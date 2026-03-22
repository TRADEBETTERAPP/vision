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
    it("defines tradebetter electric-blue as the primary accent", () => {
      // Primary accent should be tradebetter electric-blue (#455eff family)
      expect(globalsCss).toContain("--accent-primary: #455eff");
    });

    it("defines a green accent for live-status highlighting", () => {
      expect(globalsCss).toContain("--accent-green: #00ff88");
    });

    it("provides tradebetter-led near-black background tonal layering", () => {
      // bg-primary should be near-black in the #101010 family (tradebetter parity)
      expect(globalsCss).toContain("--bg-primary: #0a0a0c");
      expect(globalsCss).toContain("--bg-secondary: #111114");
      expect(globalsCss).toContain("--bg-surface: #18181e");
      expect(globalsCss).toContain("--bg-elevated: #1f1f28");
      expect(globalsCss).toContain("--bg-raised: #272732");
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

    it("uses tradebetter electric-blue in the glow effect", () => {
      // Glow should reference 69, 94, 255 (tradebetter electric-blue)
      expect(globalsCss).toContain("rgba(69, 94, 255");
    });

    it("uses tradebetter electric-blue in the radiant fallback gradient", () => {
      // The Radiant-influenced fallback uses tradebetter electric-blue family
      expect(globalsCss).toMatch(/hero-radiant-fallback[\s\S]*rgba\(69,\s*\d+,\s*\d+/);
    });

    it("defines IBM Plex Mono for terminal typography", () => {
      expect(globalsCss).toContain("--font-ibm-plex-mono");
    });

    it("defines a site atmosphere gradient for full-shell atmosphere", () => {
      expect(globalsCss).toContain("site-atmosphere-gradient");
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
