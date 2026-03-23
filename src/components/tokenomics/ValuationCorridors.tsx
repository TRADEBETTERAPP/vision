/**
 * ValuationCorridors — VAL-TOKEN-015
 *
 * Conservative stage-based valuation corridors with:
 * - Explicit numeric lower/upper bounds
 * - Proof-gate mapping per corridor
 * - Comparable-category labels
 * - A live anchor corridor for present-day state
 * - Consistent valuation/supply basis across all corridors
 * - Implied per-token value reconciliation
 */

import {
  VALUATION_CORRIDORS,
  computeImpliedTokenPrice,
} from "@/content/valuation-corridors";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import type { ConfidenceFrame } from "@/content";

/** Format a number with commas */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** Format a price to appropriate decimal places */
function formatPrice(price: number): string {
  if (price < 0.01) return `$${price.toFixed(4)}`;
  if (price < 1) return `$${price.toFixed(3)}`;
  return `$${price.toFixed(2)}`;
}

const corridorCaveat: ConfidenceFrame = {
  caveat:
    "These corridors are conservative planning ranges tied to milestone proof gates and public comparable categories — they are NOT price targets, promises, or investment advice. Actual market valuation depends on execution, adoption, macro conditions, and factors beyond BETTER's control.",
  dependencies: [
    "Milestone proof gates (see Roadmap Execution Plans)",
    "Comparable-market conditions in prediction markets, DeFi infrastructure, and AI-native finance",
  ],
};

export default function ValuationCorridors() {
  // All corridors share the same basis — extract from the first for the header
  const basis = VALUATION_CORRIDORS[0];

  return (
    <div data-testid="valuation-corridors">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Stage-Based Valuation Corridors
        </h3>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 font-terminal text-xs text-accent">
          Planning Logic
        </span>
      </div>
      <p className="mb-4 text-sm text-secondary">
        Conservative stage-based corridors tied to milestone proof gates and
        public comparable categories. Each corridor reflects what comparable
        protocols have achieved at a similar stage — not what BETTER promises.
      </p>

      {/* Basis declaration */}
      <div
        className="glass-card mb-6 p-4"
        data-testid="corridor-basis-declaration"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
              Valuation Basis
            </span>
            <p className="mt-1 text-sm font-semibold text-foreground" data-testid="valuation-basis">
              {basis.valuationBasis}
            </p>
          </div>
          <div>
            <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
              Supply Basis
            </span>
            <p className="mt-1 text-sm font-semibold text-foreground" data-testid="supply-basis">
              {basis.supplyBasis}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          All corridors use the same valuation and supply basis so they are
          directly comparable. No corridor silently switches framing.
        </p>
      </div>

      {/* Corridor table */}
      <div className="space-y-4" data-testid="corridor-list">
        {VALUATION_CORRIDORS.map((corridor) => {
          const lowPrice = computeImpliedTokenPrice(corridor.lowerBoundM);
          const highPrice = computeImpliedTokenPrice(corridor.upperBoundM);

          return (
            <div
              key={corridor.id}
              className={`glass-card p-4 ${
                corridor.isLiveAnchor ? "ring-1 ring-[rgba(69,94,255,0.30)]" : ""
              }`}
              data-testid="valuation-corridor"
              data-corridor-id={corridor.id}
              data-live-anchor={String(corridor.isLiveAnchor)}
            >
              {/* Header row */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-foreground">{corridor.label}</h4>
                {corridor.isLiveAnchor && (
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 font-terminal text-[10px] font-medium uppercase text-accent">
                    Live Anchor
                  </span>
                )}
              </div>
              <p className="mb-3 text-sm text-secondary">{corridor.description}</p>

              {/* Numeric bounds + implied token price */}
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded border border-border/50 bg-background px-3 py-2">
                  <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                    FDV Range
                  </span>
                  <span
                    className="font-terminal text-lg font-bold text-foreground"
                    data-testid="corridor-fdv-range"
                  >
                    ${formatNumber(corridor.lowerBoundM)}M – ${formatNumber(corridor.upperBoundM)}M
                  </span>
                </div>
                <div className="rounded border border-border/50 bg-background px-3 py-2">
                  <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                    Implied Token Price
                  </span>
                  <span
                    className="font-terminal text-lg font-bold text-accent"
                    data-testid="corridor-token-price"
                  >
                    {formatPrice(lowPrice)} – {formatPrice(highPrice)}
                  </span>
                </div>
                <div className="rounded border border-border/50 bg-background px-3 py-2">
                  <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                    Comparables
                  </span>
                  <span className="text-xs text-secondary" data-testid="corridor-comparables">
                    {corridor.comparableCategories.join("; ")}
                  </span>
                </div>
              </div>

              {/* Proof gates */}
              <div className="mb-3">
                <span className="font-terminal text-xs font-medium uppercase tracking-wider text-[#a0a0a0]">
                  Proof Gates Required
                </span>
                <ul className="mt-1 space-y-1" data-testid="corridor-proof-gates">
                  {corridor.proofGates.map((gate, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-secondary">
                      <span className="mt-1 text-[#a0a0a0]">▸</span>
                      <span>{gate}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <EvidenceHook source={corridor.source} />
            </div>
          );
        })}
      </div>

      <CaveatFrame confidence={corridorCaveat} className="mt-4" />
    </div>
  );
}
