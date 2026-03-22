"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VisualEffectsState {
  /** Whether the advanced visual effects have finished initializing */
  ready: boolean;
  /** Whether the user prefers reduced motion */
  reducedMotion: boolean;
  /** Whether effects have been disabled due to failure or lack of support */
  fallback: boolean;
  /** Whether the 2D canvas renderer initialized successfully */
  canvasReady: boolean;
  /** Signal that effects are ready */
  markReady: () => void;
  /** Signal that effects should fall back */
  triggerFallback: () => void;
  /** Signal that the 2D canvas renderer is ready */
  markCanvasReady: () => void;
}

const defaultState: VisualEffectsState = {
  ready: false,
  reducedMotion: false,
  fallback: false,
  canvasReady: false,
  markReady: () => {},
  triggerFallback: () => {},
  markCanvasReady: () => {},
};

const VisualEffectsContext = createContext<VisualEffectsState>(defaultState);

// ---------------------------------------------------------------------------
// Hook to detect prefers-reduced-motion
// ---------------------------------------------------------------------------

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: { matches: boolean }) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface ProviderProps {
  children: React.ReactNode;
  /** Force fallback mode (useful for testing) */
  forceFallback?: boolean;
}

export function VisualEffectsProvider({
  children,
  forceFallback = false,
}: ProviderProps) {
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(forceFallback);
  const [canvasReady, setCanvasReady] = useState(false);
  const reducedMotion = useReducedMotion();

  const markReady = useCallback(() => setReady(true), []);
  const triggerFallback = useCallback(() => setFallback(true), []);
  const markCanvasReady = useCallback(() => setCanvasReady(true), []);

  const value = useMemo<VisualEffectsState>(
    () => ({ ready, reducedMotion, fallback, canvasReady, markReady, triggerFallback, markCanvasReady }),
    [ready, reducedMotion, fallback, canvasReady, markReady, triggerFallback, markCanvasReady]
  );

  return (
    <VisualEffectsContext.Provider value={value}>
      {children}
    </VisualEffectsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

export function useVisualEffects(): VisualEffectsState {
  return useContext(VisualEffectsContext);
}
