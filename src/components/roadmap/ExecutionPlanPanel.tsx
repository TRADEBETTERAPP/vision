import type { ExecutionPlan } from "@/content/types";
import { CONFIDENCE_LABEL_DESCRIPTIONS } from "@/content/types";
import EvidenceHook from "@/components/EvidenceHook";

/**
 * ExecutionPlanPanel — renders a per-stage execution plan treatment.
 *
 * Satisfies VAL-ROADMAP-016:
 * - Shows workstreams with internal/external distinction
 * - Lists external dependencies
 * - Displays falsifiable proof gates as concrete, externally observable criteria
 * - Shows bounded timing windows (ranges or dependency-relative)
 * - Exposes confidence labels (Committed / Planned / Directional)
 * - Explicitly distinguishes AI-agent-compressible internal work from
 *   slower outside constraints
 */
export default function ExecutionPlanPanel({ plan }: { plan: ExecutionPlan }) {
  const internalWorkstreams = plan.workstreams.filter(
    (w) => w.nature === "internal"
  );
  const externalWorkstreams = plan.workstreams.filter(
    (w) => w.nature === "external"
  );

  return (
    <div
      data-testid="execution-plan-panel"
      className="glass-card mt-4 space-y-4 p-4"
    >
      {/* Header with confidence label */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-terminal text-xs font-medium uppercase tracking-widest text-accent">
            Execution Plan
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-secondary">
            {plan.investorSummary}
          </p>
        </div>
        <ConfidenceBadge label={plan.confidenceLabel} />
      </div>

      {/* Timing Window */}
      <div
        data-testid="execution-plan-timing"
        className="rounded border border-accent/10 bg-accent/5 px-3 py-2"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-terminal text-[10px] font-medium uppercase tracking-widest text-accent">
            Timing
          </span>
          <span className="text-sm font-medium text-foreground">
            {plan.timingWindow.display}
          </span>
        </div>
        {plan.timingWindow.mainConstraint && (
          <p className="mt-1 text-xs text-muted">
            <span className="font-terminal font-medium">Key constraint:</span>{" "}
            {plan.timingWindow.mainConstraint}
          </p>
        )}
      </div>

      {/* Workstreams — Internal (AI-agent-compressible) */}
      {internalWorkstreams.length > 0 && (
        <div data-testid="execution-plan-internal-workstreams">
          <h5 className="mb-2 flex items-center gap-2 font-terminal text-[10px] font-medium uppercase tracking-widest text-secondary">
            <span
              className="inline-block h-2 w-2 rounded-full bg-accent"
              aria-hidden="true"
            />
            Internal Workstreams
            <span className="font-normal normal-case tracking-normal text-muted">
              (AI-agent-compressible)
            </span>
          </h5>
          <ul className="space-y-2">
            {internalWorkstreams.map((ws, i) => (
              <li
                key={i}
                className="rounded border border-border/50 bg-surface/50 px-3 py-2"
              >
                <span className="text-xs font-semibold text-foreground">
                  {ws.label}
                </span>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {ws.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Workstreams — External (slower outside constraints) */}
      {externalWorkstreams.length > 0 && (
        <div data-testid="execution-plan-external-workstreams">
          <h5 className="mb-2 flex items-center gap-2 font-terminal text-[10px] font-medium uppercase tracking-widest text-secondary">
            <span
              className="inline-block h-2 w-2 rounded-full bg-[#a0a0a0]"
              aria-hidden="true"
            />
            External Workstreams
            <span className="font-normal normal-case tracking-normal text-muted">
              (outside constraints — not AI-compressible)
            </span>
          </h5>
          <ul className="space-y-2">
            {externalWorkstreams.map((ws, i) => (
              <li
                key={i}
                className="rounded border border-white/10 bg-white/[0.03] px-3 py-2"
              >
                <span className="text-xs font-semibold text-foreground">
                  {ws.label}
                </span>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {ws.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* External Dependencies */}
      {plan.externalDependencies.length > 0 && (
        <div data-testid="execution-plan-external-deps">
          <h5 className="mb-2 font-terminal text-[10px] font-medium uppercase tracking-widest text-secondary">
            External Dependencies
          </h5>
          <ul className="space-y-1">
            {plan.externalDependencies.map((dep, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted">
                <span
                  className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#a0a0a0]/60"
                  aria-hidden="true"
                />
                {dep}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Proof Gates */}
      <div data-testid="execution-plan-proof-gates">
        <h5 className="mb-2 font-terminal text-[10px] font-medium uppercase tracking-widest text-secondary">
          Proof Gates
          <span className="ml-1 font-normal normal-case tracking-normal text-muted">
            (externally observable success criteria)
          </span>
        </h5>
        <ul className="space-y-2">
          {plan.proofGates.map((gate, i) => (
            <li
              key={i}
              className="rounded border border-accent/10 bg-surface/50 px-3 py-2"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-accent">
                  {gate.label}
                </span>
                <EvidenceHook source={gate.source} />
              </div>
              <p className="mt-1 text-xs leading-relaxed text-secondary">
                {gate.criterion}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Plan source cue */}
      <div className="flex items-center justify-end gap-2 border-t border-border/30 pt-2">
        <EvidenceHook source={plan.source} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ConfidenceBadge — visual treatment for Committed / Planned / Directional
// ---------------------------------------------------------------------------

function ConfidenceBadge({
  label,
}: {
  label: ExecutionPlan["confidenceLabel"];
}) {
  const colorMap: Record<
    ExecutionPlan["confidenceLabel"],
    { bg: string; text: string; ring: string }
  > = {
    Committed: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      ring: "ring-green-500/30",
    },
    Planned: {
      bg: "bg-accent/10",
      text: "text-accent",
      ring: "ring-accent/30",
    },
    Directional: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      ring: "ring-amber-500/30",
    },
  };

  const colors = colorMap[label];
  const description = CONFIDENCE_LABEL_DESCRIPTIONS[label];

  return (
    <span
      data-testid="execution-plan-confidence-label"
      title={description}
      className={`inline-flex shrink-0 items-center rounded-md px-2.5 py-1 font-terminal text-[10px] font-medium uppercase tracking-widest ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}
    >
      {label}
    </span>
  );
}
