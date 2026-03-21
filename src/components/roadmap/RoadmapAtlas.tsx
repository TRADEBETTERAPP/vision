"use client";

import React, { useEffect, useCallback, useRef } from "react";
import {
  BRANCH_FAMILY_LABELS,
} from "@/content/types";
import {
  getNodesByFamily,
  getNodeById,
  type RoadmapNode,
} from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import RoadmapNodeDetail from "./RoadmapNodeDetail";
import RoadmapStorySection, { FAMILY_KEYS } from "./RoadmapStorySection";

/** Extract node ID from a URL hash like "#node-pe-terminal-beta" */
function getNodeIdFromHash(hash: string): string | null {
  if (hash.startsWith("#node-")) {
    return hash.slice(6); // Remove "#node-"
  }
  return null;
}

/**
 * Interactive Roadmap Atlas — the core roadmap exploration surface.
 *
 * Satisfies:
 * - VAL-ROADMAP-001: Identifiable as interactive with focal point and affordances
 * - VAL-ROADMAP-002: Wayfinding stays recoverable (collapse all / reset)
 * - VAL-ROADMAP-003: Scroll storytelling and roadmap state stay in sync
 * - VAL-ROADMAP-004: Expand/collapse behaves predictably
 * - VAL-ROADMAP-005: Node details show correct content and status
 * - VAL-ROADMAP-006: Valid deep links restore state
 * - VAL-ROADMAP-007: Invalid deep links fail gracefully
 * - VAL-ROADMAP-008: Keyboard and assistive semantics
 * - VAL-ROADMAP-009: Mobile/touch usable
 * - VAL-ROADMAP-010: Covers required BETTER domains
 */
/** Combined roadmap UI state managed by reducer for clean effect-free initialization */
interface RoadmapUIState {
  expandedBranches: Record<string, boolean>;
  selectedNodeId: string | null;
  invalidDeepLink: boolean;
  activeFamilyIndex: number;
}

type RoadmapAction =
  | { type: "RESTORE_HASH"; hash: string }
  | { type: "TOGGLE_BRANCH"; family: string }
  | { type: "SELECT_NODE"; nodeId: string }
  | { type: "CLOSE_DETAIL" }
  | { type: "COLLAPSE_ALL" }
  | { type: "SET_ACTIVE_FAMILY"; index: number; expandFamily?: string };

function roadmapReducer(state: RoadmapUIState, action: RoadmapAction): RoadmapUIState {
  switch (action.type) {
    case "RESTORE_HASH": {
      const nodeId = getNodeIdFromHash(action.hash);
      if (nodeId) {
        const node = getNodeById(nodeId);
        if (node) {
          const familyIndex = FAMILY_KEYS.indexOf(node.family);
          return {
            ...state,
            selectedNodeId: nodeId,
            // Preserve existing expanded branches; also expand the target family
            expandedBranches: { ...state.expandedBranches, [node.family]: true },
            invalidDeepLink: false,
            activeFamilyIndex: familyIndex >= 0 ? familyIndex : state.activeFamilyIndex,
          };
        }
        // Invalid deep link
        return { ...state, selectedNodeId: null, invalidDeepLink: true };
      }
      return state;
    }
    case "TOGGLE_BRANCH":
      return {
        ...state,
        expandedBranches: {
          ...state.expandedBranches,
          [action.family]: !state.expandedBranches[action.family],
        },
      };
    case "SELECT_NODE": {
      // When selecting a node, also sync the active family index
      // and ensure the node's branch stays expanded — but preserve
      // all other expanded branches (VAL-ROADMAP-004).
      const node = getNodeById(action.nodeId);
      const familyIndex = node ? FAMILY_KEYS.indexOf(node.family) : state.activeFamilyIndex;
      return {
        ...state,
        selectedNodeId: action.nodeId,
        invalidDeepLink: false,
        activeFamilyIndex: familyIndex >= 0 ? familyIndex : state.activeFamilyIndex,
        expandedBranches: node
          ? { ...state.expandedBranches, [node.family]: true }
          : state.expandedBranches,
      };
    }
    case "CLOSE_DETAIL":
      return { ...state, selectedNodeId: null };
    case "COLLAPSE_ALL":
      return { ...state, expandedBranches: {}, selectedNodeId: null, invalidDeepLink: false };
    case "SET_ACTIVE_FAMILY":
      return {
        ...state,
        activeFamilyIndex: action.index,
        expandedBranches: action.expandFamily
          ? { ...state.expandedBranches, [action.expandFamily]: true }
          : state.expandedBranches,
      };
    default:
      return state;
  }
}

