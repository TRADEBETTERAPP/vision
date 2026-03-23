/**
 * Comprehensive tests for the BETTER Vision content system.
 *
 * These tests protect the shared data layer from silent drift by validating:
 * - Type completeness and structural integrity
 * - Maturity taxonomy consistency
 * - Roadmap branch family coverage
 * - Token tier monotonicity (whale-first invariants)
 * - Token allocation arithmetic
 * - Scenario dimension completeness and ordering
 * - Projection output ordering (conservative ≤ base ≤ upside)
 * - Cost-band arithmetic and dependency sequencing
 * - Source/assumption cue presence on every data item
 */

import {
  // Types and constants
  MATURITY_LABELS,
  MATURITY_DESCRIPTIONS,
  BRANCH_FAMILY_LABELS,
  BRANCH_FAMILY_DESCRIPTIONS,
  SCENARIO_DIMENSION_LABELS,
  SCENARIO_LEVEL_LABELS,
  INFRA_SUBSYSTEM_LABELS,
  // Validators
  validateTierMonotonicity,
  validateProjectionOrdering,
  calculateTotalCostRange,
  // Roadmap
  ROADMAP_NODES,
  getNodesByFamily,
  getNodeById,
  getDependents,
  // Token tiers
  TOKEN_TIERS,
  TOTAL_SUPPLY,
  MINTED_SUPPLY,
  BASE_CONTRACT,
  TOKEN_ALLOCATIONS,
  getTiersSorted,
  getTierById,
  getTierForBalance,
  validateAllocations,
  FIRST_VAULT_POLICY,
  FIRST_VAULT_WORKED_EXAMPLES,
  MODELED_WHALE_PRODUCTS,
  REFERRAL_INCENTIVE_POLICY,
  PRODUCT_FAMILY_REVENUE_MODELS,
  // Scenarios
  SCENARIOS,
  PROJECTION_OUTPUTS,
  getScenario,
  getAssumption,
  getProjectionValues,
  // Cost bands
  COST_BAND_MODELS,
  getCostBandModel,
  getTotalInfraRange,
} from "../index";

import type {
  MaturityStatus,
  RoadmapBranchFamily,
  ScenarioDimension,
  ScenarioLevel,
} from "../index";

// ---------------------------------------------------------------------------
// Maturity Taxonomy
// ---------------------------------------------------------------------------

describe("Maturity Taxonomy", () => {
  const statuses: MaturityStatus[] = [
    "live",
    "in_progress",
    "planned",
    "speculative",
  ];

  it("provides labels for all four statuses", () => {
    for (const s of statuses) {
      expect(MATURITY_LABELS[s]).toBeDefined();
      expect(typeof MATURITY_LABELS[s]).toBe("string");
      expect(MATURITY_LABELS[s].length).toBeGreaterThan(0);
    }
  });

  it("provides descriptions for all four statuses", () => {
    for (const s of statuses) {
      expect(MATURITY_DESCRIPTIONS[s]).toBeDefined();
      expect(MATURITY_DESCRIPTIONS[s].length).toBeGreaterThan(10);
    }
  });
});

// ---------------------------------------------------------------------------
// Roadmap Branch Families
// ---------------------------------------------------------------------------

