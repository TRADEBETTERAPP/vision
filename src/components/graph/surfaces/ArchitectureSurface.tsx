/**
 * ArchitectureSurface — the "Architecture" graph surface content.
 * Renders architecture section when focused via the graph shell.
 */
import { ArchitectureSection } from "@/components/architecture";

export function ArchitectureSurface() {
  return (
    <div>
      <p className="mb-8 text-sm text-secondary">
        Hyperliquid/HyperEVM, OpenServ/BRAID, proprietary AI/RL, Polygon
        validators, and phased low-latency execution — the BETTER stack, its
        cost bands, and the compounding flywheel. Content is informational — not
        operational.
      </p>
      <ArchitectureSection />
    </div>
  );
}
