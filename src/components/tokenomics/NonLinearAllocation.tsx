/**
 * Non-Linear Allocation Explainer — VAL-TOKEN-006
 *
 * Explains non-linear vault allocation logic with worked examples
 * across at least two different tiers/deposit sizes.
 */

import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import type { SourceCue, ConfidenceFrame } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";

const allocationSource: SourceCue = {
  type: "scenario_based",
  label: "BETTER Tokenomics",
  note: "Non-linear allocation formula is under development. Examples are illustrative.",
};

const allocationCaveat: ConfidenceFrame = {
  caveat:
    "These formulas and examples are illustrative of the intended design direction. Final allocation curves will be calibrated before vault launch.",
  dependencies: [
    "Whale-First Tier Ladder",
    "Social Vaults & vBETTER",
  ],
};

interface AllocationExample {
  tier: string;
  deposit: string;
  tierWeight: number;
  baseAllocation: string;
  weightedAllocation: string;
  effectiveBoost: string;
}

const ALLOCATION_EXAMPLES: AllocationExample[] = [
  {
    tier: "Explorer",
    deposit: "$1,000",
    tierWeight: 1.0,
    baseAllocation: "$1,000",
    weightedAllocation: "$1,000",
    effectiveBoost: "0%",
  },
  {
    tier: "Lite",
    deposit: "$1,000",
    tierWeight: 1.1,
    baseAllocation: "$1,000",
    weightedAllocation: "$1,100",
    effectiveBoost: "+10%",
  },
  {
    tier: "Standard",
    deposit: "$5,000",
    tierWeight: 1.25,
    baseAllocation: "$5,000",
    weightedAllocation: "$6,250",
    effectiveBoost: "+25%",
  },
  {
    tier: "Whale",
    deposit: "$10,000",
    tierWeight: 1.6,
    baseAllocation: "$10,000",
    weightedAllocation: "$16,000",
    effectiveBoost: "+60%",
  },
  {
    tier: "Apex Whale",
    deposit: "$25,000",
    tierWeight: 2.0,
    baseAllocation: "$25,000",
    weightedAllocation: "$50,000",
    effectiveBoost: "+100%",
  },
];

export default function NonLinearAllocation() {
  return (
    <div data-testid="nonlinear-allocation-explainer">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Non-Linear Vault Allocation
        </h3>
        <MaturityBadge status="planned" />
      </div>
      <p className="mb-4 text-sm text-secondary">
        When vault space is scarce, allocation is not simply first-come,
        first-served. A non-linear weighting formula gives higher tiers
        disproportionately larger effective allocations, rewarding committed
        whale holders without completely excluding lower tiers.
      </p>

      <div className="mb-4">
        <EvidenceHook source={allocationSource} />
      </div>

      {/* Formula explanation */}
      <div className="mb-6 rounded-lg border border-accent/20 bg-accent/5 p-4">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-accent">
          How It Works
        </h4>
        <div className="mb-3 rounded border border-border bg-background px-4 py-3 font-terminal text-sm text-foreground">
          <code>
            Effective Allocation = Deposit × Tier Weight
          </code>
        </div>
        <p className="mb-2 text-sm text-secondary">
          Each tier has a <span className="font-semibold text-foreground">tier weight</span> that
          scales the effective allocation used to determine vault share. Higher
          tiers receive disproportionately larger weights:
        </p>
        <ul className="list-inside space-y-1 text-sm text-secondary">
          <li>
            <span className="font-terminal text-foreground">Explorer:</span> 1.0× (baseline)
          </li>
          <li>
            <span className="font-terminal text-foreground">Lite:</span> 1.1× (+10%)
          </li>
          <li>
            <span className="font-terminal text-foreground">Standard:</span> 1.25× (+25%)
          </li>
          <li>
            <span className="font-terminal text-foreground">Whale:</span> 1.6× (+60%)
          </li>
          <li>
            <span className="font-terminal text-accent">Apex Whale:</span> 2.0× (+100%)
          </li>
        </ul>
      </div>

      {/* Worked examples table */}
      <h4 className="mb-3 font-terminal text-sm font-semibold uppercase tracking-wider text-muted">
        Worked Examples
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" data-testid="allocation-examples-table">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 pr-3 font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Tier
              </th>
              <th className="pb-2 pr-3 text-right font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Deposit
              </th>
              <th className="pb-2 pr-3 text-right font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Weight
              </th>
              <th className="pb-2 pr-3 text-right font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Effective
              </th>
              <th className="pb-2 font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Boost
              </th>
            </tr>
          </thead>
          <tbody>
            {ALLOCATION_EXAMPLES.map((ex) => (
              <tr
                key={ex.tier}
                className="border-b border-border/50"
                data-testid="allocation-example-row"
              >
                <td className="py-2.5 pr-3 font-medium text-foreground">
                  {ex.tier}
                </td>
                <td className="py-2.5 pr-3 text-right font-terminal text-secondary">
                  {ex.deposit}
                </td>
                <td className="py-2.5 pr-3 text-right font-terminal text-secondary">
                  {ex.tierWeight}×
                </td>
                <td className="py-2.5 pr-3 text-right font-terminal text-accent">
                  {ex.weightedAllocation}
                </td>
                <td className="py-2.5 font-terminal text-xs text-accent">
                  {ex.effectiveBoost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key takeaway */}
      <div className="mt-4 rounded-lg border border-border bg-surface p-4">
        <h4 className="mb-2 font-terminal text-xs font-semibold uppercase tracking-wider text-muted">
          Key Takeaway
        </h4>
        <p className="text-sm text-secondary">
          An Apex Whale depositing $25,000 receives <span className="font-semibold text-accent">$50,000</span> in
          effective allocation weight — double their deposit. A Standard holder
          depositing $5,000 receives <span className="font-semibold text-foreground">$6,250</span> in
          effective weight. This non-linear curve ensures whale-tier holders
          have meaningful priority in scarce vault allocations without
          completely blocking lower tiers.
        </p>
      </div>

      <CaveatFrame confidence={allocationCaveat} className="mt-4" />
    </div>
  );
}
