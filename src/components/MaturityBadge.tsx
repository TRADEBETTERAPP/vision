import { MATURITY_LABELS, type MaturityStatus } from "@/content";

/**
 * Monochrome + green-only status indicator system (VAL-VISUAL-032).
 *
 * Live = small green dot (#00ff00, 8px) + white text.
 * In-progress / Planned / Speculative = monochrome text only (white/gray).
 * No rainbow badge backgrounds. No colored fills. Restrained and professional.
 */
const STATUS_TEXT_STYLES: Record<MaturityStatus, string> = {
  live: "text-white",
  in_progress: "text-white",
  planned: "text-[#a0a0a0]",
  speculative: "text-[#707070]",
};

/**
 * Renders a restrained maturity-status indicator (e.g. "Live", "Planned").
 * Used on narrative cards, roadmap nodes, and section headers.
 *
 * - Live status shows a small green dot + white text.
 * - All other statuses show monochrome text only, no colored backgrounds.
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
      className={`inline-flex items-center gap-1.5 font-terminal text-xs font-medium ${STATUS_TEXT_STYLES[status]} ${className}`}
      data-testid="maturity-badge"
      data-status={status}
    >
      {status === "live" && (
        <span
          className="inline-block h-2 w-2 shrink-0 rounded-full bg-accent-green"
          data-testid="status-dot"
          aria-hidden="true"
        />
      )}
      {MATURITY_LABELS[status]}
    </span>
  );
}
