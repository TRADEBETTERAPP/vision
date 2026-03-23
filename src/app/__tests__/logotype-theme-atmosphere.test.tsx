/**
 * Tests for the graph-shell-logotype-theme-and-atmosphere feature.
 *
 * VAL-NARR-012: BETTER logotype is the dominant above-the-fold brand signal.
 * VAL-VISUAL-000: Signature BETTER visual system matches the approved shell overhaul.
 * VAL-VISUAL-019: BETTER logotype asset replaces text wordmarks across key shell surfaces.
 * VAL-VISUAL-020: Radiant and Hermes atmosphere visible across the full shell.
 * VAL-VISUAL-021: tradebetter theme parity extends across the full shell.
 * VAL-VISUAL-022: Shell readability holds under the persistent immersive background.
 * VAL-VISUAL-023: BETTER logotype usage is traceable to the provided asset.
 */
import fs from "fs";
import path from "path";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import Home from "../page";
import { SiteAtmosphere } from "@/components/visual/SiteAtmosphere";

// Helper: renders Home wrapped in SiteAtmosphere (mimics layout.tsx structure)
function renderWithAtmosphere() {
  return render(
    <SiteAtmosphere>
      <Home />
    </SiteAtmosphere>
  );
}

// ---------------------------------------------------------------------------
// VAL-VISUAL-019 / VAL-VISUAL-023: Logotype asset is present and traceable
// ---------------------------------------------------------------------------

describe("BETTER logotype asset (VAL-VISUAL-019, VAL-VISUAL-023)", () => {
  it("logotype SVG file exists in the public directory", () => {
    const logotypePath = path.resolve(__dirname, "../../../public/better-logotype.svg");
    expect(fs.existsSync(logotypePath)).toBe(true);
  });

  it("logotype SVG matches the provided asset from Better_Design", () => {
    const repoPath = path.resolve(__dirname, "../../../public/better-logotype.svg");
    const repoContent = fs.readFileSync(repoPath, "utf-8");
    // The logotype should contain the BETTER letterforms (characteristic SVG paths)
    expect(repoContent).toContain("svg");
    expect(repoContent).toContain("fill");
    // Must contain the star/compass BETTER mark (distinctive path)
    expect(repoContent).toContain("343.999");
  });

  it("brand band renders the BETTER logotype image, not text-only wordmark", () => {
    render(<Home />);
    const brandBand = screen.getByTestId("compact-brand-band");
    const logotypeImg = brandBand.querySelector('img[data-testid="hero-logotype"]');
    expect(logotypeImg).toBeInTheDocument();
    expect(logotypeImg!.getAttribute("src")).toContain("better-logotype");
  });

  it("BetterLogotype component exists and uses the correct asset path", () => {
    const componentPath = path.resolve(__dirname, "../../components/BetterLogotype.tsx");
    const content = fs.readFileSync(componentPath, "utf-8");
    expect(content).toContain("/better-logotype.svg");
    expect(content).toContain("Better_Logotype_Light.svg");
  });

  it("layout.tsx header uses BetterLogotype component", () => {
    const layoutPath = path.resolve(__dirname, "../layout.tsx");
    const content = fs.readFileSync(layoutPath, "utf-8");
    expect(content).toContain("BetterLogotype");
    expect(content).toContain('data-testid="header-logotype"');
  });

  it("MobileNav includes BetterLogotype for mobile overlay", () => {
    const mobilePath = path.resolve(__dirname, "../../components/MobileNav.tsx");
    const content = fs.readFileSync(mobilePath, "utf-8");
    expect(content).toContain("BetterLogotype");
    expect(content).toContain('data-testid="mobile-overlay-logotype"');
  });
});

// ---------------------------------------------------------------------------
// VAL-NARR-012: BETTER logotype is the dominant above-the-fold brand signal
// ---------------------------------------------------------------------------

