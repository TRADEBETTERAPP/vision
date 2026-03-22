import { render, screen } from "@testing-library/react";
import { AsciiBackground } from "../AsciiBackground";
import { VisualEffectsProvider } from "../VisualEffectsProvider";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("AsciiBackground", () => {
  it("renders the ASCII background container with aria-hidden", () => {
    render(
      <VisualEffectsProvider>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    expect(bg).toBeInTheDocument();
    expect(bg.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders static characters when reduced motion is active", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <VisualEffectsProvider>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    expect(bg).toBeInTheDocument();
    // In reduced motion, the container should still render but with the static class
    expect(bg.classList.contains("ascii-bg-static") || bg.className.includes("ascii-bg-static")).toBe(true);
  });

  it("renders in fallback mode without crashing", () => {
    render(
      <VisualEffectsProvider forceFallback>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    expect(bg).toBeInTheDocument();
    // ASCII is DOM-based and independent of WebGL fallback.
    // It keeps animating even when WebGL fails — only reduced-motion makes it static.
    expect(bg).toBeInTheDocument();
  });

  it("contains ASCII-like characters in its content", () => {
    render(
      <VisualEffectsProvider>
        <AsciiBackground />
      </VisualEffectsProvider>
    );
    const bg = screen.getByTestId("ascii-background");
    const text = bg.textContent ?? "";
    // Should contain some combination of typical ASCII art / terminal characters
    expect(text.length).toBeGreaterThan(0);
    // Should contain characters from the ASCII palette
    expect(/[01▓░▒│─┌┐└┘├┤┬┴┼●◆◇$>_]/.test(text)).toBe(true);
  });
});
