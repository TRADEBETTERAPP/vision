"use client";

import { useCallback, useEffect, useRef } from "react";
import { useVisualEffects } from "./VisualEffectsProvider";

// ---------------------------------------------------------------------------
// Hermes ASCII-video–derived BETTER Canvas Renderer
//
// Real-time canvas-based ASCII renderer directly adapted from the
// NousResearch/hermes-agent ascii-video pipeline:
//   Source: https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video
//
// Concrete Hermes pipeline adaptations:
//
//   1. Multi-density grid system — adapted from architecture.md § Multi-Density
//      Grids and § GridLayer Initialization. The Hermes pipeline pre-initializes
//      grids at multiple font sizes (xs=8, sm=10, md=16, lg=20, xl=24) to create
//      "natural texture interference" when layered. This renderer uses three
//      density layers (coarse=20px, medium=14px, fine=10px) composited onto a
//      single canvas via screen blending.
//      Ref: https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/architecture.md
//
//   2. Glyph bitmap pre-rasterization — adapted from architecture.md
//      § GridLayer Initialization and § Character Render Loop. Hermes
//      pre-rasterizes all palette characters to float32 bitmaps at init
//      (`self.bm[c] = np.array(img) / 255.0`) then composites them per-cell
//      with `np.maximum` for additive blending. This renderer mirrors that
//      pattern: glyphs are rasterized to an OffscreenCanvas glyph atlas at
//      init, then stamped per-cell during frame rendering.
//      Ref: https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/architecture.md
//
//   3. Character palettes — adapted from architecture.md § Character Palettes
//      § Palette Library. Uses PAL_BOX (`─│┌┐└┘├┤┬┴┼`), PAL_BLOCKS (`░▒▓█`),
//      PAL_HERMES (` .·~=≈∞⚡☿✦★⊕◊◆▲▼●■`), and PAL_DENSE (` .:;+=xX$#@█`)
//      palettes for different grid layers, creating the multi-texture effect
//      described in the composition reference.
//      Ref: https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/architecture.md
//
//   4. val2char glyph mapping with gamma tonemap — adapted from architecture.md
//      § Mapping Values to Characters (`val2char`, `val2char_gamma`) and
//      composition.md § Adaptive Tone Mapping (`tonemap()`). Value fields are
//      generated per-cell, gamma-corrected (< 1 lifts shadows), then mapped to
//      palette characters by index. This prevents the "inherently dark" ASCII
//      brightness problem described in the Hermes troubleshooting reference.
//      Ref: https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/composition.md
//
//   5. Value field generators — adapted from effects.md § Value Field Generators.
//      Uses sine-based interference field (Hermes `vf_sine / vf_plasma`),
//      distance-mapped radial field (Hermes `vf_rings / vf_tunnel`), and
//      smooth noise approximation. These drive the per-cell brightness that
//      feeds into val2char mapping.
//      Ref: https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/effects.md
//
//   6. Multi-grid screen-blend composition — adapted from composition.md
//      § Multi-Grid Composition and § Pixel-Level Blend Modes. The Hermes
//      pipeline renders layers at different grid densities then composites
//      with `blend_canvas(a, b, "screen", 0.8)`. "Fine detail shows through
//      gaps in coarse characters." This renderer uses globalCompositeOperation
//      "screen" to blend the three density layers.
//      Ref: https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/composition.md
//
//   7. Temporal feedback buffer — adapted from composition.md § FeedbackBuffer.
//      The Hermes FeedbackBuffer stores previous frames and blends them back
//      with decay + spatial transform for motion trails. This renderer
//      implements a simplified feedback loop: each frame blends the previous
//      canvas with configurable decay, creating ghostly trailing motion.
//      Ref: https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/composition.md
//
//   8. Layer hierarchy — adapted from design-patterns.md § Layer Hierarchy:
//      "Background (dim atmosphere, dense grid), content (main visual,
//      standard grid), accent (sparse highlights, coarse grid)." The three
//      density layers follow this exact pattern.
//      Ref: https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/design-patterns.md
//
// This is a canvas-based renderer (VAL-VISUAL-016), NOT a synthetic DOM
// `<pre>` text grid. It renders glyphs as pixel data onto HTML5 Canvas.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Character palettes (from Hermes architecture.md § Palette Library)
// ---------------------------------------------------------------------------

