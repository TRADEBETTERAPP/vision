import type { NarrativeBlock } from "@/content";
import MaturityBadge from "./MaturityBadge";
import EvidenceHook from "./EvidenceHook";
import CaveatFrame from "./CaveatFrame";
import { LiquidMetalCard } from "./LiquidMetalCard";

/**
 * A narrative content card that visibly carries:
 * - Maturity badge (VAL-NARR-006)
 * - Evidence hook / source cue (VAL-NARR-008)
 * - Caveat / confidence framing for future-facing items (VAL-NARR-009)
 *
 * VAL-VISUAL-030: Glass-morphism + liquid metal interactive finish.
 */
export default function NarrativeCard({
  block,
  className = "",
}: {
  block: NarrativeBlock;
  className?: string;
}) {
  const isFutureFacing = block.status !== "live";

  return (
    <LiquidMetalCard
      as="article"
      className={`p-5 ${className}`}
      data-testid="narrative-card"
      data-status={block.status}
    >
      <div className="mb-3 flex items-center gap-3">
        <MaturityBadge status={block.status} />
        <EvidenceHook source={block.source} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {block.title}
      </h3>
      <p className="text-sm leading-relaxed text-secondary">{block.body}</p>
      {isFutureFacing && block.confidence && (
        <CaveatFrame confidence={block.confidence} className="mt-3" />
      )}
    </LiquidMetalCard>
  );
}
