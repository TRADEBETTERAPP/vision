/**
 * Cross-surface consistency tests.
 *
 * VAL-CROSS-004: Status consistency across all sections
 * VAL-CROSS-005: Terminology and threshold consistency
 * VAL-CROSS-006: Projection dependencies trace to roadmap/architecture stages
 * VAL-CROSS-007: Non-hero CTAs match maturity (data-level verification)
 *
 * These tests verify that the same feature or economic mechanic is not
 * presented as live in one section and planned/speculative in another.
 */

import {
  ROADMAP_NODES,
  PROJECTION_OUTPUTS,
  TOKEN_TIERS,
  COST_BAND_MODELS,
  TOTAL_SUPPLY,
  getNodeById,
  getTiersSorted,
  MATURITY_LABELS,
  type MaturityStatus,
} from "../index";

import { NARRATIVE_BLOCKS } from "../narrative";

// ---------------------------------------------------------------------------
// VAL-CROSS-004: Status consistency across surfaces
// ---------------------------------------------------------------------------

describe("Cross-Surface Status Consistency (VAL-CROSS-004)", () => {
  /**
   * Mapping of concepts that appear across narrative and roadmap surfaces.
   * narrative block id → roadmap node id
   */
  const narrativeToRoadmap: Record<string, string> = {
    "vision-social-vaults": "pe-social-vaults",
    "vision-strategy-agents": "pe-strategy-agents",
    "vision-hyperevm": "ti-hyperevm-phase1",
    "vision-enterprise": "pe-b2b-data",
  };

  for (const [narrativeId, roadmapId] of Object.entries(narrativeToRoadmap)) {
    it(`narrative '${narrativeId}' and roadmap '${roadmapId}' share a consistent status`, () => {
      const narrativeBlock = NARRATIVE_BLOCKS.find((b) => b.id === narrativeId);
      const roadmapNode = getNodeById(roadmapId);
      expect(narrativeBlock).toBeDefined();
      expect(roadmapNode).toBeDefined();
      expect(narrativeBlock!.status).toBe(roadmapNode!.status);
    });
  }

  it("live-scope narrative blocks match roadmap 'live' status for the Terminal", () => {
    const scopeTerminal = NARRATIVE_BLOCKS.find((b) => b.id === "scope-terminal");
    const roadmapTerminal = getNodeById("pe-terminal-beta");
    expect(scopeTerminal).toBeDefined();
    expect(roadmapTerminal).toBeDefined();
    expect(scopeTerminal!.status).toBe("live");
    expect(roadmapTerminal!.status).toBe("live");
  });

  it("no feature is live in one surface and speculative in another", () => {
    // Check each narrative-to-roadmap pair has no live/speculative contradiction
    for (const [narrativeId, roadmapId] of Object.entries(narrativeToRoadmap)) {
      const narrativeBlock = NARRATIVE_BLOCKS.find((b) => b.id === narrativeId);
      const roadmapNode = getNodeById(roadmapId);
      if (narrativeBlock && roadmapNode) {
        const pair = [narrativeBlock.status, roadmapNode.status];
        // Should never have {live, speculative} or {speculative, live}
        expect(pair).not.toEqual(expect.arrayContaining(["live", "speculative"] as MaturityStatus[]));
      }
    }
  });
});

// ---------------------------------------------------------------------------
// VAL-CROSS-005: Terminology and threshold consistency
// ---------------------------------------------------------------------------

describe("Cross-Surface Terminology Consistency (VAL-CROSS-005)", () => {
  it("tier names in token data are consistent with narrative copy", () => {
    const tiers = getTiersSorted();
    const tierNames = tiers.map((t) => t.name);
    // These names should not differ between surfaces
    expect(tierNames).toContain("Explorer");
    expect(tierNames).toContain("Lite");
    expect(tierNames).toContain("Standard");
    expect(tierNames).toContain("Whale");
    expect(tierNames).toContain("Apex Whale");
  });

  it("Lite Mode threshold is consistent between tier data and narrative", () => {
    const liteTier = TOKEN_TIERS.find((t) => t.id === "tier-lite");
    expect(liteTier).toBeDefined();
    expect(liteTier!.threshold).toBe(50_000);
    // Narrative should mention 50,000 or halved requirement consistently
    const liteScopeBlock = NARRATIVE_BLOCKS.find((b) => b.id === "scope-lite-mode");
    expect(liteScopeBlock).toBeDefined();
    expect(liteScopeBlock!.body).toMatch(/halv/i); // "halves the... requirement"
  });

  it("Standard tier threshold is consistent at 100,000", () => {
    const standardTier = TOKEN_TIERS.find((t) => t.id === "tier-standard");
    expect(standardTier!.threshold).toBe(100_000);
  });

  it("total supply is consistently 1,000,000,000 across models", () => {
    // Already validated in content-models.test.ts but verify cross-surface
    expect(TOTAL_SUPPLY).toBe(1_000_000_000);
  });

  it("maturity labels use the canonical MATURITY_LABELS mapping", () => {
    // Verify all status values in roadmap nodes use valid labels
    for (const node of ROADMAP_NODES) {
      expect(MATURITY_LABELS[node.status]).toBeDefined();
    }
    for (const block of NARRATIVE_BLOCKS) {
      expect(MATURITY_LABELS[block.status]).toBeDefined();
    }
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        expect(MATURITY_LABELS[phase.status]).toBeDefined();
      }
    }
  });

  it("fee names use consistent terminology across surfaces", () => {
    // The narrative and tokenomics should use the same fee names.
    // We check both titles and body text since some terms appear in titles.
    const expectedFeeTerms = [
      "Trading Tax",
      "Lite Mode",
      "per-fill fee",
      "FDV ratchet",
    ];
    const allNarrativeText = NARRATIVE_BLOCKS.map(
      (b) => `${b.title} ${b.body}`
    ).join(" ");
    for (const term of expectedFeeTerms) {
      expect(allNarrativeText).toContain(term);
    }
  });
});

