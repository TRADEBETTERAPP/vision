/**
 * Seed data: Infrastructure cost-band models.
 *
 * Each subsystem has phased cost evolution with:
 * - Rough cost ranges (not false precision)
 * - Assumption basis for each estimate
 * - Capability unlock descriptions
 * - Dependency sequencing
 *
 * Source: Mission guidance + illustrative infrastructure estimates.
 */

import {
  CostBandModel,
  CostBandPhase,
  InfraSubsystem,
  SourceCue,
  calculateTotalCostRange,
} from "./types";

const illustrativeSource: SourceCue = {
  type: "illustrative",
  label: "BETTER Infrastructure Estimates",
  note:
    "Rough order-of-magnitude ranges — not budgets. Actual costs depend on vendor selection, scale, and timing.",
};

const scenarioSource: SourceCue = {
  type: "scenario_based",
  label: "BETTER Roadmap",
  note: "Cost estimates derived from comparable infrastructure deployments.",
};

// ---------------------------------------------------------------------------
// AI/RL Models
// ---------------------------------------------------------------------------

const aiRlPhases: CostBandPhase[] = [
  {
    id: "cb-ai-rl-phase1",
    name: "Phase 1: Foundation Models",
    status: "live",
    costLow: 50_000,
    costHigh: 150_000,
    assumptionBasis:
      "Cloud GPU rental and fine-tuning of open-source models. Based on current operational costs.",
    capabilityUnlock:
      "Baseline signal generation powering Terminal predictions.",
    dependencies: [],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Current operational AI/ML infrastructure.",
      asOf: "2026-Q1",
    },
  },
  {
    id: "cb-ai-rl-phase2",
    name: "Phase 2: Proprietary Training",
    status: "planned",
    costLow: 500_000,
    costHigh: 2_000_000,
    assumptionBasis:
      "Dedicated GPU cluster lease (6–12 months) for training on accumulated prediction-market data.",
    capabilityUnlock:
      "Differentiated models trained on BETTER's proprietary data — not replicable by competitors without equivalent data accumulation.",
    dependencies: ["cb-ai-rl-phase1"],
    source: scenarioSource,
  },
  {
    id: "cb-ai-rl-phase3",
    name: "Phase 3: Full-Stack Intelligence",
    status: "speculative",
    costLow: 2_000_000,
    costHigh: 10_000_000,
    assumptionBasis:
      "Large-scale compute for multi-domain models, LLM fine-tuning, and inference infrastructure at scale.",
    capabilityUnlock:
      "BETTER as a platform intelligence provider: LLM credits, inference marketplace, and cross-market AI capabilities.",
    dependencies: ["cb-ai-rl-phase2"],
    source: illustrativeSource,
  },
];

// ---------------------------------------------------------------------------
// Polygon Validators
// ---------------------------------------------------------------------------

const polygonPhases: CostBandPhase[] = [
  {
    id: "cb-polygon-phase1",
    name: "Phase 1: Full Node Operations",
    status: "planned",
    costLow: 20_000,
    costHigh: 80_000,
    assumptionBasis:
      "Dedicated bare-metal servers for Polygon full nodes — operational cost per year including bandwidth.",
    capabilityUnlock:
      "Direct chain access, reduced RPC latency, and independent transaction verification.",
    dependencies: [],
    source: scenarioSource,
  },
  {
    id: "cb-polygon-phase2",
    name: "Phase 2: Validator Operations",
    status: "speculative",
    costLow: 100_000,
    costHigh: 500_000,
    assumptionBasis:
      "Staking capital requirement plus operational overhead for running Polygon validators. Range depends on stake size.",
    capabilityUnlock:
      "Validator staking rewards, protocol-level influence, and deeper network reliability.",
    dependencies: ["cb-polygon-phase1"],
    source: illustrativeSource,
  },
];

// ---------------------------------------------------------------------------
// Low-Latency Execution
// ---------------------------------------------------------------------------

const lowLatencyPhases: CostBandPhase[] = [
  {
    id: "cb-low-latency-phase1",
    name: "Phase 1: Co-Location",
    status: "planned",
    costLow: 100_000,
    costHigh: 300_000,
    assumptionBasis:
      "Co-located rack space near major exchange and chain infrastructure. Annual lease and connectivity costs.",
    capabilityUnlock:
      "Meaningful execution speed advantage for BETTER agents over non-colocated competitors.",
    dependencies: [],
    source: scenarioSource,
  },
  {
    id: "cb-low-latency-phase2",
    name: "Phase 2: FPGA Acceleration",
    status: "speculative",
    costLow: 500_000,
    costHigh: 3_000_000,
    assumptionBasis:
      "FPGA hardware, custom firmware development, and integration with co-located infrastructure.",
    capabilityUnlock:
      "HFT-grade ultra-low-latency execution — structural speed advantage for BETTER's entire agent fleet.",
    dependencies: ["cb-low-latency-phase1"],
    source: illustrativeSource,
  },
];

