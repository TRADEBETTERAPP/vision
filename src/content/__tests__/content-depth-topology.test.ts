import { GRAPH_NODES } from "../graph-nodes";

const REQUIRED_BIDIRECTIONAL_EDGES = [
  ["macro-thesis", "what-is-better"],
  ["macro-thesis", "tokenomics"],
  ["hft-edge", "architecture"],
  ["hft-edge", "proof"],
  ["hft-edge", "truth-perp-flywheel"],
  ["llm-product", "architecture"],
  ["llm-product", "tokenomics"],
  ["truth-perp-flywheel", "tokenomics"],
] as const;

describe("content-depth graph topology", () => {
  it.each(REQUIRED_BIDIRECTIONAL_EDGES)(
    "keeps %s and %s connected in both directions",
    (leftId, rightId) => {
      const leftNode = GRAPH_NODES.find((entry) => entry.id === leftId);
      const rightNode = GRAPH_NODES.find((entry) => entry.id === rightId);

      expect(leftNode?.related).toContain(rightId);
      expect(rightNode?.related).toContain(leftId);
    }
  );

  it("keeps all four new content nodes connected to at least two surfaces", () => {
    for (const nodeId of [
      "macro-thesis",
      "hft-edge",
      "llm-product",
      "truth-perp-flywheel",
    ]) {
      const node = GRAPH_NODES.find((entry) => entry.id === nodeId);
      expect(node?.related.length).toBeGreaterThanOrEqual(2);
    }
  });
});
