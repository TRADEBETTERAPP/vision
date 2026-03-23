/**
 * Canonical BETTER Vision Content Type System
 *
 * These types define the shared data contracts for the entire BETTER vision site.
 * Every surface — narrative, roadmap, tokenomics, projections, architecture —
 * uses these types so maturity labels, evidence hooks, and scenario assumptions
 * are first-class fields rather than ad-hoc copy.
 */

// ---------------------------------------------------------------------------
// Maturity Taxonomy
// ---------------------------------------------------------------------------

/**
 * Shared maturity taxonomy used consistently across narrative, roadmap,
 * tokenomics, and architecture surfaces.
 *
 * - Live: Shipped and accessible today
 * - InProgress: Actively being built
 * - Planned: Committed roadmap item with design or spec work underway
 * - Speculative: Ambitious but not yet committed — future exploration
 */
export type MaturityStatus = "live" | "in_progress" | "planned" | "speculative";

/** Human-readable labels for each maturity status */
export const MATURITY_LABELS: Record<MaturityStatus, string> = {
  live: "Live",
  in_progress: "In Progress",
  planned: "Planned",
  speculative: "Speculative",
};

/** Short explanations for each maturity status */
export const MATURITY_DESCRIPTIONS: Record<MaturityStatus, string> = {
  live: "Shipped and accessible to users today.",
  in_progress: "Actively being built by the BETTER team.",
  planned: "Committed roadmap item with design or specification work underway.",
  speculative:
    "Ambitious long-range exploration — not yet committed to a timeline.",
};

// ---------------------------------------------------------------------------
// Source & Assumption Cues
// ---------------------------------------------------------------------------

/**
 * Evidence hook that distinguishes canonical facts from scenario-based or
 * illustrative values. Attached to any claim, number, or threshold.
 */
export type SourceType =
  | "canonical"      // Current verifiable BETTER fact
  | "scenario_based" // Derived from a scenario assumption set
  | "illustrative"   // Example or hypothetical for explanation
  | "external";      // Third-party data or market reference

export interface SourceCue {
  /** What kind of source backs this value */
  type: SourceType;
  /** Human-readable label for the source (e.g. "BETTER Docs", "CoinGecko") */
  label: string;
  /** Optional URL or reference path */
  href?: string;
  /** When was this value last verified or updated */
  asOf?: string;
  /** Additional context about the assumption or caveat */
  note?: string;
}

/**
 * Confidence framing for future-facing claims.
 * Attaches to any roadmap node, projection, or economic claim.
 */
export interface ConfidenceFrame {
  /** Short caveat or uncertainty note shown near the claim */
  caveat: string;
  /** What must be true for this claim to hold */
  dependencies?: string[];
}

// ---------------------------------------------------------------------------
// Roadmap Branch Families
// ---------------------------------------------------------------------------

/**
 * The five required roadmap branch families covering the full BETTER ecosystem.
 */
export type RoadmapBranchFamily =
  | "product_evolution"
  | "token_utility"
  | "revenue_expansion"
  | "technical_infrastructure"
  | "social_agent_ecosystem";

export const BRANCH_FAMILY_LABELS: Record<RoadmapBranchFamily, string> = {
  product_evolution: "Product Evolution",
  token_utility: "Token Utility & Access Tiers",
  revenue_expansion: "Revenue Expansion",
  technical_infrastructure: "Technical Infrastructure",
  social_agent_ecosystem: "Social & Agent Ecosystem",
};

export const BRANCH_FAMILY_DESCRIPTIONS: Record<RoadmapBranchFamily, string> = {
  product_evolution:
    "Core BETTER products from Terminal through social vaults and autonomous trading.",
  token_utility:
    "Token access gates, whale-first tiers, FDV ratchet, and agent-native utility mechanics.",
  revenue_expansion:
    "Consumer, pro, whale, and enterprise revenue streams with value-flow mapping.",
  technical_infrastructure:
    "Hyperliquid/HyperEVM, proprietary AI/RL, Polygon validators, and phased low-latency execution.",
  social_agent_ecosystem:
    "Community coordination, prediction-market social loops, OpenServ integrations, and autonomous agent frameworks.",
};