// ---------------------------------------------------------------------------
// HyperEVM Integration
// ---------------------------------------------------------------------------

const hyperEvmPhases: CostBandPhase[] = [
  {
    id: "cb-hyperevm-phase1",
    name: "Phase 1: Contract Deployment",
    status: "in_progress",
    costLow: 30_000,
    costHigh: 100_000,
    assumptionBasis:
      "Smart contract development, security audits, and initial deployment on HyperEVM.",
    capabilityUnlock:
      "BETTER contracts live on HyperEVM — enables Hyperliquid-native prediction markets.",
    dependencies: [],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "HyperEVM integration is actively being built.",
      asOf: "2026-Q1",
    },
  },
  {
    id: "cb-hyperevm-phase2",
    name: "Phase 2: Full Cross-Chain Execution",
    status: "planned",
    costLow: 100_000,
    costHigh: 400_000,
    assumptionBasis:
      "Cross-chain bridge infrastructure, multi-chain order routing, and ongoing audit costs.",
    capabilityUnlock:
      "Seamless cross-chain execution between Polygon, HyperEVM, and future chains.",
    dependencies: ["cb-hyperevm-phase1"],
    source: scenarioSource,
  },
];

// ---------------------------------------------------------------------------
// Data Pipeline
// ---------------------------------------------------------------------------

const dataPipelinePhases: CostBandPhase[] = [
  {
    id: "cb-data-pipeline-phase1",
    name: "Phase 1: Core Collection",
    status: "live",
    costLow: 20_000,
    costHigh: 60_000,
    assumptionBasis:
      "Cloud infrastructure for data ingestion, processing, and storage. Current operational baseline.",
    capabilityUnlock:
      "Raw data foundation powering all BETTER intelligence products.",
    dependencies: [],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Current data pipeline supporting Terminal.",
      asOf: "2026-Q1",
    },
  },
  {
    id: "cb-data-pipeline-phase2",
    name: "Phase 2: Enterprise-Grade Pipeline",
    status: "planned",
    costLow: 200_000,
    costHigh: 800_000,
    assumptionBasis:
      "Institutional-grade data pipeline: SLA monitoring, audit trails, API gateway, and scale-out storage.",
    capabilityUnlock:
      "Institutional-quality data products for B2B licensing and enterprise API access.",
    dependencies: ["cb-data-pipeline-phase1"],
    source: scenarioSource,
  },
];

// ---------------------------------------------------------------------------
// Build & Export Models
// ---------------------------------------------------------------------------

function buildModel(
  subsystem: InfraSubsystem,
  title: string,
  phases: CostBandPhase[]
): CostBandModel {
  const { low, high } = calculateTotalCostRange(phases);
  return {
    subsystem,
    title,
    phases,
    totalRangeLow: low,
    totalRangeHigh: high,
  };
}

export const COST_BAND_MODELS: CostBandModel[] = [
  buildModel("ai_rl_models", "Proprietary AI / RL Models", aiRlPhases),
  buildModel(
    "polygon_validators",
    "Polygon Node & Validator Operations",
    polygonPhases
  ),
  buildModel(
    "low_latency_execution",
    "Low-Latency / Colo / FPGA Execution",
    lowLatencyPhases
  ),
  buildModel(
    "hyperevm_integration",
    "HyperEVM Integration & Deployment",
    hyperEvmPhases
  ),
  buildModel(
    "data_pipeline",
    "Data Pipeline & Market Intelligence",
    dataPipelinePhases
  ),
];

/** Get a cost-band model by subsystem */
export function getCostBandModel(
  subsystem: InfraSubsystem
): CostBandModel | undefined {
  return COST_BAND_MODELS.find((m) => m.subsystem === subsystem);
}

/** Resolve a cost-band phase ID to its human-readable name */
export function getPhaseLabel(phaseId: string): string {
  for (const model of COST_BAND_MODELS) {
    const phase = model.phases.find((p) => p.id === phaseId);
    if (phase) return phase.name;
  }
  return phaseId;
}

/** Get a cost-band phase by its stable ID */
export function getPhaseById(phaseId: string): CostBandPhase | undefined {
  for (const model of COST_BAND_MODELS) {
    const phase = model.phases.find((p) => p.id === phaseId);
    if (phase) return phase;
  }
  return undefined;
}

/** Get all phase IDs across all cost-band models */
export function getAllPhaseIds(): string[] {
  return COST_BAND_MODELS.flatMap((m) => m.phases.map((p) => p.id));
}

/** Get the total infrastructure investment range across all subsystems */
export function getTotalInfraRange(): { low: number; high: number } {
  const low = COST_BAND_MODELS.reduce((sum, m) => sum + m.totalRangeLow, 0);
  const high = COST_BAND_MODELS.reduce((sum, m) => sum + m.totalRangeHigh, 0);
  return { low, high };
}
