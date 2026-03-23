"use client";

import { useVisualEffects } from "./VisualEffectsProvider";

/**
 * HeroVisualSystem — immersive BETTER atmosphere for the hero section.
 *
 * VAL-VISUAL-029: Only ONE Radiant Fluid Amber shader instance runs site-wide
 * via SiteAtmosphere. This component provides ONLY CSS layers for the hero:
 *   - Radiant fallback gradient (CSS-only)
 *   - Scanline overlay (CSS-only terminal texture)
 * The WebGL shader canvas is NOT rendered here — it lives exclusively in
 * SiteAtmosphere to enforce the single-shader-instance rule.
 *
 * Visual layers (back to front):
 * 1. CSS-only radiant fallback gradient — atmospheric depth
 * 2. Scanline overlay — CSS-only terminal texture
 *
 * Motion strategy (VAL-VISUAL-011): exactly 2 intentional motions:
 *   M1 — Shader canvas: slow organic drift (in SiteAtmosphere, not here)
 *   M2 — Hero entrance: content fades in on mount via CSS (one-shot, no loop)
 *
 * Content-first (VAL-VISUAL-001): children render at z-10 immediately.
 * CSS-only layers render on server.
 *
 * Reduced-motion (VAL-VISUAL-003): all motions stop; static layers persist.
 * Fallback (VAL-VISUAL-004): CSS gradient remains as the atmosphere.
 *
 * Visual state differentiation (VAL-VISUAL-017):
 *   Enhanced state: SiteAtmosphere WebGL shader is animating.
 *   Fallback state: CSS gradient → coherent but truly static.
 *   The data-visual-state attribute exposes which mode is active for
 *   headed-browser validation (VAL-VISUAL-018).
 *   data-motion-layers tracks active motion systems from SiteAtmosphere.
 *
 * Provenance (VAL-VISUAL-014, VAL-VISUAL-015):
 *   Radiant adaptation: vendored Radiant Fluid Amber shader asset
 *     → radiant-fluid-amber.glsl.ts (simplex noise, mod289/permute, q→r→f domain warp)
 *     → HeroShaderCanvas.tsx (WebGL renderer in SiteAtmosphere)
 *   Source: https://radiant-shaders.com/shader/fluid-amber
 *   Repository: https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html
 */

/**
 * HeroVisualSystem consumes the VisualEffectsProvider from the parent
 * SiteAtmosphere rather than creating its own. This ensures the visual
 * state (enhanced/fallback/constrained/reduced-motion) reflects the
 * actual shader state from SiteAtmosphere's single shader instance.
 *
 * Exposes data-visual-state and data-motion-layers attributes on the
 * wrapper div so headed browser validation (VAL-VISUAL-018) can
 * distinguish the enhanced state from fallback/reduced-motion modes.
 */
export function HeroVisualSystem({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ready, reducedMotion, fallback, isDesktopCapable } = useVisualEffects();

  // Device class for capability gating (VAL-VISUAL-025)
  // Heavy shader and continuous-animation layers only activate on
  // desktop-class clients. Mobile/tablet/constrained get a cheaper
  // but hierarchy-preserving fallback.
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
  // Enhanced (desktop): shader (1) = 1
  // Constrained (mobile/tablet): CSS gradient drift animation = 1
  // Fallback (desktop WebGL fail): 0 (truly static)
  // Reduced-motion: 0
  const motionLayers =
    visualState === "enhanced" ? 1 : visualState === "constrained" ? 1 : 0;

  return (
    <div
      data-testid="hero-visual-system"
      data-visual-state={visualState}
      data-motion-layers={motionLayers}
      data-device-class={deviceClass}
      className="relative overflow-hidden"
    >
      {/* Layer 0: CSS-only radiant fallback gradient (always visible, no JS) */}
      <div
        className="hero-radiant-fallback absolute inset-0"
        aria-hidden="true"
        data-testid="hero-radiant-fallback"
      />

      {/* Layer 1: CSS scanline overlay — terminal texture (all devices) */}
      <div
        className="scanline-overlay absolute inset-0 z-[3]"
        aria-hidden="true"
      />

      {/* Layer 10: Content — M2 entrance animation via CSS */}
      <div
        data-testid="hero-content"
        className="hero-entrance relative z-10"
      >
        {children}
      </div>
    </div>
  );
}