/** SSR-safe initial state — hash is read after mount via useEffect */
const INITIAL_STATE: RoadmapUIState = {
  expandedBranches: {},
  selectedNodeId: null,
  invalidDeepLink: false,
  activeFamilyIndex: 0,
};

export default function RoadmapAtlas() {
  const [state, dispatch] = React.useReducer(roadmapReducer, INITIAL_STATE);

  const { expandedBranches, selectedNodeId, invalidDeepLink, activeFamilyIndex } = state;

  // Track whether the initial hash has been applied (hydration-safe).
  // Uses a ref instead of state to avoid triggering a cascading render.
  const hasMountedRef = useRef(false);

  // Ref for scroll observation
  const branchSectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Refs for deep-link visibility: scroll & focus targets
  const detailPanelRef = useRef<HTMLDivElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);

  // Guard: when true, the IntersectionObserver scroll-sync is temporarily
  // suppressed to prevent layout-shift-driven observer firings from
  // overriding an explicit user interaction (node selection, tab click).
  const scrollSyncLockedRef = useRef(false);
  const scrollSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Lock scroll-sync for a brief window after explicit interactions */
  const lockScrollSync = useCallback(() => {
    scrollSyncLockedRef.current = true;
    if (scrollSyncTimerRef.current) clearTimeout(scrollSyncTimerRef.current);
    scrollSyncTimerRef.current = setTimeout(() => {
      scrollSyncLockedRef.current = false;
    }, 600);
  }, []);

  // -------------------------------------------------------------------
  // Hydration-safe hash restoration: read the hash ONLY after mount
  // so the server and client initial renders match (VAL-ROADMAP-006).
  // -------------------------------------------------------------------
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      dispatch({ type: "RESTORE_HASH", hash });
    }
    hasMountedRef.current = true;
  }, []);

  // -------------------------------------------------------------------
  // Deep-link visibility: scroll & focus the detail panel or fallback
  // into view so the user sees the result of a direct #node-* load.
  // -------------------------------------------------------------------
  useEffect(() => {
    if (selectedNodeId && detailPanelRef.current) {
      detailPanelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      detailPanelRef.current.focus({ preventScroll: true });
    } else if (invalidDeepLink && fallbackRef.current) {
      fallbackRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      fallbackRef.current.focus({ preventScroll: true });
    }
  }, [selectedNodeId, invalidDeepLink]);

  // -------------------------------------------------------------------
  // URL hash sync when node is selected/deselected
  // -------------------------------------------------------------------
  // Track whether we are programmatically setting the hash so the
  // hashchange listener can ignore self-triggered events.
  const selfHashChangeRef = useRef(false);
  const prevSelectedRef = useRef(selectedNodeId);
  useEffect(() => {
    // Only update hash when selection changed after initial mount
    if (hasMountedRef.current && prevSelectedRef.current !== selectedNodeId && selectedNodeId) {
      selfHashChangeRef.current = true;
      window.location.hash = `node-${selectedNodeId}`;
      // Reset the flag after the current event-loop tick
      requestAnimationFrame(() => {
        selfHashChangeRef.current = false;
      });
    }
    prevSelectedRef.current = selectedNodeId;
  }, [selectedNodeId]);

  // -------------------------------------------------------------------
  // Listen for hashchange events (e.g., browser back/forward, external links)
  // Ignore self-triggered hash changes to avoid resetting branch state.
  // -------------------------------------------------------------------
  useEffect(() => {
    const handler = () => {
      if (selfHashChangeRef.current) return;
      const hash = window.location.hash;
      if (hash) {
        dispatch({ type: "RESTORE_HASH", hash });
      }
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // -------------------------------------------------------------------
  // Scroll-linked sync: scroll event listener that recomputes the
  // topmost visible branch section on every scroll.  This replaces the
  // previous IntersectionObserver approach which broke when branch
  // sections had widely varying heights (collapsed ≈ 58 px vs
  // expanded ≈ 900 px), causing rigid threshold + rootMargin
  // combinations to miss transitions.
  //
  // Algorithm: on every scroll, find the first (topmost) branch section
  // whose *bottom* is still below the "activation line" — a point 25 %
  // down from the viewport top.  This ensures:
  //   • Forward scrolling: as a section's bottom scrolls above the line,
  //     the next section becomes active.
  //   • Backward scrolling: the moment a higher section's bottom
  //     re-enters below the line, it immediately reclaims active status.
  //
  // Guarded by scrollSyncLockedRef to prevent layout-shift noise from
  // overriding explicit user interactions (VAL-ROADMAP-003).
  // -------------------------------------------------------------------
  useEffect(() => {
    let rafId: number | null = null;

    const syncActiveFamily = () => {
      if (scrollSyncLockedRef.current) return;

      const refs = branchSectionRefs.current;
      const activationLine = window.innerHeight * 0.25;
      let bestIndex = -1;

      for (let i = 0; i < refs.length; i++) {
        const el = refs[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // A section "owns" the scroll position when its bottom is still
        // below the activation line (it hasn't scrolled past).
        if (rect.bottom > activationLine) {
          bestIndex = i;
          break;
        }
      }

      if (bestIndex >= 0) {
        dispatch({ type: "SET_ACTIVE_FAMILY", index: bestIndex });
      }
    };

    const onScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncActiveFamily);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Run once on mount so the initial scroll position is reflected
    syncActiveFamily();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // -------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------
  const toggleBranch = useCallback((family: string) => {
    dispatch({ type: "TOGGLE_BRANCH", family });
  }, []);

  const selectNode = useCallback((nodeId: string) => {
    lockScrollSync();
    dispatch({ type: "SELECT_NODE", nodeId });
  }, [lockScrollSync]);

  const closeDetail = useCallback(() => {
    dispatch({ type: "CLOSE_DETAIL" });
    // Clear hash without triggering scroll
    if (window.location.hash.startsWith("#node-")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const collapseAll = useCallback(() => {
    dispatch({ type: "COLLAPSE_ALL" });
    if (window.location.hash.startsWith("#node-")) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const handleStoryFamilyChange = useCallback(
    (index: number) => {
      lockScrollSync();
      const family = FAMILY_KEYS[index];
      dispatch({ type: "SET_ACTIVE_FAMILY", index, expandFamily: family });
      // Scroll the branch section into view
      const ref = branchSectionRefs.current[index];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },
    [lockScrollSync]
  );

  // Handle Escape key for closing detail panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedNodeId) {
        closeDetail();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selectedNodeId, closeDetail]);

  // -------------------------------------------------------------------
  // Get selected node data
  // -------------------------------------------------------------------
  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) : null;

  return (
    <div className="space-y-8" data-testid="roadmap-atlas">
      {/* Interactive prompt / legend */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-terminal text-sm text-secondary">
          <span className="text-accent" aria-hidden="true">
            ▶
          </span>{" "}
          Explore the roadmap by expanding branch families below. Click any node
          for details.
        </p>
        <button
          type="button"
          onClick={collapseAll}
          className="shrink-0 rounded border border-border px-3 py-1.5 font-terminal text-xs text-secondary transition-colors hover:border-accent hover:text-foreground"
          aria-label="Collapse all branches"
        >
          Collapse All
        </button>
      </div>

      {/* Invalid deep link fallback */}
      {invalidDeepLink && (
        <div
          data-testid="roadmap-invalid-link-fallback"
          className="rounded-lg border border-accent-warn/30 bg-accent-warn/5 p-4 text-center"
          role="alert"
          ref={fallbackRef}
          tabIndex={-1}
        >
          <p className="text-sm text-accent-warn">
            The roadmap node you linked to wasn&apos;t found. It may have been
            renamed or removed.
          </p>
          <p className="mt-1 text-xs text-muted">
            Explore the full roadmap below to find what you&apos;re looking for.
          </p>
          <button
            type="button"
            onClick={collapseAll}
            className="mt-3 inline-flex items-center rounded border border-accent-warn/30 px-4 py-1.5 font-terminal text-xs text-accent-warn transition-colors hover:border-accent-warn hover:text-foreground"
          >
            Reset &amp; Explore Roadmap
          </button>
        </div>
      )}

      {/* Main layout: Story panels + Branch explorer */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left: Scroll-linked story panels (visible on lg+) */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <RoadmapStorySection
              activeFamilyIndex={activeFamilyIndex}
              onActiveFamilyChange={handleStoryFamilyChange}
            />
          </div>
        </div>

        {/* Right: Interactive branch explorer */}
        <div className="space-y-4">
          {FAMILY_KEYS.map((family, index) => {
            const nodes = getNodesByFamily(family);
            const isExpanded = !!expandedBranches[family];

            return (
              <div
                key={family}
                ref={(el) => {
                  branchSectionRefs.current[index] = el;
                }}
                data-testid="roadmap-branch-section"
              >
                {/* Branch family toggle header */}
                <button
                  type="button"
                  onClick={() => toggleBranch(family)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleBranch(family);
                    }
                  }}
                  aria-expanded={isExpanded}
                  aria-label={BRANCH_FAMILY_LABELS[family]}
                  className={`group flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                    isExpanded
                      ? "border-accent/30 bg-accent/5"
                      : "border-border bg-surface hover:border-border-active"
                  }`}
                  data-testid="roadmap-branch-toggle"
                >
                  {/* Expand/collapse chevron */}
                  <span
                    className={`shrink-0 font-terminal text-sm text-accent transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▸
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold text-foreground">
                      {BRANCH_FAMILY_LABELS[family]}
                    </span>
                    <span className="ml-2 font-terminal text-xs text-muted">
                      {nodes.length} nodes
                    </span>
                  </div>
                  {/* Quick status indicators */}
                  <div className="hidden shrink-0 gap-1 sm:flex">
                    {nodes
                      .filter((n) => n.status === "live")
                      .slice(0, 1)
                      .map(() => (
                        <span
                          key="live-dot"
                          className="h-2 w-2 rounded-full bg-accent"
                          title="Has live items"
                        />
                      ))}
                    {nodes.some((n) => n.status === "in_progress") && (
                      <span
                        className="h-2 w-2 rounded-full bg-accent-secondary"
                        title="Has in-progress items"
                      />
                    )}
                    {nodes.some((n) => n.status === "planned") && (
                      <span
                        className="h-2 w-2 rounded-full bg-accent-warn"
                        title="Has planned items"
                      />
                    )}
                  </div>
                </button>

                {/* Expanded nodes list */}
                {isExpanded && (
                  <div
                    className="mt-2 space-y-2 pl-4 sm:pl-8"
                    role="group"
                    aria-label={`${BRANCH_FAMILY_LABELS[family]} nodes`}
                  >
                    {nodes.map((node) => (
                      <RoadmapNodeItem
                        key={node.id}
                        node={node}
                        isSelected={selectedNodeId === node.id}
                        onSelect={() => selectNode(node.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel — shown when a node is selected */}
      {selectedNode && (
        <div
          className="mt-6"
          ref={detailPanelRef}
          tabIndex={-1}
          data-testid="roadmap-detail-scroll-target"
        >
          <RoadmapNodeDetail node={selectedNode} onClose={closeDetail} />
        </div>
      )}

      {/* Mobile story panels (visible below lg) */}
      <div className="lg:hidden">
        <details className="rounded-lg border border-border bg-surface">
          <summary className="cursor-pointer p-4 font-terminal text-sm font-medium text-secondary">
            Branch Family Overview
          </summary>
          <div className="border-t border-border p-4">
            <RoadmapStorySection
              activeFamilyIndex={activeFamilyIndex}
              onActiveFamilyChange={handleStoryFamilyChange}
            />
          </div>
        </details>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Individual node item in a branch
// ---------------------------------------------------------------------------

function RoadmapNodeItem({
  node,
  isSelected,
  onSelect,
}: {
  node: RoadmapNode;
  isSelected: boolean;
  onSelect: () => void;
}) {
  // Leaf nodes (no dependents that are also in the tree) don't show expand controls
  const hasChildren = false; // Nodes in this flat list don't have sub-nodes

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={node.title}
      aria-pressed={isSelected}
      className={`flex w-full items-center gap-3 rounded-md border p-3 text-left transition-all ${
        isSelected
          ? "border-accent/40 bg-accent/10"
          : "border-border bg-background hover:border-border-active hover:bg-surface"
      }`}
      data-testid="roadmap-node-item"
      data-node-id={node.id}
    >
      {/* Connection line indicator */}
      <span
        className="shrink-0 font-terminal text-xs text-muted"
        aria-hidden="true"
      >
        {node.dependencies.length > 0 ? "├─" : "──"}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-sm font-medium ${
              isSelected ? "text-accent" : "text-foreground"
            }`}
          >
            {node.title}
          </span>
          <MaturityBadge status={node.status} className="text-[10px]" />
        </div>
        {/* Short summary on desktop */}
        <p className="mt-0.5 hidden text-xs text-muted sm:line-clamp-1 sm:block">
          {node.summary}
        </p>
      </div>

      {/* Not a leaf with sub-expansion */}
      {!hasChildren && (
        <span
          className="shrink-0 font-terminal text-xs text-muted"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </button>
  );
}
