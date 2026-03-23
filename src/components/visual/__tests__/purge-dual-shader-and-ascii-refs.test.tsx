/**
 * Tests for the purge of dual-shader mounts and stale ASCII references.
 *
 * Feature: redesign-purge-remaining-dual-shader-and-ascii-refs
 *
 * Expected behavior:
 * 1. Exactly ONE HeroShaderCanvas mount exists (in SiteAtmosphere only)
 * 2. No HeroShaderCanvas mount in HeroVisualSystem
 * 3. All stale ASCII-related comments, variable names, and references
 *    are removed from production source files
 */
import fs from "fs";
import path from "path";

/** Helper: read a source file relative to the visual components dir */
function readVisualSource(filename: string): string {
  return fs.readFileSync(
    path.resolve(__dirname, "..", filename),
    "utf-8"
  );
}

// ---------------------------------------------------------------------------
// Single HeroShaderCanvas mount (SiteAtmosphere only)
// ---------------------------------------------------------------------------

describe("Exactly ONE HeroShaderCanvas mount across the app", () => {
  it("SiteAtmosphere imports and renders HeroShaderCanvas", () => {
    const src = readVisualSource("SiteAtmosphere.tsx");
    expect(src).toMatch(/import\(.*HeroShaderCanvas/);
    expect(src).toContain("<HeroShaderCanvas");
  });

  it("HeroVisualSystem does NOT import HeroShaderCanvas", () => {
    const src = readVisualSource("HeroVisualSystem.tsx");
    expect(src).not.toMatch(/import.*HeroShaderCanvas/);
  });

  it("HeroVisualSystem does NOT render <HeroShaderCanvas", () => {
    const src = readVisualSource("HeroVisualSystem.tsx");
    expect(src).not.toContain("<HeroShaderCanvas");
  });
});

// ---------------------------------------------------------------------------
// All stale ASCII references removed from production source files
// ---------------------------------------------------------------------------

describe("No stale ASCII references in production source files", () => {
  const productionFiles = [
    "HeroVisualSystem.tsx",
    "SiteAtmosphere.tsx",
    "HeroShaderCanvas.tsx",
    "VisualEffectsProvider.tsx",
    "FilmGrainOverlay.tsx",
    "index.ts",
  ];

  for (const filename of productionFiles) {
    it(`${filename} contains no ASCII-related references`, () => {
      const filePath = path.resolve(__dirname, "..", filename);
      if (!fs.existsSync(filePath)) return; // skip if file doesn't exist
      const src = fs.readFileSync(filePath, "utf-8");
      // No references to ASCII in any form — comments, variable names, strings
      expect(src).not.toMatch(/\bASCII\b/i);
      expect(src).not.toMatch(/\bAscii\b/);
      expect(src).not.toContain("AsciiCanvasRenderer");
      expect(src).not.toContain("AsciiBackground");
      expect(src).not.toContain("ascii-video");
      expect(src).not.toContain("ascii-canvas");
      expect(src).not.toContain("ascii-background");
    });
  }

  it("globals.css contains no ASCII-related class names or references", () => {
    const cssSrc = fs.readFileSync(
      path.resolve(__dirname, "../../../app/globals.css"),
      "utf-8"
    );
    expect(cssSrc).not.toMatch(/\bascii\b/i);
    expect(cssSrc).not.toContain(".ascii-canvas-renderer");
    expect(cssSrc).not.toContain(".ascii-background");
    expect(cssSrc).not.toContain("site-atmosphere-ascii");
  });

  it("HeroVisualSkeleton.tsx contains no ASCII references", () => {
    const skeletonPath = path.resolve(
      __dirname,
      "../../skeletons/HeroVisualSkeleton.tsx"
    );
    if (!fs.existsSync(skeletonPath)) return;
    const src = fs.readFileSync(skeletonPath, "utf-8");
    expect(src).not.toMatch(/\bASCII\b/i);
    expect(src).not.toMatch(/\bAscii\b/);
  });
});
