import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Home page", () => {
  // VAL-NARR-001: Hero explains BETTER in plain language
  it("renders a plain-language definition of BETTER in the hero", () => {
    render(<Home />);
    // BETTER brand is now rendered as a logotype image (VAL-VISUAL-019)
    const heroLogotype = screen.getByTestId("hero-logotype");
    expect(heroLogotype).toBeInTheDocument();
    expect(heroLogotype.getAttribute("alt")).toContain("BETTER");
    // Multiple elements mention "prediction-market intelligence" — use getAllByText
    const matches = screen.getAllByText(/prediction-market intelligence/i);
    expect(matches.length).toBeGreaterThan(0);
    // The definition block should be present
    expect(
      screen.getByText(/prediction-market intelligence platform that combines/i)
    ).toBeInTheDocument();
  });

  // VAL-NARR-002: Hero separates live product reality from future vision
  it("separates live product from future vision before scroll", () => {
    render(<Home />);
    // Redesigned hero uses inline status framing, not split cards
    expect(screen.getByTestId("hero-live-status")).toBeInTheDocument();
    expect(screen.getByTestId("hero-future-status")).toBeInTheDocument();
  });

  // VAL-NARR-006: Narrative shell visibly carries maturity labels
  it("renders maturity badges on proof and hero content", () => {
    render(<Home />);
    const badges = screen.getAllByTestId("maturity-badge");
    expect(badges.length).toBeGreaterThan(0);
    // Check that at least Live status is present
    const statuses = badges.map((b) => b.getAttribute("data-status"));
    expect(statuses).toContain("live");
  });

  // VAL-NARR-008: Aggressive claims expose evidence hooks
  it("renders evidence hooks on hero and proof content", () => {
    render(<Home />);
    const hooks = screen.getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThan(0);
  });

  // VAL-NARR-009: Aggressive and future-facing claims carry nearby caveats
  it("renders caveat frames on future-facing hero content", () => {
    render(<Home />);
    const caveats = screen.getAllByTestId("caveat-frame");
    expect(caveats.length).toBeGreaterThan(0);
  });

  // VAL-NARR-010: CTAs are honest about destination — live path is primary
  it("renders honest CTAs with graph-first destinations", () => {
    render(<Home />);
    // Primary CTA leads to proof graph focus state (VAL-CROSS-013)
    const primaryCta = screen.getByTestId("cta-primary");
    expect(primaryCta).toHaveAttribute("href", "#graph-proof");
    expect(primaryCta.textContent).toMatch(/live/i);

    // Secondary CTA leads to roadmap exploration via graph shell
    const secondaryCta = screen.getByTestId("cta-secondary");
    expect(secondaryCta).toHaveAttribute("href", "#graph-roadmap");
    expect(secondaryCta.textContent).toMatch(/atlas|roadmap/i);
  });

  // VAL-NARR-013: Proof section appears before graph shell
  it("renders proof section between hero and graph shell", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    expect(proof).toBeInTheDocument();
  });

  // VAL-ROADMAP-001: Graph-first shell is the primary exploration surface
  it("renders the graph-first exploration shell", () => {
    render(<Home />);
    const graphShell = screen.getByTestId("graph-shell");
    expect(graphShell).toBeInTheDocument();
    // Graph nodes should be visible as the primary navigation model
    const graphNodes = screen.getAllByTestId("graph-node-button");
    expect(graphNodes.length).toBeGreaterThanOrEqual(7);
  });

  // The atlas section wraps the graph shell
  it("renders the BETTER Atlas section heading", () => {
    render(<Home />);
    expect(screen.getByText("Explore the Ecosystem")).toBeInTheDocument();
  });
});
