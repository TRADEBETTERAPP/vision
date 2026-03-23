/**
 * Bundle splitting, dynamic imports, skeleton screens, and lazy loading tests.
 *
 * VAL-VISUAL-027: Performance — fast first meaningful paint with aggressive
 * bundle splitting, lazy-loaded heavy components, and skeleton/progressive loading.
 *
 * Test-first: These tests define the expected behavior BEFORE the dynamic
 * import implementation is applied. They verify:
 *   1. Heavy components (GraphExplorer, visual layers) are dynamically imported
 *   2. Skeleton screens render during progressive loading
 *   3. Below-fold content (ProofModule) is lazy-loaded
 *   4. Content-first rendering: hero text visible before heavy JS
 */

import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import {
  GraphExplorerSkeleton,
  HeroVisualSkeleton,
  ProofModuleSkeleton,
} from "@/components/skeletons";
import Home from "../page";

// ---------------------------------------------------------------------------
// Helpers — read source files for dynamic import structure verification
// ---------------------------------------------------------------------------

function readSource(relativePath: string): string {
  return fs.readFileSync(path.resolve(__dirname, relativePath), "utf-8");
}

// ---------------------------------------------------------------------------
// 1. Skeleton components exist and render meaningful loading states
// ---------------------------------------------------------------------------

describe("Skeleton screens for progressive loading (VAL-VISUAL-027)", () => {
  it("GraphExplorerSkeleton renders a loading placeholder with grid structure", () => {
    render(<GraphExplorerSkeleton />);
    const skeleton = screen.getByTestId("graph-explorer-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("role", "status");
    expect(skeleton).toHaveAttribute("aria-label", "Loading graph workspace…");
  });

  it("HeroVisualSkeleton renders children immediately with CSS-only background", () => {
    render(
      <HeroVisualSkeleton>
        <span data-testid="hero-content-text">Hello BETTER</span>
      </HeroVisualSkeleton>
    );
    const skeleton = screen.getByTestId("hero-visual-skeleton");
    expect(skeleton).toBeInTheDocument();
    // Content is immediately visible inside skeleton
    expect(screen.getByTestId("hero-content-text")).toBeInTheDocument();
  });

  it("ProofModuleSkeleton renders a loading placeholder for the proof section", () => {
    render(<ProofModuleSkeleton />);
    const skeleton = screen.getByTestId("proof-module-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("role", "status");
  });
});

// ---------------------------------------------------------------------------
// 2. Page uses dynamic imports (verified by checking module structure)
// ---------------------------------------------------------------------------

describe("Dynamic import structure (VAL-VISUAL-027)", () => {
  it("LazyGraphExplorer dynamically imports GraphExplorer with ssr:false", () => {
    const source = readSource(
      "../../components/graph/LazyGraphExplorer.tsx"
    );

    // Should use next/dynamic import
    expect(source).toMatch(/dynamic\s*\(/);
    // Should reference GraphExplorer in a dynamic import
    expect(source).toMatch(/import\(.*GraphExplorer/);
    // Should disable SSR for the graph workspace
    expect(source).toMatch(/ssr:\s*false/);
  });

  it("page.tsx uses LazyGraphExplorer (not a static import of GraphExplorer)", () => {
    const pageSource = readSource("../page.tsx");

    // Should import LazyGraphExplorer
    expect(pageSource).toMatch(/LazyGraphExplorer/);
    // Should NOT have a static import of GraphExplorer directly
    expect(pageSource).not.toMatch(
      /^import\s+\{?\s*GraphExplorer\s*\}?\s+from/m
    );
  });

  it("page.tsx dynamically imports ProofModule for below-fold lazy loading", () => {
    const pageSource = readSource("../page.tsx");

    // Should dynamically import ProofModule
    expect(pageSource).toMatch(/import\(.*ProofModule/);
    // Should NOT have a static import of the ProofModule component itself
    // Note: ProofModuleSkeleton is allowed as a static import
    expect(pageSource).not.toMatch(
      /^import\s+(?!.*Skeleton).*\bProofModule\b.*from\s+["']@\/components\/ProofModule/m
    );
  });

  it("SiteAtmosphere dynamically imports heavy visual components", () => {
    const source = readSource("../../components/visual/SiteAtmosphere.tsx");

    // Should use next/dynamic for HeroShaderCanvas
    expect(source).toMatch(/dynamic\s*\(/);
    expect(source).toMatch(/import\(.*HeroShaderCanvas/);
    // Should use next/dynamic for AsciiCanvasRenderer
    expect(source).toMatch(/import\(.*AsciiCanvasRenderer/);
    // Should use next/dynamic for AsciiBackground
    expect(source).toMatch(/import\(.*AsciiBackground/);
  });

  it("HeroVisualSystem dynamically imports heavy visual components", () => {
    const source = readSource("../../components/visual/HeroVisualSystem.tsx");

    // Should use next/dynamic for heavy components
    expect(source).toMatch(/dynamic\s*\(/);
    expect(source).toMatch(/import\(.*HeroShaderCanvas/);
    expect(source).toMatch(/import\(.*AsciiCanvasRenderer/);
    expect(source).toMatch(/import\(.*AsciiBackground/);
  });
});

// ---------------------------------------------------------------------------
// 3. Content-first rendering: hero text visible in initial render
// ---------------------------------------------------------------------------

describe("Content-first rendering (VAL-VISUAL-001, VAL-VISUAL-027)", () => {
  it("hero tagline and definition are visible in initial page render", () => {
    render(<Home />);
    // The tagline should be visible immediately (not blocked by heavy JS)
    const tagline = screen.getByTestId("hero-tagline");
    expect(tagline).toBeInTheDocument();
    expect(tagline.textContent).toContain("Prediction-market intelligence");
  });

  it("hero CTAs are visible in initial page render", () => {
    render(<Home />);
    expect(screen.getByTestId("cta-primary")).toBeInTheDocument();
    expect(screen.getByTestId("cta-secondary")).toBeInTheDocument();
  });
});
