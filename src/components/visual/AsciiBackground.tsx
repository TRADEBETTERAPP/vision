"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVisualEffects } from "./VisualEffectsProvider";

// ---------------------------------------------------------------------------
// Hermes ASCII-video–adapted BETTER terminal atmosphere
//
// Directly adapted from NousResearch/hermes-agent ascii-video skill:
//   Source: https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video
//   Architecture ref: references/architecture.md — GridLayer, character palettes, val2char mapping
//   Effects ref: references/effects.md — value field generators, layered composition
//   Composition ref: references/composition.md — multi-grid layer hierarchy pattern
//
// Concrete adaptations from the Hermes ascii-video system:
//   1. Character palette — adapted from PAL_BOX (`─│┌┐└┘├┤┬┴┼`) and PAL_BLOCKS
//      (`░▒▓█`) defined in architecture.md § Character Palettes.
//   2. Data-stream highlights — adapted from PAL_HERMES project-specific palette
//      (` .·~=≈∞⚡☿✦★⊕◊◆▲▼●■`) in architecture.md § Project-Specific Palettes.
//   3. Grid layout — adapted from the fixed-row/col GridLayer system in
//      architecture.md § Grid System, using a centered terminal-viewport frame
//      with deterministic pseudo-random placement analogous to val2char().
//   4. Layer hierarchy — adapted from the composition.md § Multi-Grid Composition
//      three-layer pattern: background (dim atmosphere), content (main visual),
//      accent (sparse highlights). Here collapsed into a single DOM-based layer.
//   5. Sparse animation — adapted from the Hermes temporal coherence model:
//      ~4fps throttled updates with ~5% character mutation per cycle, matching
//      the "deliberate, not frenetic" motion philosophy from effects.md.
//   6. Bottom-border glyphs — uses └┘┴ for the bottom frame row, matching
//      the PAL_BOX palette's correct box-drawing closure characters.
//
// This is NOT a faint background noise — it's a visible atmospheric texture
// that supports the Radiant shader layer and reinforces the terminal aesthetic.
// ---------------------------------------------------------------------------

/**
 * Terminal block-art characters for structure (includes shading blocks).
 * Adapted from Hermes ascii-video PAL_BLOCKS (`░▒▓█`) and PAL_BOX
 * (`─│┌┐└┘├┤┬┴┼`) character palettes.
 * Source: https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/architecture.md
 */
const STRUCTURE_CHARS = "░▒▓│─┌┐└┘├┤┬┴┼";

/**
 * Data-stream highlight characters.
 * Adapted from Hermes ascii-video PAL_HERMES project-specific palette
 * (` .·~=≈∞⚡☿✦★⊕◊◆▲▼●■`) — selected subset for BETTER terminal feel.
 * Source: https://github.com/NousResearch/hermes-agent/blob/main/skills/creative/ascii-video/references/architecture.md
 */
const DATA_CHARS = "01$>_●◆";
/** Empty space character */
const SPACE = " ";

const COLS = 100;
const ROWS = 32;

/** Deterministic pseudo-random from two seeds */
function hash(a: number, b: number): number {
  return Math.abs(Math.sin(a * 127.1 + b * 311.7) * 43758.5453) % 1;
}

/** Separate hash for character index selection (avoids correlation with density hash) */
function charHash(a: number, b: number): number {
  return Math.abs(Math.sin(a * 269.3 + b * 183.1) * 29173.7137) % 1;
}

/**
 * Generate a structured ASCII grid with intentional layout.
 * Creates a terminal-viewport feel with border framing, sparse data regions,
 * and structured block patterns rather than random character soup.
 */
