/**
 * BETTER Vision Content System — barrel export.
 *
 * All typed content models, seed data, and helpers for the BETTER vision site.
 */

// Types and taxonomy
export type {
  MaturityStatus,
  SourceType,
  SourceCue,
  ConfidenceFrame,
  RoadmapBranchFamily,
  RoadmapNode,
  TokenTier,
  ScenarioDimension,
  ScenarioLevel,
  DimensionAssumption,
  Scenario,
  ProjectionOutput,
  InfraSubsystem,
  CostBandPhase,
  CostBandModel,
  NarrativeBlock,
} from "./types";

export {
  MATURITY_LABELS,
  MATURITY_DESCRIPTIONS,
  BRANCH_FAMILY_LABELS,
  BRANCH_FAMILY_DESCRIPTIONS,
  SCENARIO_DIMENSION_LABELS,
  SCENARIO_LEVEL_LABELS,
  INFRA_SUBSYSTEM_LABELS,
  validateTierMonotonicity,
  validateProjectionOrdering,
  calculateTotalCostRange,
} from "./types";

// Roadmap nodes
export {
  ROADMAP_NODES,
  getNodesByFamily,
  getNodeById,
  getDependents,
} from "./roadmap-nodes";

// Token tiers
export {
  TOKEN_TIERS,
  TOTAL_SUPPLY,
  TOKEN_ALLOCATIONS,
  getTiersSorted,
  getTierById,
  getTierForBalance,
  validateAllocations,
} from "./token-tiers";
export type { TokenAllocation } from "./token-tiers";

// Scenarios
export {
  SCENARIOS,
  PROJECTION_OUTPUTS,
  getScenario,
  getAssumption,
  getProjectionValues,
} from "./scenarios";

// Cost bands
export {
  COST_BAND_MODELS,
  getCostBandModel,
  getTotalInfraRange,
} from "./cost-bands";

// Narrative blocks
export {
  NARRATIVE_BLOCKS,
  getBlocksBySurface,
  getBlockById,
} from "./narrative";
