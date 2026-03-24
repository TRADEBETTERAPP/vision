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
  ConfidenceLabel,
  Workstream,
  ProofGate,
  TimingWindow,
  ExecutionPlan,
  UseCaseAnalysis,
} from "./types";

export {
  MATURITY_LABELS,
  MATURITY_DESCRIPTIONS,
  BRANCH_FAMILY_LABELS,
  BRANCH_FAMILY_DESCRIPTIONS,
  SCENARIO_DIMENSION_LABELS,
  SCENARIO_LEVEL_LABELS,
  INFRA_SUBSYSTEM_LABELS,
  CONFIDENCE_LABEL_DESCRIPTIONS,
  validateTierMonotonicity,
  validateProjectionOrdering,
  calculateTotalCostRange,
  validateExecutionPlan,
  validateUseCaseAnalysis,
} from "./types";

// Roadmap nodes
export {
  ROADMAP_NODES,
  getNodesByFamily,
  getNodeById,
  getDependents,
} from "./roadmap-nodes";

// Token tiers, supply, first-vault policy, whale products, referrals, revenue models
export {
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
} from "./token-tiers";
export type {
  TokenAllocation,
  FirstVaultPolicy,
  FirstVaultWorkedExample,
  ModeledWhaleProduct,
  ReferralIncentivePolicy,
  ProductFamilyRevenueModel,
} from "./token-tiers";

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
  getPhaseLabel,
  getPhaseById,
  getAllPhaseIds,
} from "./cost-bands";

// Narrative blocks
export {
  NARRATIVE_BLOCKS,
  getBlocksBySurface,
  getBlockById,
} from "./narrative";

// Graph shell nodes
export {
  GRAPH_NODES,
  getGraphNodeById,
  getRelatedGraphNodes,
  DEFAULT_GRAPH_NODE,
  parseGraphHash,
  graphNodeHash,
} from "./graph-nodes";
export type { GraphNode } from "./graph-nodes";

// Macro thesis surface content
export { MACRO_THESIS_CONTENT } from "./macro-thesis";
export type {
  MacroThesisContent,
  MacroThesisClaim,
  MacroThesisMetric,
} from "./macro-thesis";

// HFT edge surface content
export { HFT_EDGE_CONTENT } from "./hft-edge";
export type {
  HftEdgeContent,
  HftEdgeSection,
  HftEdgeMetric,
  HftEdgeFormula,
} from "./hft-edge";

// LLM product surface content
export { LLM_PRODUCT_CONTENT } from "./llm-product";
export type {
  LlmProductContent,
  LlmProductSection,
  LlmProductMetric,
} from "./llm-product";

// TRUTH-PERP & Flywheel surface content
export { TRUTH_PERP_FLYWHEEL_CONTENT } from "./truth-perp-flywheel";
export type {
  TruthPerpFlywheelContent,
  TruthPerpFlywheelSection,
  TruthPerpFlywheelMetric,
  TruthPerpFlywheelPhase,
} from "./truth-perp-flywheel";

// Execution plans
export {
  EXECUTION_PLANS,
  getExecutionPlanForNode,
  getPrimaryRoadmapStageIds,
} from "./execution-plans";

// Valuation corridors
export {
  VALUATION_CORRIDORS,
  getCorridorById,
  getLiveAnchorCorridor,
  computeImpliedTokenPrice,
  validateValuationCorridors,
} from "./valuation-corridors";
export type { ValuationCorridor } from "./valuation-corridors";

// Vault-capacity modeling and bidding allocation
export {
  computeVaultCapacityEstimate,
  computeBiddingAllocations,
  validateTotalStaked,
  DEFAULT_TOTAL_STAKED,
  WHALE_VAULT_ASSUMPTIONS,
  FIRST_VAULT_DEFAULTS,
  BIDDING_MODEL_PARAMS,
  SOCIAL_VAULT_PARAMS,
  MULTI_VAULT_PROGRESSION,
} from "./vault-capacity";
export type {
  VaultCapacityInput,
  VaultCapacityEstimate,
  WhaleVaultAssumptions,
  AssumptionRole,
  BiddingModelParams,
  SocialVaultParams,
  BiddingAllocationInput,
  StakerAllocation,
  BiddingAllocationResult,
  MultiVaultProgression,
  VaultProgressionStage,
} from "./vault-capacity";

// Use-case analyses (VAL-TOKEN-021)
export { USE_CASE_ANALYSES } from "./use-case-analyses";
