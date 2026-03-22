/**
 * VAL-VISUAL-015: Moving background ships a vendored real Radiant asset.
 *
 * The moving background must use a real vendored Radiant-derived asset
 * rather than a custom approximation, placeholder, or comment-only reference.
 *
 * Vendored asset: src/components/visual/radiant-fluid-amber.glsl.ts
 * Original source: https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html
 * License: MIT (Copyright (c) 2025 Paul Bakaus)
 * Site reference: https://radiant-shaders.com/shader/fluid-amber
 *
 * The vendored shader preserves Radiant Fluid Amber's canonical GLSL
 * implementation — simplex noise (snoise), permutation-based hashing
 * (mod289/permute), fBM with additive octave offsets, and the signature
 * triple-pass domain-warp composition (q → r → f). The palette is remapped
 * to BETTER blue and tunable parameters are exposed for integration.
 */
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { HeroShaderCanvas } from "../HeroShaderCanvas";
import { VisualEffectsProvider } from "../VisualEffectsProvider";
import {
  RADIANT_FLUID_AMBER_VERTEX,
  RADIANT_FLUID_AMBER_FRAGMENT,
} from "../radiant-fluid-amber.glsl";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readSource(relPath: string): string {
  return fs.readFileSync(
    path.resolve(__dirname, "..", relPath),
    "utf-8",
  );
}

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

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);
});

// ---------------------------------------------------------------------------
// Vendored asset existence and structure
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-015: Vendored Radiant asset file exists", () => {
  it("radiant-fluid-amber.glsl.ts exists as a vendored shader asset", () => {
    const assetPath = path.resolve(
      __dirname,
      "..",
      "radiant-fluid-amber.glsl.ts",
    );
    expect(fs.existsSync(assetPath)).toBe(true);
  });

  it("vendored asset cites the original Radiant GitHub source", () => {
    const src = readSource("radiant-fluid-amber.glsl.ts");
    expect(src).toContain(
      "https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html",
    );
  });

  it("vendored asset cites the Radiant site page", () => {
    const src = readSource("radiant-fluid-amber.glsl.ts");
    expect(src).toContain("https://radiant-shaders.com/shader/fluid-amber");
  });

  it("vendored asset preserves the MIT license attribution", () => {
    const src = readSource("radiant-fluid-amber.glsl.ts");
    expect(src).toMatch(/MIT/i);
    expect(src).toMatch(/Paul Bakaus/i);
  });

  it("vendored asset exports a FRAGMENT_SHADER string", () => {
    expect(typeof RADIANT_FLUID_AMBER_FRAGMENT).toBe("string");
    expect(RADIANT_FLUID_AMBER_FRAGMENT.length).toBeGreaterThan(200);
  });

  it("vendored asset exports a VERTEX_SHADER string", () => {
    expect(typeof RADIANT_FLUID_AMBER_VERTEX).toBe("string");
    expect(RADIANT_FLUID_AMBER_VERTEX).toContain("a_pos");
  });
});

// ---------------------------------------------------------------------------
// Radiant simplex noise core — NOT hash-based value noise
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-015: Vendored shader uses real Radiant simplex noise", () => {
  it("fragment shader contains snoise (simplex noise) function", () => {
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toContain("snoise");
  });

  it("fragment shader contains mod289 permutation function (Radiant convention)", () => {
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toContain("mod289");
  });

  it("fragment shader contains permute function (Radiant convention)", () => {
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toContain("permute");
  });

  it("fragment shader does NOT use hash-based fract(sin(dot(...))) as its noise function", () => {
    // The old custom shader defined: float hash(vec2 p) { return fract(sin(dot(p, ...))) }
    // Real Radiant uses mod289+permute simplex noise instead.
    // Check that no hash() function definition exists in the GLSL:
    expect(RADIANT_FLUID_AMBER_FRAGMENT).not.toMatch(/float\s+hash\s*\(\s*vec2/);
    // The noise foundation should be snoise, not hash-based noise
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toContain("snoise");
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toContain("mod289");
  });
});

// ---------------------------------------------------------------------------
// Domain-warp composition pattern (q → r → f)
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-015: Vendored shader preserves Radiant domain-warp pattern", () => {
  it("fragment shader uses the canonical q-r-f triple-pass domain warp", () => {
    // Radiant's q = vec2(fbm(p + ...), fbm(p + ...))
    // Then r = vec2(fbm(p + 4.0 * q + ...), fbm(p + 4.0 * q + ...))
    // Then f = fbm(p + 3.5 * r)
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toMatch(/vec2\s+q\s*=/);
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toMatch(/vec2\s+r\s*=/);
    // Final composition
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toMatch(/fbm\s*\(\s*p\s*\+/);
  });

  it("fragment shader uses fbm function with snoise-based octaves", () => {
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toContain("fbm");
    // fBM should use snoise, not hash-based noise
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toMatch(/snoise\s*\(/);
  });
});

// ---------------------------------------------------------------------------
// BETTER blue palette (remapped from Radiant amber)
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-015: Vendored shader is tuned for tradebetter electric-blue", () => {
  it("fragment shader palette uses tradebetter electric-blue tones instead of amber", () => {
    // The actual mix() calls in the GLSL code use electric-blue tones, not amber.
    // (Original amber values may appear in comments explaining the adaptation.)
    // Verify: the initial base color is near-black with blue hint
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toMatch(/vec3\(0\.02,\s*0\.02,\s*0\.08\)/);
    // Verify: tradebetter electric-blue peak is present (#455eff → ~0.27, 0.37, 1.0)
    expect(RADIANT_FLUID_AMBER_FRAGMENT).toMatch(/vec3\(0\.27,\s*0\.37,\s*1\.0\)/);
  });

  it("vendored asset documents the tradebetter electric-blue adaptation", () => {
    const src = readSource("radiant-fluid-amber.glsl.ts");
    expect(src).toMatch(/tradebetter electric-blue/i);
  });
});

// ---------------------------------------------------------------------------
// HeroShaderCanvas imports and uses the vendored asset
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-015: HeroShaderCanvas uses vendored Radiant asset", () => {
  it("HeroShaderCanvas imports from the vendored Radiant shader file", () => {
    const src = readSource("HeroShaderCanvas.tsx");
    expect(src).toMatch(/from\s+["']\.\/radiant-fluid-amber\.glsl["']/);
  });

  it("HeroShaderCanvas documents the vendored asset path", () => {
    const src = readSource("HeroShaderCanvas.tsx");
    expect(src).toContain("radiant-fluid-amber.glsl");
  });

  it("HeroShaderCanvas documents the vendored source URL", () => {
    const src = readSource("HeroShaderCanvas.tsx");
    expect(src).toContain(
      "https://github.com/pbakaus/radiant/blob/main/static/fluid-amber.html",
    );
  });

  it("renders canvas when WebGL is available", () => {
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

  it("still falls back gracefully when WebGL is unavailable", () => {
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

    render(
      <VisualEffectsProvider>
        <HeroShaderCanvas />
      </VisualEffectsProvider>,
    );
    expect(screen.queryByTestId("hero-shader-canvas")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// HeroVisualSystem documents vendored asset
// ---------------------------------------------------------------------------

describe("VAL-VISUAL-015: HeroVisualSystem documents vendored Radiant asset", () => {
  it("HeroVisualSystem docblock mentions vendored Radiant asset", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toMatch(/[Vv]endored.*[Rr]adiant/);
  });

  it("HeroVisualSystem cites the shipped asset path", () => {
    const src = readSource("HeroVisualSystem.tsx");
    expect(src).toContain("radiant-fluid-amber.glsl");
  });
});
