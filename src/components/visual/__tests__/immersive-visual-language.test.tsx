/**
 * Tests for the authentic BETTER immersive visual language
 *
 * Covers:
 * - VAL-VISUAL-011: Hero motion is intentional and limited (2 motions, no ambient loops)
 * - VAL-VISUAL-012: Shader layer feels authentically Radiant-influenced
 * - VAL-VISUAL-028: All ASCII layers permanently removed (replaces old VAL-VISUAL-013/016 ASCII requirement)
 * - VAL-VISUAL-000: Signature visual system is visibly present (upgraded)
 * - VAL-VISUAL-001: Content-first hero renders before effects (preserved)
 * - VAL-VISUAL-003: Reduced-motion preserves hierarchy (preserved)
 * - VAL-VISUAL-004: Runtime fallback handles failures cleanly (preserved)
 *
 * Note: VAL-VISUAL-016 (formerly ASCII canvas renderer) now verifies the
 * approved stack (single shader + film grain). See visual-016-approved-stack.test.tsx.
 */
import fs from "fs";
import path from "path";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { HeroShaderCanvas } from "../HeroShaderCanvas";
import { VisualEffectsProvider, useVisualEffects } from "../VisualEffectsProvider";

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function createMockWebGLContext() {
  return {
    createShader: jest.fn().mockReturnValue({}),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    getShaderParameter: jest.fn().mockReturnValue(true),
    createProgram: jest.fn().mockReturnValue({}),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    getProgramParameter: jest.fn().mockReturnValue(true),
    createBuffer: jest.fn().mockReturnValue({}),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),
    getAttribLocation: jest.fn().mockReturnValue(0),
    getUniformLocation: jest.fn().mockReturnValue({}),
    useProgram: jest.fn(),
    enableVertexAttribArray: jest.fn(),
    vertexAttribPointer: jest.fn(),
    uniform1f: jest.fn(),
    uniform2f: jest.fn(),
    drawArrays: jest.fn(),
    viewport: jest.fn(),
    deleteProgram: jest.fn(),
    deleteShader: jest.fn(),
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88e4,
    FLOAT: 0x1406,
    TRIANGLES: 0x0004,
  };
}

