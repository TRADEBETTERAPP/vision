"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { VisualEffectsProvider, useVisualEffects } from "./VisualEffectsProvider";

/**
 * Dynamic imports for heavy visual components — aggressive bundle splitting.
 *
 * VAL-VISUAL-027: HeroShaderCanvas (WebGL), AsciiCanvasRenderer (canvas),
 * and AsciiBackground (DOM fallback) are dynamically imported with ssr:false
 * so they do not block first meaningful paint. The CSS-only layers (radiant
 * fallback gradient, scanline overlay, vignette) render immediately.
 */
const HeroShaderCanvas = dynamic(
  () => import("./HeroShaderCanvas").then((mod) => mod.HeroShaderCanvas),
  { ssr: false }
);

const AsciiCanvasRenderer = dynamic(
  () => import("./AsciiCanvasRenderer").then((mod) => mod.AsciiCanvasRenderer),
  { ssr: false }
);

const AsciiBackground = dynamic(
  () => import("./AsciiBackground").then((mod) => mod.AsciiBackground),
  { ssr: false }
);

/**
 * HeroVisualSystem — immersive BETTER atmosphere for the hero section.
 *
 * Visual layers (back to front):
 * 1. Vendored Radiant Fluid Amber shader canvas — real Radiant asset (WebGL, client-only)
 *    Vendored asset: radiant-fluid-amber.glsl.ts
 *    Original source: https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html
 *    Site reference: https://radiant-shaders.com/shader/fluid-amber
 *    License: MIT (Copyright (c) 2025 Paul Bakaus)
 * 2. Hermes ASCII-video–derived canvas renderer — real-time multi-grid ASCII
 *    Adapted from: https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video
 *    Uses multi-density grid composition, glyph atlas, val2char mapping, tonemap,
 *    feedback buffer, and visible temporal motion — all canvas-based (VAL-VISUAL-016)
 * 2b. Legacy DOM-based ASCII atmosphere (retained as fallback for non-canvas environments)
 *    Source: https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video
 * 3. Scanline overlay — CSS-only terminal texture
 * 4. Vignette gradient — readability protection for hero content
 *
 * Motion strategy (VAL-VISUAL-011): exactly 3 intentional motions:
 *   M1 — Shader canvas: slow organic drift (TIME_SCALE 0.15, Radiant convention)
 *   M2 — ASCII canvas: multi-grid value field animation (~8fps, Hermes pipeline convention)
 *   M3 — Hero entrance: content fades in on mount via CSS (one-shot, no loop)
 *
 * Content-first (VAL-VISUAL-001): children render at z-10 immediately.
 * CSS-only layers render on server; WebGL/ASCII mount after hydration.
 *
 * Reduced-motion (VAL-VISUAL-003): all 3 motions stop; static layers persist.
 * Fallback (VAL-VISUAL-004): WebGL failure → CSS gradient + static ASCII layers remain.
 *   Both AsciiCanvasRenderer and AsciiBackground become static (no animation)
 *   so that data-motion-layers=0 is accurate and the fallback is truly still.
 *
 * Visual state differentiation (VAL-VISUAL-017):
 *   Enhanced state: WebGL shader + ASCII canvas both animating → dramatic moving depth.
 *   Fallback state: CSS gradient + static ASCII layers → coherent but truly static.
 *   The data-visual-state attribute exposes which mode is active for headed-browser
 *   validation (VAL-VISUAL-018) and CSS-driven layering differentiation.
 *   data-motion-layers tracks the count of active motion systems (shader + ascii = 2).
 *   data-canvas-ready tracks whether the 2D canvas renderer initialized (for DOM fallback).
 *
 * Provenance (VAL-VISUAL-014, VAL-VISUAL-015):
 *   Radiant adaptation: vendored Radiant Fluid Amber shader asset
 *     → radiant-fluid-amber.glsl.ts (simplex noise, mod289/permute, q→r→f domain warp)
 *     → HeroShaderCanvas.tsx (WebGL renderer using vendored asset)
 *   Hermes adaptation: multi-density grid system, glyph atlas pre-rasterization,
 *     val2char + gamma tonemap, value field generators, screen-blend multi-grid
 *     composition, temporal feedback buffer → AsciiCanvasRenderer.tsx (canvas-based)
 *   Legacy Hermes adaptation: PAL_BOX + PAL_BLOCKS palettes, GridLayer layout,
 *     layer hierarchy, temporal coherence model → AsciiBackground.tsx (DOM fallback)
 */

