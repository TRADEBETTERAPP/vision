import {
  NARRATIVE_BLOCKS,
  getBlocksBySurface,
  getBlockById,
} from "../narrative";
import type { MaturityStatus } from "../types";

describe("Narrative Blocks", () => {
  it("every block has a unique ID", () => {
    const ids = NARRATIVE_BLOCKS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every block has required fields", () => {
    for (const block of NARRATIVE_BLOCKS) {
      expect(block.id).toBeTruthy();
      expect(block.surface).toBeTruthy();
      expect(block.title).toBeTruthy();
      expect(block.body.length).toBeGreaterThan(10);
      expect(block.source).toBeDefined();
      expect(block.source.type).toBeTruthy();
      expect(block.source.label).toBeTruthy();
    }
  });

  it("every block has a valid maturity status", () => {
    const validStatuses: MaturityStatus[] = [
      "live",
      "in_progress",
      "planned",
      "speculative",
    ];
    for (const block of NARRATIVE_BLOCKS) {
      expect(validStatuses).toContain(block.status);
    }
  });

  it("future-facing blocks have confidence framing", () => {
    const futureBlocks = NARRATIVE_BLOCKS.filter(
      (b) => b.status === "planned" || b.status === "speculative"
    );
    expect(futureBlocks.length).toBeGreaterThan(0);
    for (const block of futureBlocks) {
      expect(block.confidence).toBeDefined();
      expect(block.confidence!.caveat.length).toBeGreaterThan(10);
    }
  });

  it("has hero surface blocks", () => {
    const heroBlocks = getBlocksBySurface("hero");
    expect(heroBlocks.length).toBeGreaterThan(0);
  });

  it("has current_scope surface blocks", () => {
    const scopeBlocks = getBlocksBySurface("current_scope");
    expect(scopeBlocks.length).toBeGreaterThan(0);
    // All current scope blocks should be live
    for (const block of scopeBlocks) {
      expect(block.status).toBe("live");
    }
  });

  it("has vision surface blocks", () => {
    const visionBlocks = getBlocksBySurface("vision");
    expect(visionBlocks.length).toBeGreaterThan(0);
  });

  it("blocks are sorted by order within each surface", () => {
    const surfaces = [...new Set(NARRATIVE_BLOCKS.map((b) => b.surface))];
    for (const surface of surfaces) {
      const blocks = getBlocksBySurface(surface);
      for (let i = 1; i < blocks.length; i++) {
        expect(blocks[i].order).toBeGreaterThanOrEqual(blocks[i - 1].order);
      }
    }
  });

  it("getBlockById returns correct block", () => {
    const block = getBlockById("hero-definition");
    expect(block).toBeDefined();
    expect(block!.title).toBe("What is BETTER?");
  });

  it("getBlockById returns undefined for unknown ID", () => {
    expect(getBlockById("nonexistent")).toBeUndefined();
  });

  it("live blocks use canonical sources", () => {
    const liveBlocks = NARRATIVE_BLOCKS.filter((b) => b.status === "live");
    for (const block of liveBlocks) {
      expect(block.source.type).toBe("canonical");
    }
  });
});
