import { MATURITY_LABELS, type MaturityStatus } from "@/content";

/**
 * Monochrome + green-only status styling (tradebetter-exact design atoms).
 * Live = green accent. All other states = grayscale only.
 * The detailed badge rework is in the next feature; this removes competing
 * accent colors from the token system per VAL-VISUAL-031.
 */
const STATUS_STYLES: Record<MaturityStatus, string> = {
  live: "bg-accent-green/15 text-accent-green border-accent-green/30",
  in_progress: "bg-white/5 text-white border-white/20",
  planned: "bg-white/5 text-[#a0a0a0] border-white/15",
  speculative: "bg-white/5 text-[#707070] border-white/10",
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