const emptySubscribe = () => () => {};

export function HeroVisualSystem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VisualEffectsProvider>
      <HeroVisualSystemInner>{children}</HeroVisualSystemInner>
    </VisualEffectsProvider>
  );
}

/**
 * Inner component that consumes the VisualEffectsProvider context.
 * Exposes data-visual-state and data-motion-layers attributes on the
 * wrapper div so headed browser validation (VAL-VISUAL-018) can
 * distinguish the enhanced state from fallback/reduced-motion modes.
 */
function HeroVisualSystemInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, reducedMotion, fallback, canvasReady, isDesktopCapable } = useVisualEffects();

  // SSR-safe mount detection for client-only layers
  const hasMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Device class for capability gating (VAL-VISUAL-025)
  // Heavy shader, ASCII-canvas, and continuous-animation layers only
  // activate on desktop-class clients. Mobile/tablet/constrained get
  // a cheaper but hierarchy-preserving fallback.
  const deviceClass = isDesktopCapable ? "desktop" : "constrained";

  // Compute visual state for data attribute (VAL-VISUAL-017)
  // Enhanced: WebGL shader is ready, motion is allowed, AND device is desktop-class
  // Constrained: mobile/tablet — CSS-only low-cost gradient drift animation
  // Fallback: WebGL failed on desktop
  // Reduced-motion: user prefers reduced motion
  const visualState = reducedMotion
    ? "reduced-motion"
    : ready && !fallback && isDesktopCapable
      ? "enhanced"
      : !isDesktopCapable
        ? "constrained"
        : "fallback";

  // Count active motion layers (VAL-VISUAL-018)
  // Enhanced (desktop): shader (1) + ASCII canvas (1) = 2
  // Constrained (mobile/tablet): CSS gradient drift animation = 1
  // Fallback (desktop WebGL fail): 0 (truly static)
  // Reduced-motion: 0
  const motionLayers =
    visualState === "enhanced" ? 2 : visualState === "constrained" ? 1 : 0;

  return (
    <div
      data-testid="hero-visual-system"
      data-visual-state={visualState}
      data-motion-layers={motionLayers}
      data-canvas-ready={canvasReady ? "true" : "false"}
      data-device-class={deviceClass}
      className="relative overflow-hidden"
    >
      {/* Layer 0: CSS-only radiant fallback gradient (always visible, no JS) */}
      <div
        className="hero-radiant-fallback absolute inset-0"
        aria-hidden="true"
        data-testid="hero-radiant-fallback"
      />

      {/* Layer 1: WebGL Radiant shader — desktop only (VAL-VISUAL-025) */}
      {hasMounted && isDesktopCapable && <HeroShaderCanvas />}

      {/* Layer 2: Hermes ASCII canvas renderer — desktop only (VAL-VISUAL-025) */}
      {hasMounted && isDesktopCapable && <AsciiCanvasRenderer />}

      {/* Layer 2b: Legacy DOM ASCII fallback (hidden when canvas is available, kept for non-canvas envs) */}
      {hasMounted && isDesktopCapable && <AsciiBackground />}

      {/* Layer 3: CSS scanline overlay — terminal texture (all devices) */}
      <div
        className="scanline-overlay absolute inset-0 z-[3]"
        aria-hidden="true"
      />

      {/* Layer 4: Vignette + readability gradient */}
      <div
        className="hero-vignette absolute inset-0 z-[4]"
        aria-hidden="true"
      />

      {/* Layer 10: Content — M3 entrance animation via CSS */}
      <div
        data-testid="hero-content"
        className="hero-entrance relative z-10"
      >
        {children}
      </div>
    </div>
  );
}
