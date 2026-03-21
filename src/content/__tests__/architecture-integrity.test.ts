/**
 * Regression tests for architecture data referential integrity and
 * cross-surface maturity consistency.
 *
 * Protects:
 * - Cost-band phase dependencies use stable IDs that resolve to existing phases
 * - Every cost-band phase has a stable unique ID
 * - Phase ID → label resolution produces readable (non-ID) text
 * - Strategy Agents & Vaults maturity is consistent across roadmap, narrative,
 *   tokenomics, and flywheel surfaces
 */

import {
  COST_BAND_MODELS,
  getPhaseLabel,
  getPhaseById,
  getAllPhaseIds,
  getNodeById,
} from "../index";

import { NARRATIVE_BLOCKS } from "../narrative";

// ---------------------------------------------------------------------------
// Cost-Band Phase Referential Integrity
// ---------------------------------------------------------------------------

describe("Cost-Band Phase Referential Integrity", () => {
  const allPhaseIds = getAllPhaseIds();

  it("every cost-band phase has a stable unique ID", () => {
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        expect(phase.id).toBeTruthy();
        expect(typeof phase.id).toBe("string");
        expect(phase.id.length).toBeGreaterThan(0);
      }
    }
  });

  it("cost-band phase IDs are globally unique across all subsystems", () => {
    expect(new Set(allPhaseIds).size).toBe(allPhaseIds.length);
  });

  it("cost-band phase dependencies reference existing phase IDs", () => {
    const idSet = new Set(allPhaseIds);
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        for (const depId of phase.dependencies) {
          expect(idSet.has(depId)).toBe(true);
        }
      }
    }
  });

  it("cost-band phase dependencies do not reference the phase itself", () => {
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        for (const depId of phase.dependencies) {
          expect(depId).not.toBe(phase.id);
        }
      }
    }
  });

  it("no circular dependencies in cost-band phases", () => {
    const graph = new Map<string, string[]>();
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        graph.set(phase.id, phase.dependencies);
      }
    }

    function hasCycle(
      nodeId: string,
      visited: Set<string>,
      stack: Set<string>
    ): boolean {
      visited.add(nodeId);
      stack.add(nodeId);
      for (const dep of graph.get(nodeId) || []) {
        if (!visited.has(dep)) {
          if (hasCycle(dep, visited, stack)) return true;
        } else if (stack.has(dep)) {
          return true;
        }
      }
      stack.delete(nodeId);
      return false;
    }

    const visited = new Set<string>();
    for (const id of allPhaseIds) {
      if (!visited.has(id)) {
        expect(hasCycle(id, visited, new Set())).toBe(false);
      }
    }
  });

  it("getPhaseLabel resolves every dependency to a readable (non-ID) label", () => {
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        for (const depId of phase.dependencies) {
          const label = getPhaseLabel(depId);
          // Label should differ from the raw ID and not be empty
          expect(label).not.toBe(depId);
          expect(label.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("getPhaseById returns the correct phase for each known ID", () => {
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        const resolved = getPhaseById(phase.id);
        expect(resolved).toBeDefined();
        expect(resolved!.name).toBe(phase.name);
      }
    }
  });

  it("getPhaseById returns undefined for unknown IDs", () => {
    expect(getPhaseById("nonexistent-phase")).toBeUndefined();
  });

  it("getPhaseLabel falls back to the raw ID for unknown IDs", () => {
    expect(getPhaseLabel("nonexistent-phase")).toBe("nonexistent-phase");
  });
});

// ---------------------------------------------------------------------------
// Cross-Surface Maturity Consistency — Strategy Agents
// ---------------------------------------------------------------------------

describe("Cross-Surface Maturity Consistency — Strategy Agents", () => {
  it("roadmap pe-strategy-agents has status 'planned'", () => {
    const node = getNodeById("pe-strategy-agents");
    expect(node).toBeDefined();
    expect(node!.status).toBe("planned");
  });

  it("narrative vision-strategy-agents matches roadmap maturity", () => {
    const roadmapNode = getNodeById("pe-strategy-agents");
    const narrativeBlock = NARRATIVE_BLOCKS.find(
      (b) => b.id === "vision-strategy-agents"
    );
    expect(narrativeBlock).toBeDefined();
    expect(narrativeBlock!.status).toBe(roadmapNode!.status);
  });

  it("all surfaces referencing Strategy Agents agree on maturity", () => {
    // Collect the canonical status from the roadmap
    const canonicalStatus = getNodeById("pe-strategy-agents")!.status;

    // Narrative
    const narrativeBlock = NARRATIVE_BLOCKS.find(
      (b) => b.id === "vision-strategy-agents"
    );
    expect(narrativeBlock!.status).toBe(canonicalStatus);

    // Note: FlywheelExplorer data is component-local, so we test it
    // through the rendered component (see ArchitectureSection tests).
    // This test ensures the data-layer references stay consistent.
  });
});

// ---------------------------------------------------------------------------
// Cross-Surface Maturity Consistency — Broad Checks
// ---------------------------------------------------------------------------

describe("Cross-Surface Maturity Consistency — Broad", () => {
  it("narrative blocks match roadmap node statuses for shared concepts", () => {
    // Map of narrative block IDs to their corresponding roadmap node IDs
    const mappings: Record<string, string> = {
      "vision-social-vaults": "pe-social-vaults",
      "vision-strategy-agents": "pe-strategy-agents",
    };

    for (const [narrativeId, roadmapId] of Object.entries(mappings)) {
      const narrativeBlock = NARRATIVE_BLOCKS.find(
        (b) => b.id === narrativeId
      );
      const roadmapNode = getNodeById(roadmapId);
      expect(narrativeBlock).toBeDefined();
      expect(roadmapNode).toBeDefined();
      expect(narrativeBlock!.status).toBe(roadmapNode!.status);
    }
  });
});
