/**
 * Token Utility Surface — VAL-TOKEN-010 + VAL-TOKEN-021
 *
 * Covers the expanded agent-native token utility mechanics with full
 * use-case depth: comparable market size, revenue model, token demand
 * implications, realistic timeline, and estimated revenue range.
 *
 * Prediction market figures are backed by Dune-verified on-chain data.
 */

import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";
import type { MaturityStatus, SourceCue, ConfidenceFrame, UseCaseAnalysis } from "@/content";
import { USE_CASE_ANALYSES } from "@/content";

interface UtilityMechanic {
  id: string;
  title: string;
  status: MaturityStatus;
  description: string;
  tokenRole: string;
  source: SourceCue;
  confidence?: ConfidenceFrame;
}

const UTILITY_MECHANICS: UtilityMechanic[] = [
  {
    id: "util-copy-trading-signals",
    title: "Copy Trading & Signal Following",
    status: "live",
    description:
      "Prediction-market copy trading and signal following — BETTER's live core product. Route Polymarket and prediction-market trades through BETTER's infrastructure with signal-following intelligence.",
    tokenRole:
      "Signal access requires 50,000 BETTER (Lite) or 100,000 BETTER (Standard Terminal). Creates sustained buy-side demand from every new copy-trader.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Lite Mode copy trading with 2% per-fill fee is live now.",
    },
  },
  {
    id: "util-strategy-agents",
    title: "Strategy Agents",
    status: "planned",
    description:
      "Autonomous AI agents that execute prediction-market strategies 24/7. Agents consume BETTER tokens for execution rights, gas subsidies, and priority queue access.",
    tokenRole:
      "Agents require staked BETTER for activation. Higher tier = more agent slots + priority execution.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Planned agent-native expansion.",
    },
    confidence: {
      caveat: "Agent infrastructure depends on Terminal open access and vault readiness.",
      dependencies: ["Terminal Open Access", "Social Vaults & vBETTER"],
    },
  },
  {
    id: "util-social-vaults",
    title: "Social Vaults",
    status: "in_progress",
    description:
      "Community-created strategy vaults for collective prediction-market strategies. 25,000 BETTER minimum (¼ of quant-team standard). √-weighted bidding allocation model with 20% performance fee.",
    tokenRole:
      "Vault participation requires token holding. Higher stakes earn priority allocation via √-weighted bidding.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Social vaults in active development with 25K BETTER minimum.",
    },
    confidence: {
      caveat: "Vault infrastructure is in active development. Specific access gates are modeled policy.",
      dependencies: ["Smart Contract Audit", "Venue Integrations"],
    },
  },
  {
    id: "util-personal-ai-vaults",
    title: "Personal AI-Crafted Vaults",
    status: "planned",
    description:
      "Individually tailored AI-crafted vault strategies built around a whale's risk preferences, position sizing, and market views. Whale-tier exclusive product.",
    tokenRole:
      "Whale tier (500K BETTER) minimum. Apex (2M BETTER) gets bespoke configurations. Highest per-user token demand.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Modeled as a Whale-tier exclusive product.",
    },
    confidence: {
      caveat: "Modeled product gate, not confirmed live. Final thresholds may differ.",
      dependencies: ["Social Vault Infrastructure", "AI Model Quality"],
    },
  },
  {
    id: "util-bonded-agents",
    title: "Bonded Agent Registry",
    status: "planned",
    description:
      "Quality control via bonding: agents must stake BETTER tokens to register. Bonds are slashed for poor performance or malicious behavior, protecting delegators.",
    tokenRole:
      "BETTER tokens serve as agent quality bonds. Higher bonds signal more confidence in agent quality.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Agent quality assurance mechanism.",
    },
    confidence: {
      caveat: "Bonding parameters and slashing rules are still under design.",
      dependencies: ["Autonomous Strategy Agents"],
    },
  },
  {
    id: "util-delegation",
    title: "Agent Delegation & Backing",
    status: "planned",
    description:
      "Users delegate capital to bonded agents without running them directly. Delegators share in agent profits and losses, creating a capital-efficient agent marketplace.",
    tokenRole:
      "BETTER tokens used for delegation staking. Delegation limits scale with tier — whales can delegate more capital.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat: "Delegation mechanics depend on bonded agent registry and vault infrastructure.",
      dependencies: ["Bonded Agent Registry", "Social Vaults & vBETTER"],
    },
  },
  {
    id: "util-data-bounties",
    title: "Research & Data Bounties",
    status: "planned",
    description:
      "Community and agent bounty system: earn BETTER tokens for contributing prediction-market research, alternative data, and signal validation.",
    tokenRole:
      "BETTER tokens are the reward currency for bounty completion. Bounty access priority follows the tier ladder.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat: "Bounty economics require careful calibration to maintain quality and prevent gaming.",
      dependencies: ["Community Signal Sharing"],
    },
  },
  {
    id: "util-premium-lanes",
    title: "Premium API & Agent Lanes",
    status: "planned",
    description:
      "Dedicated high-throughput API lanes for whale-tier users and institutional agents. Lower latency, higher rate limits, and priority data feeds.",
    tokenRole:
      "Access gated by tier. Whale and Apex Whale tiers receive dedicated infrastructure lanes. BETTER tokens may be consumed for premium bandwidth.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
    confidence: {
      caveat: "Requires enterprise-grade data pipeline readiness.",
      dependencies: ["Whale-First Tier Ladder", "Enterprise-Grade Data Pipeline"],
    },
  },
  {
    id: "util-llm-credits",
    title: "LLM & Inference Credits",
    status: "speculative",
    description:
      "BETTER tokens used as credits for LLM inference and AI model access within the ecosystem. Agents and users consume credits for signal generation, research synthesis, and strategy optimization.",
    tokenRole:
      "Token burn or consumption for inference. Creates a direct link between AI utility and token demand.",
    source: {
      type: "illustrative",
      label: "BETTER Vision",
      note: "Speculative token utility — not committed to a timeline.",
    },
    confidence: {
      caveat: "Speculative long-range idea. Depends on BETTER building or licensing sufficient inference capacity.",
      dependencies: ["Full-Stack AI Intelligence"],
    },
  },
  {
    id: "util-whale-exclusives",
    title: "Whale Exclusive Products",
    status: "speculative",
    description:
      "Premium-only products available exclusively to Whale and Apex Whale tiers: private alpha signals, early vault previews, OTC facilitation, bespoke agent configurations, and curated research feeds.",
    tokenRole:
      "Access gated by Whale/Apex tier threshold. These products exist only for top-tier holders — there is no pay-to-unlock alternative.",
    source: {
      type: "illustrative",
      label: "BETTER Vision",
      note: "Speculative product concepts for maximum whale retention.",
    },
    confidence: {
      caveat: "Exploratory product ideas — none are committed to a timeline or design.",
      dependencies: ["Whale-First Tier Ladder", "Autonomous Strategy Agents"],
    },
  },
  {
    id: "util-enterprise-data-licensing",
    title: "Enterprise Data Licensing",
    status: "planned",
    description:
      "B2B data licensing and custom analytics packages for institutions. BETTER's unique prediction-market signals, vault performance data, and agent behavior datasets are licensed to hedge funds, trading desks, and research firms.",
    tokenRole:
      "Enterprise API keys require BETTER holding or staking. Institutional clients acquire large, stable positions for operational access — non-speculative demand.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Enterprise data licensing leverages BETTER's proprietary data moat from live products.",
    },
    confidence: {
      caveat: "Enterprise data products depend on sufficient proprietary data accumulation from live products and an enterprise sales infrastructure.",
      dependencies: ["Whale-First Tier Ladder", "Enterprise-Grade Data Pipeline"],
    },
  },
];