/**
 * A single roadmap node within a branch family.
 */
export interface RoadmapNode {
  /** Stable unique identifier */
  id: string;
  /** Which branch family this node belongs to */
  family: RoadmapBranchFamily;
  /** Display title */
  title: string;
  /** Current maturity status */
  status: MaturityStatus;
  /** Plain-language summary */
  summary: string;
  /** IDs of prerequisite roadmap nodes */
  dependencies: string[];
  /** What this node unlocks or enables when complete */
  unlocks: string;
  /** Evidence or source backing */
  source: SourceCue;
  /** Confidence framing for future-facing items */
  confidence?: ConfidenceFrame;
  /** Optional ordering weight within the family (lower = earlier) */
  order: number;
}

// ---------------------------------------------------------------------------
// Token Tier Schema (Whale-First)
// ---------------------------------------------------------------------------

/**
 * A single tier in the whale-first access structure.
 * Higher tiers monotonically improve all whale privileges.
 */
export interface TokenTier {
  /** Stable unique identifier */
  id: string;
  /** Display name (e.g. "Whale", "Apex Whale") */
  name: string;
  /** Minimum BETTER token holding required */
  threshold: number;
  /** How qualification is determined */
  qualificationBasis: string;
  /**
   * Access priority level (1 = lowest, higher = better).
   * Must be monotonically non-decreasing across ascending tiers.
   */
  accessPriority: number;
  /**
   * Allocation priority level.
   * Must be monotonically non-decreasing across ascending tiers.
   */
  allocationPriority: number;
  /**
   * Preview priority level.
   * Must be monotonically non-decreasing across ascending tiers.
   */
  previewPriority: number;
  /** Maximum concurrent agent slots */
  agentLimit: number;
  /**
   * Fee advantage as a decimal multiplier (1.0 = no advantage, 0.8 = 20% reduction).
   * Must be monotonically non-increasing across ascending tiers (lower = better).
   */
  feeMultiplier: number;
  /** Exclusive products or capabilities available at this tier */
  exclusiveProducts: string[];
  /** Evidence hook for the threshold value */
  source: SourceCue;
  /** Sort order (ascending by threshold) */
  order: number;
}

// ---------------------------------------------------------------------------
// Scenario Assumption Model
// ---------------------------------------------------------------------------

/**
 * The five required scenario dimensions.
 */
export type ScenarioDimension =
  | "prediction_markets"
  | "hyperliquid_hyperevm"
  | "social_vaults"
  | "ai_agent_tooling"
  | "enterprise_rails";

export const SCENARIO_DIMENSION_LABELS: Record<ScenarioDimension, string> = {
  prediction_markets: "Prediction Markets",
  hyperliquid_hyperevm: "Hyperliquid / HyperEVM",
  social_vaults: "Social Vaults",
  ai_agent_tooling: "AI-Agent Tooling",
  enterprise_rails: "Enterprise Rails",
};

/**
 * Scenario level identifiers for the three standard projections.
 */
export type ScenarioLevel = "conservative" | "base" | "upside";

export const SCENARIO_LEVEL_LABELS: Record<ScenarioLevel, string> = {
  conservative: "Conservative",
  base: "Base",
  upside: "Upside",
};

/**
 * An assumption value for a single dimension within a single scenario level.
 */
export interface DimensionAssumption {
  /** Which dimension */
  dimension: ScenarioDimension;
  /** The assumed value (semantics depend on dimension) */
  value: number;
  /** Unit or label for the value (e.g. "% market share", "$M TAM") */
  unit: string;
  /** Human-readable explanation of what this number means */
  description: string;
  /** Source/assumption cue */
  source: SourceCue;
}

/**
 * A complete scenario is a set of assumptions across all five dimensions.
 */
export interface Scenario {
  /** Scenario level */
  level: ScenarioLevel;
  /** Human-readable label */
  label: string;
  /** Short description of the scenario's thesis */
  description: string;
  /** Assumptions for each dimension */
  assumptions: DimensionAssumption[];
}

// ---------------------------------------------------------------------------
// Cost-Band Model
// ---------------------------------------------------------------------------