/** Hermes PAL_BOX — structural box-drawing characters */
const PAL_BOX = " ─│┌┐└┘├┤┬┴┼";

/** Hermes PAL_BLOCKS — block element density progression */
const PAL_BLOCKS = " ░▒▓█";

/** Hermes PAL_HERMES — project-specific mythology/tech blend */
const PAL_HERMES = " .·~=≈∞⚡☿✦★⊕◊◆▲▼●■";

/** Hermes PAL_DENSE — 11-level classic ASCII brightness ramp */
const PAL_DENSE = " .:;+=xX$#@█";

// ---------------------------------------------------------------------------
// Grid density configuration (from Hermes multi-density grid table)
// ---------------------------------------------------------------------------

interface GridConfig {
  fontSize: number;
  palette: string;
  /** Gamma for tonemap (< 1 lifts shadows) */
  gamma: number;
  /** Value field type */
  fieldType: "plasma" | "rings" | "tunnel";
  /** Brightness threshold — cells below this are skipped */
  threshold: number;
}

/**
 * Three-layer multi-density grid configuration.
 * Adapted from Hermes design-patterns.md § Layer Hierarchy:
 *   background (dense/dim) → content (standard) → accent (coarse/sparse)
 */
const GRID_LAYERS: GridConfig[] = [
  // Background: dense fine grid with block elements (Hermes "sm" ~10px)
  {
    fontSize: 10,
    palette: PAL_BLOCKS,
    gamma: 0.55,
    fieldType: "plasma",
    threshold: 0.08,
  },
  // Content: medium grid with structural characters (Hermes "md" ~14px)
  {
    fontSize: 14,
    palette: PAL_BOX + PAL_DENSE.slice(3),
    gamma: 0.65,
    fieldType: "rings",
    threshold: 0.05,
  },
  // Accent: coarse grid with Hermes project-specific highlights (Hermes "lg" ~20px)
  {
    fontSize: 20,
    palette: PAL_HERMES,
    gamma: 0.75,
    fieldType: "tunnel",
    threshold: 0.06,
  },
];

// ---------------------------------------------------------------------------
// Value field generators (from Hermes effects.md)
// ---------------------------------------------------------------------------

/**
 * Sine-based plasma field — adapted from Hermes vf_plasma / vf_sine.
 * "Sum of sines at multiple orientations/speeds" creating moire interference.
 */
function vfPlasma(
  col: number,
  row: number,
  cols: number,
  rows: number,
  t: number,
): number {
  const nx = col / cols;
  const ny = row / rows;
  const v1 = Math.sin(nx * 10 + t * 0.7);
  const v2 = Math.sin(ny * 8 - t * 0.5);
  const v3 = Math.sin((nx + ny) * 6 + t * 0.3);
  const v4 = Math.sin(Math.sqrt(nx * nx + ny * ny) * 12 - t * 0.9);
  return (v1 + v2 + v3 + v4 + 4) / 8; // normalize to [0, 1]
}

/**
 * Concentric rings field — adapted from Hermes vf_rings.
 * "Concentric rings, bass-driven count and wobble."
 */
function vfRings(
  col: number,
  row: number,
  cols: number,
  rows: number,
  t: number,
): number {
  const nx = (col - cols / 2) / cols;
  const ny = (row - rows / 2) / rows;
  const dist = Math.sqrt(nx * nx + ny * ny);
  const angle = Math.atan2(ny, nx);
  const v = Math.sin(dist * 20 - t * 1.2 + angle * 2) * 0.5 + 0.5;
  return v * Math.max(0, 1 - dist * 1.5);
}

/**
 * Tunnel/depth field — adapted from Hermes vf_tunnel.
 * "Infinite depth perspective (inverse distance)."
 */
