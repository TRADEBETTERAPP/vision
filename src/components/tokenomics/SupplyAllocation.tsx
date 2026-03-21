/**
 * Supply & Allocation Table — VAL-TOKEN-001
 *
 * Displays token allocations, percentages, and token amounts that
 * reconcile to the stated total supply.
 */

import {
  TOKEN_ALLOCATIONS,
  TOTAL_SUPPLY,
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
        Total supply of{" "}
        <span className="font-terminal font-semibold text-accent">
          {formatNumber(TOTAL_SUPPLY)}
        </span>{" "}
        BETTER tokens, allocated across five categories.
      </p>

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
                  <EvidenceHook source={alloc.source} />
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
                  <span className="font-terminal text-xs text-accent-danger">
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
            "bg-accent",
            "bg-accent-secondary",
            "bg-accent-warn",
            "bg-[#8b5cf6]",
            "bg-accent-danger",
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
            "bg-accent",
            "bg-accent-secondary",
            "bg-accent-warn",
            "bg-[#8b5cf6]",
            "bg-accent-danger",
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
