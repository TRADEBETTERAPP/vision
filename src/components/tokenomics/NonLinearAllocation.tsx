/**
 * Non-Linear Allocation Explainer — VAL-TOKEN-006
 *
 * Explains the √-weighted bidding allocation model with worked examples
 * across at least two different stake sizes, showing how square-root tapering
 * compresses whale advantage while still rewarding larger stakes.
 */

import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import type { SourceCue, ConfidenceFrame } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";

const allocationSource: SourceCue = {
  type: "canonical",
  label: "BETTER Vault Bidding Model",
  note: "√-weighted bidding allocation with hard per-staker cap and $100 USDC minimum floor. See vault policy for full model details.",
  asOf: "2026-Q1",
};

const allocationCaveat: ConfidenceFrame = {
  caveat:
    "These examples demonstrate the √-weighted bidding model using the first vault ($25,000 total cap). Future vault caps are set case-by-case and will produce different allocation distributions. The core √-tapering mechanism, per-staker cap, and $100 floor remain consistent across all quant-team vaults.",
  dependencies: [
    "Whale-First Tier Ladder",
    "Bidding Allocation Infrastructure",
    "Social Vaults & vBETTER",
  ],
};

interface AllocationExample {
  label: string;
  stake: string;
  stakeNum: number;
  sqrtWeight: string;
  pureProportional: string;
  biddingAllocation: string;
  compression: string;
}

const ALLOCATION_EXAMPLES: AllocationExample[] = [
  {
    label: "Minimum Staker",
    stake: "100,000",
    stakeNum: 100_000,
    sqrtWeight: "316",
    pureProportional: "$169 (0.7%)",
    biddingAllocation: "$585 (2.3%)",
    compression: "3.5× boost",
  },
  {
    label: "Medium Holder",
    stake: "500,000",
    stakeNum: 500_000,
    sqrtWeight: "707",
    pureProportional: "$845 (3.4%)",
    biddingAllocation: "$1,308 (5.2%)",
    compression: "1.5× boost",
  },
  {
    label: "Large Holder",
    stake: "2,000,000",
    stakeNum: 2_000_000,
    sqrtWeight: "1,414",
    pureProportional: "$3,378 (13.5%)",
    biddingAllocation: "$2,616 (10.5%)",
    compression: "0.8× compression",
  },
  {
    label: "Largest Holder",
    stake: "13,000,000",
    stakeNum: 13_000_000,
    sqrtWeight: "3,606",
    pureProportional: "$21,959 (87.8%)",
    biddingAllocation: "$5,000 (20.0%)",
    compression: "0.23× compression (capped)",
  },
];

export default function NonLinearAllocation() {
  return (
    <div data-testid="nonlinear-allocation-explainer">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          √-Weighted Vault Allocation
        </h3>
        <MaturityBadge status="in_progress" />
      </div>
      <p className="mb-4 text-sm text-secondary">
        Vault allocation uses a <strong>√-weighted bidding model</strong> instead of pure proportional
        allocation. Square-root tapering compresses whale allocations, the per-staker cap bounds
        maximum individual exposure, and the $100 floor guarantees meaningful participation for
        every qualifying staker.
      </p>

      <div className="mb-4">
        <EvidenceHook source={allocationSource} />
      </div>

      {/* Formula explanation */}
      <LiquidMetalCard className="mb-6 p-4">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-accent">
          How It Works
        </h4>
        <div className="mb-3 rounded border border-border bg-background px-4 py-3 font-terminal text-sm text-foreground">
          <code>
            Weight = √(Staked BETTER) &nbsp;|&nbsp; Cap = max(V/N, V×20%) &nbsp;|&nbsp; Floor = $100
          </code>
        </div>
        <p className="mb-2 text-sm text-secondary">
          The <span className="font-semibold text-foreground">square root</span> of each staker&apos;s
          BETTER commitment determines their weight. This creates diminishing returns for larger stakes:
        </p>
        <ul className="list-inside space-y-1 text-sm text-secondary">
          <li>
            <span className="font-terminal text-foreground">100K BETTER:</span> √100,000 = 316 weight
          </li>
          <li>
            <span className="font-terminal text-foreground">1M BETTER:</span> √1,000,000 = 1,000 weight (10× stake → 3.2× weight)
          </li>
          <li>
            <span className="font-terminal text-accent">13M BETTER:</span> √13,000,000 = 3,606 weight (130× stake → 11.4× weight)
          </li>
        </ul>
        <p className="mt-2 text-xs text-muted">
          A 130× difference in stake translates to only an 11.4× difference in allocation weight.
        </p>
      </LiquidMetalCard>

      {/* Worked examples table — 20-staker scenario */}
      <h4 className="mb-3 font-terminal text-sm font-semibold uppercase tracking-wider text-muted">
        Worked Examples (20-Staker Scenario, $25K Vault)
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" data-testid="allocation-examples-table">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 pr-3 font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Staker
              </th>
              <th className="pb-2 pr-3 text-right font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                BETTER Staked
              </th>
              <th className="pb-2 pr-3 text-right font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                √-Weight
              </th>
              <th className="pb-2 pr-3 text-right font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Pure Proportional
              </th>
              <th className="pb-2 pr-3 text-right font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                √-Bidding Alloc
              </th>
              <th className="pb-2 font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Effect
              </th>
            </tr>
          </thead>
          <tbody>
            {ALLOCATION_EXAMPLES.map((ex) => (
              <tr
                key={ex.label}
                className="border-b border-border/50"
                data-testid="allocation-example-row"
              >
                <td className="py-2.5 pr-3 font-medium text-foreground">
                  {ex.label}
                </td>
                <td className="py-2.5 pr-3 text-right font-terminal text-secondary">
                  {ex.stake}
                </td>
                <td className="py-2.5 pr-3 text-right font-terminal text-secondary">
                  {ex.sqrtWeight}
                </td>
                <td className="py-2.5 pr-3 text-right font-terminal text-muted">
                  {ex.pureProportional}
                </td>
                <td className="py-2.5 pr-3 text-right font-terminal font-semibold text-accent">
                  {ex.biddingAllocation}
                </td>
                <td className="py-2.5 font-terminal text-xs text-accent">
                  {ex.compression}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Key takeaway */}
      <LiquidMetalCard className="mt-4 p-4">
        <h4 className="mb-2 font-terminal text-xs font-semibold uppercase tracking-wider text-muted">
          Key Takeaway
        </h4>
        <p className="text-sm text-secondary">
          Under pure proportional allocation, the largest holder would take{" "}
          <span className="font-semibold text-foreground">87.8%</span> of the vault. The √-weighted bidding model
          compresses this to <span className="font-semibold text-accent">20%</span> (capped), while a minimum staker&apos;s
          share increases from 0.7% to <span className="font-semibold text-accent">2.3%</span>. Staking more still earns meaningfully
          more allocation, but the advantage tapers — creating a fairer distribution while preserving whale incentives.
        </p>
      </LiquidMetalCard>

      <CaveatFrame confidence={allocationCaveat} className="mt-4" />
    </div>
  );
}