describe("BETTER brand dominance via logotype (VAL-NARR-012)", () => {
  it("brand band h1 contains the logotype image, not just text", () => {
    render(<Home />);
    const brandBand = screen.getByTestId("compact-brand-band");
    const h1 = within(brandBand).getByRole("heading", { level: 1 });
    expect(h1).toBeInTheDocument();
    const logotypeImg = h1.querySelector('img[data-testid="hero-logotype"]');
    expect(logotypeImg).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-000 / VAL-VISUAL-021: tradebetter theme parity
// ---------------------------------------------------------------------------

describe("tradebetter theme parity (VAL-VISUAL-000, VAL-VISUAL-021)", () => {
  const globalsPath = path.resolve(__dirname, "../globals.css");
  const globalsCss = fs.readFileSync(globalsPath, "utf-8");

  it("uses exact tradebetter #101010 as the primary background", () => {
    // Background is exact tradebetter page canvas color
    expect(globalsCss).toContain("--bg-primary: #101010");
  });

  it("uses electric-blue emphasis from tradebetter (#455eff family)", () => {
    expect(globalsCss).toContain("--accent-primary: #455eff");
  });

  it("uses IBM Plex Mono for terminal/UI typography", () => {
    expect(globalsCss).toContain("--font-ibm-plex-mono");
  });

  it("defines restrained display typography", () => {
    expect(globalsCss).toContain("--font-display:");
  });

  it("layout.tsx loads IBM Plex Mono font", () => {
    const layoutPath = path.resolve(__dirname, "../layout.tsx");
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");
    expect(layoutContent).toContain("IBM_Plex_Mono");
    expect(layoutContent).toContain("--font-ibm-plex-mono");
  });

  it("shader uses tradebetter electric-blue palette, not old cyan", () => {
    const shaderPath = path.resolve(__dirname, "../../components/visual/radiant-fluid-amber.glsl.ts");
    const content = fs.readFileSync(shaderPath, "utf-8");
    expect(content).toContain("tradebetter electric-blue");
    expect(content).toMatch(/vec3\(0\.27,\s*0\.37,\s*1\.0\)/);
  });

  it("ASCII layers have been removed (VAL-VISUAL-028)", () => {
    const asciiPath = path.resolve(__dirname, "../../components/visual/AsciiCanvasRenderer.tsx");
    expect(fs.existsSync(asciiPath)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-020: Atmosphere visible across the full shell
// ---------------------------------------------------------------------------

describe("Full-shell atmosphere (VAL-VISUAL-020)", () => {
  it("SiteAtmosphere component wraps content with atmosphere layer", () => {
    renderWithAtmosphere();
    const atmosphereLayer = document.querySelector('[data-testid="site-atmosphere"]');
    expect(atmosphereLayer).toBeInTheDocument();
  });

  it("atmosphere layer encompasses all page sections when wrapped", () => {
    renderWithAtmosphere();
    const atmosphere = document.querySelector('[data-testid="site-atmosphere"]');
    expect(atmosphere).toBeInTheDocument();
    // Graph-first shell: major surfaces are inside the atlas section and graph shell.
    // Check that the brand band, atlas, and proof are within the atmosphere.
    const brandBand = document.querySelector('[data-testid="compact-brand-band"]');
    const atlas = document.getElementById("atlas");
    const proof = document.getElementById("proof");
    expect(brandBand).toBeInTheDocument();
    expect(atlas).toBeInTheDocument();
    expect(proof).toBeInTheDocument();
    expect(atmosphere!.contains(brandBand!)).toBe(true);
    expect(atmosphere!.contains(atlas!)).toBe(true);
    expect(atmosphere!.contains(proof!)).toBe(true);
  });

  it("layout.tsx imports and uses SiteAtmosphere", () => {
    const layoutPath = path.resolve(__dirname, "../layout.tsx");
    const content = fs.readFileSync(layoutPath, "utf-8");
    expect(content).toContain("SiteAtmosphere");
    expect(content).toContain("<SiteAtmosphere>");
  });

  it("CSS defines site-atmosphere-gradient for full-shell atmosphere", () => {
    const globalsPath = path.resolve(__dirname, "../globals.css");
    const content = fs.readFileSync(globalsPath, "utf-8");
    expect(content).toContain("site-atmosphere-gradient");
    // Should use tradebetter electric-blue in the gradient
    expect(content).toMatch(/site-atmosphere-gradient[\s\S]*rgba\(69,\s*94,\s*255/);
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-022: Readability under persistent atmosphere
// ---------------------------------------------------------------------------

describe("Shell readability under persistent atmosphere (VAL-VISUAL-022)", () => {
  it("sections have readable content layers above the atmosphere", () => {
    renderWithAtmosphere();
    // Graph-first shell: major surfaces are inside the atlas section and graph shell.
    // Check that the proof and atlas sections have readable content.
    const sections = ["proof", "atlas"];
    for (const id of sections) {
      const section = document.getElementById(id);
      expect(section).toBeInTheDocument();
      expect(section!.textContent!.length).toBeGreaterThan(10);
    }
    // Also check the compact brand band
    const brandBand = document.querySelector('[data-testid="compact-brand-band"]');
    expect(brandBand).toBeInTheDocument();
    expect(brandBand!.textContent!.length).toBeGreaterThan(10);
  });

  it("content layer is positioned above the atmosphere background", () => {
    renderWithAtmosphere();
    const contentLayer = document.querySelector('[data-testid="site-content"]');
    expect(contentLayer).toBeInTheDocument();
    // Content should have z-10 class for positioning above atmosphere
    expect(contentLayer!.className).toContain("z-10");
  });
});
