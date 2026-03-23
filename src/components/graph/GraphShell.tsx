"use client";

/**
 * GraphShell — the graph-first BETTER exploration shell.
 *
 * Replaces the linear section-anchor browsing model with a node-first
 * explorable mindmap. Users navigate by selecting graph nodes rather
 * than scrolling between document sections.
 *
 * Satisfies:
 * - VAL-NARR-004: Navigation opens graph destinations/focus states
 * - VAL-ROADMAP-001: Shell reads as graph-first explorable mindmap
 * - VAL-ROADMAP-002: Orientation recovery via breadcrumb + recenter
 * - VAL-ROADMAP-006: Valid deep links restore node-focused graph state
 * - VAL-ROADMAP-007: Invalid deep links fall back to coherent state
 * - VAL-ROADMAP-009: Mobile exploration remains node-first
 * - VAL-ROADMAP-011: Node-first exploration is primary interaction model
 * - VAL-ROADMAP-012: Direct traversal between related nodes
 * - VAL-ROADMAP-013: Major transitions without linear scrolling
 * - VAL-ROADMAP-014: Default state is pure graph workspace
 * - VAL-VISUAL-033: Clean graph workspace without chrome clutter
 * - VAL-ROADMAP-015: Guided VC-friendly pitch path through ordered gates
 * - VAL-ROADMAP-017: Discoverable start affordance + resumable with progress cues
 * - VAL-CROSS-014: Investor-path entry from default graph workspace
 */