/**
 * Infrastructure subsystem identifiers for cost modeling.
 */
export type InfraSubsystem =
  | "ai_rl_models"
  | "polygon_validators"
  | "low_latency_execution"
  | "hyperevm_integration"
  | "data_pipeline";

export const INFRA_SUBSYSTEM_LABELS: Record<InfraSubsystem, string> = {
  ai_rl_models: "Proprietary AI / RL Models",
  polygon_validators: "Polygon Node & Validator Operations",
  low_latency_execution: "Low-Latency / Colo / FPGA Execution",
  hyperevm_integration: "HyperEVM Integration & Deployment",
  data_pipeline: "Data Pipeline & Market Intelligence",
};

/**
 * A single phase within a subsystem's cost evolution.
 */
export interface CostBandPhase {
  /** Stable unique identifier for referential integrity */
  id: string;
  /** Phase name (e.g. "Phase 1: Foundation") */
  name: string;
  /** Maturity status of this phase */
  status: MaturityStatus;
  /** Low estimate for the phase cost (USD) */
  costLow: number;
  /** High estimate for the phase cost (USD) */
  costHigh: number;
  /** What assumption or basis drives the cost range */
  assumptionBasis: string;
  /** What capability this phase unlocks */
  capabilityUnlock: string;
  /** Stable phase IDs this depends on (resolved to readable labels in the UI) */
  dependencies: string[];
  /** Source cue for the cost estimate */
  source: SourceCue;
}

/**
 * Full cost-band model for an infrastructure subsystem.
 */
export interface CostBandModel {
  /** Subsystem identifier */
  subsystem: InfraSubsystem;
  /** Display title */
  title: string;
  /** Phased cost evolution */
  phases: CostBandPhase[];
  /** Total estimated range across all phases */
  totalRangeLow: number;
  totalRangeHigh: number;
}

// ---------------------------------------------------------------------------
// Narrative Content
// ---------------------------------------------------------------------------

/**
 * A narrative block used for hero sections, story sections, and content cards.
 */
export interface NarrativeBlock {
  /** Stable unique identifier */
  id: string;
  /** Section surface (e.g. "hero", "current_scope", "vision") */
  surface: string;
  /** Display title */
  title: string;
  /** Body content (plain text or markdown) */
  body: string;
  /** Maturity status of the content subject */
  status: MaturityStatus;
  /** Evidence or source backing */
  source: SourceCue;
  /** Confidence framing for future-facing content */
  confidence?: ConfidenceFrame;
  /** Sort order within the surface */
  order: number;
}

// ---------------------------------------------------------------------------
// Projection Output
// ---------------------------------------------------------------------------

/**
 * A single projection output derived from scenario assumptions.
 */
export interface ProjectionOutput {
  /** What metric this projects */
  metric: string;
  /** Unit label (e.g. "$M", "users", "%") */
  unit: string;
  /** Conservative scenario value */
  conservative: number;
  /** Base scenario value */
  base: number;
  /** Upside scenario value */
  upside: number;
  /** Which roadmap/architecture dependencies must be live for this projection */
  dependsOn: string[];
  /** Source cue */
  source: SourceCue;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check that priorities are monotonically non-decreasing across sorted tiers */
export function validateTierMonotonicity(tiers: TokenTier[]): boolean {
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold);
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (
      curr.accessPriority < prev.accessPriority ||
      curr.allocationPriority < prev.allocationPriority ||
      curr.previewPriority < prev.previewPriority ||
      curr.agentLimit < prev.agentLimit ||
      curr.feeMultiplier > prev.feeMultiplier // fee multiplier decreases = better
    ) {
      return false;
    }
  }
  return true;
}

/** Validate that scenario outputs are logically ordered (conservative ≤ base ≤ upside) */
export function validateProjectionOrdering(
  projections: ProjectionOutput[]
): boolean {
  return projections.every(
    (p) => p.conservative <= p.base && p.base <= p.upside
  );
}

/** Calculate the total cost range for a cost-band model from its phases */
export function calculateTotalCostRange(
  phases: CostBandPhase[]
): { low: number; high: number } {
  const low = phases.reduce((sum, p) => sum + p.costLow, 0);
  const high = phases.reduce((sum, p) => sum + p.costHigh, 0);
  return { low, high };
}

