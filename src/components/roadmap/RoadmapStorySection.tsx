"use client";

import {
  BRANCH_FAMILY_LABELS,
  BRANCH_FAMILY_DESCRIPTIONS,
  type RoadmapBranchFamily,
} from "@/content/types";
import { getNodesByFamily, type RoadmapNode } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import type { MaturityStatus } from "@/content/types";

const FAMILY_KEYS: RoadmapBranchFamily[] = [
  "product_evolution",
  "token_utility",
  "revenue_expansion",
  "technical_infrastructure",
  "social_agent_ecosystem",
];

/** Count nodes by status for a given family */
function getStatusCounts(
  nodes: RoadmapNode[]
): Record<MaturityStatus, number> {
  const counts: Record<MaturityStatus, number> = {
    live: 0,
    in_progress: 0,
    planned: 0,
    speculative: 0,
  };
  for (const n of nodes) {
    counts[n.status]++;
  }
  return counts;
}

/**
 * Scroll-linked storytelling panels for roadmap branch families.
 *
 * Satisfies:
 * - VAL-ROADMAP-003: Scroll storytelling and roadmap highlighting stay in sync
 * - VAL-ROADMAP-010: Covers required BETTER domains
 */
export default function RoadmapStorySection({
  activeFamilyIndex,
  onActiveFamilyChange,
}: {
  activeFamilyIndex: number;
  onActiveFamilyChange: (index: number) => void;
}) {
  return (
    <div className="space-y-4" role="tablist" aria-label="Roadmap branch families">
      {FAMILY_KEYS.map((family, index) => {
        const nodes = getNodesByFamily(family);
        const counts = getStatusCounts(nodes);
        const isActive = index === activeFamilyIndex;

        return (
          <button
            key={family}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-testid="roadmap-story-panel"
            data-active={isActive ? "true" : "false"}
            className="w-full rounded-lg p-4 text-left transition-all"
            style={{
              background: isActive ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.10)",
              border: "1px solid rgba(255, 255, 255, 0.20)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => onActiveFamilyChange(index)}
          >
            <h3
              className={`mb-1 font-semibold ${
                isActive ? "text-accent" : "text-foreground"
              }`}
            >
              {BRANCH_FAMILY_LABELS[family]}
            </h3>
            <p className="mb-2 text-xs leading-relaxed text-secondary">
              {BRANCH_FAMILY_DESCRIPTIONS[family]}
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "live",
                  "in_progress",
                  "planned",
                  "speculative",
                ] as MaturityStatus[]
              )
                .filter((s) => counts[s] > 0)
                .map((s) => (
                  <span key={s} className="flex items-center gap-1">
                    <MaturityBadge status={s} className="text-[10px]" />
                    <span className="font-terminal text-[10px] text-muted">
                      ×{counts[s]}
                    </span>
                  </span>
                ))}
              <span className="font-terminal text-[10px] text-muted">
                {nodes.length} nodes
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export { FAMILY_KEYS };
