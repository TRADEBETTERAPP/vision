"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { VisualEffectsProvider, useVisualEffects } from "./VisualEffectsProvider";

/**
 * Dynamic imports for heavy visual components — aggressive bundle splitting.
 *
 * VAL-VISUAL-027: HeroShaderCanvas (WebGL), AsciiCanvasRenderer (canvas),
 * and AsciiBackground (DOM fallback) are dynamically imported with ssr:false
 * so they do not block first meaningful paint. The CSS-only radiant fallback
 * gradient and scanline overlay render immediately for content-first loading.
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
 * SiteAtmosphere — extends the real Radiant/Hermes immersive background
 * treatment across the entire site shell, not just the hero.
 *
 * VAL-VISUAL-020: Radiant and Hermes atmosphere remains materially visible
 * across hero, graph rest states, focused detail states, mobile overlay
 * states, and lower-page exploration states.
 *
 * VAL-VISUAL-022: Persistent atmosphere preserves readable copy, controls,
 * and focus states across the full shell.
 *
 * This component wraps the <main> content and renders a persistent
 * atmospheric background using the REAL shipped Radiant/Hermes layers
 * (at reduced opacity for readability) rather than falling back to a
 * static-only CSS gradient treatment:
 *
 *   - Vendored Radiant Fluid Amber WebGL shader (same as hero, lower opacity)
 *   - Hermes-derived ASCII canvas renderer (real-time multi-grid, lower opacity)
 *   - Legacy DOM ASCII fallback (for non-canvas environments)
 *   - CSS radiant fallback gradient (always visible, for WebGL-fail cases)
 *   - Scanline overlay for terminal texture continuity
 *
 * The hero section has its own full-strength HeroVisualSystem layers.
 * Below the hero, this component provides a lighter but still materially
 * visible continuation of the SAME atmospheric implementation so the site
 * feels like one continuous immersive environment.
 *
 * The atmosphere uses pointer-events:none and stays behind content (z-0)
 * so it never blocks interactions or reduces readability.
 */

const emptySubscribe = () => () => {};

export function SiteAtmosphere({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VisualEffectsProvider>
      <SiteAtmosphereInner>{children}</SiteAtmosphereInner>
    </VisualEffectsProvider>
  );
}

/**
 * Inner component that consumes VisualEffectsProvider context to manage
 * the real Radiant/Hermes atmosphere layers across the full shell.
 */
function SiteAtmosphereInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { canvasReady, isDesktopCapable } = useVisualEffects();

  // SSR-safe mount detection for client-only layers
  const hasMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // Device class for capability gating (VAL-VISUAL-025)
  const deviceClass = isDesktopCapable ? "desktop" : "constrained";

  return (
    <div
      data-testid="site-atmosphere"
      data-canvas-ready={canvasReady ? "true" : "false"}
      data-device-class={deviceClass}
      className="relative"
    >
      {/* Persistent atmospheric background — REAL Radiant/Hermes layers */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {/* CSS radiant fallback gradient — always visible on all devices,
            WebGL-fail safety net and constrained-device primary atmosphere */}
        <div className="site-atmosphere-gradient absolute inset-0" />

        {/* Real Radiant shader layer — desktop only (VAL-VISUAL-025)
            Same vendored Fluid Amber asset as hero, reduced opacity */}
        {hasMounted && isDesktopCapable && (
          <div className="site-atmosphere-shader absolute inset-0">
            <HeroShaderCanvas />
          </div>
        )}

        {/* Real Hermes ASCII canvas renderer — desktop only (VAL-VISUAL-025)
            Multi-grid composition, reduced opacity */}
        {hasMounted && isDesktopCapable && (
          <div className="site-atmosphere-ascii absolute inset-0">
            <AsciiCanvasRenderer />
          </div>
        )}

        {/* Legacy DOM ASCII fallback — desktop only (non-canvas environments) */}
        {hasMounted && isDesktopCapable && <AsciiBackground />}

        {/* Scanline overlay — lightweight terminal texture (all devices) */}
        <div className="scanline-overlay absolute inset-0 opacity-30" />
      </div>

      {/* Content layer — positioned above the atmosphere */}
      <div data-testid="site-content" className="relative z-10">
        {children}
      </div>
    </div>
  );
}
