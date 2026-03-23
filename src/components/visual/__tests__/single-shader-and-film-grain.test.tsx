/**
 * Tests for the single-shader + film-grain atmosphere system
 *
 * VAL-VISUAL-029: ONE Radiant Fluid Amber shader instance runs site-wide
 * at reduced opacity as subtle atmosphere, plus a tradebetter-matching
 * film grain overlay (animated noise at low opacity with lighten blend mode).
 * No duplicate shader instances. Atmosphere is visible but subtle.
 *
 * Feature: redesign-single-shader-and-film-grain-atmosphere
 *
 * Expected behavior:
 * - ONE Radiant Fluid Amber shader instance runs at reduced opacity
 * - Film grain overlay tiled across full viewport at 5% opacity
 *   with mix-blend-mode:lighten and pointer-events:none
 * - Vignette gradient overlays are removed
 * - Atmosphere is visible but does not compete with content
 */
import React from "react";
import fs from "fs";
import path from "path";
import { render } from "@testing-library/react";
import { SiteAtmosphere } from "../SiteAtmosphere";

// Mock desktop-class capability so heavy layers render in tests
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
});

// ---------------------------------------------------------------------------
// ONE shader instance site-wide (VAL-VISUAL-029)
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-029: Single shader site-wide atmosphere", () => {
  it("SiteAtmosphere includes the Radiant shader canvas", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../SiteAtmosphere.tsx"),
      "utf-8"
    );
    expect(src).toContain("HeroShaderCanvas");
  });

  it("HeroVisualSystem does NOT include its own shader canvas (no duplicate)", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../HeroVisualSystem.tsx"),
      "utf-8"
    );
    // HeroVisualSystem should NOT dynamically import or render HeroShaderCanvas
    expect(src).not.toMatch(/import.*HeroShaderCanvas/);
    expect(src).not.toContain("<HeroShaderCanvas");
  });

  it("SiteAtmosphere shader runs at reduced but visible opacity (0.15–0.35)", () => {
    const cssSrc = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    // The site-atmosphere-shader class should have opacity in the 0.15–0.35 range
    const shaderRule = cssSrc.match(
      /\.site-atmosphere-shader\s*\{[^}]*\}/
    );
    expect(shaderRule).not.toBeNull();
    const opacityMatch = shaderRule![0].match(/opacity:\s*([\d.]+)/);
    expect(opacityMatch).not.toBeNull();
    const opacity = parseFloat(opacityMatch![1]);
    expect(opacity).toBeGreaterThanOrEqual(0.15);
    expect(opacity).toBeLessThanOrEqual(0.35);
  });
});

// ---------------------------------------------------------------------------
// Film grain overlay (VAL-VISUAL-029)
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-029: Film grain overlay", () => {
  it("SiteAtmosphere renders a film-grain overlay element", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const grain = document.querySelector('[data-testid="film-grain-overlay"]');
    expect(grain).toBeInTheDocument();
  });

  it("film grain overlay has pointer-events-none", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const grain = document.querySelector('[data-testid="film-grain-overlay"]');
    expect(grain).not.toBeNull();
    expect(grain!.className).toContain("pointer-events-none");
  });

  it("CSS defines film-grain-overlay with ~5% opacity and mix-blend-mode:lighten", () => {
    const cssSrc = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    expect(cssSrc).toContain("film-grain-overlay");
    // Should have mix-blend-mode: lighten
    expect(cssSrc).toMatch(/film-grain-overlay[\s\S]*?mix-blend-mode:\s*lighten/);
    // Should have opacity around 5% (0.05)
    expect(cssSrc).toMatch(/film-grain-overlay[\s\S]*?opacity:\s*0\.05/);
  });

  it("film grain overlay covers the full viewport (fixed inset-0)", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const grain = document.querySelector('[data-testid="film-grain-overlay"]');
    expect(grain).not.toBeNull();
    // Should be fixed position covering full viewport
    expect(grain!.className).toMatch(/fixed/);
    expect(grain!.className).toMatch(/inset-0/);
  });

  it("film grain overlay is aria-hidden", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const grain = document.querySelector('[data-testid="film-grain-overlay"]');
    expect(grain).not.toBeNull();
    expect(grain!.getAttribute("aria-hidden")).toBe("true");
  });
});

// ---------------------------------------------------------------------------
// Vignette removal
// ---------------------------------------------------------------------------

