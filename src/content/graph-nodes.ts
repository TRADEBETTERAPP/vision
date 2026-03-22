/**
 * Graph shell node definitions for the BETTER exploration atlas.
 *
 * Each graph node represents a major BETTER surface (hero, proof, roadmap,
 * tokenomics, architecture, evidence, risks) that users can focus on
 * through the graph-first navigation shell.
 *
 * Graph edges define relationships between surfaces so users can traverse
 * directly between related nodes without linear scrolling.
 */

import type { MaturityStatus } from "./types";

// ---------------------------------------------------------------------------
// Graph Node Types
// ---------------------------------------------------------------------------

export interface GraphNode {
  /** Stable unique identifier — used in URL hashes (#graph-<id>) */
  id: string;
  /** Display label for the graph node */
  label: string;
  /** Short description shown in graph overview and focus breadcrumb */
  description: string;
  /** Icon/symbol for compact graph rendering */
  icon: string;
  /** The dominant maturity status of this surface (for visual treatment) */
  dominantStatus: MaturityStatus;
  /** Related node IDs — used for direct traversal (VAL-ROADMAP-012) */
  related: string[];
  /** Category for visual grouping */
  category: "identity" | "proof" | "exploration" | "analysis" | "reference";
  /** Section ID in the legacy layout (for scroll fallback) */
  legacySectionId?: string;
}

// ---------------------------------------------------------------------------
// Graph Node Definitions
// ---------------------------------------------------------------------------

export const GRAPH_NODES: GraphNode[] = [
  {
    id: "what-is-better",
    label: "What is BETTER",
    description: "Brand identity, mission, and product promise",
    icon: "◆",
    dominantStatus: "live",
    related: ["proof", "live-now"],
    category: "identity",
    legacySectionId: "what-is-better",
  },
  {
    id: "proof",
    label: "Proof & Trust",
    description: "Live product evidence and credibility signals",
    icon: "✓",
    dominantStatus: "live",
    related: ["what-is-better", "live-now", "roadmap"],
    category: "proof",
    legacySectionId: "proof",
  },
  {
    id: "live-now",
    label: "Live Now",
    description: "Current production capabilities available today",
    icon: "●",
    dominantStatus: "live",
    related: ["proof", "roadmap", "tokenomics"],
    category: "proof",
    legacySectionId: "live-now",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    description: "Interactive roadmap atlas — product, token, infra evolution",
    icon: "⊕",
    dominantStatus: "in_progress",
    related: ["live-now", "tokenomics", "architecture"],
    category: "exploration",
    legacySectionId: "roadmap",
  },
  {
    id: "tokenomics",
    label: "Tokenomics",
    description: "Whale-first tiers, supply math, scenarios, and projections",
    icon: "◈",
    dominantStatus: "in_progress",
    related: ["roadmap", "live-now", "architecture"],
    category: "analysis",
    legacySectionId: "tokenomics",
  },
  {
    id: "architecture",
    label: "Architecture",
    description: "Technical stack layers, cost bands, and BETTER flywheel",
    icon: "⬡",
    dominantStatus: "planned",
    related: ["roadmap", "tokenomics", "evidence"],
    category: "analysis",
    legacySectionId: "architecture",
  },
  {
    id: "evidence",
    label: "Evidence & Sources",
    description: "Source types, citation paths, and evidence hooks explained",
    icon: "◇",
    dominantStatus: "live",
    related: ["architecture", "risks"],
    category: "reference",
    legacySectionId: "evidence",
  },
  {
    id: "risks",
    label: "Risks & Caveats",
    description: "Key uncertainties, dependencies, and non-guarantees",
    icon: "△",
    dominantStatus: "live",
    related: ["evidence", "roadmap"],
    category: "reference",
    legacySectionId: "risks",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get a graph node by ID */
export function getGraphNodeById(id: string): GraphNode | undefined {
  return GRAPH_NODES.find((n) => n.id === id);
}

/** Get related nodes for a given graph node */
export function getRelatedGraphNodes(nodeId: string): GraphNode[] {
  const node = getGraphNodeById(nodeId);
  if (!node) return [];
  return node.related
    .map((id) => getGraphNodeById(id))
    .filter((n): n is GraphNode => n !== undefined);
}

/** Default focus node for the graph shell */
export const DEFAULT_GRAPH_NODE = "what-is-better";

/** Parse a URL hash into a graph node ID, or null if invalid */
export function parseGraphHash(hash: string): string | null {
  // Support both #graph-<id> format and legacy #<id> format
  if (hash.startsWith("#graph-")) {
    return hash.slice(7);
  }
  // Legacy section anchors map to graph nodes
  const stripped = hash.slice(1);
  if (GRAPH_NODES.some((n) => n.id === stripped)) {
    return stripped;
  }
  // Roadmap deep links (#node-*) map to the roadmap graph node
  if (hash.startsWith("#node-")) {
    return "roadmap";
  }
  return null;
}

/** Generate the URL hash for a graph node */
export function graphNodeHash(nodeId: string): string {
  return `#graph-${nodeId}`;
}