describe("Roadmap Branch Families", () => {
  const requiredFamilies: RoadmapBranchFamily[] = [
    "product_evolution",
    "token_utility",
    "revenue_expansion",
    "technical_infrastructure",
    "social_agent_ecosystem",
  ];

  it("has labels and descriptions for all five required families", () => {
    for (const family of requiredFamilies) {
      expect(BRANCH_FAMILY_LABELS[family]).toBeDefined();
      expect(BRANCH_FAMILY_DESCRIPTIONS[family]).toBeDefined();
    }
  });

  it("has at least one node per required branch family", () => {
    for (const family of requiredFamilies) {
      const nodes = getNodesByFamily(family);
      expect(nodes.length).toBeGreaterThan(0);
    }
  });

  it("covers all five required domain families in the roadmap", () => {
    const familiesPresent = new Set(ROADMAP_NODES.map((n) => n.family));
    for (const family of requiredFamilies) {
      expect(familiesPresent.has(family)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Roadmap Nodes — Structural Integrity
// ---------------------------------------------------------------------------

describe("Roadmap Nodes", () => {
  it("every node has a unique ID", () => {
    const ids = ROADMAP_NODES.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every node has required fields", () => {
    for (const node of ROADMAP_NODES) {
      expect(node.id).toBeTruthy();
      expect(node.family).toBeTruthy();
      expect(node.title).toBeTruthy();
      expect(node.status).toBeTruthy();
      expect(node.summary.length).toBeGreaterThan(10);
      expect(typeof node.unlocks).toBe("string");
      expect(node.source).toBeDefined();
      expect(node.source.type).toBeTruthy();
      expect(node.source.label).toBeTruthy();
    }
  });

  it("every node has a valid maturity status", () => {
    const validStatuses: MaturityStatus[] = [
      "live",
      "in_progress",
      "planned",
      "speculative",
    ];
    for (const node of ROADMAP_NODES) {
      expect(validStatuses).toContain(node.status);
    }
  });

  it("future-facing nodes have confidence framing", () => {
    const futureNodes = ROADMAP_NODES.filter(
      (n) => n.status === "planned" || n.status === "speculative"
    );
    expect(futureNodes.length).toBeGreaterThan(0);
    for (const node of futureNodes) {
      expect(node.confidence).toBeDefined();
      expect(node.confidence!.caveat.length).toBeGreaterThan(10);
    }
  });

  it("dependency references point to existing node IDs", () => {
    const allIds = new Set(ROADMAP_NODES.map((n) => n.id));
    for (const node of ROADMAP_NODES) {
      for (const dep of node.dependencies) {
        expect(allIds.has(dep)).toBe(true);
      }
    }
  });

  it("getNodeById returns correct node", () => {
    const node = getNodeById("pe-terminal-beta");
    expect(node).toBeDefined();
    expect(node!.title).toBe("BETTER Terminal (Closed Beta)");
  });

  it("getNodeById returns undefined for unknown ID", () => {
    expect(getNodeById("nonexistent")).toBeUndefined();
  });

  it("getDependents returns nodes that depend on a given node", () => {
    const dependents = getDependents("pe-terminal-beta");
    expect(dependents.length).toBeGreaterThan(0);
    for (const dep of dependents) {
      expect(dep.dependencies).toContain("pe-terminal-beta");
    }
  });

  it("nodes are sorted correctly within families", () => {
    const families: RoadmapBranchFamily[] = [
      "product_evolution",
      "token_utility",
      "revenue_expansion",
      "technical_infrastructure",
      "social_agent_ecosystem",
    ];
    for (const family of families) {
      const nodes = getNodesByFamily(family);
      for (let i = 1; i < nodes.length; i++) {
        expect(nodes[i].order).toBeGreaterThanOrEqual(nodes[i - 1].order);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Scenario Coverage
// ---------------------------------------------------------------------------

describe("Roadmap Scenario Dimension Coverage", () => {
  it("covers prediction markets in product and infrastructure nodes", () => {
    const predictionNodes = ROADMAP_NODES.filter(
      (n) =>
        n.summary.toLowerCase().includes("prediction") ||
        n.summary.toLowerCase().includes("polymarket")
    );
    expect(predictionNodes.length).toBeGreaterThan(0);
  });

  it("covers Hyperliquid/HyperEVM in infrastructure nodes", () => {
    const hyperNodes = ROADMAP_NODES.filter(
      (n) =>
        n.summary.toLowerCase().includes("hyperliquid") ||
        n.summary.toLowerCase().includes("hyperevm") ||
        n.title.toLowerCase().includes("hyperevm")
    );
    expect(hyperNodes.length).toBeGreaterThan(0);
  });

  it("covers social vaults in product nodes", () => {
    const vaultNodes = ROADMAP_NODES.filter(
      (n) =>
        n.summary.toLowerCase().includes("vault") ||
        n.title.toLowerCase().includes("vault")
    );
    expect(vaultNodes.length).toBeGreaterThan(0);
  });

  it("covers AI-agent tooling in ecosystem nodes", () => {
    const agentNodes = ROADMAP_NODES.filter(
      (n) =>
        n.summary.toLowerCase().includes("agent") ||
        n.title.toLowerCase().includes("agent")
    );
    expect(agentNodes.length).toBeGreaterThan(0);
  });

  it("covers enterprise rails in revenue and product nodes", () => {
    const enterpriseNodes = ROADMAP_NODES.filter(
      (n) =>
        n.summary.toLowerCase().includes("enterprise") ||
        n.summary.toLowerCase().includes("b2b") ||
        n.summary.toLowerCase().includes("institutional")
    );
    expect(enterpriseNodes.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Token Tiers — Whale-First Invariants
// ---------------------------------------------------------------------------

describe("Token Tiers", () => {
  it("tiers are sorted by ascending threshold", () => {
    const sorted = getTiersSorted();
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].threshold).toBeGreaterThanOrEqual(
        sorted[i - 1].threshold
      );
    }
  });

  it("whale privileges are monotonically non-decreasing across tiers", () => {
    expect(validateTierMonotonicity(TOKEN_TIERS)).toBe(true);
  });

  it("higher tiers never silently lose whale privileges", () => {
    const sorted = getTiersSorted();
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      // Access priority must not decrease
      expect(curr.accessPriority).toBeGreaterThanOrEqual(prev.accessPriority);
      // Allocation priority must not decrease
      expect(curr.allocationPriority).toBeGreaterThanOrEqual(
        prev.allocationPriority
      );
      // Preview priority must not decrease
      expect(curr.previewPriority).toBeGreaterThanOrEqual(
        prev.previewPriority
      );
      // Agent limit must not decrease
      expect(curr.agentLimit).toBeGreaterThanOrEqual(prev.agentLimit);
      // Fee multiplier must not increase (lower = better)
      expect(curr.feeMultiplier).toBeLessThanOrEqual(prev.feeMultiplier);
    }
  });

  it("every tier has a source cue", () => {
    for (const tier of TOKEN_TIERS) {
      expect(tier.source).toBeDefined();
      expect(tier.source.type).toBeTruthy();
      expect(tier.source.label).toBeTruthy();
    }
  });

  it("every tier has a qualification basis", () => {
    for (const tier of TOKEN_TIERS) {
      expect(tier.qualificationBasis.length).toBeGreaterThan(0);
    }
  });

  it("getTierForBalance returns the correct tier for various balances", () => {
    expect(getTierForBalance(0).id).toBe("tier-explorer");
    expect(getTierForBalance(49_999).id).toBe("tier-explorer");
    expect(getTierForBalance(50_000).id).toBe("tier-lite");
    expect(getTierForBalance(100_000).id).toBe("tier-standard");
    expect(getTierForBalance(499_999).id).toBe("tier-standard");
    expect(getTierForBalance(500_000).id).toBe("tier-whale");
    expect(getTierForBalance(2_000_000).id).toBe("tier-apex");
    expect(getTierForBalance(10_000_000).id).toBe("tier-apex");
  });

  it("getTierById returns correct tier", () => {
    expect(getTierById("tier-whale")!.name).toBe("Whale");
    expect(getTierById("nonexistent")).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Token Allocations — Arithmetic
// ---------------------------------------------------------------------------

describe("Token Allocations (Minted Supply)", () => {
  it("minted supply is 709,001,940 from the Base contract", () => {
    expect(MINTED_SUPPLY).toBe(709_001_940);
  });

  it("TOTAL_SUPPLY equals MINTED_SUPPLY (deprecated alias)", () => {
    expect(TOTAL_SUPPLY).toBe(MINTED_SUPPLY);
  });

  it("Base contract metadata is complete", () => {
    expect(BASE_CONTRACT.address).toBe("0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E");
    expect(BASE_CONTRACT.chain).toBe("Base");
    expect(BASE_CONTRACT.mintedSupply).toBe(MINTED_SUPPLY);
    expect(BASE_CONTRACT.decimals).toBe(18);
    expect(BASE_CONTRACT.source.type).toBe("canonical");
  });

  it("allocations sum to 100% and reconcile with minted supply", () => {
    const result = validateAllocations();
    expect(result.valid).toBe(true);
    expect(result.totalPercentage).toBe(100);
    expect(result.totalTokens).toBe(MINTED_SUPPLY);
  });

  it("each allocation percentage approximately matches its token count", () => {
    for (const alloc of TOKEN_ALLOCATIONS) {
      const expected = (alloc.percentage / 100) * MINTED_SUPPLY;
      // Allow for rounding within 0.1% of the allocation
      // On-chain verified allocations use exact token counts; percentages are derived
      const tolerance = Math.max(1, alloc.tokens * 0.001);
      expect(Math.abs(alloc.tokens - expected)).toBeLessThanOrEqual(tolerance);
    }
  });

  it("every allocation has a source cue", () => {
    for (const alloc of TOKEN_ALLOCATIONS) {
      expect(alloc.source).toBeDefined();
      expect(alloc.source.type).toBeTruthy();
    }
  });

  it("does not present 1,000,000,000 as the active supply", () => {
    // VAL-TOKEN-001: The site must not present 1B as the active supply
    expect(MINTED_SUPPLY).not.toBe(1_000_000_000);
    expect(MINTED_SUPPLY).toBe(709_001_940);
  });
});

// ---------------------------------------------------------------------------
// First-Vault Policy (VAL-TOKEN-012)
// ---------------------------------------------------------------------------

describe("First-Vault Policy (VAL-TOKEN-012)", () => {
  it("minimum holding is 100,000 BETTER", () => {
    expect(FIRST_VAULT_POLICY.minimumBetter).toBe(100_000);
  });

  it("total vault cap is $25,000", () => {
    expect(FIRST_VAULT_POLICY.totalVaultCapUsd).toBe(25_000);
  });

  it("qualifying tier minimum is Standard (tier-standard)", () => {
    expect(FIRST_VAULT_POLICY.qualifyingTierMinimum).toBe("tier-standard");
  });

  it("has a canonical source cue", () => {
    expect(FIRST_VAULT_POLICY.source.type).toBe("canonical");
  });

  it("worked examples cover qualifying and non-qualifying wallets", () => {
    const qualifying = FIRST_VAULT_WORKED_EXAMPLES.filter((e) => e.qualifies);
    const nonQualifying = FIRST_VAULT_WORKED_EXAMPLES.filter((e) => !e.qualifies);
    expect(qualifying.length).toBeGreaterThanOrEqual(2);
    expect(nonQualifying.length).toBeGreaterThanOrEqual(1);
  });

  it("worked examples have valid √-weight values for qualifying stakers", () => {
    for (const ex of FIRST_VAULT_WORKED_EXAMPLES) {
      if (ex.qualifies) {
        expect(ex.sqrtWeight).toBeGreaterThan(0);
        expect(ex.estimatedAllocationUsd).toBeGreaterThan(0);
      } else {
        expect(ex.sqrtWeight).toBe(0);
        expect(ex.estimatedAllocationUsd).toBe(0);
      }
    }
  });

  it("qualifying worked examples have allocations within total vault cap", () => {
    for (const ex of FIRST_VAULT_WORKED_EXAMPLES) {
      if (ex.qualifies) {
        expect(ex.estimatedAllocationUsd).toBeLessThanOrEqual(FIRST_VAULT_POLICY.totalVaultCapUsd);
      }
    }
  });

  it("qualifying worked examples have reasonable % of vault", () => {
    for (const ex of FIRST_VAULT_WORKED_EXAMPLES) {
      if (ex.qualifies) {
        expect(ex.percentOfVault).toBeGreaterThan(0);
        expect(ex.percentOfVault).toBeLessThanOrEqual(100);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Modeled Whale Products
// ---------------------------------------------------------------------------

describe("Modeled Whale Products", () => {
  it("includes social vaults, personal AI-crafted vaults, and at least two other whale products", () => {
    const names = MODELED_WHALE_PRODUCTS.map((p) => p.name);
    expect(names).toContain("Social Vaults");
    expect(names).toContain("Personal AI-Crafted Vaults");
    expect(MODELED_WHALE_PRODUCTS.length).toBeGreaterThanOrEqual(3);
  });

  it("every product has a scenario_based or illustrative source (not canonical)", () => {
    for (const product of MODELED_WHALE_PRODUCTS) {
      expect(["scenario_based", "illustrative"]).toContain(product.source.type);
    }
  });

  it("every product references a valid tier ID", () => {
    for (const product of MODELED_WHALE_PRODUCTS) {
      const tier = getTierById(product.minimumTierId);
      expect(tier).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// Referral Incentive Policy (VAL-TOKEN-013)
// ---------------------------------------------------------------------------

describe("Referral Incentive Policy (VAL-TOKEN-013)", () => {
  it("describes the payout source", () => {
    expect(REFERRAL_INCENTIVE_POLICY.rewardSourceDescription.length).toBeGreaterThan(20);
  });

  it("has per-referrer and per-referral caps", () => {
    expect(REFERRAL_INCENTIVE_POLICY.payoutCapPerReferrer.length).toBeGreaterThan(5);
    expect(REFERRAL_INCENTIVE_POLICY.payoutCapPerReferral.length).toBeGreaterThan(5);
  });

  it("has anti-abuse measures", () => {
    expect(REFERRAL_INCENTIVE_POLICY.antiAbuseMeasures.length).toBeGreaterThanOrEqual(3);
  });

  it("has sustainability logic", () => {
    expect(REFERRAL_INCENTIVE_POLICY.sustainabilityLogic.length).toBeGreaterThan(20);
  });

  it("maturity is planned (not live)", () => {
    expect(REFERRAL_INCENTIVE_POLICY.maturity).toBe("planned");
  });
});

// ---------------------------------------------------------------------------
// Product-Family Revenue Models (VAL-TOKEN-014)
// ---------------------------------------------------------------------------

describe("Product-Family Revenue Models (VAL-TOKEN-014)", () => {
  it("covers at least 7 product families", () => {
    expect(PRODUCT_FAMILY_REVENUE_MODELS.length).toBeGreaterThanOrEqual(7);
  });

  it("covers required product families", () => {
    const families = PRODUCT_FAMILY_REVENUE_MODELS.map((m) => m.productFamily);
    expect(families).toContain("Token Trading & Taxes");
    expect(families).toContain("Lite Mode & Terminal");
    expect(families).toContain("Social Vaults");
    expect(families).toContain("Strategy Agents");
    expect(families).toContain("Whale Premium Products");
    expect(families).toContain("Referrals");
    expect(families).toContain("Enterprise & API Rails");
  });

  it("each family has a return type label", () => {
    for (const model of PRODUCT_FAMILY_REVENUE_MODELS) {
      expect(model.returnTypeLabel.length).toBeGreaterThan(5);
      expect(["direct_revenue", "ecosystem_value", "hybrid"]).toContain(model.returnType);
    }
  });

  it("each family has a return path description", () => {
    for (const model of PRODUCT_FAMILY_REVENUE_MODELS) {
      expect(model.returnPath.length).toBeGreaterThan(20);
    }
  });

  it("each family has a source cue", () => {
    for (const model of PRODUCT_FAMILY_REVENUE_MODELS) {
      expect(model.source).toBeDefined();
      expect(model.source.type).toBeTruthy();
    }
  });

  it("each family has a maturity label", () => {
    const validStatuses = ["live", "in_progress", "planned", "speculative"];
    for (const model of PRODUCT_FAMILY_REVENUE_MODELS) {
      expect(validStatuses).toContain(model.maturity);
    }
  });
});

// ---------------------------------------------------------------------------
// Scenario Model
// ---------------------------------------------------------------------------

describe("Scenario Model", () => {
  const requiredDimensions: ScenarioDimension[] = [
    "prediction_markets",
    "hyperliquid_hyperevm",
    "social_vaults",
    "ai_agent_tooling",
    "enterprise_rails",
  ];

  const requiredLevels: ScenarioLevel[] = [
    "conservative",
    "base",
    "upside",
  ];

  it("has all three required scenario levels", () => {
    for (const level of requiredLevels) {
      const scenario = getScenario(level);
      expect(scenario).toBeDefined();
      expect(scenario.label).toBeTruthy();
      expect(scenario.description.length).toBeGreaterThan(10);
    }
  });

  it("each scenario covers all five required dimensions", () => {
    for (const level of requiredLevels) {
      const scenario = getScenario(level);
      const dims = new Set(scenario.assumptions.map((a) => a.dimension));
      for (const dim of requiredDimensions) {
        expect(dims.has(dim)).toBe(true);
      }
    }
  });

  it("dimension labels exist for all five dimensions", () => {
    for (const dim of requiredDimensions) {
      expect(SCENARIO_DIMENSION_LABELS[dim]).toBeTruthy();
    }
  });

  it("scenario level labels exist for all three levels", () => {
    for (const level of requiredLevels) {
      expect(SCENARIO_LEVEL_LABELS[level]).toBeTruthy();
    }
  });

  it("assumptions are logically ordered across scenarios (conservative ≤ base ≤ upside)", () => {
    for (const dim of requiredDimensions) {
      const conservative = getAssumption("conservative", dim);
      const base = getAssumption("base", dim);
      const upside = getAssumption("upside", dim);
      expect(base.value).toBeGreaterThanOrEqual(conservative.value);
      expect(upside.value).toBeGreaterThanOrEqual(base.value);
    }
  });

  it("every assumption has a source cue and description", () => {
    for (const scenario of SCENARIOS) {
      for (const a of scenario.assumptions) {
        expect(a.source).toBeDefined();
        expect(a.source.type).toBeTruthy();
        expect(a.description.length).toBeGreaterThan(10);
        expect(a.unit.length).toBeGreaterThan(0);
      }
    }
  });

  it("getAssumption throws for unknown level", () => {
    expect(() => getScenario("unknown" as ScenarioLevel)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Projection Outputs
// ---------------------------------------------------------------------------

describe("Projection Outputs", () => {
  it("projection values are ordered conservative ≤ base ≤ upside", () => {
    expect(validateProjectionOrdering(PROJECTION_OUTPUTS)).toBe(true);
  });

  it("every projection has dependency references", () => {
    for (const p of PROJECTION_OUTPUTS) {
      expect(p.dependsOn.length).toBeGreaterThan(0);
    }
  });

  it("every projection has a source cue", () => {
    for (const p of PROJECTION_OUTPUTS) {
      expect(p.source).toBeDefined();
      expect(p.source.type).toBeTruthy();
    }
  });

  it("projection dependencies reference existing roadmap nodes", () => {
    const allNodeIds = new Set(ROADMAP_NODES.map((n) => n.id));
    for (const p of PROJECTION_OUTPUTS) {
      for (const dep of p.dependsOn) {
        expect(allNodeIds.has(dep)).toBe(true);
      }
    }
  });

  it("getProjectionValues returns values for each level", () => {
    const conservative = getProjectionValues("conservative");
    const base = getProjectionValues("base");
    const upside = getProjectionValues("upside");
    expect(conservative.length).toBe(PROJECTION_OUTPUTS.length);
    expect(base.length).toBe(PROJECTION_OUTPUTS.length);
    expect(upside.length).toBe(PROJECTION_OUTPUTS.length);
  });
});

// ---------------------------------------------------------------------------
// Cost-Band Models
// ---------------------------------------------------------------------------

describe("Cost-Band Models", () => {
  it("covers all five required infrastructure subsystems", () => {
    const subsystems = COST_BAND_MODELS.map((m) => m.subsystem);
    expect(subsystems).toContain("ai_rl_models");
    expect(subsystems).toContain("polygon_validators");
    expect(subsystems).toContain("low_latency_execution");
    expect(subsystems).toContain("hyperevm_integration");
    expect(subsystems).toContain("data_pipeline");
  });

  it("total range matches sum of phase costs", () => {
    for (const model of COST_BAND_MODELS) {
      const { low, high } = calculateTotalCostRange(model.phases);
      expect(model.totalRangeLow).toBe(low);
      expect(model.totalRangeHigh).toBe(high);
    }
  });

  it("cost ranges are valid (low ≤ high) for every phase", () => {
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        expect(phase.costHigh).toBeGreaterThanOrEqual(phase.costLow);
      }
    }
  });

  it("every phase has an assumption basis and capability unlock", () => {
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        expect(phase.assumptionBasis.length).toBeGreaterThan(10);
        expect(phase.capabilityUnlock.length).toBeGreaterThan(10);
      }
    }
  });

  it("every phase has a valid maturity status", () => {
    const validStatuses: MaturityStatus[] = [
      "live",
      "in_progress",
      "planned",
      "speculative",
    ];
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        expect(validStatuses).toContain(phase.status);
      }
    }
  });

  it("every phase has a source cue", () => {
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        expect(phase.source).toBeDefined();
        expect(phase.source.type).toBeTruthy();
        expect(phase.source.label).toBeTruthy();
      }
    }
  });

  it("getCostBandModel returns correct model", () => {
    const model = getCostBandModel("ai_rl_models");
    expect(model).toBeDefined();
    expect(model!.title).toBe("Proprietary AI / RL Models");
    expect(getCostBandModel("nonexistent" as never)).toBeUndefined();
  });

  it("total infra range is reasonable", () => {
    const { low, high } = getTotalInfraRange();
    expect(low).toBeGreaterThan(0);
    expect(high).toBeGreaterThan(low);
  });

  it("subsystem labels exist for all subsystems", () => {
    for (const model of COST_BAND_MODELS) {
      expect(INFRA_SUBSYSTEM_LABELS[model.subsystem]).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// Cross-Cutting Invariants
// ---------------------------------------------------------------------------

describe("Cross-Cutting Invariants", () => {
  it("all source cues across the system have valid types", () => {
    const validSourceTypes = [
      "canonical",
      "scenario_based",
      "illustrative",
      "external",
    ];

    // Check roadmap nodes
    for (const node of ROADMAP_NODES) {
      expect(validSourceTypes).toContain(node.source.type);
    }

    // Check token tiers
    for (const tier of TOKEN_TIERS) {
      expect(validSourceTypes).toContain(tier.source.type);
    }

    // Check scenarios
    for (const scenario of SCENARIOS) {
      for (const a of scenario.assumptions) {
        expect(validSourceTypes).toContain(a.source.type);
      }
    }

    // Check projections
    for (const p of PROJECTION_OUTPUTS) {
      expect(validSourceTypes).toContain(p.source.type);
    }

    // Check cost band phases
    for (const model of COST_BAND_MODELS) {
      for (const phase of model.phases) {
        expect(validSourceTypes).toContain(phase.source.type);
      }
    }
  });

  it("live items use canonical sources", () => {
    const liveNodes = ROADMAP_NODES.filter((n) => n.status === "live");
    for (const node of liveNodes) {
      expect(node.source.type).toBe("canonical");
    }
  });

  it("speculative items use illustrative or scenario_based sources", () => {
    const specNodes = ROADMAP_NODES.filter((n) => n.status === "speculative");
    for (const node of specNodes) {
      expect(["illustrative", "scenario_based"]).toContain(node.source.type);
    }
  });

  it("no circular dependencies in roadmap nodes", () => {
    // Simple cycle detection via DFS
    const graph = new Map<string, string[]>();
    for (const node of ROADMAP_NODES) {
      graph.set(node.id, node.dependencies);
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
    for (const node of ROADMAP_NODES) {
      if (!visited.has(node.id)) {
        expect(hasCycle(node.id, visited, new Set())).toBe(false);
      }
    }
  });
});
