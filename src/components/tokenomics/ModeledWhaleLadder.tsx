/**
 * Modeled Whale Product Ladder — VAL-TOKEN-002 (higher-tier products)
 *
 * Shows the aggressive inferred whale ladder for social vaults, personal
 * AI-crafted vaults, and related premium products. Clearly framed as
 * modeled/inferred policy where proof is absent.
 */

import { MODELED_WHALE_PRODUCTS, getTierById } from "@/content";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import MaturityBadge from "@/components/MaturityBadge";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";
import type { ConfidenceFrame, MaturityStatus } from "@/content";

/** Format a large number with commas */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

const ladderCaveat: ConfidenceFrame = {
  caveat:
    "These product gates are inferred from the whale-first tier design philosophy and do not represent confirmed live mechanics. Final access thresholds, product availability, and pricing may change.",
  dependencies: [
    "Whale-First Tier Ladder",
    "Social Vaults & vBETTER",
    "Autonomous Strategy Agents",
  ],
};

export default function ModeledWhaleLadder() {
  return (
    <div data-testid="modeled-whale-ladder">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Modeled Whale Product Ladder
        </h3>
        <MaturityBadge status="planned" />
      </div>
      <p className="mb-4 text-sm text-secondary">
        Beyond the first vault, the whale-first design philosophy extends to
        premium BETTER products. These access gates are{" "}
        <span className="font-semibold text-accent">modeled/inferred policy</span> —
        not confirmed live mechanics. Where proof is absent, products are
        explicitly labeled as modeled.
      </p>

      <div className="space-y-3">
        {MODELED_WHALE_PRODUCTS.map((product) => {
          const tier = getTierById(product.minimumTierId);
          return (
            <LiquidMetalCard
              key={product.id}
              className="p-4"
              data-testid="modeled-whale-product"
              data-product-id={product.id}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-foreground">{product.name}</h4>
                <MaturityBadge status={product.maturity as MaturityStatus} />
                <span className="rounded-full bg-accent/10 px-2 py-0.5 font-terminal text-xs text-accent">
                  Modeled Gate
                </span>
              </div>
              <p className="mb-3 text-sm text-secondary">{product.description}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <LiquidMetalCard className="px-3 py-2">
                  <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                    Modeled Minimum
                  </span>
                  <span className="font-terminal font-semibold text-foreground">
                    ≥ {formatNumber(product.modeledMinimumBetter)} BETTER
                  </span>
                </LiquidMetalCard>
                <LiquidMetalCard className="px-3 py-2">
                  <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                    Required Tier
                  </span>
                  <span className="font-terminal font-semibold text-accent">
                    {tier?.name ?? product.minimumTierId}
                  </span>
                </LiquidMetalCard>
              </div>
              <div className="mt-3">
                <EvidenceHook source={product.source} />
              </div>
            </LiquidMetalCard>
          );
        })}
      </div>

      <CaveatFrame confidence={ladderCaveat} className="mt-4" />
    </div>
  );
}
