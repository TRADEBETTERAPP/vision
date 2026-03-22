/**
 * Design system baseline tests — ensure the redesign token primitives
 * and dependency setup are correctly configured.
 */
import fs from "fs";
import path from "path";

describe("Design system baseline", () => {
  const globalsPath = path.resolve(__dirname, "../globals.css");
  const globalsCss = fs.readFileSync(globalsPath, "utf-8");

  describe("Token primitives in globals.css", () => {
    it("defines BETTER blue as the primary accent", () => {
      // Primary accent should be BETTER blue, not green
      expect(globalsCss).toContain("--accent-primary: #00aaff");
    });

    it("defines a green accent for live-status highlighting", () => {
      expect(globalsCss).toContain("--accent-green: #00ff88");
    });

    it("provides deeper background tonal layering", () => {
      // bg-primary should be darker than the original #0a0a0f
      expect(globalsCss).toContain("--bg-primary: #060609");
      expect(globalsCss).toContain("--bg-secondary: #0c0c14");
      expect(globalsCss).toContain("--bg-surface: #13131f");
      expect(globalsCss).toContain("--bg-elevated: #1a1a2a");
      expect(globalsCss).toContain("--bg-raised: #222236");
    });

    it("defines an accent border token", () => {
      expect(globalsCss).toContain("--border-accent:");
    });

    it("maps accent to BETTER blue in the Tailwind theme", () => {
      expect(globalsCss).toContain("--color-accent: var(--accent-primary)");
    });

    it("maps accent-green for tailwind usage", () => {
      expect(globalsCss).toContain("--color-accent-green: var(--accent-green)");
    });

    it("defines transition tokens", () => {
      expect(globalsCss).toContain("--transition-fast:");
      expect(globalsCss).toContain("--transition-base:");
      expect(globalsCss).toContain("--transition-slow:");
    });

    it("defines section spacing tokens", () => {
      expect(globalsCss).toContain("--space-section:");
    });

    it("uses BETTER blue in the glow effect", () => {
      // Glow should reference 0, 170, 255 (BETTER blue)
      expect(globalsCss).toContain("rgba(0, 170, 255");
    });

    it("uses BETTER blue in the radiant fallback gradient", () => {
      // The Radiant-influenced fallback replaces the old grid-pattern layer
      expect(globalsCss).toMatch(/hero-radiant-fallback[\s\S]*rgba\(0,\s*\d+,\s*\d+/);
    });
  });

  describe("Dependencies installed", () => {
    const pkgPath = path.resolve(__dirname, "../../../package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

    it("has class-variance-authority installed", () => {
      expect(pkg.dependencies["class-variance-authority"]).toBeDefined();
    });

    it("has tailwind-merge installed", () => {
      expect(pkg.dependencies["tailwind-merge"]).toBeDefined();
    });

    it("has motion installed", () => {
      expect(pkg.dependencies["motion"]).toBeDefined();
    });
  });

  describe("Utility module exists", () => {
    it("cn utility module exists at src/lib/utils.ts", () => {
      const utilsPath = path.resolve(__dirname, "../../lib/utils.ts");
      expect(fs.existsSync(utilsPath)).toBe(true);
    });
  });

  describe("UI primitives barrel export", () => {
    it("exports Button, Section, and Heading from ui/index", () => {
      const indexPath = path.resolve(
        __dirname,
        "../../components/ui/index.ts"
      );
      const indexContent = fs.readFileSync(indexPath, "utf-8");
      expect(indexContent).toContain("Button");
      expect(indexContent).toContain("Section");
      expect(indexContent).toContain("Heading");
    });
  });
});