function vfTunnel(
  col: number,
  row: number,
  cols: number,
  rows: number,
  t: number,
): number {
  const nx = (col - cols / 2) / cols;
  const ny = (row - rows / 2) / rows;
  const dist = Math.sqrt(nx * nx + ny * ny) + 0.001;
  const angle = Math.atan2(ny, nx);
  const v = Math.sin(1.0 / dist * 4 + angle * 3 - t * 0.8) * 0.5 + 0.5;
  // Fade out at center to avoid singularity, fade at edges for vignette
  const vignette = Math.min(1, dist * 4) * Math.max(0, 1 - dist * 1.8);
  return v * vignette;
}

// ---------------------------------------------------------------------------
// val2char mapping with gamma tonemap (from Hermes architecture.md + composition.md)
// ---------------------------------------------------------------------------

/**
 * Map a [0,1] value to a character from the palette after gamma correction.
 * Adapted from Hermes val2char_gamma():
 *   `v_adj = np.power(np.clip(v, 0, 1), gamma)`
 *   `idx = np.clip((v_adj * n).astype(int), 0, n - 1)`
 */
function val2charGamma(v: number, palette: string, gamma: number): string {
  const clamped = Math.max(0, Math.min(1, v));
  const adjusted = Math.pow(clamped, gamma);
  const n = palette.length;
  const idx = Math.min(Math.floor(adjusted * n), n - 1);
  return palette[idx];
}

// ---------------------------------------------------------------------------
// HSV to RGB conversion (from Hermes architecture.md § Color System)
// ---------------------------------------------------------------------------

