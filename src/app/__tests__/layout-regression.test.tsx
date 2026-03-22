import { render, screen } from "@testing-library/react";
import Home from "../page";

/**
 * Focused regression tests for shared navigation and layout behavior.
 *
 * Updated for graph-first shell architecture: the hero, proof, and atlas
 * sections are always rendered. Individual content surfaces (roadmap,
 * tokenomics, etc.) are rendered inside the graph shell when focused.
 */
describe("Shared navigation regression", () => {
  it("hero section has the #what-is-better anchor", () => {
    render(<Home />);
    const section = document.getElementById("what-is-better");
    expect(section).toBeInTheDocument();
  });

  it("proof section has the #proof anchor", () => {
    render(<Home />);
    const section = document.getElementById("proof");
    expect(section).toBeInTheDocument();
  });

  it("atlas section has the #atlas anchor wrapping the graph shell", () => {
    render(<Home />);
    const section = document.getElementById("atlas");
    expect(section).toBeInTheDocument();
    // Graph shell should be inside the atlas section
    const graphShell = screen.getByTestId("graph-shell");
    expect(section!.contains(graphShell)).toBe(true);
  });

  it("graph shell renders all major BETTER surface nodes", () => {
    render(<Home />);
    const graphNodes = screen.getAllByTestId("graph-node-button");
    // Should have nodes for: what-is-better, proof, live-now, roadmap,
    // tokenomics, architecture, evidence, risks
    expect(graphNodes.length).toBeGreaterThanOrEqual(7);
  });
});

describe("Hero poster-like composition regression", () => {
  it("hero renders inline live and future status indicators", () => {
    render(<Home />);
    expect(screen.getByTestId("hero-live-status")).toBeInTheDocument();
    expect(screen.getByTestId("hero-future-status")).toBeInTheDocument();
  });

  it("live status indicator carries the live maturity badge", () => {
    render(<Home />);
    const liveStatus = screen.getByTestId("hero-live-status");
    const badge = liveStatus.querySelector('[data-testid="maturity-badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-status", "live");
  });

  it("future status indicator carries a non-live maturity badge", () => {
    render(<Home />);
    const futureStatus = screen.getByTestId("hero-future-status");
    const badge = futureStatus.querySelector('[data-testid="maturity-badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge?.getAttribute("data-status")).not.toBe("live");
  });

  it("hero includes a caveat frame for future-facing claims", () => {
    render(<Home />);
    const heroSection = screen.getByTestId("hero-section");
    const caveat = heroSection.querySelector('[data-testid="caveat-frame"]');
    expect(caveat).toBeInTheDocument();
  });
});

describe("Graph shell heading and structure regression", () => {
  it("renders the BETTER Atlas section heading", () => {
    render(<Home />);
    expect(screen.getByText("Explore the Ecosystem")).toBeInTheDocument();
  });

  it("graph overview shows BETTER Atlas labels", () => {
    render(<Home />);
    const atlasLabels = screen.getAllByText("BETTER Atlas");
    expect(atlasLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("hero evidence hooks are present in hero section", () => {
    render(<Home />);
    const heroSection = screen.getByTestId("hero-section");
    const hooks = heroSection.querySelectorAll('[data-testid="evidence-hook"]');
    expect(hooks.length).toBeGreaterThan(0);
  });
});
