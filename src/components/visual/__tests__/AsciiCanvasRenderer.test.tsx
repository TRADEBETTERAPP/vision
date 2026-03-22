/**
 * VAL-VISUAL-016: ASCII layer uses a real-time Hermes-derived canvas renderer
 *
 * Tests that the shipped ASCII atmosphere is rendered through a real-time
 * canvas-based renderer derived from Hermes ASCII-video pipeline ideas
 * (glyph mapping, tonal remapping, feedback, multi-layer composition)
 * and does NOT degrade into a synthetic DOM text grid (`<pre>`).
 *
 * Source: https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { AsciiCanvasRenderer } from "../AsciiCanvasRenderer";
import { VisualEffectsProvider } from "../VisualEffectsProvider";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readSource(relPath: string): string {
  return fs.readFileSync(
    path.resolve(__dirname, "..", relPath),
    "utf-8",
  );
}

function mockReducedMotion(enabled: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: enabled
        ? query === "(prefers-reduced-motion: reduce)"
        : false,
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

function createMock2DContext() {
  return {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    fillText: jest.fn(),
    drawImage: jest.fn(),
    setTransform: jest.fn(),
    getImageData: jest.fn().mockReturnValue({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    }),
    measureText: jest.fn().mockReturnValue({
      width: 8,
      actualBoundingBoxAscent: 10,
      actualBoundingBoxDescent: 2,
    }),
    canvas: {
      width: 800,
      height: 600,
      getBoundingClientRect: () => ({
        width: 800,
        height: 600,
        top: 0,
        left: 0,
        right: 800,
        bottom: 600,
      }),
    },
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    font: "",
    textBaseline: "top",
    fillStyle: "#ffffff",
  };
}

beforeEach(() => {
  mockReducedMotion(false);
  const mockCtx = createMock2DContext();
  HTMLCanvasElement.prototype.getContext = jest
    .fn()
    .mockImplementation((type: string) => {
      if (type === "2d") return mockCtx;
      return null;
    });
  // Mock getBoundingClientRect on canvas elements
  HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
    width: 800,
    height: 600,
    top: 0,
    left: 0,
    right: 800,
    bottom: 600,
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-016: Canvas-based renderer (not DOM <pre> grid)
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-016: ASCII canvas renderer is canvas-based", () => {
  it("renders a <canvas> element, not a <pre> element", () => {
    render(
      <VisualEffectsProvider>
        <AsciiCanvasRenderer />
      </VisualEffectsProvider>,
    );
    const canvas = screen.getByTestId("ascii-canvas-renderer");
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName).toBe("CANVAS");
  });

  it("canvas is aria-hidden for accessibility", () => {
    render(
      <VisualEffectsProvider>
        <AsciiCanvasRenderer />
      </VisualEffectsProvider>,
    );
    const canvas = screen.getByTestId("ascii-canvas-renderer");
    expect(canvas.getAttribute("aria-hidden")).toBe("true");
  });

  it("canvas has the ascii-canvas-renderer CSS class", () => {
    render(
      <VisualEffectsProvider>
        <AsciiCanvasRenderer />
      </VisualEffectsProvider>,
    );
    const canvas = screen.getByTestId("ascii-canvas-renderer");
    expect(canvas.className).toContain("ascii-canvas-renderer");
  });

  it("renders without crashing in reduced-motion mode", () => {
    mockReducedMotion(true);
    render(
      <VisualEffectsProvider>
        <AsciiCanvasRenderer />
      </VisualEffectsProvider>,
    );
    const canvas = screen.getByTestId("ascii-canvas-renderer");
    expect(canvas).toBeInTheDocument();
  });

  it("renders without crashing in WebGL fallback mode", () => {
    render(
      <VisualEffectsProvider forceFallback>
        <AsciiCanvasRenderer />
      </VisualEffectsProvider>,
    );
    const canvas = screen.getByTestId("ascii-canvas-renderer");
    expect(canvas).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Hermes provenance in source
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-016: Hermes ASCII-video provenance in canvas renderer", () => {
  it("cites the Hermes ascii-video repository as adapted source", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain(
      "https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video",
    );
  });

  it("cites Hermes architecture.md for multi-density grid system", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain("architecture.md");
    expect(src).toContain("Multi-Density");
  });

  it("cites Hermes composition.md for tonemap and feedback buffer", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain("composition.md");
    expect(src).toContain("Tone Map");
  });

  it("implements multi-density grid layers (Hermes multi-grid composition)", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    // Must have multiple grid configurations at different font sizes
    expect(src).toMatch(/fontSize:\s*10/);
    expect(src).toMatch(/fontSize:\s*14/);
    expect(src).toMatch(/fontSize:\s*20/);
  });

  it("implements glyph atlas pre-rasterization (Hermes GridLayer pattern)", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain("GlyphAtlas");
    expect(src).toContain("createGlyphAtlas");
    // Must pre-render characters to atlas
    expect(src).toContain("fillText");
  });

  it("implements val2char mapping with gamma tonemap (Hermes val2char_gamma + tonemap)", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain("val2charGamma");
    expect(src).toContain("gamma");
    // Must apply gamma correction
    expect(src).toContain("Math.pow");
  });

  it("implements value field generators (Hermes vf_plasma, vf_rings, vf_tunnel)", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain("vfPlasma");
    expect(src).toContain("vfRings");
    expect(src).toContain("vfTunnel");
  });

  it("implements temporal feedback buffer (Hermes FeedbackBuffer)", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain("FeedbackBuffer");
    expect(src).toContain("decay");
  });

  it("uses Hermes character palettes (PAL_BOX, PAL_BLOCKS, PAL_HERMES, PAL_DENSE)", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain("PAL_BOX");
    expect(src).toContain("PAL_BLOCKS");
    expect(src).toContain("PAL_HERMES");
    expect(src).toContain("PAL_DENSE");
  });

  it("uses screen blend mode for multi-grid composition (Hermes blend_canvas screen)", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain('"screen"');
    expect(src).toContain("globalCompositeOperation");
  });

  it("cites Hermes effects.md for value field generators", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain("effects.md");
  });

  it("cites Hermes design-patterns.md for layer hierarchy", () => {
    const src = readSource("AsciiCanvasRenderer.tsx");
    expect(src).toContain("design-patterns.md");
    expect(src).toMatch(/[Ll]ayer [Hh]ierarchy/);
  });
});

// ---------------------------------------------------------------------------
// HeroVisualSystem integration
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-016: Canvas renderer is integrated in HeroVisualSystem", () => {
  it("HeroVisualSystem includes the canvas renderer layer", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toContain("AsciiCanvasRenderer");
  });

  it("HeroVisualSystem documents the canvas renderer as VAL-VISUAL-016", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toContain("VAL-VISUAL-016");
  });

  it("HeroVisualSystem documents canvas-based Hermes adaptation provenance", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toContain("multi-density grid");
    expect(src).toContain("glyph atlas");
    expect(src).toContain("val2char");
    expect(src).toContain("feedback buffer");
  });
});
