import type { ConfidenceFrame } from "@/content";
import { LiquidMetalCard } from "./LiquidMetalCard";

/**
 * Renders nearby caveat / confidence framing for aggressive or future-facing claims.
 * Satisfies VAL-NARR-009: aggressive claims carry nearby caveats or confidence framing.
 */
export default function CaveatFrame({
  confidence,
  className = "",
}: {
  confidence: ConfidenceFrame;
  className?: string;
}) {
  return (
    <LiquidMetalCard
      className={`px-3 py-2 ${className}`}
      role="note"
      aria-label="Confidence and caveat framing"
      data-testid="caveat-frame"
    >
      <p className="text-xs text-[#a0a0a0]">
        <span className="mr-1 font-terminal font-semibold">⚠ Caveat:</span>
        {confidence.caveat}
      </p>
      {confidence.dependencies && confidence.dependencies.length > 0 && (
        <p className="mt-1 text-xs text-muted">
          <span className="font-terminal font-medium">Depends on:</span>{" "}
          {confidence.dependencies.join(", ")}
        </p>
      )}
    </LiquidMetalCard>
  );
}
