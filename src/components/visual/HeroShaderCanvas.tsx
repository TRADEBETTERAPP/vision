"use client";

import { useCallback, useEffect, useRef } from "react";
import { useVisualEffects } from "./VisualEffectsProvider";

// ---------------------------------------------------------------------------
// GLSL Shaders — Radiant-influenced BETTER atmosphere
//
// Inspired by Radiant shader techniques: organic noise fields, slow luminous
// gradients, and subtle depth layers in BETTER blue. This is NOT a generic
// grid or glow — it creates atmospheric depth with material impact.
// ---------------------------------------------------------------------------

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  /* Smooth noise for organic field generation */
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  /* Fractional Brownian Motion — layered noise for organic depth */
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 coord = vec2(uv.x * aspect, uv.y);

    /* Slow time — deliberate, non-frenetic movement */
    float t = u_time * 0.06;

    /* Primary radiant field — large-scale luminous structure */
    float field1 = fbm(coord * 2.0 + vec2(t * 0.3, t * 0.2));
    float field2 = fbm(coord * 3.0 + vec2(-t * 0.2, t * 0.4) + field1 * 0.5);

    /* Secondary depth layer — creates Radiant-style light caustics */
    float caustic = fbm(coord * 4.5 + vec2(field2 * 0.8, field1 * 0.6) + t * 0.15);
    caustic = smoothstep(0.3, 0.7, caustic);

    /* BETTER blue palette — three tones for depth */
    vec3 deepBlue   = vec3(0.0, 0.10, 0.22);   /* Deep oceanic base */
    vec3 midBlue    = vec3(0.0, 0.28, 0.55);    /* Mid radiance */
    vec3 brightBlue = vec3(0.0, 0.667, 1.0);    /* BETTER blue #00aaff */

    /* Compose: layered radiant depth from dark to bright */
    vec3 color = deepBlue;
    color = mix(color, midBlue, field1 * 0.6);
    color = mix(color, brightBlue * 0.4, caustic * 0.35);

    /* Subtle luminous highlights — Radiant influence */
    float highlight = smoothstep(0.55, 0.85, field2 + caustic * 0.3);
    color += brightBlue * highlight * 0.12;

    /* Vignette: atmospheric fade toward edges */
    float vignette = 1.0 - length((uv - 0.5) * vec2(1.8, 2.2));
    vignette = smoothstep(0.0, 0.6, vignette);
    color *= vignette;

    /* Vertical gradient: darker at top/bottom for text readability zones */
    float vertFade = smoothstep(0.0, 0.25, uv.y) * smoothstep(1.0, 0.75, uv.y);
    color *= 0.5 + vertFade * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// WebGL helpers
// ---------------------------------------------------------------------------

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
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
  fragmentShader: WebGLShader
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

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      triggerFallback();
      return;
    }

    const webgl = gl as WebGLRenderingContext;

    const vert = createShader(webgl, webgl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(webgl, webgl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) {
      triggerFallback();
      return;
    }

    const program = createProgram(webgl, vert, frag);
    if (!program) {
      triggerFallback();
      return;
    }

    // Full-screen quad
    const positionBuffer = webgl.createBuffer();
    webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
    webgl.bufferData(
      webgl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      webgl.STATIC_DRAW
    );

    const posLoc = webgl.getAttribLocation(program, "a_position");
    const timeLoc = webgl.getUniformLocation(program, "u_time");
    const resLoc = webgl.getUniformLocation(program, "u_resolution");

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
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const time = (performance.now() - startTime) / 1000;
      webgl.uniform1f(timeLoc, time);
      webgl.uniform2f(resLoc, canvas.width, canvas.height);
      webgl.drawArrays(webgl.TRIANGLES, 0, 6);
      animFrameRef.current = requestAnimationFrame(render);
    };

    markReady();
    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      webgl.deleteProgram(program);
      webgl.deleteShader(vert);
      webgl.deleteShader(frag);
    };
  }, [markReady, triggerFallback]);

  useEffect(() => {
    if (reducedMotion || fallback) return;
    const cleanup = initWebGL();
    return () => {
      cancelAnimationFrame(animFrameRef.current);
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