/** Look up the use-case analysis for a utility mechanic by ID */
function getAnalysisForMechanic(id: string): UseCaseAnalysis | undefined {
  return USE_CASE_ANALYSES.find((uc) => uc.id === id);
}

export default function TokenUtilitySurface() {
  return (
    <div data-testid="token-utility-surface">
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        Agent-Native Token Utility
      </h3>
      <p className="mb-4 text-sm text-secondary">
        Beyond access gating, BETTER tokens power an expanding set of
        agent-native utility mechanics — from strategy execution to delegation
        markets to AI inference credits. Each use case below includes comparable
        market sizing, revenue model analysis, and token demand implications.
      </p>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {UTILITY_MECHANICS.map((mechanic) => (
          <UtilityCard
            key={mechanic.id}
            mechanic={mechanic}
            analysis={getAnalysisForMechanic(mechanic.id)}
          />
        ))}
      </div>
    </div>
  );
}

function UtilityCard({
  mechanic,
  analysis,
}: {
  mechanic: UtilityMechanic;
  analysis?: UseCaseAnalysis;
}) {
  return (
    <LiquidMetalCard
      className="p-4"
      data-testid="utility-card"
      data-utility-id={mechanic.id}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h4 className="font-semibold text-foreground">{mechanic.title}</h4>
        <MaturityBadge status={mechanic.status} />
      </div>
      <p className="mb-3 text-sm text-secondary">{mechanic.description}</p>

      <LiquidMetalCard className="mb-3 px-3 py-2">
        <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
          Token Role
        </span>
        <p className="mt-0.5 text-sm text-secondary">{mechanic.tokenRole}</p>
      </LiquidMetalCard>

      {/* Use-case depth analysis (VAL-TOKEN-021) */}
      {analysis && <UseCaseDepthSection analysis={analysis} />}

      <EvidenceHook source={analysis?.source ?? mechanic.source} />
      {mechanic.confidence && (
        <CaveatFrame confidence={mechanic.confidence} className="mt-2" />
      )}
    </LiquidMetalCard>
  );
}

