import { GRAPH_NODES } from "../graph-nodes";
import { HFT_EDGE_CONTENT } from "../hft-edge";

describe("HFT Edge content model", () => {
  it("registers the HFT Edge graph node with the required related edges", () => {
    const node = GRAPH_NODES.find((entry) => entry.id === "hft-edge");

    expect(node).toBeDefined();
    expect(node?.label).toBe("HFT Edge");
    expect(node?.related).toEqual(
      expect.arrayContaining(["architecture", "proof"])
    );
    expect(node?.dominantStatus).toBe("in_progress");
  });

  it("captures the exact latency, alpha, and execution figures", () => {
    const serialized = JSON.stringify(HFT_EDGE_CONTENT);

    expect(serialized).toContain("Rust");
    expect(serialized).toContain("same AWS rack");
    expect(serialized).toContain("0.11ms");
    expect(serialized).toContain("8ms");
    expect(serialized).toContain("Z-Score");
    expect(serialized).toContain("35-70x");
    expect(serialized).toContain("Sharpe >40");
    expect(serialized).toContain("FAST15M");
    expect(serialized).toContain("LONG");
    expect(serialized).toContain("Kelly");
    expect(serialized).toContain("~60x");
  });

  it("captures copy-trading and BRAID consensus details", () => {
    const serialized = JSON.stringify(HFT_EDGE_CONTENT);

    expect(serialized).toContain("gas-sponsored");
    expect(serialized).toContain("UDA");
    expect(serialized).toContain("one-click copy trading");
    expect(serialized).toContain("88%");
    expect(serialized).toContain("100%");
    expect(serialized).toContain("4-way");
  });

  it("attributes every claim block to @tradebetterapp", () => {
    expect(HFT_EDGE_CONTENT.source.label).toContain("@tradebetterapp");

    for (const section of HFT_EDGE_CONTENT.sections) {
      expect(section.source.label).toContain("@tradebetterapp");
    }
  });
});