function mockReducedMotion(enabled: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches:
        (enabled && query === "(prefers-reduced-motion: reduce)") ||
        (!enabled && query === "(pointer: fine)") ||
        (!enabled && query === "(min-width: 1025px)"),
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);
  mockReducedMotion(false);
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-011: Hero motion is intentional and limited
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-011: Hero motion is intentional and limited", () => {
  it("hero content wrapper uses one-shot entrance animation class", () => {
    render(<Home />);
    const heroContent = screen.getByTestId("hero-content");
    expect(heroContent.className).toContain("hero-entrance");
  });

  it("globals.css defines hero-enter as a single-run animation (no infinite)", () => {
    const globalsCss = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    // The hero-enter keyframe should exist
    expect(globalsCss).toContain("@keyframes hero-enter");
    // It should NOT contain 'infinite' for hero-enter animation
    const heroEntranceRule = globalsCss.match(
      /\.hero-entrance\s*\{[\s\S]*?\}/
    );
    expect(heroEntranceRule).not.toBeNull();
    expect(heroEntranceRule![0]).not.toContain("infinite");
  });

  it("vendored shader time scale produces slow motion (not frenetic)", () => {
    const shaderSource = fs.readFileSync(
      path.resolve(__dirname, "../radiant-fluid-amber.glsl.ts"),
      "utf-8"
    );
    // The vendored Radiant shader uses TIME_SCALE = 0.15 (slow organic drift)
    expect(shaderSource).toMatch(/TIME_SCALE\s*=\s*0\.15/);
  });

  it("reduced motion disables hero entrance animation in CSS", () => {
    const globalsCss = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    // Reduced motion section should override hero-entrance
    expect(globalsCss).toMatch(
      /prefers-reduced-motion[\s\S]*\.hero-entrance[\s\S]*animation:\s*none/
    );
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-012: Shader layer feels authentically Radiant-influenced
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-012: Shader feels authentically Radiant-influenced", () => {
  it("vendored shader uses fbm (fractional Brownian motion) with snoise", () => {
    const shaderSource = fs.readFileSync(
      path.resolve(__dirname, "../radiant-fluid-amber.glsl.ts"),
      "utf-8"
    );
    expect(shaderSource).toContain("fbm");
    expect(shaderSource).toContain("snoise");
  });

  it("vendored shader uses tradebetter electric-blue color palette (not generic green or amber)", () => {
    const shaderSource = fs.readFileSync(
      path.resolve(__dirname, "../radiant-fluid-amber.glsl.ts"),
      "utf-8"
    );
    // Should contain tradebetter electric-blue peak (#455eff → ~0.27, 0.37, 1.0)
    expect(shaderSource).toMatch(/vec3\(0\.27,\s*0\.37,\s*1\.0\)/);
    // Should not use the old green accent
    expect(shaderSource).not.toContain("0, 1, 0.533");
    // Near-black base with blue hint
    expect(shaderSource).toMatch(/vec3\(0\.02,\s*0\.02,\s*0\.08\)/);
  });

  it("vendored shader creates depth with q-r-f domain-warp composition", () => {
    const shaderSource = fs.readFileSync(
      path.resolve(__dirname, "../radiant-fluid-amber.glsl.ts"),
      "utf-8"
    );
    // Triple-pass domain warp: q → r → f
    expect(shaderSource).toMatch(/vec2\s+q\s*=/);
    expect(shaderSource).toMatch(/vec2\s+r\s*=/);
    // Highlight extraction for radiant feel
    expect(shaderSource).toContain("highlight");
  });

  it("vendored shader includes vignette for atmospheric edge fade", () => {
    const shaderSource = fs.readFileSync(
      path.resolve(__dirname, "../radiant-fluid-amber.glsl.ts"),
      "utf-8"
    );
    expect(shaderSource).toContain("vignette");
  });

  it("CSS radiant fallback uses tradebetter electric-blue radial gradients", () => {
    const globalsCss = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    expect(globalsCss).toContain("hero-radiant-fallback");
    // Multiple gradient layers for depth
    const fallbackRule = globalsCss.match(
      /\.hero-radiant-fallback\s*\{[\s\S]*?\}/
    );
    expect(fallbackRule).not.toBeNull();
    // Should contain radial-gradient (not just a flat color)
    expect(fallbackRule![0]).toContain("radial-gradient");
  });

  it("renders the radiant fallback layer in the DOM", () => {
    render(<Home />);
    const fallback = screen.getByTestId("hero-radiant-fallback");
    expect(fallback).toBeInTheDocument();
    expect(fallback.className).toContain("hero-radiant-fallback");
  });

  it("shader canvas renders at high opacity for material impact", () => {
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue(createMockWebGLContext());

    render(
      <VisualEffectsProvider>
        <HeroShaderCanvas />
      </VisualEffectsProvider>
    );
    const canvas = screen.getByTestId("hero-shader-canvas");
    const opacity = parseFloat(canvas.style.opacity || "1");
    // Should be materially visible (>= 0.7), not faint (0.6 was old)
    expect(opacity).toBeGreaterThanOrEqual(0.7);
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-028: All ASCII layers permanently removed
// (Replaces old VAL-VISUAL-013 / VAL-VISUAL-016 ASCII requirement.
//  The approved stack is now: single shader + film grain — see
//  visual-016-approved-stack.test.tsx for full VAL-VISUAL-016 coverage.)
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-028: Zero ASCII code remaining", () => {
  it("no ASCII-related CSS classes exist in globals.css", () => {
    const globalsCss = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    expect(globalsCss).not.toContain(".ascii-canvas-renderer");
    expect(globalsCss).not.toContain(".ascii-background");
    expect(globalsCss).not.toContain(".ascii-bg-animated");
    expect(globalsCss).not.toContain(".ascii-bg-static");
    expect(globalsCss).not.toContain(".ascii-text");
    expect(globalsCss).not.toContain("site-atmosphere-ascii");
  });

  it("HeroVisualSystem does not reference any ASCII components", () => {
    const heroSrc = fs.readFileSync(
      path.resolve(__dirname, "../HeroVisualSystem.tsx"),
      "utf-8"
    );
    expect(heroSrc).not.toContain("AsciiCanvasRenderer");
    expect(heroSrc).not.toContain("AsciiBackground");
  });

  it("SiteAtmosphere does not reference any ASCII components", () => {
    const atmSrc = fs.readFileSync(
      path.resolve(__dirname, "../SiteAtmosphere.tsx"),
      "utf-8"
    );
    expect(atmSrc).not.toContain("AsciiCanvasRenderer");
    expect(atmSrc).not.toContain("AsciiBackground");
  });

  it("visual/index.ts does not export ASCII components", () => {
    const indexSrc = fs.readFileSync(
      path.resolve(__dirname, "../index.ts"),
      "utf-8"
    );
    expect(indexSrc).not.toContain("AsciiBackground");
    expect(indexSrc).not.toContain("AsciiCanvasRenderer");
  });

  it("AsciiCanvasRenderer.tsx file does not exist", () => {
    const filePath = path.resolve(__dirname, "../AsciiCanvasRenderer.tsx");
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it("AsciiBackground.tsx file does not exist", () => {
    const filePath = path.resolve(__dirname, "../AsciiBackground.tsx");
    expect(fs.existsSync(filePath)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-000: Upgraded signature visual system verification
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-000: Signature BETTER visual system is present (upgraded)", () => {
  it("hero visual system contains Radiant fallback and shader slot", () => {
    render(<Home />);
    expect(screen.getByTestId("hero-visual-system")).toBeInTheDocument();
    expect(screen.getByTestId("hero-radiant-fallback")).toBeInTheDocument();
  });

  it("visual layers are ordered: fallback → content (no scanline/vignette overlays)", () => {
    render(<Home />);
    const system = screen.getByTestId("hero-visual-system");
    const children = Array.from(system.children);

    // Find the positions of key layers
    const fallbackIdx = children.findIndex((c) =>
      (c as HTMLElement).dataset?.testid === "hero-radiant-fallback" ||
      c.className?.includes("hero-radiant-fallback")
    );
    const contentIdx = children.findIndex((c) =>
      (c as HTMLElement).dataset?.testid === "hero-content"
    );

    // Content should be after fallback (highest z-index)
    expect(contentIdx).toBeGreaterThan(fallbackIdx);

    // No scanline overlay should exist in the hero visual system
    const scanlineLayer = children.find((c) =>
      c.className?.includes("scanline-overlay")
    );
    expect(scanlineLayer).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Content-first & fallback preservation
// ---------------------------------------------------------------------------

describe("Content-first and fallback behavior preserved", () => {
  it("hero content is readable in pure fallback mode (no WebGL, no animation)", () => {
    mockReducedMotion(true);

    render(<Home />);
    // BETTER brand is now rendered as logotype image (VAL-VISUAL-019)
    const heroLogotype = screen.getByTestId("hero-logotype");
    expect(heroLogotype).toBeInTheDocument();
    expect(heroLogotype.getAttribute("alt")).toContain("BETTER");
    expect(screen.getByTestId("hero-tagline")).toBeInTheDocument();
    expect(screen.getByTestId("cta-primary")).toBeInTheDocument();
    expect(screen.getByTestId("cta-secondary")).toBeInTheDocument();
    // Radiant fallback gradient should still be present
    expect(screen.getByTestId("hero-radiant-fallback")).toBeInTheDocument();
  });

  it("shader canvas does not render when reduced-motion is active", () => {
    mockReducedMotion(true);
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue(createMockWebGLContext());

    render(
      <VisualEffectsProvider>
        <HeroShaderCanvas />
      </VisualEffectsProvider>
    );
    expect(screen.queryByTestId("hero-shader-canvas")).not.toBeInTheDocument();
  });

  it("WebGL failure triggers fallback without breaking the hero", async () => {
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

    function FallbackChecker() {
      const ctx = useVisualEffects();
      return <span data-testid="is-fallback">{String(ctx.fallback)}</span>;
    }

    render(
      <VisualEffectsProvider>
        <HeroShaderCanvas />
        <FallbackChecker />
      </VisualEffectsProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("is-fallback")).toHaveTextContent("true");
    });
  });
});