describe("Vignette gradient overlays removed", () => {
  it("HeroVisualSystem does not render a vignette layer", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../HeroVisualSystem.tsx"),
      "utf-8"
    );
    expect(src).not.toContain("hero-vignette");
  });

  it("HeroVisualSkeleton does not render a vignette layer", () => {
    const skeletonSrc = fs.readFileSync(
      path.resolve(__dirname, "../../skeletons/HeroVisualSkeleton.tsx"),
      "utf-8"
    );
    expect(skeletonSrc).not.toContain("hero-vignette");
  });

  it("globals.css does not contain hero-vignette class", () => {
    const cssSrc = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    expect(cssSrc).not.toContain(".hero-vignette");
  });
});

// ---------------------------------------------------------------------------
// Atmosphere does not compete with content
// ---------------------------------------------------------------------------

describe("Atmosphere is visible but does not compete with content", () => {
  it("content layer is positioned above all atmosphere layers", () => {
    render(
      <SiteAtmosphere>
        <div data-testid="test-content">test content</div>
      </SiteAtmosphere>
    );
    const content = document.querySelector('[data-testid="site-content"]');
    expect(content).not.toBeNull();
    expect(content!.className).toContain("z-10");
  });

  it("all atmosphere background layers have pointer-events-none", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const atmosphereBg = document.querySelector(
      '[data-testid="site-atmosphere"] > div[aria-hidden="true"]'
    );
    if (atmosphereBg) {
      expect(atmosphereBg.className).toContain("pointer-events-none");
    }
  });
});

// ---------------------------------------------------------------------------
// Scanline/vignette/texture overlay enforcement (two-layer-only atmosphere)
// The approved atmosphere is ONLY: shader + film grain. No scanlines, no
// vignettes, no additional texture overlays of any kind.
// ---------------------------------------------------------------------------

describe("Two-layer-only atmosphere enforcement: no scanlines, vignettes, or texture overlays", () => {
  it("globals.css does not contain .scanline-overlay class", () => {
    const cssSrc = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    expect(cssSrc).not.toContain(".scanline-overlay");
  });

  it("globals.css does not contain scanline-related CSS selectors", () => {
    const cssSrc = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    expect(cssSrc).not.toMatch(/scanline/i);
  });

  it("HeroVisualSystem does not render a scanline overlay layer", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../HeroVisualSystem.tsx"),
      "utf-8"
    );
    expect(src).not.toContain('className="scanline-overlay');
    expect(src).not.toContain("scanline-overlay");
  });

  it("HeroVisualSkeleton does not render a scanline overlay layer", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../../skeletons/HeroVisualSkeleton.tsx"),
      "utf-8"
    );
    expect(src).not.toContain('className="scanline-overlay');
    expect(src).not.toContain("scanline-overlay");
  });

  it("SiteAtmosphere does not render a scanline overlay layer", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../SiteAtmosphere.tsx"),
      "utf-8"
    );
    expect(src).not.toContain('className="scanline-overlay');
    expect(src).not.toContain("scanline-overlay");
  });

  it("no scanline-overlay elements exist in the rendered DOM", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const scanlines = document.querySelectorAll(".scanline-overlay");
    expect(scanlines.length).toBe(0);
  });

  it("globals.css does not contain .hero-vignette class", () => {
    const cssSrc = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    expect(cssSrc).not.toContain(".hero-vignette");
  });

  it("no vignette overlay elements exist in the rendered hero DOM", () => {
    render(
      <SiteAtmosphere>
        <div>test content</div>
      </SiteAtmosphere>
    );
    const vignettes = document.querySelectorAll('[class*="vignette"]');
    expect(vignettes.length).toBe(0);
  });

  it("only approved atmosphere layers exist: shader + film grain + CSS gradient fallback", () => {
    const atmosphereSrc = fs.readFileSync(
      path.resolve(__dirname, "../SiteAtmosphere.tsx"),
      "utf-8"
    );
    // The only visual overlays allowed are:
    // 1. site-atmosphere-gradient (CSS fallback)
    // 2. site-atmosphere-shader (Radiant Fluid Amber WebGL)
    // 3. FilmGrainOverlay (film grain at 5% opacity)
    expect(atmosphereSrc).toContain("site-atmosphere-gradient");
    expect(atmosphereSrc).toContain("site-atmosphere-shader");
    expect(atmosphereSrc).toContain("FilmGrainOverlay");
    // Must NOT contain any additional texture overlay CSS class names or elements
    expect(atmosphereSrc).not.toContain("scanline-overlay");
    expect(atmosphereSrc).not.toContain("texture-overlay");
    // Must NOT render a vignette element (className check, not docblock policy text)
    expect(atmosphereSrc).not.toMatch(/className="[^"]*vignette/);
    expect(atmosphereSrc).not.toMatch(/className='[^']*vignette/);
  });
});