function UseCaseDepthSection({ analysis }: { analysis: UseCaseAnalysis }) {
  return (
    <div className="mb-3 space-y-2">
      {/* Comparable Market Size */}
      <LiquidMetalCard
        className="px-3 py-2"
        data-testid="use-case-market-size"
      >
        <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
          Comparable Market Size
        </span>
        <p className="mt-0.5 text-xs text-secondary">
          {analysis.comparableMarketSize}
        </p>
      </LiquidMetalCard>

      {/* Revenue Model */}
      <LiquidMetalCard
        className="px-3 py-2"
        data-testid="use-case-revenue-model"
      >
        <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
          Revenue Model
        </span>
        <p className="mt-0.5 text-xs text-secondary">
          {analysis.revenueModel}
        </p>
      </LiquidMetalCard>

      {/* Estimated Revenue Range */}
      <LiquidMetalCard
        className="px-3 py-2"
        data-testid="use-case-revenue-range"
      >
        <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-accent">
          Estimated Revenue
        </span>
        <p className="mt-0.5 font-terminal text-xs text-accent">
          {analysis.estimatedRevenueRange}
        </p>
      </LiquidMetalCard>

      {/* Token Demand Implications */}
      <LiquidMetalCard
        className="px-3 py-2"
        data-testid="use-case-token-demand"
      >
        <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
          Token Demand &amp; New Holders
        </span>
        <p className="mt-0.5 text-xs text-secondary">
          {analysis.tokenDemandImplications}
        </p>
      </LiquidMetalCard>

      {/* Realistic Timeline */}
      <LiquidMetalCard
        className="px-3 py-2"
        data-testid="use-case-timeline"
      >
        <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
          Realistic Timeline
        </span>
        <p className="mt-0.5 text-xs text-secondary">
          {analysis.realisticTimeline}
        </p>
      </LiquidMetalCard>

      {/* Key Dependencies */}
      {analysis.keyDependencies.length > 0 && (
        <LiquidMetalCard className="px-3 py-2">
          <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
            Key Dependencies
          </span>
          <ul className="mt-0.5 list-inside list-disc text-xs text-secondary">
            {analysis.keyDependencies.map((dep, i) => (
              <li key={i}>{dep}</li>
            ))}
          </ul>
        </LiquidMetalCard>
      )}
    </div>
  );
}
