/**
 * Tests that ALL card surfaces across the site use the LiquidMetalCard
 * cursor-tracking treatment — no remaining glass-card CSS-only cards.
 *
 * VAL-VISUAL-030: Cards across the graph workspace and content surfaces use
 * glass-morphism with a liquid metal interactive finish (cursor-tracking
 * metallic sheen). Every card/module should use the same glass-card +
 * liquid-metal treatment.
 */
import fs from "fs";
import path from "path";

/**
 * Recursively find all .tsx files in a directory
 */
function findTsxFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "__tests__" && entry.name !== "node_modules") {
      results.push(...findTsxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      results.push(fullPath);
    }
  }
  return results;
}

describe("LiquidMetalCard everywhere — VAL-VISUAL-030", () => {
  it("no component files reference the glass-card CSS class", () => {
    const componentsDir = path.resolve(__dirname, "..");
    const tsxFiles = findTsxFiles(componentsDir);

    const filesUsingGlassCard: string[] = [];
    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, "utf-8");
      // Match className="...glass-card..." patterns in JSX
      if (/glass-card/.test(content)) {
        filesUsingGlassCard.push(path.relative(componentsDir, file));
      }
    }

    expect(filesUsingGlassCard).toEqual([]);
  });

  it("globals.css does not define the .glass-card utility class as a CSS rule", () => {
    const globalsPath = path.resolve(__dirname, "../../app/globals.css");
    const content = fs.readFileSync(globalsPath, "utf-8");
    // Ensure no .glass-card CSS rule exists (not just a comment mentioning it)
    // Match ".glass-card" followed by optional whitespace and an opening brace
    expect(content).not.toMatch(/\.glass-card\s*\{/);
    // Also verify .glass-card:hover is not defined
    expect(content).not.toMatch(/\.glass-card:hover\s*\{/);
  });

  it("all card-like surfaces import and use LiquidMetalCard for cursor tracking", () => {
    // Key component files that previously used glass-card must now import LiquidMetalCard
    const expectedFiles = [
      "tokenomics/ReferralIncentives.tsx",
      "tokenomics/NonLinearAllocation.tsx",
      "tokenomics/TokenUtilitySurface.tsx",
      "tokenomics/FeeStackValueFlow.tsx",
      "tokenomics/ValuationCorridors.tsx",
      "tokenomics/ScarcityExplainer.tsx",
      "tokenomics/ScenarioSwitcher.tsx",
      "tokenomics/FirstVaultPolicy.tsx",
      "tokenomics/ProductFamilyRevenueModel.tsx",
      "tokenomics/VaultCapacityModel.tsx",
      "tokenomics/TierLadder.tsx",
      "tokenomics/ModeledWhaleLadder.tsx",
      "tokenomics/SupplyAllocation.tsx",
      "roadmap/ExecutionPlanPanel.tsx",
      "roadmap/RoadmapNodeDetail.tsx",
      "roadmap/RoadmapAtlas.tsx",
    ];

    const componentsDir = path.resolve(__dirname, "..");
    const missingImports: string[] = [];
    for (const relPath of expectedFiles) {
      const fullPath = path.join(componentsDir, relPath);
      if (!fs.existsSync(fullPath)) continue;
      const content = fs.readFileSync(fullPath, "utf-8");
      if (!content.includes("LiquidMetalCard")) {
        missingImports.push(relPath);
      }
    }

    expect(missingImports).toEqual([]);
  });
});
