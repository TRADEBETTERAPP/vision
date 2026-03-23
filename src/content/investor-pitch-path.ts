/**
 * Investor Pitch Path — ordered gate definitions for the guided VC-friendly
 * traversal path through the BETTER graph workspace.
 *
 * VAL-ROADMAP-015: Users follow one guided path through ordered gates:
 *   problem → wedge → proof → moat → business model → roadmap gates →
 *   valuation → appendix/evidence
 *
 * VAL-ROADMAP-017: The path is discoverable (start affordance) and resumable
 *   (progress tracking, return cues).
 *
 * VAL-CROSS-014: Entry affordance is exposed directly from the default graph
 *   workspace without a separate proof-page handoff.
 */

// ---------------------------------------------------------------------------
// Gate Definitions
// ---------------------------------------------------------------------------

export interface PitchGate {
  /** Stable gate identifier */
  id: string;
  /** Gate order (1-based, ascending) */
  order: number;
  /** Display label for the gate */
  label: string;
  /** Short description of what this gate covers */
  description: string;
  /** Icon for compact rendering */
  icon: string;
  /** The graph node ID this gate maps to */
  graphNodeId: string;
}

/**
 * The ordered investor pitch gates. Each gate maps to a graph node surface
 * and represents one step in the VC-friendly narrative:
 *
 * 1. Problem — what BETTER solves
 * 2. Wedge — the live product entry point
 * 3. Proof — evidence of traction and execution
 * 4. Moat — defensibility and competitive positioning
 * 5. Business Model — revenue mechanics and unit economics
 * 6. Roadmap Gates — milestone-driven expansion path
 * 7. Valuation — stage-based corridors tied to proof gates
 * 8. Appendix / Evidence — deep sources and reference material
 */
export const INVESTOR_PITCH_GATES: PitchGate[] = [
  {
    id: "gate-problem",
    order: 1,
    label: "Problem",
    description: "What BETTER solves: fragmented prediction-market intelligence",
    icon: "◆",
    graphNodeId: "what-is-better",
  },
  {
    id: "gate-wedge",
    order: 2,
    label: "Wedge",
    description: "Live product entry: Terminal & copy-trading in closed beta",
    icon: "●",
    graphNodeId: "live-now",
  },
  {
    id: "gate-proof",
    order: 3,
    label: "Proof",
    description: "Traction evidence, credibility signals, and live on-chain mechanics",
    icon: "✓",
    graphNodeId: "proof",
  },
  {
    id: "gate-moat",
    order: 4,
    label: "Moat",
    description: "Defensibility through proprietary AI, whale network effects, and token alignment",
    icon: "⬡",
    graphNodeId: "architecture",
  },
  {
    id: "gate-business-model",
    order: 5,
    label: "Business Model",
    description: "Whale-first tiers, revenue streams, and sustainable economics",
    icon: "◈",
    graphNodeId: "tokenomics",
  },
  {
    id: "gate-roadmap",
    order: 6,
    label: "Roadmap Gates",
    description: "Milestone-driven expansion with proof gates and bounded timing",
    icon: "⊕",
    graphNodeId: "roadmap",
  },
  {
    id: "gate-valuation",
    order: 7,
    label: "Valuation",
    description: "Conservative stage-based corridors tied to milestone proof gates",
    icon: "△",
    graphNodeId: "risks",
  },
  {
    id: "gate-appendix",
    order: 8,
    label: "Appendix / Evidence",
    description: "Deep sources, citation paths, and evidence hooks",
    icon: "◇",
    graphNodeId: "evidence",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the total number of gates */
export const TOTAL_GATES = INVESTOR_PITCH_GATES.length;

/** Get a gate by its ID */
export function getGateById(gateId: string): PitchGate | undefined {
  return INVESTOR_PITCH_GATES.find((g) => g.id === gateId);
}

/** Get the gate index (0-based) for a graph node ID, or -1 if not part of the path */
export function getGateIndexForNode(graphNodeId: string): number {
  return INVESTOR_PITCH_GATES.findIndex((g) => g.graphNodeId === graphNodeId);
}

/** Get the gate for a graph node ID, or undefined if not part of the path */
export function getGateForNode(graphNodeId: string): PitchGate | undefined {
  return INVESTOR_PITCH_GATES.find((g) => g.graphNodeId === graphNodeId);
}

/** Get the next gate after the current one, or undefined if at the end */
export function getNextGate(currentGateId: string): PitchGate | undefined {
  const idx = INVESTOR_PITCH_GATES.findIndex((g) => g.id === currentGateId);
  if (idx < 0 || idx >= INVESTOR_PITCH_GATES.length - 1) return undefined;
  return INVESTOR_PITCH_GATES[idx + 1];
}

/** Get the previous gate before the current one, or undefined if at the start */
export function getPreviousGate(currentGateId: string): PitchGate | undefined {
  const idx = INVESTOR_PITCH_GATES.findIndex((g) => g.id === currentGateId);
  if (idx <= 0) return undefined;
  return INVESTOR_PITCH_GATES[idx - 1];
}
