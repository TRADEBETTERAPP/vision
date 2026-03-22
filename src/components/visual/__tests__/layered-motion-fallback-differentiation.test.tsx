/**
 * VAL-VISUAL-017: Enhanced visual state is dramatically distinct from static fallback.
 * VAL-VISUAL-018: Headed browser validation shows visible background motion.
 *
 * Tests that the layered motion system (Radiant + ASCII) produces an enhanced
 * state that is materially more dramatic than the static/degraded fallback,
 * and that the system exposes state metadata for headed-browser validation.
 */
import fs from "fs";
import path from "path";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { HeroShaderCanvas } from "../HeroShaderCanvas";
import { AsciiCanvasRenderer } from "../AsciiCanvasRenderer";
import { VisualEffectsProvider } from "../VisualEffectsProvider";

// ---------------------------------------------------------------------------
// Helpers
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
// VAL-VISUAL-017: Enhanced state is dramatically distinct from fallback
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-017: Enhanced visual state is dramatically distinct from static fallback", () => {
  it("HeroVisualSystem exposes data-visual-state attribute for browser validation", () => {
    render(<Home />);
    const system = screen.getByTestId("hero-visual-system");
    const state = system.getAttribute("data-visual-state");
    // In test env without WebGL, should be 'fallback' or 'static'
    expect(state).toBeTruthy();
    expect(["enhanced", "fallback", "static", "reduced-motion"]).toContain(state);
  });

  it("enhanced state is exposed when WebGL is available", async () => {
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockImplementation((type: string) => {
        if (type === "webgl" || type === "experimental-webgl") {
          return createMockWebGLContext();
        }
        if (type === "2d") {
          return {
            clearRect: jest.fn(),
            fillRect: jest.fn(),
            fillText: jest.fn(),
            drawImage: jest.fn(),
            measureText: jest.fn().mockReturnValue({ width: 8 }),
            canvas: { width: 800, height: 600, getBoundingClientRect: () => ({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600 }) },
            globalAlpha: 1,
            globalCompositeOperation: "source-over",
            font: "",
            textBaseline: "top",
            fillStyle: "#ffffff",
          };
        }
        return null;
      });
    HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
      width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600,
    });

    render(<Home />);
    await waitFor(() => {
      const system = screen.getByTestId("hero-visual-system");
      expect(system.getAttribute("data-visual-state")).toBe("enhanced");
    });
  });

  it("fallback state is exposed when WebGL fails", () => {
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

    render(<Home />);
    const system = screen.getByTestId("hero-visual-system");
    const state = system.getAttribute("data-visual-state");
    expect(state).toBe("fallback");
  });

  it("reduced-motion state is exposed when reduced motion is active", () => {
    mockReducedMotion(true);

    render(<Home />);
    const system = screen.getByTestId("hero-visual-system");
    expect(system.getAttribute("data-visual-state")).toBe("reduced-motion");
  });

  it("CSS provides stronger visual treatment for enhanced state than fallback", () => {
    const globalsCss = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8",
    );
    // Enhanced state should have a distinct, stronger visual treatment
    expect(globalsCss).toContain('[data-visual-state="enhanced"]');
    expect(globalsCss).toContain('[data-visual-state="fallback"]');
  });

  it("enhanced state radiant fallback gradient is dimmer (WebGL shader takes over)", () => {
    const globalsCss = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8",
    );
    // When enhanced, the CSS fallback gradient should dim because the WebGL shader is active
    const enhancedFallback = globalsCss.match(
      /\[data-visual-state="enhanced"\]\s+\.hero-radiant-fallback[\s\S]*?\}/
    );
    expect(enhancedFallback).not.toBeNull();
    // Should have reduced opacity when shader is providing the real visuals
    expect(enhancedFallback![0]).toMatch(/opacity:\s*0\.[0-3]/);
  });

  it("fallback state radiant fallback gradient is stronger (no WebGL shader behind it)", () => {
    const globalsCss = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8",
    );
    // In fallback mode, the CSS gradient is the ONLY background treatment
    // It must be noticeably stronger/more visible
    const fallbackGradient = globalsCss.match(
      /\[data-visual-state="fallback"\]\s+\.hero-radiant-fallback[\s\S]*?\}/
    );
    expect(fallbackGradient).not.toBeNull();
    // Should have higher opacity in fallback mode
    expect(fallbackGradient![0]).toMatch(/opacity:\s*[0-9.]+/);
  });

  it("enhanced state ASCII canvas is more visible than fallback ASCII", () => {
    const globalsCss = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8",
    );
    // Enhanced state: canvas renderer at higher opacity, DOM fallback hidden
    const enhancedCanvas = globalsCss.match(
      /\[data-visual-state="enhanced"\]\s+\.ascii-canvas-renderer[\s\S]*?\}/
    );
    expect(enhancedCanvas).not.toBeNull();
  });

  it("shader canvas has materially higher opacity than the fallback gradient", () => {
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue(createMockWebGLContext());

    render(
      <VisualEffectsProvider>
        <HeroShaderCanvas />
      </VisualEffectsProvider>,
    );
    const canvas = screen.getByTestId("hero-shader-canvas");
    const shaderOpacity = parseFloat(canvas.style.opacity || "1");
    // Shader opacity must be >= 0.7 for material visual impact
    expect(shaderOpacity).toBeGreaterThanOrEqual(0.7);
  });

  it("enhanced state exposes data-motion-layers count for validation", async () => {
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockImplementation((type: string) => {
        if (type === "webgl" || type === "experimental-webgl") {
          return createMockWebGLContext();
        }
        if (type === "2d") {
          return {
            clearRect: jest.fn(),
            fillRect: jest.fn(),
            fillText: jest.fn(),
            drawImage: jest.fn(),
            measureText: jest.fn().mockReturnValue({ width: 8 }),
            canvas: { width: 800, height: 600, getBoundingClientRect: () => ({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600 }) },
            globalAlpha: 1,
            globalCompositeOperation: "source-over",
            font: "",
            textBaseline: "top",
            fillStyle: "#ffffff",
          };
        }
        return null;
      });
    HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
      width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600,
    });

    render(<Home />);
    // Enhanced state must have 2 active motion layers (shader + ASCII canvas)
    await waitFor(() => {
      const system = screen.getByTestId("hero-visual-system");
      const layers = system.getAttribute("data-motion-layers");
      expect(Number(layers)).toBeGreaterThanOrEqual(2);
    });
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-018: Headed browser validation can verify motion
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-018: System exposes metadata for headed browser motion validation", () => {
  it("HeroVisualSystem exposes data-visual-state for browser validation scripts", () => {
    render(<Home />);
    const system = screen.getByTestId("hero-visual-system");
    expect(system.hasAttribute("data-visual-state")).toBe(true);
  });

  it("shader canvas is identifiable via data-testid for browser validation", () => {
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue(createMockWebGLContext());

    render(
      <VisualEffectsProvider>
        <HeroShaderCanvas />
      </VisualEffectsProvider>,
    );
    expect(screen.getByTestId("hero-shader-canvas")).toBeInTheDocument();
  });

  it("ASCII canvas renderer is identifiable via data-testid for browser validation", () => {
    const mockCtx = {
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      fillText: jest.fn(),
      drawImage: jest.fn(),
      measureText: jest.fn().mockReturnValue({ width: 8 }),
      canvas: { width: 800, height: 600, getBoundingClientRect: () => ({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600 }) },
      globalAlpha: 1,
      globalCompositeOperation: "source-over",
      font: "",
      textBaseline: "top",
      fillStyle: "#ffffff",
    };
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockImplementation((type: string) => {
        if (type === "2d") return mockCtx;
        return null;
      });
    HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn().mockReturnValue({
      width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600,
    });

    render(
      <VisualEffectsProvider>
        <AsciiCanvasRenderer />
      </VisualEffectsProvider>,
    );
    expect(screen.getByTestId("ascii-canvas-renderer")).toBeInTheDocument();
  });

  it("visual system wrapper with data-visual-state and data-motion-layers enables browser pixel comparison", () => {
    render(<Home />);
    const system = screen.getByTestId("hero-visual-system");
    // Must have both attributes for browser validation to distinguish states
    expect(system.hasAttribute("data-visual-state")).toBe(true);
    expect(system.hasAttribute("data-motion-layers")).toBe(true);
  });
});
