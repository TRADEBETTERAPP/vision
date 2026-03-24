import { render, screen, act } from "@testing-library/react";
import {
  VisualEffectsProvider,
  useVisualEffects,
} from "../VisualEffectsProvider";

/** Test consumer that reads the visual effects context */
function StatusDisplay() {
  const { ready, reducedMotion, fallback } = useVisualEffects();
  return (
    <div>
      <span data-testid="ready">{String(ready)}</span>
      <span data-testid="reduced-motion">{String(reducedMotion)}</span>
      <span data-testid="fallback">{String(fallback)}</span>
    </div>
  );
}

describe("VisualEffectsProvider", () => {
  let matchMediaListeners: Array<(e: { matches: boolean }) => void>;
  let matchMediaMatches: boolean;

  beforeEach(() => {
    matchMediaListeners = [];
    matchMediaMatches = false;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation((query: string) => {
        const isReducedMotion = query === "(prefers-reduced-motion: reduce)";
        return {
          matches: isReducedMotion ? matchMediaMatches : false,
          media: query,
          addEventListener: (_event: string, listener: (e: { matches: boolean }) => void) => {
            if (isReducedMotion) matchMediaListeners.push(listener);
          },
          removeEventListener: (_event: string, listener: (e: { matches: boolean }) => void) => {
            matchMediaListeners = matchMediaListeners.filter((l) => l !== listener);
          },
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      }),
    });
  });

  it("starts with ready=false, fallback=false, and not reduced-motion", () => {
    render(
      <VisualEffectsProvider>
        <StatusDisplay />
      </VisualEffectsProvider>
    );
    expect(screen.getByTestId("ready")).toHaveTextContent("false");
    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("false");
    expect(screen.getByTestId("fallback")).toHaveTextContent("false");
  });

  it("detects reduced motion when prefers-reduced-motion matches", () => {
    matchMediaMatches = true;
    render(
      <VisualEffectsProvider>
        <StatusDisplay />
      </VisualEffectsProvider>
    );
    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("true");
  });

  it("responds to dynamic reduced-motion changes", () => {
    render(
      <VisualEffectsProvider>
        <StatusDisplay />
      </VisualEffectsProvider>
    );
    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("false");

    act(() => {
      for (const listener of matchMediaListeners) {
        listener({ matches: true });
      }
    });
    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("true");
  });

  it("sets fallback=true when forceFallback prop is true", () => {
    render(
      <VisualEffectsProvider forceFallback>
        <StatusDisplay />
      </VisualEffectsProvider>
    );
    expect(screen.getByTestId("fallback")).toHaveTextContent("true");
  });

  it("provides a markReady callback that sets ready=true", () => {
    function ReadyTrigger() {
      const { ready, markReady } = useVisualEffects();
      return (
        <div>
          <span data-testid="ready">{String(ready)}</span>
          <button onClick={markReady}>Go</button>
        </div>
      );
    }

    render(
      <VisualEffectsProvider>
        <ReadyTrigger />
      </VisualEffectsProvider>
    );
    expect(screen.getByTestId("ready")).toHaveTextContent("false");

    act(() => {
      screen.getByText("Go").click();
    });
    expect(screen.getByTestId("ready")).toHaveTextContent("true");
  });

  it("provides a triggerFallback callback that sets fallback=true", () => {
    function FallbackTrigger() {
      const { fallback, triggerFallback } = useVisualEffects();
      return (
        <div>
          <span data-testid="fallback">{String(fallback)}</span>
          <button onClick={triggerFallback}>Fail</button>
        </div>
      );
    }

    render(
      <VisualEffectsProvider>
        <FallbackTrigger />
      </VisualEffectsProvider>
    );
    expect(screen.getByTestId("fallback")).toHaveTextContent("false");

    act(() => {
      screen.getByText("Fail").click();
    });
    expect(screen.getByTestId("fallback")).toHaveTextContent("true");
  });

  it("does not throw when matchMedia is unavailable", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: undefined,
    });

    expect(() =>
      render(
        <VisualEffectsProvider>
          <StatusDisplay />
        </VisualEffectsProvider>,
      ),
    ).not.toThrow();

    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("false");
  });

  it("falls back to legacy media query listeners when addEventListener is unavailable", () => {
    const legacyListeners: Array<(e: { matches: boolean }) => void> = [];

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation((query: string) => {
        const isReducedMotion = query === "(prefers-reduced-motion: reduce)";
        return {
          matches: false,
          media: query,
          addEventListener: undefined,
          removeEventListener: undefined,
          onchange: null,
          addListener: (listener: (e: { matches: boolean }) => void) => {
            if (isReducedMotion) legacyListeners.push(listener);
          },
          removeListener: (listener: (e: { matches: boolean }) => void) => {
            const index = legacyListeners.indexOf(listener);
            if (index >= 0) legacyListeners.splice(index, 1);
          },
          dispatchEvent: jest.fn(),
        };
      }),
    });

    render(
      <VisualEffectsProvider>
        <StatusDisplay />
      </VisualEffectsProvider>,
    );

    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("false");

    act(() => {
      for (const listener of legacyListeners) {
        listener({ matches: true });
      }
    });

    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("true");
  });
});
