/**
 * Fee-Stack Examples & Value-Flow Mapping — VAL-TOKEN-009
 *
 * Separately explains trading taxes, Lite Mode fees, vault performance fees,
 * whale premium fee advantages, and future revenue lines.
 * Maps consumer, pro, whale, and enterprise value flows to treasury/sinks.
 */

import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import type { MaturityStatus, SourceCue, ConfidenceFrame } from "@/content";

// ---------------------------------------------------------------------------
// Fee Stack
// ---------------------------------------------------------------------------

interface FeeItem {
  title: string;
  status: MaturityStatus;
  description: string;
  example: string;
  source: SourceCue;
}

const FEE_STACK: FeeItem[] = [
  {
    title: "Trading Tax (Buy/Sell)",
    status: "live",
    description:
      "2% buy tax and 2% sell tax on the Aerodrome LP path. Applies to every BETTER token swap.",
    example:
      "Buying 100,000 BETTER costs 2,000 BETTER in tax → treasury. Selling 100,000 BETTER costs another 2,000 BETTER.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      href: "https://docs.tradebetter.app",
      asOf: "2026-Q1",
    },
  },
  {
    title: "Lite Mode Per-Fill Fee",
    status: "live",
    description:
      "2% nominal fee charged on each Lite Mode prediction-market fill. Applies instead of the full Terminal token requirement.",
    example:
      "A $500 Polymarket fill through Lite Mode costs $10 in fees → protocol revenue.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      href: "https://docs.tradebetter.app",
      asOf: "2026-Q1",
    },
  },
  {
    title: "Vault Performance Fee",
    status: "in_progress",
    description:
      "Performance-based fee on social vault profits. Aligns vault manager incentives with depositor outcomes.",
    example:
      "A vault generates $50,000 in profit → 20% performance fee ($10,000) split between manager and protocol.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "20% performance fee on profit-only withdrawals with wallet-level high-water mark.",
      asOf: "2026-Q1",
    },
  },
  {
    title: "Whale Premium Fee Advantage",
    status: "in_progress",
    description:
      "Whale and Apex Whale tiers receive fee reductions across all fee types. Lower multiplier = larger discount.",
    example:
      "Apex Whale (0.75× multiplier): $500 fill → $7.50 fee instead of $10. Whale (0.85×): $500 fill → $8.50 fee.",
    source: {
      type: "scenario_based",
      label: "BETTER Tokenomics",
      note: "Fee multipliers are illustrative.",
    },
  },
  {
    title: "Agent Transaction Fees",
    status: "planned",
    description:
      "Fees on autonomous agent transactions, delegation bonds, and agent registry operations.",
    example:
      "Agent executes 100 fills/day × $0.50 avg. fee → $50/day in agent-sourced protocol revenue.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },
  {
    title: "Enterprise Data & API Licensing",
    status: "planned",
    description:
      "B2B licensing of BETTER's prediction-market intelligence and premium API access for institutional clients.",
    example:
      "Enterprise data subscription: $5,000–$50,000/month depending on data tier and SLA level.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },
];

// ---------------------------------------------------------------------------
// Value Flows
// ---------------------------------------------------------------------------

interface ValueFlow {
  segment: string;
  status: MaturityStatus;
  sources: string[];
  destination: string;
  description: string;
}

const VALUE_FLOWS: ValueFlow[] = [
  {
    segment: "Consumer",
    status: "live",
    sources: [
      "Trading tax on token swaps",
      "Lite Mode per-fill fees",
    ],
    destination: "Protocol treasury",
    description:
      "Retail users generate revenue through trading tax and Lite Mode usage fees. This is the primary current revenue source.",
  },
  {
    segment: "Pro / Prosumer",
    status: "in_progress",
    sources: [
      "Vault performance fees",
      "Standard Terminal access (token holding)",
      "Agent transaction fees (when live)",
    ],
    destination: "Treasury + vault manager rewards + token sinks",
    description:
      "Active traders and vault managers generate performance-based revenue. Token holding acts as a demand sink.",
  },
  {
    segment: "Whale",
    status: "in_progress",
    sources: [
      "Premium tier fee flow (reduced but high-volume)",
      "Priority allocation demand",
      "Whale premium subscriptions (planned)",
      "Agent delegation fees",
    ],
    destination: "Treasury + reinvestment pool + burn mechanics",
    description:
      "Whale-tier users trade at reduced fees but at much higher volumes, generating significant net revenue. Premium features create additional high-margin streams.",
  },
  {
    segment: "Enterprise",
    status: "planned",
    sources: [
      "Data licensing subscriptions",
      "Premium API lane access",
      "Custom model/signal packages",
    ],
    destination: "Treasury + infrastructure reinvestment",
    description:
      "Institutional clients pay for data, API access, and model licensing. High-margin B2B revenue diversifies beyond consumer trading.",
  },
];

const flowCaveat: ConfidenceFrame = {
  caveat:
    "Revenue flows labeled Planned or In Progress are subject to change. Fee rates, allocation splits, and enterprise pricing are illustrative.",
  dependencies: [
    "Whale-First Tier Ladder",
    "Social Vaults & vBETTER",
    "Enterprise Data & API Licensing",
  ],
};

export default function FeeStackValueFlow() {
  return (
    <div data-testid="fee-stack-value-flow">
      {/* Fee Stack */}
      <div className="mb-8">
        <h3 className="mb-1 text-lg font-semibold text-foreground">
          Fee Stack Breakdown
        </h3>
        <p className="mb-4 text-sm text-secondary">
          Each fee type is separately explained with a worked example showing
          how it flows to protocol revenue.
        </p>

        <div className="space-y-3">
          {FEE_STACK.map((fee) => (
            <div
              key={fee.title}
              className="rounded-lg border border-border bg-surface p-4"
              data-testid="fee-item"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-foreground">{fee.title}</h4>
                <MaturityBadge status={fee.status} />
              </div>
              <p className="mb-2 text-sm text-secondary">{fee.description}</p>
              <div className="rounded border border-border bg-background px-3 py-2" data-testid="fee-example">
                <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
                  Worked Example
                </span>
                <p className="mt-0.5 text-sm text-secondary">{fee.example}</p>
              </div>
              <div className="mt-2">
                <EvidenceHook source={fee.source} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Flow Mapping */}
      <div>
        <h3 className="mb-1 text-lg font-semibold text-foreground">
          Revenue &amp; Value-Flow Mapping
        </h3>
        <p className="mb-4 text-sm text-secondary">
          How consumer, pro, whale, and enterprise segments feed protocol revenue,
          token sinks, and reinvestment — each with explicit maturity labels.
        </p>

        <div className="space-y-4">
          {VALUE_FLOWS.map((flow) => (
            <div
              key={flow.segment}
              className="rounded-lg border border-border bg-surface p-4"
              data-testid="value-flow-card"
            >
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h4 className="font-semibold text-foreground">
                  {flow.segment}
                </h4>
                <MaturityBadge status={flow.status} />
                <span className="font-terminal text-xs text-muted">
                  → {flow.destination}
                </span>
              </div>
              <p className="mb-3 text-sm text-secondary">{flow.description}</p>
              <div>
                <span className="font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                  Revenue Sources
                </span>
                <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm text-secondary">
                  {flow.sources.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <CaveatFrame confidence={flowCaveat} className="mt-4" />
      </div>
    </div>
  );
}
