/**
 * Product-Family Revenue & Value-Return Model — VAL-TOKEN-014
 *
 * Breaks out revenue and value-return modeling by product family.
 * Each family shows direct monetized revenue or broader ecosystem-value flow,
 * with explicit maturity labels.
 */

import { PRODUCT_FAMILY_REVENUE_MODELS } from "@/content";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import MaturityBadge from "@/components/MaturityBadge";
import type { ConfidenceFrame } from "@/content";

const revenueCaveat: ConfidenceFrame = {
  caveat:
    "Revenue estimates are scenario-dependent ranges, not forecasts. Actual outcomes depend on adoption, market conditions, and execution.",
  dependencies: [
    "Terminal Open Access",
    "Social Vaults & vBETTER",
    "Autonomous Strategy Agents",
    "Enterprise Data & API Licensing",
  ],
};

/** Style the return type badge */
function returnTypeBadgeClass(returnType: string): string {
  switch (returnType) {
    case "direct_revenue":
      return "bg-accent/10 text-accent";
    case "ecosystem_value":
      return "bg-white/[0.06] text-[#e6e6e6]";
    case "hybrid":
      return "bg-white/5 text-[#a0a0a0]";
    default:
      return "bg-surface text-muted";
  }
}

export default function ProductFamilyRevenueModel() {
  return (
    <div data-testid="product-family-revenue-model">
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        Product-Family Revenue &amp; Value-Return Model
      </h3>
      <p className="mb-4 text-sm text-secondary">
        Each major BETTER product family is modeled with its direct monetized
        revenue path or broader ecosystem-value return, broken out by line and
        labeled with maturity framing.
      </p>

      <div className="space-y-3">
        {PRODUCT_FAMILY_REVENUE_MODELS.map((model) => (
          <div
            key={model.id}
            className="glass-card p-4"
            data-testid="product-revenue-line"
            data-product-id={model.id}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-foreground">{model.productFamily}</h4>
              <MaturityBadge status={model.maturity} />
              <span
                className={`rounded-full px-2 py-0.5 font-terminal text-xs ${returnTypeBadgeClass(model.returnType)}`}
                data-testid="return-type-label"
              >
                {model.returnTypeLabel}
              </span>
            </div>
            <p className="mb-3 text-sm text-secondary">{model.revenueDescription}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-border/50 bg-background px-3 py-2">
                <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                  Return Path
                </span>
                <p className="text-xs text-secondary">{model.returnPath}</p>
              </div>
              {model.estimatedRange && (
                <div className="rounded border border-border/50 bg-background px-3 py-2">
                  <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                    Estimated Range
                  </span>
                  <p className="font-terminal text-xs text-accent">{model.estimatedRange}</p>
                </div>
              )}
            </div>

            <div className="mt-3">
              <EvidenceHook source={model.source} />
            </div>
          </div>
        ))}
      </div>

      <CaveatFrame confidence={revenueCaveat} className="mt-4" />
    </div>
  );
}
