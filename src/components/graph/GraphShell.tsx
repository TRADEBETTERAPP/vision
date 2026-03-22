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
import MaturityBadge from "@/components/MaturityBadge";

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
}

type GraphAction =
  | { type: "FOCUS_NODE"; nodeId: string }
  | { type: "RESTORE_HASH"; hash: string }
  | { type: "RECENTER" }
  | { type: "GO_BACK" };

function graphReducer(state: GraphShellState, action: GraphAction): GraphShellState {
  switch (action.type) {
    case "FOCUS_NODE": {
      const node = getGraphNodeById(action.nodeId);
      if (!node) return { ...state, invalidLink: true, focusedNodeId: null };
      return {
        focusedNodeId: action.nodeId,
        invalidLink: false,
        history: state.focusedNodeId
          ? [...state.history, state.focusedNodeId]
          : state.history,
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
        focusedNodeId: nodeId,
        invalidLink: false,
        history: state.history,
      };
    }
    case "RECENTER":
      return { focusedNodeId: null, invalidLink: false, history: [] };
    case "GO_BACK": {
      const prev = state.history[state.history.length - 1] ?? null;
      return {
        focusedNodeId: prev,
        invalidLink: false,
        history: state.history.slice(0, -1),
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
  const { focusedNodeId, invalidLink } = state;

  const hasMountedRef = useRef(false);
  const selfHashChangeRef = useRef(false);
  const focusedSurfaceRef = useRef<HTMLDivElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);

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
  // -----------------------------------------------------------------------
  useEffect(() => {
    const handler = () => {
      if (selfHashChangeRef.current) return;
      const hash = window.location.hash;
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
  // Scroll focused surface into view
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (focusedNodeId && focusedSurfaceRef.current) {
      focusedSurfaceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (invalidLink && fallbackRef.current) {
      fallbackRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
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
  // Derived state
  // -----------------------------------------------------------------------
  const focusedNode = focusedNodeId ? getGraphNodeById(focusedNodeId) : null;
  const relatedNodes = focusedNodeId ? getRelatedGraphNodes(focusedNodeId) : [];

  // Active node for marking in the overview
  const activeNodeId = focusedNodeId ?? DEFAULT_GRAPH_NODE;

  return (
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
// Export for the graph overview map for use in other places
// ---------------------------------------------------------------------------
export { GraphNodeMap };
