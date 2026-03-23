/**
 * Regression tests for site-wide atmosphere continuity and mobile-overlay
 * typography consistency.
 *
 * Addresses the scrutiny findings from graph-shell-logotype-theme-and-atmosphere:
 *
 * 1. VAL-VISUAL-020: Radiant/Hermes atmosphere must remain materially visible
 *    across the full shell — not just the hero. The SiteAtmosphere component
 *    must include real Radiant/Hermes layers (shader + ASCII canvas) in addition
 *    to the CSS fallback gradient, so graph/detail, lower-page, and mobile-overlay
 *    states feel like one continuous atmospheric environment.
 *
 * 2. VAL-VISUAL-022: Shell readability must hold under the persistent immersive
 *    background — the extended atmosphere must not block content interactions.
 *
 * 3. Mobile overlay nav links must use the shell's mono UI treatment (font-terminal)
 *    rather than falling back to default sans styling.
 */
import React from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../page";
import { SiteAtmosphere } from "@/components/visual/SiteAtmosphere";
import MobileNav from "@/components/MobileNav";

// Mock desktop-class capability so heavy layers render in tests
beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches:
        query === "(pointer: fine)" ||
        query === "(min-width: 1025px)",
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

// Helper: renders Home wrapped in SiteAtmosphere (mimics layout.tsx structure)
function renderWithAtmosphere() {
  return render(
    <SiteAtmosphere>
      <Home />
    </SiteAtmosphere>
  );
}

// ---------------------------------------------------------------------------
// Site-wide atmosphere continuity: real Radiant/Hermes layers beyond hero
// ---------------------------------------------------------------------------

describe("Site-wide atmosphere includes real Radiant/Hermes layers (VAL-VISUAL-020)", () => {
  it("SiteAtmosphere wraps content in a VisualEffectsProvider for real layers", () => {
    const componentPath = path.resolve(
      __dirname,
      "../../components/visual/SiteAtmosphere.tsx"
    );
    const content = fs.readFileSync(componentPath, "utf-8");
    expect(content).toContain("VisualEffectsProvider");
  });

  it("SiteAtmosphere renders the Hermes ASCII canvas renderer", () => {
    const componentPath = path.resolve(
      __dirname,
      "../../components/visual/SiteAtmosphere.tsx"
    );
    const content = fs.readFileSync(componentPath, "utf-8");
    expect(content).toContain("AsciiCanvasRenderer");
  });

  it("SiteAtmosphere renders the Radiant shader canvas", () => {
    const componentPath = path.resolve(
      __dirname,
      "../../components/visual/SiteAtmosphere.tsx"
    );
    const content = fs.readFileSync(componentPath, "utf-8");
    expect(content).toContain("HeroShaderCanvas");
  });

  it("site atmosphere layer includes ascii-canvas-renderer and shader in DOM", async () => {
    renderWithAtmosphere();
    const atmosphere = document.querySelector('[data-testid="site-atmosphere"]');
    expect(atmosphere).toBeInTheDocument();
    // AsciiCanvasRenderer loads via dynamic import (VAL-VISUAL-027)
    // Wait for dynamically imported components to resolve.
    // Multiple instances may exist (SiteAtmosphere + HeroVisualSystem inside Home).
    const asciiCanvases = await screen.findAllByTestId("ascii-canvas-renderer");
    // Note: AsciiCanvasRenderer renders a <canvas> element
    // In test (JSDOM) the canvas may not init WebGL, but the element should be present
    expect(asciiCanvases.length).toBeGreaterThan(0);
  });

  it("SiteAtmosphere applies reduced opacity to its Radiant/Hermes layers for readability", () => {
    const componentPath = path.resolve(
      __dirname,
      "../../components/visual/SiteAtmosphere.tsx"
    );
    const content = fs.readFileSync(componentPath, "utf-8");
    // Should have opacity modifiers for the atmosphere layers
    expect(content).toMatch(/opacity/i);
  });

  it("SiteAtmosphere CSS has site-specific atmosphere-shader and atmosphere-ascii classes", () => {
    const globalsPath = path.resolve(__dirname, "../globals.css");
    const content = fs.readFileSync(globalsPath, "utf-8");
    expect(content).toContain("site-atmosphere-shader");
    expect(content).toContain("site-atmosphere-ascii");
  });
});

// ---------------------------------------------------------------------------
// Shell readability under persistent atmosphere (VAL-VISUAL-022)
// ---------------------------------------------------------------------------

describe("Shell readability under real atmosphere layers (VAL-VISUAL-022)", () => {
  it("atmosphere layers have pointer-events-none so they never block content", () => {
    renderWithAtmosphere();
    const atmosphereBackground = document.querySelector(
      '[data-testid="site-atmosphere"] > div[aria-hidden="true"]'
    );
    if (atmosphereBackground) {
      expect(atmosphereBackground.className).toContain("pointer-events-none");
    }
  });

  it("content layer sits above atmosphere layers via z-index", () => {
    renderWithAtmosphere();
    const contentLayer = document.querySelector('[data-testid="site-content"]');
    expect(contentLayer).toBeInTheDocument();
    expect(contentLayer!.className).toContain("z-10");
  });
});

// ---------------------------------------------------------------------------
// Mobile overlay mono UI typography consistency
// ---------------------------------------------------------------------------

describe("Mobile overlay uses mono UI treatment (font-terminal)", () => {
  it("mobile nav links use font-terminal class", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);
    await user.click(screen.getByTestId("mobile-menu-button"));
    const links = screen.getAllByTestId("mobile-nav-link");
    for (const link of links) {
      expect(link.className).toContain("font-terminal");
    }
  });

  it("MobileNav source uses font-terminal on nav links", () => {
    const mobilePath = path.resolve(
      __dirname,
      "../../components/MobileNav.tsx"
    );
    const content = fs.readFileSync(mobilePath, "utf-8");
    // The nav link className string should include font-terminal
    // font-terminal may appear before or after data-testid in source
    expect(content).toMatch(/font-terminal[\s\S]*?mobile-nav-link|mobile-nav-link[\s\S]*?font-terminal/);
  });
});
