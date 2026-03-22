"use client";

/**
 * GraphShellPersistence — React context that persists sub-surface state
 * above the unmount boundary.
 *
 * When users navigate between graph surfaces, inactive surface components
 * unmount. This context stores tokenomics scenario/input state and roadmap
 * expanded-branch state at the GraphShell level so they survive cross-surface
 * handoffs and browser back/forward flows.
 *
 * Fixes the scrutiny blockers:
 * - tokenomics scenario/input state reset on surface unmount
 * - roadmap expanded-branch state reset on surface unmount
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { ScenarioLevel } from "@/content/types";

// ---------------------------------------------------------------------------
// Tokenomics persistence state
// ---------------------------------------------------------------------------

export interface TokenomicsPersistenceState {
  activeLevel: ScenarioLevel;
  tokenBalance: string;
  depositAmount: string;
}

const DEFAULT_TOKENOMICS_STATE: TokenomicsPersistenceState = {
  activeLevel: "base",
  tokenBalance: "",
  depositAmount: "",
};

// ---------------------------------------------------------------------------
// Roadmap persistence state
// ---------------------------------------------------------------------------

export interface RoadmapPersistenceState {
  expandedBranches: Record<string, boolean>;
}

const DEFAULT_ROADMAP_STATE: RoadmapPersistenceState = {
  expandedBranches: {},
};

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface GraphShellPersistenceContextValue {
  /** Persisted tokenomics state */
  tokenomics: TokenomicsPersistenceState;
  /** Update persisted tokenomics state (partial merge) */
  setTokenomicsState: (update: Partial<TokenomicsPersistenceState>) => void;

  /** Persisted roadmap expanded-branch state */
  roadmap: RoadmapPersistenceState;
  /** Update persisted roadmap state (partial merge) */
  setRoadmapState: (update: Partial<RoadmapPersistenceState>) => void;
}

const GraphShellPersistenceContext =
  createContext<GraphShellPersistenceContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function GraphShellPersistenceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tokenomics, setTokenomics] = useState<TokenomicsPersistenceState>(
    DEFAULT_TOKENOMICS_STATE
  );
  const [roadmap, setRoadmap] = useState<RoadmapPersistenceState>(
    DEFAULT_ROADMAP_STATE
  );

  const setTokenomicsState = useCallback(
    (update: Partial<TokenomicsPersistenceState>) => {
      setTokenomics((prev) => ({ ...prev, ...update }));
    },
    []
  );

  const setRoadmapState = useCallback(
    (update: Partial<RoadmapPersistenceState>) => {
      setRoadmap((prev) => ({ ...prev, ...update }));
    },
    []
  );

  const value = useMemo(
    () => ({ tokenomics, setTokenomicsState, roadmap, setRoadmapState }),
    [tokenomics, setTokenomicsState, roadmap, setRoadmapState]
  );

  return (
    <GraphShellPersistenceContext.Provider value={value}>
      {children}
    </GraphShellPersistenceContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the shared graph-shell persistence context.
 * Returns null when used outside the provider (e.g. standalone tests).
 */
export function useGraphShellPersistence(): GraphShellPersistenceContextValue | null {
  return useContext(GraphShellPersistenceContext);
}
