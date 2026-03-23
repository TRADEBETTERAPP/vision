/**
 * Static fallback and visual resilience tests.
 *
 * These tests verify:
 * 1. Fallback is truly static when WebGL/Radiant fails
 * 2. HeroVisualSystem metadata accurately reflects motion layer state
 * 3. VAL-VISUAL-028: All ASCII layers have been permanently removed
 */
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { SiteAtmosphere } from "../SiteAtmosphere";

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

function create2DContext() {
  return {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    fillText: jest.fn(),
    drawImage: jest.fn(),
    measureText: jest.fn().mockReturnValue({ width: 8 }),
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
  HTMLCanvasElement.prototype.getBoundingClientRect = jest
    .fn()
    .mockReturnValue({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
    });
  mockReducedMotion(false);
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-028: No ASCII layers exist
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-028: No ASCII layers in the visual system", () => {
  it("no ascii-canvas-renderer elements are rendered", () => {
    render(<Home />);
    expect(screen.queryByTestId("ascii-canvas-renderer")).not.toBeInTheDocument();
  });

  it("no ascii-background elements are rendered", () => {
    render(<Home />);
    expect(screen.queryByTestId("ascii-background")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Motion metadata accurately reflects rendered state
// ---------------------------------------------------------------------------

describe("HeroVisualSystem motion metadata matches actual rendered state", () => {
  it("fallback state reports 0 motion layers (via SiteAtmosphere)", () => {
    // VAL-VISUAL-029: HeroVisualSystem consumes VisualEffectsProvider from
    // the parent SiteAtmosphere. Without it, there's no provider context.
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

    render(<SiteAtmosphere><Home /></SiteAtmosphere>);
    const system = screen.getByTestId("hero-visual-system");
    expect(system.getAttribute("data-visual-state")).toBe("fallback");
    expect(system.getAttribute("data-motion-layers")).toBe("0");
  });

  it("enhanced state with WebGL reports 1 motion layer (shader only, via SiteAtmosphere)", async () => {
    // VAL-VISUAL-029: Single shader in SiteAtmosphere — must wrap Home
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockImplementation((type: string) => {
        if (type === "webgl" || type === "experimental-webgl") {
          return createMockWebGLContext();
        }
        if (type === "2d") return create2DContext();
        return null;
      });

    render(<SiteAtmosphere><Home /></SiteAtmosphere>);
    await waitFor(() => {
      const system = screen.getByTestId("hero-visual-system");
      expect(system.getAttribute("data-visual-state")).toBe("enhanced");
      expect(Number(system.getAttribute("data-motion-layers"))).toBe(1);
    });
  });

  it("reduced-motion state reports 0 motion layers (via SiteAtmosphere)", () => {
    // VAL-VISUAL-029: HeroVisualSystem consumes VisualEffectsProvider from SiteAtmosphere
    mockReducedMotion(true);

    render(<SiteAtmosphere><Home /></SiteAtmosphere>);
    const system = screen.getByTestId("hero-visual-system");
    expect(system.getAttribute("data-visual-state")).toBe("reduced-motion");
    expect(system.getAttribute("data-motion-layers")).toBe("0");
  });
});
