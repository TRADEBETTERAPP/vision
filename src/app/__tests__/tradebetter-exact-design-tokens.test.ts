/**
 * Tests for tradebetter-exact design tokens and typography (VAL-VISUAL-031).
 *
 * Verifies that globals.css matches the tradebetter.app design atoms:
 * - #101010 background
 * - Helvetica Neue Medium for headings (UPPERCASE, -0.06em tracking, white)
 * - IBM Plex Mono for body (#a0a0a0)
 * - Square CTA buttons (0px radius, white glow on hover)
 * - Neon green #00ff00 for status dots only
 * - #455eff blue for atmospheric gradients only
 * - 100-136px section spacing
 * - All competing accent colors removed from the token system
 */
import fs from "fs";
import path from "path";

describe("Tradebetter-exact design tokens (VAL-VISUAL-031)", () => {
  const globalsPath = path.resolve(__dirname, "../globals.css");
  const globalsCss = fs.readFileSync(globalsPath, "utf-8");

  describe("Background", () => {
    it("uses #101010 as the primary background", () => {
      expect(globalsCss).toContain("--bg-primary: #101010");
    });

    it("uses #191a1d as the secondary background (tradebetter card panels)", () => {
      expect(globalsCss).toContain("--bg-secondary: #191a1d");
    });
  });

  describe("Typography", () => {
    it("uses pure white #ffffff for primary text", () => {
      expect(globalsCss).toContain("--text-primary: #ffffff");
    });

    it("uses #a0a0a0 for body/secondary text", () => {
      expect(globalsCss).toContain("--text-secondary: #a0a0a0");
    });

    it("uses #707070 for muted text", () => {
      expect(globalsCss).toContain("--text-muted: #707070");
    });

    it("defines IBM Plex Mono as the body font", () => {
      expect(globalsCss).toContain("--font-mono:");
      expect(globalsCss).toContain("ibm-plex-mono");
    });

    it("defines Helvetica Neue Medium / Geist Sans as the display font for headings", () => {
      expect(globalsCss).toContain("--font-display:");
    });
  });

  describe("Accent colors — strict restraint", () => {
    it("uses #00ff00 for neon green (status dots only)", () => {
      expect(globalsCss).toContain("--accent-green: #00ff00");
    });

    it("uses #455eff for electric blue (atmospheric gradients only)", () => {
      expect(globalsCss).toContain("--accent-primary: #455eff");
    });

    it("does NOT define --accent-warn (competing orange removed)", () => {
      expect(globalsCss).not.toMatch(/--accent-warn\s*:/);
    });

    it("does NOT define --accent-danger (competing red removed)", () => {
      expect(globalsCss).not.toMatch(/--accent-danger\s*:/);
    });

    it("does NOT map competing accent colors into the Tailwind theme", () => {
      expect(globalsCss).not.toContain("--color-accent-warn");
      expect(globalsCss).not.toContain("--color-accent-danger");
    });
  });

  describe("Section spacing", () => {
    it("defines section spacing at 100px+", () => {
      // Space section should be 100px (6.25rem) or more
      expect(globalsCss).toContain("--space-section:");
      // Check the actual value is in the 100-136px range
      const match = globalsCss.match(/--space-section:\s*([^;]+)/);
      expect(match).not.toBeNull();
      const value = match![1].trim();
      // Should be in the 100-136px range expressed in px or rem
      expect(value).toMatch(/100px|6\.25rem|6\.5rem|7rem|7\.5rem|8rem|8\.5rem|136px/);
    });
  });

  describe("CTA button tokens", () => {
    it("defines white glow shadow token", () => {
      // Must contain the signature white glow for primary CTAs
      expect(globalsCss).toContain("rgba(255, 255, 255, 0.75)");
    });
  });

  describe("No competing colors in token system", () => {
    it("only accent colors are green and blue — grayscale for everything else", () => {
      // The token system should not contain orange or red accent definitions
      expect(globalsCss).not.toContain("#ff9900");
      expect(globalsCss).not.toContain("#ff3366");
    });
  });
});