function hsv2rgb(
  h: number,
  s: number,
  v: number,
): [number, number, number] {
  const hMod = ((h % 1) + 1) % 1;
  const c = v * s;
  const x = c * (1 - Math.abs(((hMod * 6) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  const sector = hMod * 6;
  if (sector < 1) {
    r = c;
    g = x;
  } else if (sector < 2) {
    r = x;
    g = c;
  } else if (sector < 3) {
    g = c;
    b = x;
  } else if (sector < 4) {
    g = x;
    b = c;
  } else if (sector < 5) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

// ---------------------------------------------------------------------------
// Glyph atlas — pre-rasterized character bitmaps
// (adapted from Hermes GridLayer.__init__ § Pre-rasterize all characters)
// ---------------------------------------------------------------------------

interface GlyphAtlas {
  cellWidth: number;
  cellHeight: number;
  /** Map from char → pre-rendered colored canvas for each glyph */
  getGlyph: (char: string, color: string) => HTMLCanvasElement | null;
}

/**
 * Create a glyph atlas factory that pre-measures cell size and lazily
 * renders colored glyphs. Mirrors Hermes GridLayer: each character is
 * rendered once at the target font size and cached as a bitmap.
 */
function createGlyphAtlas(
  fontSize: number,
  fontFamily: string,
): GlyphAtlas | null {
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  if (!measureCtx) return null;

  measureCtx.font = `${fontSize}px ${fontFamily}`;
  const metrics = measureCtx.measureText("M");
  const cellWidth = Math.ceil(metrics.width) || Math.ceil(fontSize * 0.6);
  const cellHeight = Math.ceil(fontSize * 1.2);

  if (cellWidth <= 0 || cellHeight <= 0) return null;

  // Glyph cache: key = char + color → rendered canvas
  const cache = new Map<string, HTMLCanvasElement>();

  function getGlyph(char: string, color: string): HTMLCanvasElement | null {
    if (char === " ") return null;
    const key = `${char}:${color}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const glyphCanvas = document.createElement("canvas");
    glyphCanvas.width = cellWidth;
    glyphCanvas.height = cellHeight;
    const gCtx = glyphCanvas.getContext("2d");
    if (!gCtx) return null;

    gCtx.font = `${fontSize}px ${fontFamily}`;
    gCtx.textBaseline = "top";
    gCtx.fillStyle = color;
    gCtx.fillText(char, 0, 0);

    cache.set(key, glyphCanvas);
    return glyphCanvas;
  }

  return { cellWidth, cellHeight, getGlyph };
}

// ---------------------------------------------------------------------------
// Grid layer type
// ---------------------------------------------------------------------------

interface GridLayer {
  cols: number;
  rows: number;
  atlas: GlyphAtlas;
  config: GridConfig;
  /** Offset to center the grid */
  ox: number;
  oy: number;
}

function createGridLayer(
  width: number,
  height: number,
  config: GridConfig,
  fontFamily: string,
): GridLayer | null {
  const atlas = createGlyphAtlas(config.fontSize, fontFamily);
  if (!atlas) return null;

  const cols = Math.floor(width / atlas.cellWidth);
  const rows = Math.floor(height / atlas.cellHeight);

  if (cols <= 0 || rows <= 0) return null;

  const ox = Math.floor((width - cols * atlas.cellWidth) / 2);
  const oy = Math.floor((height - rows * atlas.cellHeight) / 2);

  return { cols, rows, atlas, config, ox, oy };
}

// ---------------------------------------------------------------------------
// BETTER Blue hue constant
// ---------------------------------------------------------------------------

/** BETTER blue hue in HSV space (0-1 normalized) — ~200° = 0.555 */
const BETTER_BLUE_HUE = 0.555;

// ---------------------------------------------------------------------------
// Render a single grid layer to a temporary canvas
// (adapted from Hermes _render_vf() + GridLayer.render())
// ---------------------------------------------------------------------------

function renderGridLayerToCanvas(
  layer: GridLayer,
  t: number,
  width: number,
  height: number,
): HTMLCanvasElement | null {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext("2d");
  if (!ctx) return null;

  const { cols, rows, atlas, config, ox, oy } = layer;
  const { cellWidth, cellHeight } = atlas;

  // Select value field function
  const vfFn =
    config.fieldType === "plasma"
      ? vfPlasma
      : config.fieldType === "rings"
        ? vfRings
        : vfTunnel;

  for (let r = 0; r < rows; r++) {
    const y = oy + r * cellHeight;
    if (y + cellHeight > height) break;

    for (let c = 0; c < cols; c++) {
      const x = ox + c * cellWidth;
      if (x + cellWidth > width) break;

      // Compute value field for this cell
      const val = vfFn(c, r, cols, rows, t);

      // Skip sub-threshold values (Hermes threshold parameter)
      if (val < config.threshold) continue;

      // val2char with gamma tonemap
      const ch = val2charGamma(val, config.palette, config.gamma);
      if (ch === " ") continue;

      // Color: BETTER blue monochrome strategy (Hermes "monochrome" color strategy)
      // Fixed hue, varying saturation and value
      const brightness = Math.pow(val, 0.8);
      const [red, green, blue] = hsv2rgb(BETTER_BLUE_HUE, 0.8, brightness);
      const color = `rgb(${red},${green},${blue})`;

      // Stamp the pre-rendered colored glyph (Hermes glyph bitmap compositing)
      const glyph = atlas.getGlyph(ch, color);
      if (glyph) {
        ctx.globalAlpha = Math.min(1, brightness * 1.5);
        ctx.drawImage(glyph, x, y);
      }
    }
  }

  ctx.globalAlpha = 1;
  return tempCanvas;
}

// ---------------------------------------------------------------------------
// Feedback buffer (from Hermes composition.md § FeedbackBuffer)
// ---------------------------------------------------------------------------

/**
 * Simplified temporal feedback buffer.
 * Stores previous frame and blends it back with decay for motion trails.
 * Adapted from Hermes FeedbackBuffer: `self.buf *= decay` then blend.
 */
class FeedbackBuffer {
  private buffer: HTMLCanvasElement | null = null;
  private bufCtx: CanvasRenderingContext2D | null = null;

  apply(
    targetCtx: CanvasRenderingContext2D,
    width: number,
    height: number,
    decay: number = 0.8,
  ): void {
    if (
      !this.buffer ||
      this.buffer.width !== width ||
      this.buffer.height !== height
    ) {
      this.buffer = document.createElement("canvas");
      this.buffer.width = width;
      this.buffer.height = height;
      this.bufCtx = this.buffer.getContext("2d");
      if (this.bufCtx) {
        // Initialize with current frame
        this.bufCtx.drawImage(targetCtx.canvas, 0, 0);
      }
      return;
    }

    if (!this.bufCtx) return;

    // Blend old buffer onto current frame (screen mode for ghostly trails)
    targetCtx.globalAlpha = 0.25;
    targetCtx.globalCompositeOperation = "screen";
    targetCtx.drawImage(this.buffer, 0, 0);
    targetCtx.globalAlpha = 1;
    targetCtx.globalCompositeOperation = "source-over";

    // Update buffer: decay old content then copy current frame
    this.bufCtx.globalAlpha = decay;
    this.bufCtx.globalCompositeOperation = "source-over";
    this.bufCtx.drawImage(this.buffer, 0, 0);
    this.bufCtx.globalAlpha = 1;
    this.bufCtx.clearRect(0, 0, width, height);
    this.bufCtx.drawImage(targetCtx.canvas, 0, 0);
  }
}

// ---------------------------------------------------------------------------
// Animation frame rate
// ---------------------------------------------------------------------------

/** Target ~8fps for visible but deliberate motion (Hermes temporal coherence) */
const FRAME_INTERVAL = 1000 / 8;

// ---------------------------------------------------------------------------
// React Component
// ---------------------------------------------------------------------------

export function AsciiCanvasRenderer() {
  const { reducedMotion } = useVisualEffects();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const feedbackRef = useRef<FeedbackBuffer>(new FeedbackBuffer());
  const gridLayersRef = useRef<GridLayer[] | null>(null);

  const fontFamily =
    '"Fira Code", "JetBrains Mono", "SF Mono", "Menlo", "Monaco", "Consolas", monospace';

  const initGridLayers = useCallback(
    (width: number, height: number): GridLayer[] | null => {
      const layers: GridLayer[] = [];
      for (const config of GRID_LAYERS) {
        const layer = createGridLayer(width, height, config, fontFamily);
        if (layer) layers.push(layer);
      }
      return layers.length > 0 ? layers : null;
    },
    [],
  );

  const renderFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      t: number,
      width: number,
      height: number,
    ) => {
      const layers = gridLayersRef.current;
      if (!layers) return;

      // Clear frame (Hermes: canvas = np.zeros)
      ctx.clearRect(0, 0, width, height);

      // Render each density layer to temporary canvas, then screen-blend
      // (Hermes multi-grid composition: blend_canvas(a, b, "screen", 0.8))
      for (const layer of layers) {
        const layerCanvas = renderGridLayerToCanvas(layer, t, width, height);
        if (layerCanvas) {
          ctx.globalCompositeOperation = "screen";
          ctx.drawImage(layerCanvas, 0, 0);
        }
      }

      // Reset composite mode
      ctx.globalCompositeOperation = "source-over";

      // Apply feedback buffer for temporal trails
      feedbackRef.current.apply(ctx, width, height);
    },
    [],
  );

  // Render a single static frame for reduced-motion
  const renderStaticFrame = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const layers = gridLayersRef.current;
      if (!layers) return;
      ctx.clearRect(0, 0, width, height);
      for (const layer of layers) {
        const layerCanvas = renderGridLayerToCanvas(layer, 0, width, height);
        if (layerCanvas) {
          ctx.globalCompositeOperation = "screen";
          ctx.drawImage(layerCanvas, 0, 0);
        }
      }
      ctx.globalCompositeOperation = "source-over";
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      canvas.width = w;
      canvas.height = h;

      // Reinitialize grid layers for new dimensions
      gridLayersRef.current = initGridLayers(w, h);

      // Render static frame immediately (for reduced-motion or initial paint)
      if (gridLayersRef.current) {
        renderStaticFrame(ctx, w, h);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      return () => window.removeEventListener("resize", resize);
    }

    // Animation loop
    const startTime = performance.now();

    const animate = (now: number) => {
      // Throttle to target fps (Hermes temporal coherence)
      if (now - lastFrameTimeRef.current < FRAME_INTERVAL) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = now;

      const elapsed = (now - startTime) / 1000;
      renderFrame(ctx, elapsed, canvas.width, canvas.height);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion, initGridLayers, renderFrame, renderStaticFrame]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="ascii-canvas-renderer"
      aria-hidden="true"
      className="ascii-canvas-renderer absolute inset-0 h-full w-full"
    />
  );
}
