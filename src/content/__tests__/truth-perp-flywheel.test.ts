import { GRAPH_NODES } from "../graph-nodes";
import { TRUTH_PERP_FLYWHEEL_CONTENT } from "../truth-perp-flywheel";

describe("TRUTH-PERP & Flywheel content model", () => {
  it("registers the TRUTH-PERP graph node with the required related edges", () => {
    const node = GRAPH_NODES.find(
      (entry) => entry.id === "truth-perp-flywheel"
    );

    expect(node).toBeDefined();
    expect(node?.label).toBe("TRUTH-PERP & Flywheel");
    expect(node?.related).toEqual(
      expect.arrayContaining(["tokenomics", "hft-edge"])
    );
    expect(node?.dominantStatus).toBe("planned");
  });

  it("captures the exact HIP-3 moat and synthetic index framing", () => {
    const serialized = JSON.stringify(TRUTH_PERP_FLYWHEEL_CONTENT);

    expect(serialized).toContain("HIP-3");
    expect(serialized).toContain("Hyperliquid");
    expect(serialized).toContain("500k HYPE");
    expect(serialized).toContain("$11M");
    expect(serialized).toContain("Nasdaq of Truth");
    expect(serialized).toContain("synthetic index");
  });

  it("captures the exact vBETTER arbitrage and buy-and-burn flywheel mechanics", () => {
    const serialized = JSON.stringify(TRUTH_PERP_FLYWHEEL_CONTENT);

    expect(serialized).toContain("vBETTER");
    expect(serialized).toContain("enzyme.finance");
    expect(serialized).toContain("ETF premium capture");
    expect(serialized).toContain("30%");
    expect(serialized).toContain("buy & burn");
  });

  it("captures the three-phase roadmap timing and keeps attribution on every claim block", () => {
    const serialized = JSON.stringify(TRUTH_PERP_FLYWHEEL_CONTENT);

    expect(serialized).toContain("Phase 1");
    expect(serialized).toContain("Q1 2026");
    expect(serialized).toContain("Phase 2");
    expect(serialized).toContain("Q2 2026");
    expect(serialized).toContain("Phase 3");
    expect(serialized).toContain("Q4 2026");
    expect(TRUTH_PERP_FLYWHEEL_CONTENT.source.label).toContain(
      "@tradebetterapp"
    );

    for (const section of TRUTH_PERP_FLYWHEEL_CONTENT.sections) {
      expect(section.source.label).toContain("@tradebetterapp");
    }

    for (const phase of TRUTH_PERP_FLYWHEEL_CONTENT.phases) {
      expect(phase.source.label).toContain("@tradebetterapp");
    }
  });
});
