/**
 * Supply & Allocation Table — VAL-TOKEN-001 / VAL-TOKEN-020
 *
 * Displays token allocations, percentages, and token amounts that
 * reconcile to the minted supply from the Base contract (709,001,940 BETTER).
 *
 * All allocations are verified from on-chain data via Dune Analytics queries
 * and basescan transfer history. Each allocation cites its source.
 */

import {
  TOKEN_ALLOCATIONS,
  MINTED_SUPPLY,
  BASE_CONTRACT,
  validateAllocations,
} from "@/content";
import EvidenceHook from "@/components/EvidenceHook";

/** Format a large number with commas */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export default function SupplyAllocation() {
  const { valid, totalPercentage, totalTokens } = validateAllocations();

  return (
    <div data-testid="supply-allocation">
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        Token Supply &amp; Allocation
      </h3>
      <p className="mb-4 text-sm text-secondary">
        Minted supply of{" "}
        <span className="font-terminal font-semibold text-accent" data-testid="minted-supply-figure">
          {formatNumber(MINTED_SUPPLY)}
        </span>{" "}
        BETTER tokens on the Base contract — on-chain verified via Dune Analytics
        and basescan.
      </p>
      <div className="glass-card mb-4 px-3 py-2 text-xs text-secondary">
        <span className="font-terminal font-medium text-accent">Base Contract:</span>{" "}
        <code className="font-terminal text-foreground">{BASE_CONTRACT.address}</code>
        <span className="ml-2 text-muted">({BASE_CONTRACT.chain})</span>
        <div className="mt-1">
          <EvidenceHook source={BASE_CONTRACT.source} />
        </div>
      </div>

      {/* Allocation table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" data-testid="allocation-table">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 pr-4 font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Category
              </th>
              <th className="pb-2 pr-4 text-right font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Allocation
              </th>
              <th className="pb-2 pr-4 text-right font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Tokens
              </th>
              <th className="pb-2 font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {TOKEN_ALLOCATIONS.map((alloc) => (
              <tr
                key={alloc.label}
                className="border-b border-border/50"
                data-testid="allocation-row"
              >
                <td className="py-3 pr-4 font-medium text-foreground">
                  {alloc.label}
                </td>
                <td className="py-3 pr-4 text-right font-terminal text-accent">
                  {alloc.percentage}%
                </td>
                <td className="py-3 pr-4 text-right font-terminal text-secondary">
                  {formatNumber(alloc.tokens)}
                </td>
                <td className="py-3">
                  <div className="flex flex-col gap-1">
                    <EvidenceHook source={alloc.source} />
                    {alloc.source.note && (
                      <span
                        className="block text-[11px] leading-snug text-muted"
                        data-testid="allocation-evidence-detail"
                      >
                        {alloc.source.note}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-accent/20">
              <td className="pt-3 pr-4 font-semibold text-foreground">Total</td>
              <td className="pt-3 pr-4 text-right font-terminal font-semibold text-accent">
                {totalPercentage}%
              </td>
              <td className="pt-3 pr-4 text-right font-terminal font-semibold text-accent">
                {formatNumber(totalTokens)}
              </td>
              <td className="pt-3">
                {valid ? (
                  <span className="font-terminal text-xs text-accent">
                    ✓ Reconciled
                  </span>
                ) : (
                  <span className="font-terminal text-xs text-[#707070]">
                    ✗ Mismatch
                  </span>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Visual allocation bar */}
      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-surface" data-testid="allocation-bar">
        {TOKEN_ALLOCATIONS.map((alloc, i) => {
          const colors = [
            "bg-white",
            "bg-[#c0c0c0]",
            "bg-[#a0a0a0]",
            "bg-[#808080]",
            "bg-[#606060]",
            "bg-[#404040]",
            "bg-[#303030]",
          ];
          return (
            <div
              key={alloc.label}
              className={`${colors[i % colors.length]} transition-all`}
              style={{ width: `${alloc.percentage}%` }}
              title={`${alloc.label}: ${alloc.percentage}%`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
        {TOKEN_ALLOCATIONS.map((alloc, i) => {
          const dotColors = [
            "bg-white",
            "bg-[#c0c0c0]",
            "bg-[#a0a0a0]",
            "bg-[#808080]",
            "bg-[#606060]",
            "bg-[#404040]",
            "bg-[#303030]",
          ];
          return (
            <span key={alloc.label} className="flex items-center gap-1">
              <span
                className={`inline-block h-2 w-2 rounded-full ${dotColors[i % dotColors.length]}`}
              />
              {alloc.label} ({alloc.percentage}%)
            </span>
          );
        })}
      </div>
    </div>
  );
}
