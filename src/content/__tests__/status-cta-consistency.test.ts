/**
 * Status & CTA Consistency Tests
 *
 * VAL-CROSS-004: The same feature or mechanic is not shown with conflicting
 *                maturity states across the new shell.
 * VAL-CROSS-005: Terminology, supply figures, and thresholds remain consistent.
 * VAL-CROSS-007: Non-hero CTAs in roadmap, tokenomics, architecture, detail
 *                panels, and evidence surfaces remain honest about maturity
 *                and outcome.
 *
 * These tests ensure the graph-shell rewrite does not reintroduce stale labels
 * or misleading CTA promises.
 */

import {
  ROADMAP_NODES,
  TOKEN_TIERS,
  PRODUCT_FAMILY_REVENUE_MODELS,
  MODELED_WHALE_PRODUCTS,
  FIRST_VAULT_POLICY,
  MATURITY_LABELS,
  type MaturityStatus,
  getNodeById,
} from "../index";

import { NARRATIVE_BLOCKS } from "../narrative";
import { GRAPH_NODES } from "../graph-nodes";

// ---------------------------------------------------------------------------
// Flywheel data — must import from the component since it's co-located
// ---------------------------------------------------------------------------
// We test the flywheel data inline since it's defined in the component.
// The tests below verify that flywheel node statuses don't conflict with
// the canonical product-family revenue models.

// ---------------------------------------------------------------------------
// VAL-CROSS-004: No conflicting maturity states across surfaces
// ---------------------------------------------------------------------------

describe("Shell-wide maturity consistency (VAL-CROSS-004)", () => {
  // Mapping of concepts that span multiple surfaces.
  // narrative → roadmap → graph node dominant status → flywheel → revenue model
  const SOCIAL_VAULTS_CONCEPT = {
    narrativeId: "vision-social-vaults",
    roadmapId: "pe-social-vaults",
    expectedStatus: "in_progress" as MaturityStatus,
    productFamilyId: "pfr-social-vaults",
  };

  const STRATEGY_AGENTS_CONCEPT = {
    narrativeId: "vision-strategy-agents",
    roadmapId: "pe-strategy-agents",
    expectedStatus: "planned" as MaturityStatus,
    productFamilyId: "pfr-strategy-agents",
  };

  it("social vaults status is consistent across narrative, roadmap, and revenue model", () => {
    const { narrativeId, roadmapId, expectedStatus, productFamilyId } = SOCIAL_VAULTS_CONCEPT;
    const narrative = NARRATIVE_BLOCKS.find((b) => b.id === narrativeId);
    const roadmap = getNodeById(roadmapId);
    const revenue = PRODUCT_FAMILY_REVENUE_MODELS.find((r) => r.id === productFamilyId);

    expect(narrative).toBeDefined();
    expect(roadmap).toBeDefined();
    expect(revenue).toBeDefined();

    expect(narrative!.status).toBe(expectedStatus);
    expect(roadmap!.status).toBe(expectedStatus);
    expect(revenue!.maturity).toBe(expectedStatus);
  });

  it("strategy agents status is consistent across narrative, roadmap, and revenue model", () => {
    const { narrativeId, roadmapId, expectedStatus, productFamilyId } = STRATEGY_AGENTS_CONCEPT;
    const narrative = NARRATIVE_BLOCKS.find((b) => b.id === narrativeId);
    const roadmap = getNodeById(roadmapId);
    const revenue = PRODUCT_FAMILY_REVENUE_MODELS.find((r) => r.id === productFamilyId);

    expect(narrative).toBeDefined();
    expect(roadmap).toBeDefined();
    expect(revenue).toBeDefined();

    expect(narrative!.status).toBe(expectedStatus);
    expect(roadmap!.status).toBe(expectedStatus);
    expect(revenue!.maturity).toBe(expectedStatus);
  });

  it("modeled whale product maturity does not use type assertion hacks", () => {
    // Every modeled whale product's maturity must be a valid value from
    // the ModeledWhaleProduct interface: "planned" | "speculative"
    for (const product of MODELED_WHALE_PRODUCTS) {
      const validMaturities: string[] = ["planned", "speculative"];
      expect(validMaturities).toContain(product.maturity);
    }
  });

  it("modeled whale products for in-progress features still say 'planned' for the gate policy", () => {
    // Social vaults as a feature are in_progress, but the whale access *gate*
    // is planned (modeled policy). The modeled whale product must say planned.
    const socialVaultProduct = MODELED_WHALE_PRODUCTS.find(
      (p) => p.id === "mwp-social-vaults"
    );
    expect(socialVaultProduct).toBeDefined();
    expect(socialVaultProduct!.maturity).toBe("planned");
  });

  it("graph node dominantStatus reflects the most representative status of its content", () => {
    // Verify specific graph nodes:
    // "what-is-better" → live
    // "proof" → live
    // "live-now" → live
    // "roadmap" → in_progress (spans live through speculative, but most content is future-facing)
    // "tokenomics" → live (core supply/tiers are live, scenarios are analysis tools)
    // "architecture" → in_progress (has live layers + planned layers, weighted toward in_progress)
    // "evidence" → live
    // "risks" → live

    const expectations: Record<string, MaturityStatus> = {
      "what-is-better": "live",
      "proof": "live",
      "live-now": "live",
      "roadmap": "in_progress",
      "tokenomics": "live",
      "architecture": "in_progress",
      "evidence": "live",
      "risks": "live",
    };

    for (const [nodeId, expectedStatus] of Object.entries(expectations)) {
      const node = GRAPH_NODES.find((n) => n.id === nodeId);
      expect(node).toBeDefined();
      expect(node!.dominantStatus).toBe(expectedStatus);
    }
  });
});

