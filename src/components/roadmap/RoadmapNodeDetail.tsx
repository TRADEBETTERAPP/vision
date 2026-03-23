import type { RoadmapNode } from "@/content/types";
import { getNodeById, getExecutionPlanForNode } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import ExecutionPlanPanel from "./ExecutionPlanPanel";

/**
 * Detail panel for a selected roadmap node.
 *
 * Satisfies:
 * - VAL-ROADMAP-005: Shows title, maturity status, summary, and confidence framing
 * - VAL-ROADMAP-006: Deep-linkable via URL hash
 * - VAL-ROADMAP-016: Shows per-stage execution plan with workstreams, external
 *   dependencies, falsifiable proof gates, bounded timing, and confidence labels
 */
export default function RoadmapNodeDetail({
  node,
  onClose,
}: {
  node: RoadmapNode;
  onClose: () => void;
}) {
  const isFutureFacing = node.status !== "live";
  const executionPlan = getExecutionPlanForNode(node.id);

  return (
    <div
      data-testid="roadmap-node-detail"
      className="glass-card p-5"
      role="region"
      aria-label={`Details for ${node.title}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <MaturityBadge status={node.status} />
          <EvidenceHook source={node.source} />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded p-1 text-secondary transition-colors hover:bg-elevated hover:text-foreground"
          aria-label="Close detail panel"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <h3 className="mb-2 text-lg font-bold text-foreground">{node.title}</h3>
      <p className="mb-3 text-sm leading-relaxed text-secondary">
        {node.summary}
      </p>

      {/* Unlocks */}
      {node.unlocks && (
        <div className="mb-3 rounded border border-accent/10 bg-accent/5 px-3 py-2">
          <p className="text-xs text-accent">
            <span className="mr-1 font-terminal font-semibold">Unlocks:</span>
            {node.unlocks}
          </p>
        </div>
      )}

      {/* Dependencies — resolved to readable titles */}
      {node.dependencies.length > 0 && (
        <p className="mb-3 text-xs text-muted">
          <span className="font-terminal font-medium">Requires:</span>{" "}
          {node.dependencies
            .map((depId) => getNodeById(depId)?.title ?? depId)
            .join(", ")}
        </p>
      )}

      {/* Confidence framing for future-facing nodes */}
      {isFutureFacing && node.confidence && (
        <CaveatFrame
          confidence={{
            ...node.confidence,
            // Resolve dependency IDs to readable titles for user display
            dependencies: node.confidence.dependencies?.map(
              (depId) => getNodeById(depId)?.title ?? depId
            ),
          }}
          className="mt-3"
        />
      )}

      {/* Per-stage execution plan (VAL-ROADMAP-016) */}
      {executionPlan && <ExecutionPlanPanel plan={executionPlan} />}
    </div>
  );
}
