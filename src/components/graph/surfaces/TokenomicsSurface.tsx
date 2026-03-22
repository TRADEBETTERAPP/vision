/**
 * TokenomicsSurface — the "Tokenomics" graph surface content.
 * Renders tokenomics section when focused via the graph shell.
 */
import { TokenomicsSection } from "@/components/tokenomics";

export function TokenomicsSurface() {
  return (
    <div>
      <p className="mb-8 text-sm text-secondary">
        Reconciled supply math, whale-first tier ladders, fee advantages,
        scenario projections, and agent-native utility. Content is
        exploration-only — not a live trading interface.
      </p>
      <TokenomicsSection />
    </div>
  );
}
