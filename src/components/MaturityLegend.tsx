import {
  MATURITY_LABELS,
  MATURITY_DESCRIPTIONS,
  type MaturityStatus,
} from "@/content";
import MaturityBadge from "./MaturityBadge";
import { LiquidMetalCard } from "./LiquidMetalCard";

const ORDERED_STATUSES: MaturityStatus[] = [
  "live",
  "in_progress",
  "planned",
  "speculative",
];

/**
 * Visible legend explaining what each maturity label means.
 * Satisfies VAL-NARR-007: users can find an explanation of the maturity labels.
 * VAL-VISUAL-030: Glass-morphism + liquid metal interactive finish.
 */
export default function MaturityLegend({ className = "" }: { className?: string }) {
  return (
    <LiquidMetalCard
      className={`p-6 ${className}`}
      role="region"
      aria-label="Maturity label legend"
      data-testid="maturity-legend"
    >
      <h3 className="mb-4 font-terminal text-sm font-semibold uppercase tracking-widest text-accent">
        Understanding Maturity Labels
      </h3>
      <p className="mb-4 text-sm text-secondary">
        Every feature, product, and roadmap item on this site carries a maturity
        label so you can tell what&apos;s shipping today versus what&apos;s still being built,
        planned, or explored.
      </p>
      <dl className="space-y-3">
        {ORDERED_STATUSES.map((status) => (
          <div key={status} className="flex items-start gap-3">
            <dt className="shrink-0 pt-0.5">
              <MaturityBadge status={status} />
            </dt>
            <dd className="text-sm text-secondary">
              <span className="font-medium text-foreground">
                {MATURITY_LABELS[status]}:
              </span>{" "}
              {MATURITY_DESCRIPTIONS[status]}
            </dd>
          </div>
        ))}
      </dl>
    </LiquidMetalCard>
  );
}
