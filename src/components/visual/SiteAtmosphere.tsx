"use client";

/**
 * SiteAtmosphere — extends the Radiant/Hermes immersive background
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
 * low-opacity atmospheric background using:
 *   - CSS radiant fallback gradient (always visible)
 *   - Scanline overlay for terminal texture continuity
 *   - A subtle vignette to maintain readability
 *
 * The hero section has its own full-strength HeroVisualSystem layers
 * (WebGL shader + ASCII canvas). Below the hero, this component provides
 * a lighter but still materially visible continuation of the same
 * atmospheric language so the site feels like one coherent environment.
 *
 * The atmosphere uses pointer-events:none and stays behind content (z-0)
 * so it never blocks interactions or reduces readability.
 */

export function SiteAtmosphere({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid="site-atmosphere"
      className="relative"
    >
      {/* Persistent atmospheric background — extends across all sections */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {/* Radiant-continuation gradient — lighter than hero but present */}
        <div className="site-atmosphere-gradient absolute inset-0" />

        {/* Scanline overlay for terminal texture continuity */}
        <div className="scanline-overlay absolute inset-0 opacity-30" />
      </div>

      {/* Content layer — positioned above the atmosphere */}
      <div data-testid="site-content" className="relative z-10">
        {children}
      </div>
    </div>
  );
}
