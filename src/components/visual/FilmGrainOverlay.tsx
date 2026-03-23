/**
 * FilmGrainOverlay — tradebetter-matching animated film grain texture.
 *
 * VAL-VISUAL-029: Film grain overlay tiled across the full viewport at 5%
 * opacity with mix-blend-mode:lighten and pointer-events:none. Creates
 * tradebetter's subtle analog texture feel without competing with content.
 *
 * Implementation: Uses a vendored animated noise GIF (/grain.gif) tiled
 * across the viewport via CSS background-image, matching tradebetter's
 * exact technique of a GIF-based grain overlay rather than SVG filters.
 *
 * The grain layer sits above the shader but below all content and UI.
 */
"use client";

export function FilmGrainOverlay() {
  return (
    <div
      data-testid="film-grain-overlay"
      className="film-grain-overlay pointer-events-none fixed inset-0"
      aria-hidden="true"
      style={{
        backgroundImage: 'url(/grain.gif)',
        backgroundRepeat: 'repeat',
        backgroundSize: '64px 64px',
      }}
    />
  );
}
