/**
 * VAL-VISUAL-016 contract update: Approved visual stack verification.
 *
 * VAL-VISUAL-016 originally required an ASCII canvas renderer derived from
 * the Hermes pipeline. ASCII has been permanently removed from the redesign
 * (VAL-VISUAL-028). This test file replaces the old ASCII-layer coverage
 * with verification of the new approved stack:
 *
 *   1. Single Radiant Fluid Amber shader (site-wide, reduced opacity)
 *   2. Tradebetter-matching film grain overlay (5% opacity, lighten blend)
 *   3. No ASCII canvas, ASCII background, or Hermes-derived DOM text grids
 *
 * The approved stack is defined in AGENTS.md "Visual Re-Engineering Guidance"
 * and validated by VAL-VISUAL-028 (ASCII removed) + VAL-VISUAL-029 (single
 * shader + film grain).
 */
import React from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { SiteAtmosphere } from "../SiteAtmosphere";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readFile(relPath: string): string {
  return fs.readFileSync(path.resolve(__dirname, relPath), "utf-8");
}

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches:
        query === "(pointer: fine)" || query === "(min-width: 1025px)",
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-016 → VAL-VISUAL-028: ASCII layer permanently removed
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-016 contract update: ASCII layer replaced by approved stack", () => {
  it("AsciiCanvasRenderer.tsx does not exist (ASCII permanently removed)", () => {
    expect(
      fs.existsSync(path.resolve(__dirname, "../AsciiCanvasRenderer.tsx"))
    ).toBe(false);
  });

  it("AsciiBackground.tsx does not exist (ASCII permanently removed)", () => {
    expect(
      fs.existsSync(path.resolve(__dirname, "../AsciiBackground.tsx"))
    ).toBe(false);
  });

  it("no Hermes ASCII pipeline references remain in the visual component index", () => {
    const indexSrc = readFile("../index.ts");
    expect(indexSrc).not.toContain("AsciiCanvasRenderer");
    expect(indexSrc).not.toContain("AsciiBackground");
    expect(indexSrc).not.toContain("hermes");
  });

  it("no ASCII-related test IDs are rendered by SiteAtmosphere", () => {
    render(
      <SiteAtmosphere>
        <div>content</div>
      </SiteAtmosphere>
    );
    expect(
      screen.queryByTestId("ascii-canvas-renderer")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("ascii-background")
    ).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-016 → VAL-VISUAL-029: Approved stack — single shader + film grain
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-016 contract update: Single shader replaces ASCII canvas", () => {
  it("SiteAtmosphere renders the Radiant shader as the sole atmospheric animation", () => {
    const src = readFile("../SiteAtmosphere.tsx");
    // Must import HeroShaderCanvas (the single Radiant shader)
    expect(src).toContain("HeroShaderCanvas");
    // Must NOT import any ASCII renderer
    expect(src).not.toContain("AsciiCanvasRenderer");
    expect(src).not.toContain("AsciiBackground");
  });

  it("exactly one shader instance is declared site-wide (no duplicates)", () => {
    const siteSrc = readFile("../SiteAtmosphere.tsx");
    const heroSrc = readFile("../HeroVisualSystem.tsx");
    // SiteAtmosphere owns the shader
    expect(siteSrc).toContain("HeroShaderCanvas");
    // HeroVisualSystem must NOT duplicate the shader
    expect(heroSrc).not.toMatch(/import.*HeroShaderCanvas/);
    expect(heroSrc).not.toContain("<HeroShaderCanvas");
  });

  it("shader runs at reduced opacity for atmospheric subtlety", () => {
    const cssSrc = readFile("../../../app/globals.css");
    const shaderRule = cssSrc.match(/\.site-atmosphere-shader\s*\{[^}]*\}/);
    expect(shaderRule).not.toBeNull();
    const opacityMatch = shaderRule![0].match(/opacity:\s*([\d.]+)/);
    expect(opacityMatch).not.toBeNull();
    const opacity = parseFloat(opacityMatch![1]);
    // Atmospheric, not dominant: 0.15–0.35
    expect(opacity).toBeGreaterThanOrEqual(0.15);
    expect(opacity).toBeLessThanOrEqual(0.35);
  });
});

describe("VAL-VISUAL-016 contract update: Film grain overlay replaces ASCII texture", () => {
  it("SiteAtmosphere renders a film-grain overlay", () => {
    render(
      <SiteAtmosphere>
        <div>content</div>
      </SiteAtmosphere>
    );
    const grain = screen.queryByTestId("film-grain-overlay");
    expect(grain).toBeInTheDocument();
  });

  it("film grain uses mix-blend-mode:lighten at ~5% opacity", () => {
    const cssSrc = readFile("../../../app/globals.css");
    expect(cssSrc).toMatch(
      /film-grain-overlay[\s\S]*?mix-blend-mode:\s*lighten/
    );
    expect(cssSrc).toMatch(/film-grain-overlay[\s\S]*?opacity:\s*0\.05/);
  });

  it("film grain overlay does not block pointer events", () => {
    render(
      <SiteAtmosphere>
        <div>content</div>
      </SiteAtmosphere>
    );
    const grain = screen.getByTestId("film-grain-overlay");
    expect(grain.className).toContain("pointer-events-none");
  });
});

// ---------------------------------------------------------------------------
// No old ASCII requirement lingers in test assertions
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-016 contract update: No test files assert ASCII should exist", () => {
  it("no test file in visual/__tests__/ asserts ASCII layers SHOULD be present", () => {
    const testDir = path.resolve(__dirname);
    const testFiles = fs.readdirSync(testDir).filter((f) => f.endsWith(".test.tsx") || f.endsWith(".test.ts"));
    for (const file of testFiles) {
      const content = fs.readFileSync(path.join(testDir, file), "utf-8");
      // No assertion that ASCII should be in the document or that files should exist
      expect(content).not.toMatch(
        /expect\(.*ascii.*\)\.toBeInTheDocument\(\)/i
      );
      expect(content).not.toMatch(
        /expect\(fs\.existsSync\(.*[Aa]scii.*\)\)\.toBe\(true\)/
      );
    }
  });

  it("no test file in app/__tests__/ asserts ASCII layers SHOULD be present", () => {
    const testDir = path.resolve(__dirname, "../../../app/__tests__");
    const testFiles = fs.readdirSync(testDir).filter((f) => f.endsWith(".test.tsx") || f.endsWith(".test.ts"));
    for (const file of testFiles) {
      const content = fs.readFileSync(path.join(testDir, file), "utf-8");
      expect(content).not.toMatch(
        /expect\(.*ascii.*\)\.toBeInTheDocument\(\)/i
      );
      expect(content).not.toMatch(
        /expect\(fs\.existsSync\(.*[Aa]scii.*\)\)\.toBe\(true\)/
      );
    }
  });
});
