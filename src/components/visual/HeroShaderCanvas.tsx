"use client";

import { useCallback, useEffect, useRef } from "react";
import { useVisualEffects } from "./VisualEffectsProvider";
import {
  RADIANT_FLUID_AMBER_VERTEX,
  RADIANT_FLUID_AMBER_FRAGMENT,
} from "./radiant-fluid-amber.glsl";

// ---------------------------------------------------------------------------
// HeroShaderCanvas — Vendored Radiant Fluid Amber background
//
// This component renders the BETTER hero background using a real vendored
// Radiant shader asset instead of a custom approximation.
//
// Vendored asset: ./radiant-fluid-amber.glsl.ts
// Original source: https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html
// Site reference:  https://radiant-shaders.com/shader/fluid-amber
// License:         MIT (Copyright (c) 2025 Paul Bakaus)
//
// The vendored shader preserves Radiant Fluid Amber's canonical GLSL
// implementation — simplex noise (snoise), permutation-based hashing
// (mod289/permute), 5-octave fBM with additive offsets, and the signature
// triple-pass domain-warp composition (q → r → f). The palette has been
// remapped from warm amber to BETTER blue.
//
// Previous implementation (removed): custom approximation shader that used
// hash-based value noise (fract(sin(dot(...)))) and a dual-field + caustic
// pattern loosely inspired by Radiant techniques. That shader was rejected
// as a "custom lookalike" rather than a real vendored asset.
//
// Motion strategy: the Radiant shader uses TIME_SCALE = 0.25 (increased from
// 0.15 for more perceptible motion) matching M1 in the HeroVisualSystem
// motion budget. The higher rate ensures visible frame-to-frame change.
//
// Fallback: if WebGL is unavailable, triggerFallback() is called and the
// CSS-only radiant fallback gradient remains visible.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// WebGL helpers
// ---------------------------------------------------------------------------

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroShaderCanvas() {
  const { reducedMotion, fallback, markReady, triggerFallback } =
    useVisualEffects();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let fallbackTriggered = false;

    const failToFallback = () => {
      if (fallbackTriggered) {
        return;
      }

      fallbackTriggered = true;

      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      } else {
        disposed = true;
        cancelAnimationFrame(animFrameRef.current);
      }

      triggerFallback();
    };

    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      failToFallback();
      return;
    }

    const webgl = gl as WebGLRenderingContext;

    // Use vendored Radiant Fluid Amber shaders
    const vert = createShader(
      webgl,
      webgl.VERTEX_SHADER,
      RADIANT_FLUID_AMBER_VERTEX,
    );
    const frag = createShader(
      webgl,
      webgl.FRAGMENT_SHADER,
      RADIANT_FLUID_AMBER_FRAGMENT,
    );
    if (!vert || !frag) {
      failToFallback();
      return;
    }

    const program = createProgram(webgl, vert, frag);
    if (!program) {
      failToFallback();
      return;
    }

    // Full-screen triangle (Radiant convention: 3 vertices, not 6)
    const positionBuffer = webgl.createBuffer();
    if (!positionBuffer) {
      failToFallback();
      return;
    }
    webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
    webgl.bufferData(
      webgl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      webgl.STATIC_DRAW,
    );

    const posLoc = webgl.getAttribLocation(program, "a_pos");
    const timeLoc = webgl.getUniformLocation(program, "u_time");
    const resLoc = webgl.getUniformLocation(program, "u_res");
    if (posLoc < 0 || !timeLoc || !resLoc) {
      failToFallback();
      return;
    }

    webgl.useProgram(program);
    webgl.enableVertexAttribArray(posLoc);
    webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
    webgl.vertexAttribPointer(posLoc, 2, webgl.FLOAT, false, 0, 0);

    const startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      webgl.viewport(0, 0, canvas.width, canvas.height);
      webgl.uniform2f(resLoc, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      failToFallback();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);

    const dispose = () => {
      if (disposed) {
        return;
      }

      disposed = true;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      webgl.deleteProgram(program);
      webgl.deleteShader(vert);
      webgl.deleteShader(frag);
    };

    cleanupRef.current = dispose;

    const render = () => {
      if (disposed) {
        return;
      }

      const time = (performance.now() - startTime) / 1000;
      try {
        webgl.uniform1f(timeLoc, time);
        webgl.drawArrays(webgl.TRIANGLES, 0, 3);
      } catch {
        failToFallback();
        return;
      }
      animFrameRef.current = requestAnimationFrame(render);
    };

    markReady();
    animFrameRef.current = requestAnimationFrame(render);

    return dispose;
  }, [markReady, triggerFallback]);

  useEffect(() => {
    if (reducedMotion || fallback) return;
    const cleanup = initWebGL();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      cleanupRef.current = null;
      cleanup?.();
    };
  }, [reducedMotion, fallback, initWebGL]);

  // Don't render canvas in reduced-motion or fallback mode
  if (reducedMotion || fallback) return null;

  return (
    <canvas
      ref={canvasRef}
      data-testid="hero-shader-canvas"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.85 }}
    />
  );
}
