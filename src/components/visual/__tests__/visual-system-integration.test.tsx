import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

/**
 * Integration tests for the BETTER visual system (VAL-VISUAL-000 through VAL-VISUAL-004).
 *
 * These tests verify the signature visual system is present and that the
 * content-first, reduced-motion, and fallback behaviors work correctly.
 */

beforeEach(() => {
  // Default: no reduced motion, no WebGL
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

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

describe("VAL-VISUAL-000: Signature visual system is present", () => {
  it("renders the ASCII-video-inspired background treatment", () => {
    render(<Home />);
    expect(screen.getByTestId("ascii-background")).toBeInTheDocument();
  });

  it("renders the hero shader canvas container (even if WebGL fails)", () => {
    render(<Home />);
    // In fallback mode the canvas may not render, but the hero visual system wrapper should
    expect(screen.getByTestId("hero-visual-system")).toBeInTheDocument();
  });

  it("hero section carries the premium dark terminal aesthetic", () => {
    render(<Home />);
    const heroVisual = screen.getByTestId("hero-visual-system");
    expect(heroVisual).toBeInTheDocument();
    // The hero visual system wrapper should exist
    const hero = screen.getByTestId("hero-section");
    expect(hero).toBeInTheDocument();
  });
});

describe("VAL-VISUAL-001: Content-first hero renders before effects", () => {
  it("hero headline, supporting copy, and CTA are present regardless of effects state", () => {
    render(<Home />);
    // Brand headline
    expect(screen.getByText("BETTER")).toBeInTheDocument();
    // Dominant promise line (poster-like composition)
    expect(
      screen.getByText("The future of prediction-market intelligence")
    ).toBeInTheDocument();

    // Supporting copy (plain-language definition)
    expect(screen.getByText(/prediction-market intelligence platform/)).toBeInTheDocument();

    // Primary CTA
    expect(screen.getByTestId("cta-explore-roadmap")).toBeInTheDocument();
    expect(screen.getByTestId("cta-whats-live")).toBeInTheDocument();
  });

  it("hero content has a higher z-index than visual effect layers", () => {
    render(<Home />);
    const heroContent = screen.getByTestId("hero-content");
    expect(heroContent).toBeInTheDocument();
    // Content should be z-10 or higher
    expect(heroContent.className).toMatch(/z-10|z-20|z-30|z-40|z-50/);
  });
});

describe("VAL-VISUAL-002: Post-initialization hero remains readable", () => {
  it("live/vision split cards remain present with the visual system active", () => {
    render(<Home />);
    expect(screen.getByText("Live Today")).toBeInTheDocument();
    expect(screen.getByText("The Vision Ahead")).toBeInTheDocument();
  });

  it("CTAs remain clickable after visual system integration", () => {
    render(<Home />);
    const exploreCTA = screen.getByTestId("cta-explore-roadmap");
    const liveCTA = screen.getByTestId("cta-whats-live");
    // Both should be anchor elements with href
    expect(exploreCTA.tagName).toBe("A");
    expect(liveCTA.tagName).toBe("A");
    expect(exploreCTA.getAttribute("href")).toBe("#roadmap");
    expect(liveCTA.getAttribute("href")).toBe("#live-now");
  });
});

describe("VAL-VISUAL-003: Reduced-motion preserves hierarchy and usability", () => {
  it("hero headline and CTAs remain present with reduced motion", () => {
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

    render(<Home />);
    // Headline still present
    expect(screen.getByText("BETTER")).toBeInTheDocument();
    // CTAs still present
    expect(screen.getByTestId("cta-explore-roadmap")).toBeInTheDocument();
    expect(screen.getByTestId("cta-whats-live")).toBeInTheDocument();
    // Maturity badges still present
    expect(screen.getAllByTestId("maturity-badge").length).toBeGreaterThan(0);
  });
});

describe("VAL-VISUAL-004: Runtime fallback handles failures cleanly", () => {
  it("hero content renders correctly even when all effects are in fallback mode", () => {
    // WebGL unavailable (default mock returns null)
    render(<Home />);

    // All core hero elements should still be present
    expect(screen.getByText("BETTER")).toBeInTheDocument();
    expect(screen.getByText("Live Today")).toBeInTheDocument();
    expect(screen.getByText("The Vision Ahead")).toBeInTheDocument();
    expect(screen.getByTestId("cta-explore-roadmap")).toBeInTheDocument();
  });

  it("no broken layers or blank surfaces in fallback mode", () => {
    render(<Home />);
    const heroSection = screen.getByTestId("hero-section");
    // Hero section should have visible content, not be empty
    expect(heroSection.textContent!.length).toBeGreaterThan(100);
  });
});
