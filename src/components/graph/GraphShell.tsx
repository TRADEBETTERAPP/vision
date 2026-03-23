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
 * - VAL-ROADMAP-014: Default state is pure graph workspace with sticky inspector + minimap
 * - VAL-ROADMAP-015: Guided VC-friendly pitch path through ordered gates
 * - VAL-ROADMAP-017: Discoverable start affordance + resumable with progress cues
 * - VAL-CROSS-014: Investor-path entry from default graph workspace
 */

import React, {
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
      return {
        ...state,
        focusedNodeId: nodeId,
        invalidLink: false,
        history: state.history,
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
  const currentGate = pitchPath.active
    ? INVESTOR_PITCH_GATES[pitchPath.currentGateIndex]
    : null;
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
      {/* ---------------------------------------------------------------- */}
      <div data-testid="graph-overview" className="relative">
        {/* Orientation header */}
        <div className="mb-4 flex items-center justify-between">
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
            className="mb-4 rounded-lg border border-accent-warn/30 bg-accent-warn/5 p-4 text-center"
            role="alert"
            ref={fallbackRef}
            tabIndex={-1}
          >
            <p className="text-sm text-accent-warn">
              The graph destination you linked to wasn&apos;t found.
            </p>
            <p className="mt-1 text-xs text-muted">
              Explore the BETTER atlas below to find what you&apos;re looking for.
            </p>
            <button
              type="button"
              onClick={recenter}
              className="mt-3 inline-flex items-center rounded border border-accent-warn/30 px-4 py-1.5 font-terminal text-xs text-accent-warn transition-colors hover:border-accent-warn hover:text-foreground"
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

        {/* Persistent minimap / orientation (VAL-ROADMAP-014) — always visible */}
        <PersistentMinimap
          nodes={GRAPH_NODES}
          activeNodeId={activeNodeId}
          focusedNodeId={focusedNodeId}
          onNodeSelect={focusNode}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Sticky Inspector — persistent detail dock (VAL-ROADMAP-014)     */}
      {/* ---------------------------------------------------------------- */}
      <div data-testid="graph-sticky-inspector" className="sticky top-16 z-30">
        {focusedNode ? (
          <div className="rounded-lg border border-accent/20 bg-surface/80 px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="font-terminal text-accent" aria-hidden="true">
                {focusedNode.icon}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {focusedNode.label}
              </span>
              <MaturityBadge
                status={focusedNode.dominantStatus}
                className="text-[10px]"
              />
              {currentGate && (
                <span className="ml-auto font-terminal text-[10px] uppercase tracking-widest text-accent">
                  Investor Path — Gate {pitchPath.currentGateIndex + 1}/{TOTAL_GATES}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border/50 bg-surface/60 px-4 py-2 backdrop-blur-sm">
            <p className="text-center font-terminal text-xs text-muted">
              Select a node to inspect · or{" "}
              <button
                type="button"
                onClick={startPitchPath}
                className="text-accent underline underline-offset-2 hover:text-foreground"
              >
                start the investor path
              </button>
            </p>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Focused Surface (VAL-ROADMAP-011, VAL-ROADMAP-012)              */}
      {/* ---------------------------------------------------------------- */}
      {focusedNode && (
        <div
          data-testid="graph-focused-surface"
          ref={focusedSurfaceRef}
          tabIndex={-1}
          className="rounded-lg border border-accent/20 bg-surface/50 backdrop-blur-sm"
        >
          {/* Pitch path progress bar (VAL-ROADMAP-015, VAL-ROADMAP-017) */}
          {pitchPath.active && (
            <InvestorPathProgress
              currentIndex={pitchPath.currentGateIndex}
              visitedGates={pitchPath.visitedGates}
              onGateSelect={(idx) => {
                const gate = INVESTOR_PITCH_GATES[idx];
                if (gate) focusNode(gate.graphNodeId);
              }}
            />
          )}

          {/* Focus header with breadcrumb and related nodes */}
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

          {/* Graph context minimap — visible orientation frame (VAL-ROADMAP-012) */}
          <GraphContextMinimap
            nodes={GRAPH_NODES}
            activeNodeId={focusedNodeId!}
            relatedNodeIds={focusedNode.related}
            onNodeSelect={focusNode}
          />

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
        </div>
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
        className="inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent/5 px-4 py-2 font-terminal text-xs font-medium text-accent transition-colors hover:bg-accent/10 hover:text-foreground"
      >
        <span aria-hidden="true">▶</span>
        Investor Pitch Path
      </button>

      {showResume && resumeGate && (
        <button
          type="button"
          data-testid="investor-path-resume"
          onClick={onResume}
          className="inline-flex items-center gap-2 rounded-md border border-accent/20 px-4 py-2 font-terminal text-xs text-secondary transition-colors hover:border-accent hover:text-foreground"
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
// InvestorPathProgress — Gate progress bar (VAL-ROADMAP-015, VAL-ROADMAP-017)
// ---------------------------------------------------------------------------

function InvestorPathProgress({
  currentIndex,
  visitedGates,
  onGateSelect,
}: {
  currentIndex: number;
  visitedGates: Set<number>;
  onGateSelect: (idx: number) => void;
}) {
  return (
    <div
      data-testid="investor-path-progress"
      className="flex items-center gap-1 overflow-x-auto border-b border-accent/20 bg-accent/5 px-4 py-2"
      role="navigation"
      aria-label="Investor pitch path progress"
    >
      <span className="mr-2 shrink-0 font-terminal text-[10px] uppercase tracking-widest text-accent">
        {currentIndex + 1} of {TOTAL_GATES}
      </span>
      {INVESTOR_PITCH_GATES.map((gate, idx) => {
        const isCurrent = idx === currentIndex;
        const isVisited = visitedGates.has(idx) && !isCurrent;

        const gateState: "current" | "visited" | "upcoming" = isCurrent
          ? "current"
          : isVisited
            ? "visited"
            : "upcoming";

        return (
          <React.Fragment key={gate.id}>
            {idx > 0 && (
              <span
                className={`h-px w-3 shrink-0 ${
                  isVisited || isCurrent ? "bg-accent/50" : "bg-border"
                }`}
                aria-hidden="true"
              />
            )}
            <button
              type="button"
              data-testid="investor-gate-indicator"
              data-state={gateState}
              onClick={() => onGateSelect(idx)}
              aria-label={`${gate.label} — gate ${idx + 1}`}
              aria-current={isCurrent ? "step" : undefined}
              className={`inline-flex shrink-0 items-center gap-1 rounded px-2 py-0.5 font-terminal text-[10px] transition-colors ${
                isCurrent
                  ? "bg-accent/20 text-accent ring-1 ring-accent/40"
                  : isVisited
                    ? "bg-accent/10 text-secondary hover:text-foreground"
                    : "text-muted hover:bg-elevated hover:text-secondary"
              }`}
            >
              <span aria-hidden="true">{gate.icon}</span>
              <span className="hidden lg:inline">{gate.label}</span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PersistentMinimap — always-visible orientation cue (VAL-ROADMAP-014)
// Shows a compact minimap bar below the node grid in both overview and
// focused states, ensuring users always know where they are.
// ---------------------------------------------------------------------------

function PersistentMinimap({
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
      data-testid="graph-persistent-minimap"
      className="mt-3 flex flex-wrap items-center gap-1 rounded-md border border-border/30 bg-background/40 px-3 py-1.5 backdrop-blur-sm"
      role="navigation"
      aria-label="Graph position minimap"
    >
      <span className="mr-1 font-terminal text-[9px] uppercase tracking-widest text-muted">
        Map
      </span>
      {nodes.map((node) => {
        const isActive = node.id === activeNodeId;
        const isFocused = node.id === focusedNodeId;

        return (
          <button
            key={node.id}
            type="button"
            data-testid="persistent-minimap-node"
            data-active={isActive ? "true" : "false"}
            onClick={() => onNodeSelect(node.id)}
            aria-label={node.label}
            className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-terminal text-[10px] transition-colors ${
              isFocused
                ? "bg-accent/20 text-accent ring-1 ring-accent/30"
                : isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:bg-elevated hover:text-secondary"
            }`}
          >
            <span aria-hidden="true">{node.icon}</span>
            <span className="hidden md:inline">{node.label}</span>
          </button>
        );
      })}
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
          <button
            key={node.id}
            type="button"
            data-testid="graph-node-button"
            data-active={isActive ? "true" : "false"}
            onClick={() => onNodeSelect(node.id)}
            aria-label={node.label}
            aria-pressed={isFocused}
            className={`group relative flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
              isFocused
                ? "border-accent/50 bg-accent/10 ring-1 ring-accent/30"
                : isActive
                  ? "border-accent/30 bg-accent/5"
                  : "border-border bg-surface hover:border-accent/30 hover:bg-accent/5"
            }`}
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
          </button>
        );
      })}

      {/* Ensure all nodes also have graph-node-button testid */}
      {/* Already handled by making both active and non-active have consistent testids */}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GraphContextMinimap — Compact inline graph orientation bar (VAL-ROADMAP-012)
//
// Rendered inside the focused surface so it always stays within the viewport
// when the panel is visible. Highlights the active node, related nodes, and
// provides click-to-navigate traversal without requiring users to scroll back
// up to the full overview map.
// ---------------------------------------------------------------------------

function GraphContextMinimap({
  nodes,
  activeNodeId,
  relatedNodeIds,
  onNodeSelect,
}: {
  nodes: GraphNode[];
  activeNodeId: string;
  relatedNodeIds: string[];
  onNodeSelect: (nodeId: string) => void;
}) {
  const relatedSet = new Set(relatedNodeIds);

  return (
    <div
      data-testid="graph-context-minimap"
      className="flex flex-wrap items-center gap-1.5 border-b border-border/50 bg-background/30 px-4 py-2"
      role="navigation"
      aria-label="Graph context minimap"
    >
      <span className="mr-1 font-terminal text-[10px] uppercase tracking-widest text-muted">
        Atlas
      </span>
      {nodes.map((node) => {
        const isActive = node.id === activeNodeId;
        const isRelated = relatedSet.has(node.id);

        return (
          <button
            key={node.id}
            type="button"
            data-testid="minimap-node"
            data-active={isActive ? "true" : "false"}
            data-related={isRelated ? "true" : "false"}
            onClick={() => onNodeSelect(node.id)}
            aria-label={node.label}
            aria-current={isActive ? "true" : undefined}
            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-terminal text-[11px] transition-colors ${
              isActive
                ? "bg-accent/20 text-accent ring-1 ring-accent/30"
                : isRelated
                  ? "bg-accent/5 text-secondary hover:bg-accent/10 hover:text-foreground"
                  : "text-muted hover:bg-elevated hover:text-secondary"
            }`}
          >
            <span aria-hidden="true">{node.icon}</span>
            <span className="hidden sm:inline">{node.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export for the graph overview map for use in other places
// ---------------------------------------------------------------------------
export { GraphNodeMap };
