/**
 * Referral Incentives — VAL-TOKEN-013
 *
 * Explains payout source, caps, anti-abuse measures, and sustainability logic
 * for the BETTER referral program.
 */

import { REFERRAL_INCENTIVE_POLICY } from "@/content";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import MaturityBadge from "@/components/MaturityBadge";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";
import type { ConfidenceFrame } from "@/content";

const referralCaveat: ConfidenceFrame = {
  caveat:
    "The referral incentive structure is modeled policy. Final rates, caps, qualification windows, and anti-abuse parameters will be calibrated before launch.",
  dependencies: [
    "Treasury Allocation",
    "Trading Tax Revenue",
    "Social Vaults & vBETTER",
  ],
};

export default function ReferralIncentives() {
  const policy = REFERRAL_INCENTIVE_POLICY;

  return (
    <div data-testid="referral-incentives">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Sustainable Referral Incentives
        </h3>
        <MaturityBadge status={policy.maturity} />
      </div>
      <p className="mb-4 text-sm text-secondary">
        The BETTER referral program is designed to be sustainable — funded from
        existing protocol revenue rather than inflationary issuance, with
        explicit caps to prevent runaway payouts.
      </p>

      <div className="mb-4">
        <EvidenceHook source={policy.source} />
      </div>

      {/* Payout Source */}
      <LiquidMetalCard className="mb-4 p-4" data-testid="referral-payout-source">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-foreground">
          Payout Source
        </h4>
        <p className="text-sm text-secondary">{policy.rewardSourceDescription}</p>
      </LiquidMetalCard>

      {/* Reward Basis */}
      <LiquidMetalCard className="mb-4 p-4" data-testid="referral-reward-basis">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-foreground">
          How Rewards Are Earned
        </h4>
        <p className="text-sm text-secondary">{policy.rewardBasis}</p>
      </LiquidMetalCard>

      {/* Caps */}
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <LiquidMetalCard className="p-4" data-testid="referral-cap-per-referrer">
          <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
            Per-Referrer Cap
          </span>
          <p className="mt-1 text-sm text-secondary">{policy.payoutCapPerReferrer}</p>
        </LiquidMetalCard>
        <LiquidMetalCard className="p-4" data-testid="referral-cap-per-referral">
          <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
            Per-Referral Cap
          </span>
          <p className="mt-1 text-sm text-secondary">{policy.payoutCapPerReferral}</p>
        </LiquidMetalCard>
      </div>

      {/* Anti-Abuse Measures */}
      <LiquidMetalCard className="mb-4 p-4" data-testid="referral-anti-abuse">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-foreground">
          Anti-Abuse Measures
        </h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-secondary">
          {policy.antiAbuseMeasures.map((measure, i) => (
            <li key={i}>{measure}</li>
          ))}
        </ul>
      </LiquidMetalCard>

      {/* Sustainability Logic */}
      <LiquidMetalCard className="p-4" data-testid="referral-sustainability">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-accent">
          Sustainability Logic
        </h4>
        <p className="text-sm text-secondary">{policy.sustainabilityLogic}</p>
      </LiquidMetalCard>

      <CaveatFrame confidence={referralCaveat} className="mt-4" />
    </div>
  );
}
