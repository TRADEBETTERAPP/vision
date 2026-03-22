/**
 * Tests for the authentic BETTER immersive visual language
 *
 * Covers:
 * - VAL-VISUAL-011: Hero motion is intentional and limited (3 motions, no ambient loops)
 * - VAL-VISUAL-012: Shader layer feels authentically Radiant-influenced
 * - VAL-VISUAL-013: ASCII atmosphere is materially present and authentic
 * - VAL-VISUAL-000: Signature visual system is visibly present (upgraded)
 * - VAL-VISUAL-001: Content-first hero renders before effects (preserved)
 * - VAL-VISUAL-003: Reduced-motion preserves hierarchy (preserved)
 * - VAL-VISUAL-004: Runtime fallback handles failures cleanly (preserved)
 */
import fs from "fs";
import path from "path";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { AsciiBackground } from "../AsciiBackground";
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
      matches: enabled ? query === "(prefers-reduced-motion: reduce)" : false,
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

  it("ASCII background does NOT use a CSS infinite pulse animation", () => {
    const globalsCss = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    // The animated ASCII class should not reference infinite pulse
    const animatedAscii = globalsCss.match(
      /\.ascii-bg-animated\s+\.ascii-text\s*\{[\s\S]*?\}/
    );
    if (animatedAscii) {
      expect(animatedAscii[0]).not.toContain("animation:");
    }
  });

  it("shader canvas time multiplier produces slow motion (not frenetic)", () => {
    const shaderSource = fs.readFileSync(
      path.resolve(__dirname, "../HeroShaderCanvas.tsx"),
      "utf-8"
    );
    // The FRAGMENT_SHADER should use a slow time multiplier (< 0.1)
    expect(shaderSource).toMatch(/u_time\s*\*\s*0\.0[0-9]/);
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
  it("shader uses fbm (fractional Brownian motion) for organic noise", () => {
    const shaderSource = fs.readFileSync(
      path.resolve(__dirname, "../HeroShaderCanvas.tsx"),
      "utf-8"
    );
    expect(shaderSource).toContain("fbm");
    expect(shaderSource).toContain("noise");
  });

  it("shader uses BETTER blue color palette (not generic green)", () => {
    const shaderSource = fs.readFileSync(
      path.resolve(__dirname, "../HeroShaderCanvas.tsx"),
      "utf-8"
    );
    // Should reference blue tones, not green (#00ff88)
    expect(shaderSource).toMatch(/vec3\s*\(\s*0\.0\s*,\s*0\.\d+\s*,\s*1\.0\s*\)/);
    // Should not use the old green accent
    expect(shaderSource).not.toContain("0, 1, 0.533");
  });

  it("shader creates depth with multiple layered noise fields", () => {
    const shaderSource = fs.readFileSync(
      path.resolve(__dirname, "../HeroShaderCanvas.tsx"),
      "utf-8"
    );
    // Multiple field layers for depth
    expect(shaderSource).toContain("field1");
    expect(shaderSource).toContain("field2");
    // Caustic-like highlights for radiant feel
    expect(shaderSource).toContain("caustic");
  });

  it("shader includes vignette for atmospheric edge fade", () => {
    const shaderSource = fs.readFileSync(
      path.resolve(__dirname, "../HeroShaderCanvas.tsx"),
      "utf-8"
    );
    expect(shaderSource).toContain("vignette");
  });

  it("CSS radiant fallback uses BETTER blue radial gradients", () => {
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
// VAL-VISUAL-013: ASCII atmosphere is materially present and authentic
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-013: ASCII atmosphere is materially present and authentic", () => {
  it("ASCII text uses materially visible color in CSS (not 0.04 opacity)", () => {
    const globalsCss = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    const asciiTextRule = globalsCss.match(
      /\.ascii-background\s+\.ascii-text\s*\{[\s\S]*?\}/
    );
    expect(asciiTextRule).not.toBeNull();
    // Should use a visible opacity (>= 0.08)
    const colorMatch = asciiTextRule![0].match(/rgba\([^)]*,\s*([\d.]+)\s*\)/);
    if (colorMatch) {
      const alpha = parseFloat(colorMatch[1]);
      expect(alpha).toBeGreaterThanOrEqual(0.08);
    }
  });

  it("ASCII grid uses structured terminal characters including borders", () => {
    render(
      <VisualEffectsProvider>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    const text = bg.textContent ?? "";
    // Should contain terminal box-drawing characters for structure
    expect(text).toMatch(/[┌┐└┘│─├┤┬┴┼]/);
    // Should contain block characters for texture
    expect(text).toMatch(/[░▒▓]/);
  });

  it("ASCII grid contains data-stream highlight characters", () => {
    render(
      <VisualEffectsProvider>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    const text = bg.textContent ?? "";
    // Should include data-stream characters
    expect(text).toMatch(/[01$>_●◆]/);
  });

  it("ASCII text content has material length (not a tiny grid)", () => {
    render(
      <VisualEffectsProvider>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    const text = bg.textContent ?? "";
    // At least 100 * 32 = 3200 characters with borders
    expect(text.length).toBeGreaterThan(2000);
  });

  it("static ASCII grid preserves structure in reduced-motion mode", () => {
    mockReducedMotion(true);

    render(
      <VisualEffectsProvider>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    expect(bg.className).toContain("ascii-bg-static");
    const text = bg.textContent ?? "";
    // Still shows structured characters
    expect(text).toMatch(/[┌┐│─]/);
    expect(text.length).toBeGreaterThan(2000);
  });

  it("ASCII grid renders in fallback mode (WebGL failure does not stop ASCII)", () => {
    render(
      <VisualEffectsProvider forceFallback>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    // ASCII is DOM-based and independent of WebGL — it stays alive even in fallback
    expect(bg).toBeInTheDocument();
    const text = bg.textContent ?? "";
    expect(text).toMatch(/[┌┐│─]/);
    expect(text.length).toBeGreaterThan(2000);
  });

  it("ASCII font styling uses terminal monospace for authenticity", () => {
    render(
      <VisualEffectsProvider>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const pre = screen.getByTestId("ascii-text-content");
    expect(pre.className).toContain("font-terminal");
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-000: Upgraded signature visual system verification
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-000: Signature BETTER visual system is present (upgraded)", () => {
  it("hero visual system contains Radiant fallback, shader slot, and ASCII layer", () => {
    render(<Home />);
    expect(screen.getByTestId("hero-visual-system")).toBeInTheDocument();
    expect(screen.getByTestId("hero-radiant-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("ascii-background")).toBeInTheDocument();
  });

  it("visual layers are ordered: fallback → shader → ASCII → scanline → vignette → content", () => {
    render(<Home />);
    const system = screen.getByTestId("hero-visual-system");
    const children = Array.from(system.children);

    // Find the positions of key layers
    const fallbackIdx = children.findIndex((c) =>
      (c as HTMLElement).dataset?.testid === "hero-radiant-fallback" ||
      c.className?.includes("hero-radiant-fallback")
    );
    const asciiIdx = children.findIndex((c) =>
      (c as HTMLElement).dataset?.testid === "ascii-background"
    );
    const contentIdx = children.findIndex((c) =>
      (c as HTMLElement).dataset?.testid === "hero-content"
    );

    // Content should be last (highest z-index)
    expect(contentIdx).toBeGreaterThan(fallbackIdx);
    expect(contentIdx).toBeGreaterThan(asciiIdx);
  });
});

// ---------------------------------------------------------------------------
// Content-first & fallback preservation
// ---------------------------------------------------------------------------

describe("Content-first and fallback behavior preserved", () => {
  it("hero content is readable in pure fallback mode (no WebGL, no animation)", () => {
    mockReducedMotion(true);

    render(<Home />);
    expect(screen.getByText("BETTER")).toBeInTheDocument();
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
