"use client";

/**
 * GraphExplorer — client component that wires the GraphShell with
 * actual BETTER surface content.
 *
 * This is the primary exploration experience after the hero and proof
 * sections. Each graph node maps to a rich content surface.
 *
 * VAL-ROADMAP-001: Reads as graph-first explorable mindmap
 * VAL-ROADMAP-011: Node-first exploration is primary interaction model
 * VAL-ROADMAP-012: Direct traversal between related nodes
 * VAL-ROADMAP-013: Major transitions without linear scrolling
 */

import dynamic from "next/dynamic";
import { GraphShell } from "./GraphShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroSurface } from "./surfaces/HeroSurface";
import { ProofSurface } from "./surfaces/ProofSurface";
import { LiveNowSurface } from "./surfaces/LiveNowSurface";
import { RoadmapSurface } from "./surfaces/RoadmapSurface";
import { TokenomicsSurface } from "./surfaces/TokenomicsSurface";
import { ArchitectureSurface } from "./surfaces/ArchitectureSurface";
import { EvidenceSurface } from "./surfaces/EvidenceSurface";
import { RisksSurface } from "./surfaces/RisksSurface";
import { ValuationSurface } from "./surfaces/ValuationSurface";

function SurfaceLoadingCard({ title }: { title: string }) {
  return (
    <Card className="border-white/12 bg-white/[0.04]">
      <CardHeader className="gap-2">
        <CardTitle className="text-sm uppercase tracking-[-0.06em] text-white">
          Loading {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-white">Preparing the surface content.</p>
      </CardContent>
    </Card>
  );
}

const MacroThesisSurface = dynamic(
  () => import("./surfaces/MacroThesisSurface").then((mod) => mod.MacroThesisSurface),
  {
    loading: () => <SurfaceLoadingCard title="Macro Thesis" />,
  }
);

const HftEdgeSurface = dynamic(
  () => import("./surfaces/HftEdgeSurface").then((mod) => mod.HftEdgeSurface),
  {
    loading: () => <SurfaceLoadingCard title="HFT Edge" />,
  }
);

const LlmProductSurface = dynamic(
  () => import("./surfaces/LlmProductSurface").then((mod) => mod.LlmProductSurface),
  {
    loading: () => <SurfaceLoadingCard title="LLM Product" />,
  }
);

const TruthPerpFlywheelSurface = dynamic(
  () =>
    import("./surfaces/TruthPerpFlywheelSurface").then(
      (mod) => mod.TruthPerpFlywheelSurface
    ),
  {
    loading: () => <SurfaceLoadingCard title="TRUTH-PERP & Flywheel" />,
  }
);

/**
 * Surface content registry — maps graph node IDs to rendered content.
 * Each surface is a complete, focused BETTER content area.
 */
const SURFACE_CONTENT: Record<string, React.ReactNode> = {
  "what-is-better": <HeroSurface />,
  "macro-thesis": <MacroThesisSurface />,
  "hft-edge": <HftEdgeSurface />,
  "llm-product": <LlmProductSurface />,
  "truth-perp-flywheel": <TruthPerpFlywheelSurface />,
  proof: <ProofSurface />,
  "live-now": <LiveNowSurface />,
  roadmap: <RoadmapSurface />,
  tokenomics: <TokenomicsSurface />,
  architecture: <ArchitectureSurface />,
  evidence: <EvidenceSurface />,
  risks: <RisksSurface />,
  valuation: <ValuationSurface />,
};

export function GraphExplorer() {
  return <GraphShell surfaces={SURFACE_CONTENT} />;
}
