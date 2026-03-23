/**
 * FilmGrainOverlay — tradebetter-matching animated film grain texture.
 *
 * VAL-VISUAL-029: Film grain overlay tiled across the full viewport at 5%
 * opacity with mix-blend-mode:lighten and pointer-events:none. Creates
 * tradebetter's subtle analog texture feel without competing with content.
 *
 * Implementation: Uses an inline SVG feTurbulence noise filter to generate
 * an animated grain texture, matching tradebetter's approach of a subtle
 * noise overlay across the entire page. The SVG filter creates a lightweight
 * procedural noise that tiles automatically and animates at low frame rate.
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
    >
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <filter id="film-grain-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
            seed="0"
          >
            <animate
              attributeName="seed"
              from="0"
              to="100"
              dur="2s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#film-grain-noise)"
        />
      </svg>
    </div>
  );
}
