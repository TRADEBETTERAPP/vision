import { MATURITY_LABELS, type MaturityStatus } from "@/content";

const STATUS_STYLES: Record<MaturityStatus, string> = {
  live: "bg-accent-green/15 text-accent-green border-accent-green/30",
  in_progress: "bg-accent/15 text-accent border-accent/30",
  planned: "bg-accent-warn/15 text-accent-warn border-accent-warn/30",
  speculative: "bg-accent-danger/15 text-accent-danger border-accent-danger/30",
};

/**
 * Renders a small maturity-status badge (e.g. "Live", "Planned").
 * Used on narrative cards, roadmap nodes, and section headers.
 */
export default function MaturityBadge({
  status,
  className = "",
}: {
  status: MaturityStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-terminal text-xs font-medium ${STATUS_STYLES[status]} ${className}`}
      data-testid="maturity-badge"
      data-status={status}
    >
      {MATURITY_LABELS[status]}
    </span>
  );
}
