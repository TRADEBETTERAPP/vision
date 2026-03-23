/**
 * HeroVisualSkeleton — lightweight placeholder rendered while the heavy
 * HeroVisualSystem (WebGL shader + ASCII canvas) is loading.
 *
 * VAL-VISUAL-001: Content-first hero renders before effects initialize.
 * VAL-VISUAL-027: Skeleton screens for progressive loading.
 *
 * Shows the CSS-only radiant fallback gradient and scanline overlay
 * immediately, matching the static fallback appearance. Children
 * (hero content) render inside the skeleton so text is visible
 * before the heavy visual layers arrive.
 */
export function HeroVisualSkeleton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid="hero-visual-skeleton"
      className="relative overflow-hidden"
    >
      {/* CSS-only radiant fallback gradient — matches HeroVisualSystem layer 0 */}
      <div
        className="hero-radiant-fallback absolute inset-0"
        aria-hidden="true"
      />

      {/* Scanline overlay — matches HeroVisualSystem layer 3 */}
      <div
        className="scanline-overlay absolute inset-0 z-[3]"
        aria-hidden="true"
      />

      {/* Vignette — matches HeroVisualSystem layer 4 */}
      <div
        className="hero-vignette absolute inset-0 z-[4]"
        aria-hidden="true"
      />

      {/* Content renders immediately — content-first loading */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