// ---------------------------------------------------------------------------
// Execution Plan Model
// ---------------------------------------------------------------------------

/**
 * Public confidence label for timing windows.
 *
 * - Committed: Firm timeline with allocated resources and active execution
 * - Planned: Scheduled with a bounded window but subject to dependency resolution
 * - Directional: Intent is clear but timing depends on external factors or sequencing
 *
 * See economics.md for full definitions.
 */
export type ConfidenceLabel = "Committed" | "Planned" | "Directional";

export const CONFIDENCE_LABEL_DESCRIPTIONS: Record<ConfidenceLabel, string> = {
  Committed:
    "Firm timeline with allocated resources and active execution underway.",
  Planned:
    "Scheduled with a bounded window, but subject to dependency resolution.",
  Directional:
    "Intent is clear, but timing depends on external factors or sequencing that is not yet resolved.",
};

/**
 * A single workstream within an execution plan.
 */
export interface Workstream {
  /** Short label for the workstream */
  label: string;
  /** Whether this work is internal (AI-agent-compressible) or external (slower outside constraint) */
  nature: "internal" | "external";
  /** Brief description of what this workstream covers */
  description: string;
}

/**
 * A falsifiable proof gate — a concrete, externally observable success criterion.
 */
export interface ProofGate {
  /** Short label for the proof gate */
  label: string;
  /** Concrete, externally observable success criterion */
  criterion: string;
  /** Source cue for this proof gate */
  source: SourceCue;
}

/**
 * A bounded timing window expressed as a range or dependency-relative window.
 * Examples: "4–8 weeks after audit completion", "Q3 2026–Q4 2026"
 */
export interface TimingWindow {
  /** Human-readable timing expression (range or dependency-relative) */
  display: string;
  /** Optional structured lower bound (ISO date or relative expression) */
  lowerBound?: string;
  /** Optional structured upper bound (ISO date or relative expression) */
  upperBound?: string;
  /** The main dependency or constraint that could extend this window */
  mainConstraint?: string;
}

/**
 * Per-stage execution plan for a primary roadmap stage.
 *
 * Satisfies VAL-ROADMAP-016: Every primary roadmap stage has its own
 * dedicated execution-plan treatment with workstreams, external dependencies,
 * falsifiable proof gates, bounded timing windows, and confidence labeling.
 */
export interface ExecutionPlan {
  /** The roadmap node ID this plan belongs to */
  nodeId: string;
  /** Public confidence label: Committed / Planned / Directional */
  confidenceLabel: ConfidenceLabel;
  /** Main workstreams for this stage */
  workstreams: Workstream[];
  /** External dependencies — slower outside constraints */
  externalDependencies: string[];
  /** Falsifiable proof gates — concrete, externally observable success criteria */
  proofGates: ProofGate[];
  /** Bounded timing window for this stage */
  timingWindow: TimingWindow;
  /** Investor-facing summary of why this stage matters */
  investorSummary: string;
  /** Source cue for the overall execution plan */
  source: SourceCue;
}

/**
 * Validate that an execution plan has the required structural integrity:
 * - At least one workstream
 * - At least one proof gate
 * - A non-empty timing window
 * - At least one external dependency or an explicit note that all work is internal
 * - Workstreams include at least one internal and at least one external entry,
 *   or the externalDependencies list is non-empty to cover the external constraint requirement
 */
export function validateExecutionPlan(plan: ExecutionPlan): boolean {
  if (plan.workstreams.length === 0) return false;
  if (plan.proofGates.length === 0) return false;
  if (!plan.timingWindow.display) return false;
  if (!plan.investorSummary) return false;

  // Must distinguish internal from external:
  // Either workstreams include both natures, or externalDependencies is non-empty
  const hasInternal = plan.workstreams.some((w) => w.nature === "internal");
  const hasExternal =
    plan.workstreams.some((w) => w.nature === "external") ||
    plan.externalDependencies.length > 0;
  if (!hasInternal || !hasExternal) return false;

  return true;
}
