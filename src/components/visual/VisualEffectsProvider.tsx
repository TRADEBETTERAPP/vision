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
  /**
   * Whether the client satisfies desktop-class conditions for heavy layers.
   * Desktop-class = fine pointer + wide viewport (>1024px) + no reduced motion.
   * Mobile/tablet/constrained devices get `false` and skip heavy shader
   * and continuous-animation layers. (VAL-VISUAL-025)
   */
  isDesktopCapable: boolean;
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
  isDesktopCapable: false,
  markReady: () => {},
  triggerFallback: () => {},
  markCanvasReady: () => {},
};

const VisualEffectsContext = createContext<VisualEffectsState>(defaultState);

type MediaQueryListLike = {
  matches: boolean;
  addEventListener?: (
    type: string,
    listener: (event: { matches: boolean }) => void,
  ) => void;
  removeEventListener?: (
    type: string,
    listener: (event: { matches: boolean }) => void,
  ) => void;
  addListener?: (listener: (event: { matches: boolean }) => void) => void;
  removeListener?: (listener: (event: { matches: boolean }) => void) => void;
};

function getMediaQueryList(query: string): MediaQueryListLike | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }

  try {
    return window.matchMedia(query);
  } catch {
    return null;
  }
}

function subscribeToMediaQuery(
  query: string,
  listener: (event: { matches: boolean }) => void,
): () => void {
  const mql = getMediaQueryList(query);
  if (!mql) {
    return () => {};
  }

  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener?.("change", listener);
  }

  if (typeof mql.addListener === "function") {
    mql.addListener(listener);
    return () => mql.removeListener?.(listener);
  }

  return () => {};
}

function matchesMediaQuery(query: string): boolean {
  return getMediaQueryList(query)?.matches ?? false;
}

// ---------------------------------------------------------------------------
// Hook to detect prefers-reduced-motion
// ---------------------------------------------------------------------------

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    return matchesMediaQuery("(prefers-reduced-motion: reduce)");
  });

  useEffect(() => {
    return subscribeToMediaQuery(
      "(prefers-reduced-motion: reduce)",
      (event) => {
        setReduced(event.matches);
      },
    );
  }, []);

  return reduced;
}

// ---------------------------------------------------------------------------
// Hook to detect desktop-class capability (VAL-VISUAL-025)
// Desktop-class = fine pointer + wide viewport (>1024px) + no reduced motion.
// This composite gate ensures heavy shader and continuous-animation layers
// only activate on desktop-class clients.
// ---------------------------------------------------------------------------

function useDesktopCapable(reducedMotion: boolean): boolean {
  // Use a dedicated state + effect pattern with an explicit mount trigger.
  // During SSR/static generation, defaults to false (constrained).
  // After hydration, the effect fires and evaluates the real client capability.
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const check = () => {
      const finePointer = matchesMediaQuery("(pointer: fine)");
      const wideViewport = matchesMediaQuery("(min-width: 1025px)");
      setCapable(finePointer && wideViewport && !reducedMotion);
    };
    // Immediate check on mount
    check();

    // Listen for capability changes (e.g., viewport resize, device mode toggle)
    const handleChange = () => check();
    const unsubscribePointer = subscribeToMediaQuery(
      "(pointer: fine)",
      handleChange,
    );
    const unsubscribeWidth = subscribeToMediaQuery(
      "(min-width: 1025px)",
      handleChange,
    );

    return () => {
      unsubscribePointer();
      unsubscribeWidth();
    };
  }, [reducedMotion]);

  return capable;
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
  const isDesktopCapable = useDesktopCapable(reducedMotion);

  const markReady = useCallback(() => setReady(true), []);
  const triggerFallback = useCallback(() => setFallback(true), []);
  const markCanvasReady = useCallback(() => setCanvasReady(true), []);

  const value = useMemo<VisualEffectsState>(
    () => ({ ready, reducedMotion, fallback, canvasReady, isDesktopCapable, markReady, triggerFallback, markCanvasReady }),
    [ready, reducedMotion, fallback, canvasReady, isDesktopCapable, markReady, triggerFallback, markCanvasReady]
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