function generateStructuredGrid(seed: number = 0): string[] {
  const grid: string[] = [];

  for (let r = 0; r < ROWS; r++) {
    let line = "";
    for (let c = 0; c < COLS; c++) {
      // Deterministic pseudo-random for placement
      const h = hash(r + seed, c);
      // Separate hash for character index (uncorrelated)
      const ci = charHash(r + seed, c);

      // Top border row — terminal frame
      if (r === 0) {
        if (c === 0) line += "┌";
        else if (c === COLS - 1) line += "┐";
        else line += h > 0.7 ? "┬" : "─";
        continue;
      }

      // Bottom border row — correct box-drawing closure glyphs (└┘┴)
      if (r === ROWS - 1) {
        if (c === 0) line += "└";
        else if (c === COLS - 1) line += "┘";
        else line += h > 0.7 ? "┴" : "─";
        continue;
      }

      // Left/right border columns
      if (c === 0 || c === COLS - 1) {
        line += "│";
        continue;
      }

      // Central data region — structured blocks with sparse highlights
      const distFromCenter =
        Math.abs(c - COLS / 2) / (COLS / 2) +
        Math.abs(r - ROWS / 2) / (ROWS / 2);

      // Density falls off from center — creates depth
      const density = Math.max(0, 1.0 - distFromCenter * 0.8);

      if (h > 1.0 - density * 0.4) {
        // Block structure characters — visible terminal texture
        // Use the uncorrelated charHash for index to ensure full character coverage
        const si = Math.floor(ci * STRUCTURE_CHARS.length) % STRUCTURE_CHARS.length;
        line += STRUCTURE_CHARS[si];
      } else if (h > 0.88 && density > 0.25) {
        // Sparse data highlights — occasional terminal data glyphs
        const di = Math.floor(ci * DATA_CHARS.length) % DATA_CHARS.length;
        line += DATA_CHARS[di];
      } else {
        // Structured empty space with occasional dots for depth
        line += h > 0.82 ? "·" : SPACE;
      }
    }
    grid.push(line);
  }

  return grid;
}

/**
 * Generate a single animated frame with slow, deliberate character transitions.
 * Only a small fraction of characters change per frame — creating a living
 * terminal feel without constant noise.
 */
function generateAnimatedFrame(
  baseGrid: string[],
  time: number
): string[] {
  const grid: string[] = [];
  // Slow cycle — characters shift every ~2 seconds
  const cycle = Math.floor(time * 0.5);

  for (let r = 0; r < baseGrid.length; r++) {
    const baseLine = baseGrid[r];
    let line = "";
    for (let c = 0; c < baseLine.length; c++) {
      const baseChar = baseLine[c];

      // Only mutate interior characters, not borders
      if (
        r === 0 ||
        r === baseGrid.length - 1 ||
        c === 0 ||
        c === baseLine.length - 1
      ) {
        line += baseChar;
        continue;
      }

      // Sparse mutation: ~5% of characters shift per cycle
      const h = hash(r * 31 + cycle * 7, c * 17 + cycle * 3);

      if (h > 0.95 && baseChar !== SPACE && baseChar !== "·") {
        // Swap to a different structure or data character
        const pool = h > 0.975 ? DATA_CHARS : STRUCTURE_CHARS;
        const idx = Math.floor(charHash(r + cycle, c + cycle) * pool.length) % pool.length;
        line += pool[idx];
      } else {
        line += baseChar;
      }
    }
    grid.push(line);
  }

  return grid;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AsciiBackground() {
  const { reducedMotion, fallback } = useVisualEffects();
  const animFrameRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const [lines, setLines] = useState<string[]>(() => generateStructuredGrid());

  // ASCII becomes static when either reduced motion is requested OR when
  // the enhanced visual layer (WebGL/Radiant) has failed. In fallback mode
  // the shipped state must be truly static — no ASCII motion — so that
  // HeroVisualSystem's data-motion-layers=0 metadata is accurate and the
  // enhanced-vs-fallback differentiation is honest (VAL-VISUAL-017).
  const isStatic = reducedMotion || fallback;

  const staticGrid = useMemo(() => generateStructuredGrid(), []);

  useEffect(() => {
    if (isStatic) return;

    const startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      // Throttle to ~4fps — deliberate, not frenetic
      if (elapsed - lastUpdateRef.current > 0.25) {
        lastUpdateRef.current = elapsed;
        setLines(generateAnimatedFrame(staticGrid, elapsed));
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isStatic, staticGrid]);

  // Use static grid when in reduced-motion or fallback mode
  const displayLines = isStatic ? staticGrid : lines;

  return (
    <div
      data-testid="ascii-background"
      aria-hidden="true"
      className={`ascii-background absolute inset-0 overflow-hidden select-none ${
        isStatic ? "ascii-bg-static" : "ascii-bg-animated"
      }`}
    >
      <pre
        className="ascii-text font-terminal leading-[12px] text-[10px] sm:text-[11px] sm:leading-[14px] whitespace-pre pointer-events-none"
        data-testid="ascii-text-content"
      >
        {displayLines.join("\n")}
      </pre>
    </div>
  );
}