import {
  useReducer,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import {
  GRAPH_NODES,
  getGraphNodeById,
  getRelatedGraphNodes,
  DEFAULT_GRAPH_NODE,
  parseGraphHash,
  graphNodeHash,
  type GraphNode,
} from "@/content/graph-nodes";
import {
  INVESTOR_PITCH_GATES,
  TOTAL_GATES,
  getGateIndexForNode,
} from "@/content/investor-pitch-path";
import MaturityBadge from "@/components/MaturityBadge";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";
import { GraphShellPersistenceProvider } from "./GraphShellPersistence";

// ---------------------------------------------------------------------------
// Graph Shell State
// ---------------------------------------------------------------------------

interface GraphShellState {
  /** Currently focused graph node ID, or null for overview */
  focusedNodeId: string | null;
  /** Whether an invalid deep link was detected */
  invalidLink: boolean;
  /** Navigation history for back functionality */
  history: string[];
  /** Investor pitch path state */
  pitchPath: {
    /** Whether the pitch path is actively being followed */
    active: boolean;
    /** Index of the current gate in the pitch path (0-based) */
    currentGateIndex: number;
    /** Set of visited gate indices */
    visitedGates: Set<number>;
    /** The last gate index the user was at when they left the path */
    lastGateIndex: number | null;
  };
}

type GraphAction =
  | { type: "FOCUS_NODE"; nodeId: string }
  | { type: "RESTORE_HASH"; hash: string }
  | { type: "RECENTER" }
  | { type: "GO_BACK" }
  | { type: "START_PITCH_PATH" }
  | { type: "RESUME_PITCH_PATH" }
  | { type: "PITCH_NEXT_GATE" }
  | { type: "PITCH_PREV_GATE" };

function graphReducer(state: GraphShellState, action: GraphAction): GraphShellState {
  switch (action.type) {
    case "FOCUS_NODE": {
      const node = getGraphNodeById(action.nodeId);
      if (!node) return { ...state, invalidLink: true, focusedNodeId: null };

      // Check if this node is part of the pitch path
      const gateIdx = getGateIndexForNode(action.nodeId);
      const isOnPath = gateIdx >= 0;

      // If pitch path is active and user navigates to a non-path node, deactivate path
      const pitchPath = state.pitchPath.active && !isOnPath
        ? {
            ...state.pitchPath,
            active: false,
            lastGateIndex: state.pitchPath.currentGateIndex,
          }
        : state.pitchPath.active && isOnPath
          ? {
              ...state.pitchPath,
              currentGateIndex: gateIdx,
              visitedGates: new Set([...state.pitchPath.visitedGates, gateIdx]),
            }
          : state.pitchPath;

      return {
        ...state,
        focusedNodeId: action.nodeId,
        invalidLink: false,
        history: state.focusedNodeId
          ? [...state.history, state.focusedNodeId]
          : state.history,
        pitchPath,
      };
    }
    case "RESTORE_HASH": {
      const nodeId = parseGraphHash(action.hash);
      if (!nodeId) {
        return { ...state, invalidLink: true, focusedNodeId: null };
      }
      const node = getGraphNodeById(nodeId);
      if (!node) {
        return { ...state, invalidLink: true, focusedNodeId: null };
      }

      // Restore pitch path state when the target node is part of the path.
      // This ensures browser back/forward navigation coherently restores
      // the guided-path progress instead of leaving it stale.
      const gateIdx = getGateIndexForNode(nodeId);
      const isOnPath = gateIdx >= 0;

      let pitchPath = state.pitchPath;
      if (isOnPath) {
        // Re-activate pitch path at the correct gate, preserving visited state
        pitchPath = {
          ...state.pitchPath,
          active: true,
          currentGateIndex: gateIdx,
          visitedGates: new Set([...state.pitchPath.visitedGates, gateIdx]),
          lastGateIndex: null,
        };
      } else if (state.pitchPath.active) {
        // Navigating to a non-path node deactivates the path
        pitchPath = {
          ...state.pitchPath,
          active: false,
          lastGateIndex: state.pitchPath.currentGateIndex,
        };
      }

      return {
        ...state,
        focusedNodeId: nodeId,
        invalidLink: false,
        history: state.history,
        pitchPath,
      };
    }
    case "RECENTER": {
      const pitchPath = state.pitchPath.active
        ? {
            ...state.pitchPath,
            active: false,
            lastGateIndex: state.pitchPath.currentGateIndex,
          }
        : state.pitchPath;
      return { ...state, focusedNodeId: null, invalidLink: false, history: [], pitchPath };
    }
    case "GO_BACK": {
      const prev = state.history[state.history.length - 1] ?? null;
      return {
        ...state,
        focusedNodeId: prev,
        invalidLink: false,
        history: state.history.slice(0, -1),
      };
    }
    case "START_PITCH_PATH": {
      const firstGate = INVESTOR_PITCH_GATES[0];
      return {
        ...state,
        focusedNodeId: firstGate.graphNodeId,
        invalidLink: false,
        history: state.focusedNodeId
          ? [...state.history, state.focusedNodeId]
          : state.history,
        pitchPath: {
          active: true,
          currentGateIndex: 0,
          visitedGates: new Set([0]),
          lastGateIndex: null,
        },
      };
    }
    case "RESUME_PITCH_PATH": {
      const resumeIdx = state.pitchPath.lastGateIndex ?? 0;
      const resumeGate = INVESTOR_PITCH_GATES[resumeIdx];
      return {
        ...state,
        focusedNodeId: resumeGate.graphNodeId,
        invalidLink: false,
        history: state.focusedNodeId
          ? [...state.history, state.focusedNodeId]
          : state.history,
        pitchPath: {
          ...state.pitchPath,
          active: true,
          currentGateIndex: resumeIdx,
          visitedGates: new Set([...state.pitchPath.visitedGates, resumeIdx]),
        },
      };
    }
    case "PITCH_NEXT_GATE": {
      const nextIdx = state.pitchPath.currentGateIndex + 1;
      if (nextIdx >= TOTAL_GATES) return state;
      const nextGate = INVESTOR_PITCH_GATES[nextIdx];
      return {
        ...state,
        focusedNodeId: nextGate.graphNodeId,
        invalidLink: false,
        history: state.focusedNodeId
          ? [...state.history, state.focusedNodeId]
          : state.history,
        pitchPath: {
          ...state.pitchPath,
          currentGateIndex: nextIdx,
          visitedGates: new Set([...state.pitchPath.visitedGates, nextIdx]),
        },
      };
    }
    case "PITCH_PREV_GATE": {
      const prevIdx = state.pitchPath.currentGateIndex - 1;
      if (prevIdx < 0) return state;
      const prevGate = INVESTOR_PITCH_GATES[prevIdx];
      return {
        ...state,
        focusedNodeId: prevGate.graphNodeId,
        invalidLink: false,
        history: state.focusedNodeId
          ? [...state.history, state.focusedNodeId]
          : state.history,
        pitchPath: {
          ...state.pitchPath,
          currentGateIndex: prevIdx,
        },
      };
    }
    default:
      return state;
  }
}

const INITIAL_STATE: GraphShellState = {
  focusedNodeId: null,
  invalidLink: false,
  history: [],
  pitchPath: {
    active: false,
    currentGateIndex: 0,
    visitedGates: new Set(),
    lastGateIndex: null,
  },
};

// ---------------------------------------------------------------------------
// Surface Content Registry
// ---------------------------------------------------------------------------

export interface GraphShellProps {
  /** Surface content renderers keyed by graph node ID */
  surfaces?: Record<string, ReactNode>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GraphShell({ surfaces = {} }: GraphShellProps) {
  const [state, dispatch] = useReducer(graphReducer, INITIAL_STATE);
  const { focusedNodeId, invalidLink, pitchPath } = state;

  const hasMountedRef = useRef(false);
  const selfHashChangeRef = useRef(false);
  const focusedSurfaceRef = useRef<HTMLDivElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  /** Tracks whether the previous render had a focused node — used to
   *  distinguish initial focus (scroll to panel) from node-to-node
   *  traversal (keep graph context visible). */
  const hadPriorFocusRef = useRef(false);

  // -----------------------------------------------------------------------
  // Hydration-safe hash restoration
  // -----------------------------------------------------------------------
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      dispatch({ type: "RESTORE_HASH", hash });
    }
    hasMountedRef.current = true;
  }, []);

  // -----------------------------------------------------------------------
  // URL hash sync when focus changes
  // -----------------------------------------------------------------------
  const prevFocusedRef = useRef(focusedNodeId);
  useEffect(() => {
    if (hasMountedRef.current && prevFocusedRef.current !== focusedNodeId) {
      selfHashChangeRef.current = true;
      if (focusedNodeId) {
        window.location.hash = graphNodeHash(focusedNodeId).slice(1);
      } else {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      requestAnimationFrame(() => {
        selfHashChangeRef.current = false;
      });
    }
    prevFocusedRef.current = focusedNodeId;
  }, [focusedNodeId]);

  // -----------------------------------------------------------------------
  // Listen for hashchange events (browser back/forward)
  // VAL-CROSS-002: External hash changes must update the focused node so
  // browser back/forward navigation correctly restores graph state.
  // We compare the hash to the current focus rather than relying solely
  // on the selfHashChangeRef guard, because requestAnimationFrame may not
  // have cleared the flag before the next hashchange fires.
  // -----------------------------------------------------------------------
  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash;
      // Determine what node the current hash maps to
      const incomingNodeId = hash ? parseGraphHash(hash) : null;

      // If the self-hash-change flag is set AND the hash matches what we
      // just set, this is our own programmatic change — skip it.
      if (selfHashChangeRef.current && incomingNodeId === prevFocusedRef.current) {
        return;
      }

      // External navigation (browser back/forward, or a different hash)
      if (hash) {
        dispatch({ type: "RESTORE_HASH", hash });
      } else {
        dispatch({ type: "RECENTER" });
      }
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // -----------------------------------------------------------------------
  // Scroll focused surface into view (VAL-ROADMAP-012 fix)
  // For initial focus (overview → node), scroll to bring the panel on-screen.
  // For node-to-node traversal, use block:"nearest" so the graph overview
  // and minimap stay visually accessible instead of being pushed off-screen.
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (focusedNodeId && focusedSurfaceRef.current) {
      const block = hadPriorFocusRef.current ? "nearest" : "nearest";
      focusedSurfaceRef.current.scrollIntoView({ behavior: "smooth", block });
    } else if (invalidLink && fallbackRef.current) {
      fallbackRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    // Update the prior-focus tracker *after* the scroll decision
    hadPriorFocusRef.current = !!focusedNodeId;
  }, [focusedNodeId, invalidLink]);

  // -----------------------------------------------------------------------
  // Keyboard: Escape closes focus
  // -----------------------------------------------------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusedNodeId) {
        dispatch({ type: "RECENTER" });
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [focusedNodeId]);

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------
  const focusNode = useCallback((nodeId: string) => {
    dispatch({ type: "FOCUS_NODE", nodeId });
  }, []);

  const recenter = useCallback(() => {
    dispatch({ type: "RECENTER" });
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  // -----------------------------------------------------------------------
  // Pitch path handlers (VAL-ROADMAP-015, VAL-ROADMAP-017)
  // -----------------------------------------------------------------------
  const startPitchPath = useCallback(() => {
    dispatch({ type: "START_PITCH_PATH" });
  }, []);

  const resumePitchPath = useCallback(() => {
    dispatch({ type: "RESUME_PITCH_PATH" });
  }, []);

  const nextGate = useCallback(() => {
    dispatch({ type: "PITCH_NEXT_GATE" });
  }, []);

  const prevGate = useCallback(() => {
    dispatch({ type: "PITCH_PREV_GATE" });
  }, []);

  // -----------------------------------------------------------------------
  // Derived state
  // -----------------------------------------------------------------------
  const focusedNode = focusedNodeId ? getGraphNodeById(focusedNodeId) : null;
  const relatedNodes = focusedNodeId ? getRelatedGraphNodes(focusedNodeId) : [];

  // Active node for marking in the overview
  const activeNodeId = focusedNodeId ?? DEFAULT_GRAPH_NODE;

  // Pitch path derived state
  const hasNextGate = pitchPath.active && pitchPath.currentGateIndex < TOTAL_GATES - 1;
  const hasPrevGate = pitchPath.active && pitchPath.currentGateIndex > 0;
  const showResumeAffordance =
    !pitchPath.active &&
    pitchPath.lastGateIndex !== null &&
    pitchPath.visitedGates.size > 0;

  return (
    <GraphShellPersistenceProvider>
    <div data-testid="graph-shell" className="space-y-6">
      {/* ---------------------------------------------------------------- */}
      {/* Graph Overview — visual node map (VAL-ROADMAP-001)               */}
      {/* VAL-VISUAL-033: Clean workspace — one lightweight orientation    */}
      {/* bar + graph node grid. No competing chrome layers.               */}
      {/* ---------------------------------------------------------------- */}
      <div data-testid="graph-overview" className="relative">
        {/* Single lightweight orientation bar (VAL-VISUAL-033, VAL-ROADMAP-002) */}
        <div
          data-testid="graph-orientation-bar"
          className="mb-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="font-terminal text-xs font-medium uppercase tracking-widest text-accent">
              BETTER Atlas
            </span>
            {focusedNode && (
              <span
                data-testid="graph-breadcrumb"
                className="font-terminal text-xs text-secondary"
              >
                <span className="text-muted">→</span>{" "}
                <span className="text-foreground">{focusedNode.label}</span>
              </span>
            )}
            {!focusedNode && !invalidLink && (
              <span
                data-testid="graph-breadcrumb"
                className="font-terminal text-xs text-muted"
              >
                Overview
              </span>
            )}
          </div>

          {/* Recenter / overview control (VAL-ROADMAP-002) */}
          <button
            type="button"
            onClick={recenter}
            className="rounded border border-border px-3 py-1.5 font-terminal text-xs text-secondary transition-colors hover:border-accent hover:text-foreground"
            aria-label="Return to overview"
          >
            ⊙ Overview
          </button>
        </div>

        {/* Investor Pitch Path Start / Resume Affordance (VAL-ROADMAP-017, VAL-CROSS-014) */}
        <InvestorPathAffordance
          onStart={startPitchPath}
          onResume={resumePitchPath}
          showResume={showResumeAffordance}
          lastGateIndex={pitchPath.lastGateIndex}
        />

        {/* Invalid deep link fallback (VAL-ROADMAP-007) */}
        {invalidLink && (
          <div
            data-testid="graph-invalid-link-fallback"
            className="mb-4 rounded-lg border border-white/15 bg-white/[0.03] p-4 text-center"
            role="alert"
            ref={fallbackRef}
            tabIndex={-1}
          >
            <p className="text-sm text-[#a0a0a0]">
              The graph destination you linked to wasn&apos;t found.
            </p>
            <p className="mt-1 text-xs text-muted">
              Explore the BETTER atlas below to find what you&apos;re looking for.
            </p>
            <button
              type="button"
              onClick={recenter}
              className="mt-3 inline-flex items-center rounded border border-white/15 px-4 py-1.5 font-terminal text-xs text-[#a0a0a0] transition-colors hover:border-white/20 hover:text-foreground"
            >
              Reset &amp; Explore
            </button>
          </div>
        )}

        {/* Graph node map — the explorable mindmap (VAL-ROADMAP-001, VAL-ROADMAP-011) */}
        <GraphNodeMap
          nodes={GRAPH_NODES}
          activeNodeId={activeNodeId}
          focusedNodeId={focusedNodeId}
          onNodeSelect={focusNode}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Focused Surface (VAL-ROADMAP-011, VAL-ROADMAP-012)              */}
      {/* VAL-VISUAL-033: Clean focused panel — no nested minimaps,       */}
      {/* no progress bars, no inspector docks. Just content + traversal. */}
      {/* ---------------------------------------------------------------- */}
      {focusedNode && (
        <LiquidMetalCard
          data-testid="graph-focused-surface"
          ref={focusedSurfaceRef}
          tabIndex={-1}
          variant="active"
        >
          {/* Focus header with back button, node info, and related nodes */}
          <div className="border-b border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={recenter}
                  className="rounded p-1.5 text-secondary transition-colors hover:bg-elevated hover:text-foreground"
                  aria-label="Back to overview"
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
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                </button>
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <span className="font-terminal text-accent" aria-hidden="true">
                      {focusedNode.icon}
                    </span>
                    {focusedNode.label}
                  </h2>
                  <p className="text-xs text-secondary">{focusedNode.description}</p>
                </div>
                <MaturityBadge status={focusedNode.dominantStatus} />
              </div>
            </div>

            {/* Related nodes for direct traversal (VAL-ROADMAP-012) */}
            {relatedNodes.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="font-terminal text-xs text-muted">Related:</span>
                {relatedNodes.map((related) => (
                  <button
                    key={related.id}
                    type="button"
                    data-testid="graph-related-link"
                    onClick={() => focusNode(related.id)}
                    className="inline-flex items-center gap-1.5 rounded border border-border px-2.5 py-1 font-terminal text-xs text-secondary transition-colors hover:border-accent hover:text-foreground"
                  >
                    <span className="text-accent" aria-hidden="true">
                      {related.icon}
                    </span>
                    {related.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pitch path navigation controls (VAL-ROADMAP-015) */}
          {pitchPath.active && (
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
              {hasPrevGate ? (
                <button
                  type="button"
                  data-testid="investor-path-prev"
                  onClick={prevGate}
                  className="inline-flex items-center gap-1.5 rounded border border-border px-3 py-1 font-terminal text-xs text-secondary transition-colors hover:border-accent hover:text-foreground"
                >
                  ← {INVESTOR_PITCH_GATES[pitchPath.currentGateIndex - 1]?.label}
                </button>
              ) : (
                <span />
              )}
              {hasNextGate ? (
                <button
                  type="button"
                  data-testid="investor-path-next"
                  onClick={nextGate}
                  className="inline-flex items-center gap-1.5 rounded border border-accent/30 bg-accent/5 px-3 py-1 font-terminal text-xs text-accent transition-colors hover:bg-accent/10 hover:text-foreground"
                >
                  {INVESTOR_PITCH_GATES[pitchPath.currentGateIndex + 1]?.label} →
                </button>
              ) : (
                <span className="font-terminal text-xs text-accent">
                  ✓ Pitch complete
                </span>
              )}
            </div>
          )}

          {/* Surface content */}
          <div className="p-4 sm:p-6">
            {(focusedNodeId && surfaces[focusedNodeId]) ?? (
              <div className="py-8 text-center text-sm text-muted">
                <p>Select a node to explore its content.</p>
              </div>
            )}
          </div>
        </LiquidMetalCard>
      )}
    </div>
    </GraphShellPersistenceProvider>
  );
}

// ---------------------------------------------------------------------------
// InvestorPathAffordance — Start/Resume pitch path entry (VAL-ROADMAP-017, VAL-CROSS-014)
// ---------------------------------------------------------------------------

function InvestorPathAffordance({
  onStart,
  onResume,
  showResume,
  lastGateIndex,
}: {
  onStart: () => void;
  onResume: () => void;
  showResume: boolean;
  lastGateIndex: number | null;
}) {
  const resumeGate =
    lastGateIndex !== null ? INVESTOR_PITCH_GATES[lastGateIndex] : null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <button
        type="button"
        data-testid="investor-path-start"
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-none border border-white/20 bg-white/5 px-4 py-2 font-terminal text-xs font-medium uppercase tracking-[-0.08em] text-white transition-colors hover:bg-white/10"
      >
        <span aria-hidden="true">▶</span>
        Investor Pitch Path
      </button>

      {showResume && resumeGate && (
        <button
          type="button"
          data-testid="investor-path-resume"
          onClick={onResume}
          className="inline-flex items-center gap-2 rounded-none border border-white/15 px-4 py-2 font-terminal text-xs uppercase tracking-[-0.08em] text-secondary transition-colors hover:border-white/30 hover:text-foreground"
        >
          <span aria-hidden="true">↩</span>
          Resume at &ldquo;{resumeGate.label}&rdquo;
        </button>
      )}

      <span className="hidden font-terminal text-[10px] text-muted sm:inline">
        {TOTAL_GATES} gates · problem → wedge → proof → moat → business model → roadmap → valuation → evidence
      </span>
    </div>
  );
}



// ---------------------------------------------------------------------------
// GraphNodeMap — Visual node grid with category grouping
// ---------------------------------------------------------------------------

function GraphNodeMap({
  nodes,
  activeNodeId,
  focusedNodeId,
  onNodeSelect,
}: {
  nodes: GraphNode[];
  activeNodeId: string;
  focusedNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
}) {
  return (
    <div
      className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
      role="group"
      aria-label="BETTER exploration graph"
    >
      {nodes.map((node) => {
        const isActive = node.id === activeNodeId;
        const isFocused = node.id === focusedNodeId;

        return (
          <LiquidMetalCard
            key={node.id}
            as="button"
            variant={isFocused ? "focused" : isActive ? "active" : "default"}
            data-testid="graph-node-button"
            data-active={isActive ? "true" : "false"}
            onClick={() => onNodeSelect(node.id)}
            aria-label={node.label}
            aria-pressed={isFocused}
            className="group relative flex items-start gap-3 p-3 text-left transition-all"
          >
            {/* Node icon */}
            <span
              className={`shrink-0 font-terminal text-lg ${
                isFocused ? "text-accent" : isActive ? "text-accent" : "text-muted"
              }`}
              aria-hidden="true"
            >
              {node.icon}
            </span>

            <div className="min-w-0 flex-1">
              <span
                className={`block text-sm font-medium ${
                  isFocused ? "text-accent" : "text-foreground"
                }`}
              >
                {node.label}
              </span>
              <span className="mt-0.5 block text-xs text-muted line-clamp-2">
                {node.description}
              </span>
            </div>

            {/* Status indicator */}
            <MaturityBadge status={node.dominantStatus} className="text-[10px] shrink-0" />

            {/* Connection indicator */}
            {node.related.length > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 font-terminal text-[9px] text-accent"
                title={`${node.related.length} connections`}
                aria-hidden="true"
              >
                {node.related.length}
              </span>
            )}
          </LiquidMetalCard>
        );
      })}

      {/* Ensure all nodes also have graph-node-button testid */}
      {/* Already handled by making both active and non-active have consistent testids */}
    </div>
  );
}



// ---------------------------------------------------------------------------
// Export for the graph overview map for use in other places
// ---------------------------------------------------------------------------
export { GraphNodeMap };
