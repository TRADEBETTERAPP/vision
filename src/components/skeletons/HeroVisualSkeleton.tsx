/**
 * HeroVisualSkeleton — lightweight placeholder rendered while the heavy
 * HeroVisualSystem (WebGL shader) is loading.
 *
 * VAL-VISUAL-001: Content-first hero renders before effects initialize.
 * VAL-VISUAL-027: Skeleton screens for progressive loading.
 *
 * Shows the CSS-only radiant fallback gradient immediately, matching
 * the static fallback appearance. Children (hero content) render inside
 * the skeleton so text is visible before the heavy visual layers arrive.
 *
 * Approved visual stack (two layers only):
 *   1. Radiant Fluid Amber shader at reduced opacity (in SiteAtmosphere)
 *   2. Film grain GIF overlay at 5% opacity (in SiteAtmosphere)
 * No scanlines, no vignettes, no additional texture overlays.
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

      {/* Content renders immediately — content-first loading */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
