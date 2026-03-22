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

import { GraphShell } from "./GraphShell";
import { HeroSurface } from "./surfaces/HeroSurface";
import { ProofSurface } from "./surfaces/ProofSurface";
import { LiveNowSurface } from "./surfaces/LiveNowSurface";
import { RoadmapSurface } from "./surfaces/RoadmapSurface";
import { TokenomicsSurface } from "./surfaces/TokenomicsSurface";
import { ArchitectureSurface } from "./surfaces/ArchitectureSurface";
import { EvidenceSurface } from "./surfaces/EvidenceSurface";
import { RisksSurface } from "./surfaces/RisksSurface";

/**
 * Surface content registry — maps graph node IDs to rendered content.
 * Each surface is a complete, focused BETTER content area.
 */
const SURFACE_CONTENT: Record<string, React.ReactNode> = {
  "what-is-better": <HeroSurface />,
  proof: <ProofSurface />,
  "live-now": <LiveNowSurface />,
  roadmap: <RoadmapSurface />,
  tokenomics: <TokenomicsSurface />,
  architecture: <ArchitectureSurface />,
  evidence: <EvidenceSurface />,
  risks: <RisksSurface />,
};

export function GraphExplorer() {
  return <GraphShell surfaces={SURFACE_CONTENT} />;
}
