/**
 * VAL-VISUAL-034: All text is white — no grey text.
 *
 * Every text element on the site renders as #ffffff white.
 * No text element uses #a0a0a0, #707070, or any grey value.
 * Text hierarchy is achieved through font size, weight, and opacity —
 * never grey color values. Grey values may only be used for non-text
 * elements (borders, dividers).
 */
import * as fs from "fs";
import * as path from "path";

const GLOBALS_CSS = fs.readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf-8"
);

describe("VAL-VISUAL-034: All text is white — no grey text", () => {
  describe("CSS custom properties", () => {
    it("--text-secondary resolves to #ffffff (was #a0a0a0)", () => {
      expect(GLOBALS_CSS).toMatch(/--text-secondary:\s*#ffffff/);
    });

    it("--color-foreground resolves to var(--text-primary) = white", () => {
      expect(GLOBALS_CSS).toMatch(/--color-foreground:\s*var\(--text-primary\)/);
    });

    it("body color uses var(--text-primary) for white text", () => {
      const bodyRule = GLOBALS_CSS.match(/body\s*\{[^}]*\}/);
      expect(bodyRule).toBeTruthy();
      expect(bodyRule![0]).toMatch(/color:\s*var\(--text-primary\)/);
    });
  });

  describe("No hardcoded grey text classes in components", () => {
    it("no text-[#a0a0a0] anywhere in src/components/", () => {
      const srcDir = path.join(process.cwd(), "src/components");
      const files = getAllTsxFiles(srcDir);
      const violations: string[] = [];
      for (const file of files) {
        // Skip test files
        if (file.includes("__tests__")) continue;
        const content = fs.readFileSync(file, "utf-8");
        if (content.includes("text-[#a0a0a0]")) {
          violations.push(path.relative(process.cwd(), file));
        }
      }
      expect(violations).toEqual([]);
    });
  });

  describe("No grey placeholder text patterns in components", () => {
    const greyPlaceholderPatterns = [
      "placeholder:text-muted",
      "placeholder:text-secondary",
      "placeholder:text-[#a0a0a0]",
      "placeholder:text-[#707070]",
    ];

    it.each(greyPlaceholderPatterns)(
      "no %s anywhere in src/components/",
      (pattern) => {
        const srcDir = path.join(process.cwd(), "src/components");
        const files = getAllTsxFiles(srcDir);
        const violations: string[] = [];
        for (const file of files) {
          if (file.includes("__tests__")) continue;
          const content = fs.readFileSync(file, "utf-8");
          if (content.includes(pattern)) {
            violations.push(path.relative(process.cwd(), file));
          }
        }
        expect(violations).toEqual([]);
      },
    );
  });

  describe("No text-muted used as text color on elements in components", () => {
    it("no className containing 'text-muted' (without placeholder: prefix) in src/components/", () => {
      const srcDir = path.join(process.cwd(), "src/components");
      const files = getAllTsxFiles(srcDir);
      const violations: string[] = [];
      // Match text-muted used as a direct text color class, not as
      // placeholder:text-muted (which is caught separately above) and not
      // inside CSS variable references like var(--text-muted).
      const textMutedRegex = /(?<!placeholder:)(?<!var\(--)text-muted(?!-foreground)/g;
      for (const file of files) {
        if (file.includes("__tests__")) continue;
        const content = fs.readFileSync(file, "utf-8");
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // Skip comments and import lines
          if (line.trim().startsWith("//") || line.trim().startsWith("*") || line.trim().startsWith("import")) continue;
          // Only check className props and class strings
          if (!line.includes("className") && !line.includes("class")) continue;
          if (textMutedRegex.test(line)) {
            violations.push(
              `${path.relative(process.cwd(), file)}:${i + 1}`,
            );
          }
          // Reset regex lastIndex for the next iteration
          textMutedRegex.lastIndex = 0;
        }
      }
      expect(violations).toEqual([]);
    });
  });
});

function getAllTsxFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllTsxFiles(full));
    } else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) {
      results.push(full);
    }
  }
  return results;
}
