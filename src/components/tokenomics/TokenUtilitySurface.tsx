/**
 * Token Utility Surface — VAL-TOKEN-010
 *
 * Covers the expanded agent-native token utility mechanics:
 * strategy agents, bonded agent registry, delegation/backing,
 * research/data bounties, premium API/agent lanes, LLM/inference credits,
 * and exclusive whale products.
 */

import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import type { MaturityStatus, SourceCue, ConfidenceFrame } from "@/content";

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
];

export default function TokenUtilitySurface() {
  return (
    <div data-testid="token-utility-surface">
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        Agent-Native Token Utility
      </h3>
      <p className="mb-4 text-sm text-secondary">
        Beyond access gating, BETTER tokens power an expanding set of
        agent-native utility mechanics — from strategy execution to delegation
        markets to AI inference credits.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {UTILITY_MECHANICS.map((mechanic) => (
          <UtilityCard key={mechanic.id} mechanic={mechanic} />
        ))}
      </div>
    </div>
  );
}

function UtilityCard({ mechanic }: { mechanic: UtilityMechanic }) {
  return (
    <div
      className="rounded-lg border border-border bg-surface p-4"
      data-testid="utility-card"
      data-utility-id={mechanic.id}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <h4 className="font-semibold text-foreground">{mechanic.title}</h4>
        <MaturityBadge status={mechanic.status} />
      </div>
      <p className="mb-3 text-sm text-secondary">{mechanic.description}</p>

      <div className="mb-3 rounded border border-accent/20 bg-accent/5 px-3 py-2">
        <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
          Token Role
        </span>
        <p className="mt-0.5 text-sm text-secondary">{mechanic.tokenRole}</p>
      </div>

      <EvidenceHook source={mechanic.source} />
      {mechanic.confidence && (
        <CaveatFrame confidence={mechanic.confidence} className="mt-2" />
      )}
    </div>
  );
}