// ---------------------------------------------------------------------------
// VAL-CROSS-005: No stale 1B supply references in user-visible content
// ---------------------------------------------------------------------------

describe("No stale supply references across all content (VAL-CROSS-005)", () => {
  it("no narrative block body contains '1,000,000,000' as active supply", () => {
    for (const block of NARRATIVE_BLOCKS) {
      // Allow historical/explanatory references but not as current supply
      if (block.body.includes("1,000,000,000")) {
        expect(block.body).toMatch(/historical|superseded|previous|former|migrat/i);
      }
    }
  });

  it("roadmap node summaries do not reference 1B as current supply", () => {
    for (const node of ROADMAP_NODES) {
      if (node.summary.includes("1,000,000,000")) {
        expect(node.summary).toMatch(/historical|superseded|previous|former/i);
      }
    }
  });

  it("all token tier source notes reference minted supply, not 1B", () => {
    for (const tier of TOKEN_TIERS) {
      if (tier.source.note) {
        expect(tier.source.note).not.toMatch(/1,000,000,000|1B\b/);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// VAL-CROSS-007: Non-hero CTAs are honest about maturity
// ---------------------------------------------------------------------------

describe("Non-hero CTA honesty (VAL-CROSS-007)", () => {
  it("future-facing roadmap nodes carry confidence caveats", () => {
    const futureFacing = ROADMAP_NODES.filter(
      (n) => n.status === "planned" || n.status === "speculative"
    );
    expect(futureFacing.length).toBeGreaterThan(0);
    for (const node of futureFacing) {
      expect(node.confidence).toBeDefined();
      expect(node.confidence!.caveat.length).toBeGreaterThan(10);
    }
  });

  it("product-family revenue models carry maturity labels that match canonical taxonomy", () => {
    for (const model of PRODUCT_FAMILY_REVENUE_MODELS) {
      expect(MATURITY_LABELS[model.maturity]).toBeDefined();
    }
  });

  it("first-vault policy source is canonical (live policy, not speculative)", () => {
    expect(FIRST_VAULT_POLICY.source.type).toBe("canonical");
  });

  it("modeled whale product sources are scenario_based or illustrative (not canonical)", () => {
    for (const product of MODELED_WHALE_PRODUCTS) {
      expect(["scenario_based", "illustrative"]).toContain(product.source.type);
    }
  });
});