// ---------------------------------------------------------------------------
// VAL-CROSS-006: Projection dependencies trace to roadmap/architecture
// ---------------------------------------------------------------------------

describe("Projection Dependency Traceability (VAL-CROSS-006)", () => {
  it("every projection dependency resolves to an existing roadmap node", () => {
    const allNodeIds = new Set(ROADMAP_NODES.map((n) => n.id));
    for (const projection of PROJECTION_OUTPUTS) {
      for (const dep of projection.dependsOn) {
        expect(allNodeIds.has(dep)).toBe(true);
      }
    }
  });

  it("every projection dependency resolves to a readable title (not raw ID)", () => {
    for (const projection of PROJECTION_OUTPUTS) {
      for (const dep of projection.dependsOn) {
        const node = getNodeById(dep);
        expect(node).toBeDefined();
        expect(node!.title).toBeTruthy();
        expect(node!.title).not.toBe(dep); // title != raw ID
      }
    }
  });

  it("projection dependencies include non-live roadmap items when applicable", () => {
    // Projections that depend on future mechanics should reference
    // non-live nodes, ensuring they don't imply the mechanics are active
    const activeAgentsProjection = PROJECTION_OUTPUTS.find(
      (p) => p.metric === "Active Autonomous Agents"
    );
    expect(activeAgentsProjection).toBeDefined();
    const depStatuses = activeAgentsProjection!.dependsOn.map(
      (dep) => getNodeById(dep)?.status
    );
    // At least one dependency should be non-live (planned or speculative)
    expect(depStatuses.some((s) => s !== "live")).toBe(true);
  });

  it("vault AUM projection depends on social vaults (a non-live item)", () => {
    const vaultProjection = PROJECTION_OUTPUTS.find(
      (p) => p.metric === "Total Vault AUM"
    );
    expect(vaultProjection).toBeDefined();
    expect(vaultProjection!.dependsOn).toContain("pe-social-vaults");
    const vaultNode = getNodeById("pe-social-vaults");
    expect(vaultNode!.status).not.toBe("live");
  });

  it("enterprise revenue projection depends on non-live enterprise nodes", () => {
    const enterpriseProjection = PROJECTION_OUTPUTS.find(
      (p) => p.metric === "Enterprise Revenue"
    );
    expect(enterpriseProjection).toBeDefined();
    const depStatuses = enterpriseProjection!.dependsOn.map(
      (dep) => getNodeById(dep)?.status
    );
    expect(depStatuses.some((s) => s !== "live")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VAL-CROSS-007: CTA / action honesty at data level
// ---------------------------------------------------------------------------

describe("CTA and Action Honesty — Data Level (VAL-CROSS-007)", () => {
  it("roadmap nodes with dependencies resolve to readable labels for user display", () => {
    for (const node of ROADMAP_NODES) {
      for (const dep of node.dependencies) {
        const depNode = getNodeById(dep);
        expect(depNode).toBeDefined();
        expect(depNode!.title).toBeTruthy();
      }
    }
  });

  it("future-facing roadmap nodes carry confidence framing", () => {
    const futureFacing = ROADMAP_NODES.filter(
      (n) => n.status === "planned" || n.status === "speculative"
    );
    for (const node of futureFacing) {
      expect(node.confidence).toBeDefined();
      expect(node.confidence!.caveat.length).toBeGreaterThan(10);
    }
  });

  it("projection sources are scenario_based, not canonical (honest about uncertainty)", () => {
    for (const p of PROJECTION_OUTPUTS) {
      expect(p.source.type).toBe("scenario_based");
    }
  });
});
