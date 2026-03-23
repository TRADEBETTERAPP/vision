/**
 * Film grain GIF texture verification.
 *
 * Feature: redesign-film-grain-vendored-gif-texture
 *
 * The film grain overlay must use a vendored animated GIF texture
 * (background-image with a .gif asset), NOT SVG feTurbulence filters.
 * This matches tradebetter's exact technique of tiling a noise GIF
 * across the viewport at 5% opacity with mix-blend-mode:lighten.
 *
 * Expected behavior:
 * - FilmGrainOverlay uses background-image with a .gif asset
 * - No SVG elements or feTurbulence filters in the film grain overlay
 * - The .gif asset exists in public/grain.gif
 * - Film grain is tiled (background-repeat: repeat) across the viewport
 */
import React from "react";
import fs from "fs";
import path from "path";
import { render } from "@testing-library/react";
import { FilmGrainOverlay } from "../FilmGrainOverlay";

// ---------------------------------------------------------------------------
// GIF-based film grain (not SVG filters)
// ---------------------------------------------------------------------------

describe("Film grain uses vendored GIF texture, not SVG filters", () => {
  it("FilmGrainOverlay source does NOT contain SVG or feTurbulence", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../FilmGrainOverlay.tsx"),
      "utf-8"
    );
    expect(src).not.toContain("<svg");
    expect(src).not.toContain("feTurbulence");
    expect(src).not.toContain("<filter");
    expect(src).not.toContain("feColorMatrix");
  });

  it("FilmGrainOverlay source references a .gif asset via background-image", () => {
    const src = fs.readFileSync(
      path.resolve(__dirname, "../FilmGrainOverlay.tsx"),
      "utf-8"
    );
    // Must reference a .gif in background-image or backgroundImage
    expect(src).toMatch(/background-?[Ii]mage.*\.gif/);
  });

  it("rendered film grain overlay does NOT contain SVG elements", () => {
    render(<FilmGrainOverlay />);
    const grain = document.querySelector('[data-testid="film-grain-overlay"]');
    expect(grain).toBeInTheDocument();
    // No SVG children
    const svgs = grain!.querySelectorAll("svg");
    expect(svgs.length).toBe(0);
    // No feTurbulence elements
    const turbulence = grain!.querySelectorAll("feTurbulence");
    expect(turbulence.length).toBe(0);
  });

  it("rendered film grain overlay uses a .gif background-image", () => {
    render(<FilmGrainOverlay />);
    const grain = document.querySelector(
      '[data-testid="film-grain-overlay"]'
    ) as HTMLElement;
    expect(grain).not.toBeNull();
    // Check inline style for background-image with .gif
    const bgImage = grain.style.backgroundImage;
    expect(bgImage).toMatch(/\.gif/);
  });

  it("grain.gif asset exists in public directory", () => {
    const gifPath = path.resolve(__dirname, "../../../../public/grain.gif");
    expect(fs.existsSync(gifPath)).toBe(true);
  });

  it("grain.gif is a valid GIF89a file", () => {
    const gifPath = path.resolve(__dirname, "../../../../public/grain.gif");
    const buffer = fs.readFileSync(gifPath);
    // GIF89a magic bytes
    const header = buffer.slice(0, 6).toString("ascii");
    expect(header).toBe("GIF89a");
    // Must be reasonably sized (not empty or corrupt)
    expect(buffer.length).toBeGreaterThan(100);
  });

  it("film grain overlay tiles the GIF (background-repeat: repeat)", () => {
    render(<FilmGrainOverlay />);
    const grain = document.querySelector(
      '[data-testid="film-grain-overlay"]'
    ) as HTMLElement;
    expect(grain).not.toBeNull();
    expect(grain.style.backgroundRepeat).toBe("repeat");
  });
});
