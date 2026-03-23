/**
 * Whale-First Tier Ladder — VAL-TOKEN-002, VAL-TOKEN-003
 *
 * Renders the token tier ladder in ascending order with thresholds,
 * eligibility rules, and monotonically improving benefits across tiers.
 */

import { getTiersSorted, type TokenTier } from "@/content";
import EvidenceHook from "@/components/EvidenceHook";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";

/** Format a large number with commas */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** Format fee multiplier as percentage advantage */
function formatFeeAdvantage(multiplier: number): string {
  if (multiplier >= 1.0) return "Standard fees";
  const advantage = Math.round((1 - multiplier) * 100);
  return `${advantage}% fee reduction`;
}

export default function TierLadder() {
  const tiers = getTiersSorted();

  return (
    <div data-testid="tier-ladder">
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        Whale-First Tier Ladder
      </h3>
      <p className="mb-4 text-sm text-secondary">
        Higher BETTER holdings unlock monotonically improving access, allocation,
        preview, agent, and fee advantages. No tier silently loses privileges
        available at a lower level.
      </p>

      {/* Tier comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" data-testid="tier-comparison-table">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 pr-3 font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Tier
              </th>
              <th className="pb-2 pr-3 text-right font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Threshold
              </th>
              <th className="pb-2 pr-3 text-center font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Access
              </th>
              <th className="pb-2 pr-3 text-center font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Allocation
              </th>
              <th className="pb-2 pr-3 text-center font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Preview
              </th>
              <th className="pb-2 pr-3 text-center font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Agents
              </th>
              <th className="pb-2 pr-3 font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Fee Advantage
              </th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, index) => (
              <TierRow key={tier.id} tier={tier} isHighest={index === tiers.length - 1} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Tier detail cards */}
      <div className="mt-6 space-y-3">
        {tiers.map((tier) => (
          <TierDetailCard key={tier.id} tier={tier} />
        ))}
      </div>
    </div>
  );
}

function TierRow({ tier, isHighest }: { tier: TokenTier; isHighest: boolean }) {
  return (
    <tr
      className={`border-b border-border/50 ${isHighest ? "bg-accent/5" : ""}`}
      data-testid="tier-row"
      data-tier-id={tier.id}
    >
      <td className="py-3 pr-3">
        <span className={`font-semibold ${isHighest ? "text-accent" : "text-foreground"}`}>
          {tier.name}
        </span>
      </td>
      <td className="py-3 pr-3 text-right font-terminal text-secondary">
        {tier.threshold === 0 ? "None" : `≥ ${formatNumber(tier.threshold)}`}
      </td>
      <td className="py-3 pr-3 text-center">
        <PriorityIndicator level={tier.accessPriority} max={5} />
      </td>
      <td className="py-3 pr-3 text-center">
        <PriorityIndicator level={tier.allocationPriority} max={7} />
      </td>
      <td className="py-3 pr-3 text-center">
        <PriorityIndicator level={tier.previewPriority} max={5} />
      </td>
      <td className="py-3 pr-3 text-center font-terminal text-secondary">
        {tier.agentLimit === 0 ? "—" : tier.agentLimit}
      </td>
      <td className="py-3 pr-3 font-terminal text-xs">
        <span className={tier.feeMultiplier < 1 ? "text-accent" : "text-muted"}>
          {formatFeeAdvantage(tier.feeMultiplier)}
        </span>
      </td>
    </tr>
  );
}

function PriorityIndicator({ level, max }: { level: number; max: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5" aria-label={`Priority ${level} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            i < level ? "bg-accent" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function TierDetailCard({ tier }: { tier: TokenTier }) {
  const isWhaleOrAbove = tier.feeMultiplier < 1;

  return (
    <LiquidMetalCard
      className={`p-4 ${
        isWhaleOrAbove ? "ring-1 ring-[rgba(255,255,255,0.20)]" : ""
      }`}
      data-testid="tier-detail-card"
      data-tier-id={tier.id}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h4 className={`text-base font-semibold ${isWhaleOrAbove ? "text-accent" : "text-foreground"}`}>
          {tier.name}
        </h4>
        <span className="font-terminal text-xs text-secondary">
          {tier.threshold === 0 ? "No minimum" : `≥ ${formatNumber(tier.threshold)} BETTER`}
        </span>
        <EvidenceHook source={tier.source} />
      </div>

      <p className="mt-2 text-sm text-secondary">{tier.qualificationBasis}</p>

      {/* Benefit grid */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <BenefitItem label="Access Priority" value={`Level ${tier.accessPriority}`} />
        <BenefitItem label="Allocation Priority" value={`Level ${tier.allocationPriority}`} />
        <BenefitItem label="Preview Priority" value={tier.previewPriority === 0 ? "None" : `Level ${tier.previewPriority}`} />
        <BenefitItem label="Agent Slots" value={tier.agentLimit === 0 ? "None" : `${tier.agentLimit} concurrent`} />
        <BenefitItem
          label="Fee Advantage"
          value={formatFeeAdvantage(tier.feeMultiplier)}
          highlight={tier.feeMultiplier < 1}
        />
      </div>

      {/* Exclusive products */}
      {tier.exclusiveProducts.length > 0 && (
        <div className="mt-3">
          <p className="font-terminal text-xs font-medium uppercase tracking-wider text-muted">
            Exclusive Products
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {tier.exclusiveProducts.map((product) => (
              <span
                key={product}
                className="rounded-full border border-border bg-background px-2.5 py-0.5 font-terminal text-xs text-secondary"
              >
                {product}
              </span>
            ))}
          </div>
        </div>
      )}
    </LiquidMetalCard>
  );
}

function BenefitItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <LiquidMetalCard className="px-2.5 py-1.5">
      <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
      <span className={`text-sm ${highlight ? "font-semibold text-accent" : "text-secondary"}`}>
        {value}
      </span>
    </LiquidMetalCard>
  );
}
