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

  it("GraphExplorer lazy-loads each new content-depth surface with next/dynamic", () => {
    const source = readSource("../../components/graph/GraphExplorer.tsx");

    expect(source).toMatch(/dynamic\s*\(/);
    expect(source).toMatch(/import\(.*MacroThesisSurface/);
    expect(source).toMatch(/import\(.*HftEdgeSurface/);
    expect(source).toMatch(/import\(.*LlmProductSurface/);
    expect(source).toMatch(/import\(.*TruthPerpFlywheelSurface/);
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

  it("LazyProofModule is a client component that dynamically imports ProofModule with ssr:false", () => {
    const source = readSource(
      "../../components/LazyProofModule.tsx"
    );

    // Must be a client component (the whole point of this fix)
    expect(source).toMatch(/^["']use client["']/m);
    // Should use next/dynamic import
    expect(source).toMatch(/dynamic\s*\(/);
    // Should reference ProofModule in a dynamic import
    expect(source).toMatch(/import\(.*ProofModule/);
    // Should disable SSR so the proof module loads entirely on the client
    expect(source).toMatch(/ssr:\s*false/);
  });

  it("page.tsx uses LazyProofModule (not a direct dynamic import of ProofModule)", () => {
    const pageSource = readSource("../page.tsx");

    // Should import LazyProofModule
    expect(pageSource).toMatch(/LazyProofModule/);
    // Should NOT have a static import of the ProofModule component itself
    expect(pageSource).not.toMatch(
      /^import\s+(?!.*Lazy)(?!.*Skeleton).*\bProofModule\b.*from/m
    );
    // Should NOT use dynamic() directly in page.tsx for ProofModule
    // (dynamic() in a server component is ineffective in Next App Router)
    expect(pageSource).not.toMatch(/dynamic\s*\(\s*\(\)\s*=>\s*import\(.*ProofModule/);
  });

  it("SiteAtmosphere dynamically imports heavy visual components", () => {
    const source = readSource("../../components/visual/SiteAtmosphere.tsx");

    // Should use next/dynamic for HeroShaderCanvas
    expect(source).toMatch(/dynamic\s*\(/);
    expect(source).toMatch(/import\(.*HeroShaderCanvas/);
    // VAL-VISUAL-028: Only approved components (shader + film grain) are imported
    expect(source).toMatch(/HeroShaderCanvas/);
  });

  it("HeroVisualSystem does not duplicate heavy visual imports (single-shader rule)", () => {
    const source = readSource("../../components/visual/HeroVisualSystem.tsx");

    // VAL-VISUAL-029: HeroVisualSystem no longer imports HeroShaderCanvas —
    // the single shader instance lives exclusively in SiteAtmosphere.
    // HeroVisualSystem provides only a CSS fallback gradient layer.
    expect(source).not.toMatch(/import\(.*HeroShaderCanvas/);
    // VAL-VISUAL-028: Only approved components exist in the visual system
    expect(source).toContain("hero-radiant-fallback");
  });
});

// ---------------------------------------------------------------------------
// 2b. LazyProofModule real lazy behavior — client wrapper shows skeleton
// ---------------------------------------------------------------------------

describe("LazyProofModule renders loading skeleton before ProofModule loads", () => {
  it("renders ProofModuleSkeleton as the initial loading state", () => {
    // Import LazyProofModule directly — because next/dynamic with ssr:false
    // is mocked in jest (the dynamic component never resolves synchronously),
    // the loading fallback (ProofModuleSkeleton) should be rendered.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { LazyProofModule } = require("@/components/LazyProofModule");
    render(<LazyProofModule />);

    // The skeleton should be visible (loading state is shown before the
    // real ProofModule JS has loaded)
    const skeleton = screen.getByTestId("proof-module-skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("role", "status");
    expect(skeleton).toHaveAttribute(
      "aria-label",
      "Loading proof section…"
    );

    // The real proof section should NOT be present yet (it hasn't loaded)
    expect(screen.queryByTestId("proof-section")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. Content-first rendering: hero text visible in initial render
// ---------------------------------------------------------------------------

describe("Content-first rendering (VAL-VISUAL-001, VAL-VISUAL-027)", () => {
  it("brand band tagline and definition are visible in initial page render", () => {
    render(<Home />);
    // The tagline should be visible immediately (server-rendered compact brand band)
    const tagline = screen.getByTestId("hero-tagline");
    expect(tagline).toBeInTheDocument();
    expect(tagline.textContent).toContain("Prediction-market intelligence");
  });

  it("brand band CTAs are visible in initial page render", () => {
    render(<Home />);
    expect(screen.getByTestId("cta-primary")).toBeInTheDocument();
    expect(screen.getByTestId("cta-secondary")).toBeInTheDocument();
  });
});
