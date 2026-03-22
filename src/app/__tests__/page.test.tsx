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

  // VAL-NARR-003: Current live scope and freshness are visible
  it("renders current scope section with freshness cue", () => {
    render(<Home />);
    expect(screen.getByText("What's Live Today")).toBeInTheDocument();
    const freshnessCue = screen.getByTestId("freshness-cue");
    expect(freshnessCue).toBeInTheDocument();
    expect(freshnessCue.textContent).toContain("2026-Q1");
    expect(freshnessCue.textContent).toContain("BETTER Docs");
  });

  // VAL-NARR-006: Narrative shell visibly carries maturity labels
  it("renders maturity badges on narrative cards", () => {
    render(<Home />);
    const badges = screen.getAllByTestId("maturity-badge");
    expect(badges.length).toBeGreaterThan(0);
    // Check that at least Live and a non-Live status are present
    const statuses = badges.map((b) => b.getAttribute("data-status"));
    expect(statuses).toContain("live");
    expect(
      statuses.some((s) => s !== "live")
    ).toBe(true);
  });

  // VAL-NARR-007: The site explains what maturity labels mean
  it("renders the maturity legend", () => {
    render(<Home />);
    expect(screen.getByTestId("maturity-legend")).toBeInTheDocument();
    expect(screen.getByText("Understanding Maturity Labels")).toBeInTheDocument();
  });

  // VAL-NARR-008: Aggressive claims expose evidence hooks
  it("renders evidence hooks on narrative cards", () => {
    render(<Home />);
    const hooks = screen.getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThan(0);
  });

  // VAL-NARR-008: Evidence section explains source types
  it("renders evidence explainer section", () => {
    render(<Home />);
    const explainers = screen.getAllByTestId("evidence-explainer");
    expect(explainers.length).toBe(4); // canonical, scenario_based, illustrative, external
  });

  // VAL-NARR-009: Aggressive and future-facing claims carry nearby caveats
  it("renders caveat frames on future-facing narrative cards", () => {
    render(<Home />);
    const caveats = screen.getAllByTestId("caveat-frame");
    expect(caveats.length).toBeGreaterThan(0);
  });

  // VAL-NARR-009: Risks section exists
  it("renders the risks and caveats section", () => {
    render(<Home />);
    // "Risks & Caveats" appears both in label and heading — use role to target heading
    expect(
      screen.getByRole("heading", { name: "Risks & Caveats" })
    ).toBeInTheDocument();
    const riskItems = screen.getAllByTestId("risk-item");
    expect(riskItems.length).toBeGreaterThan(0);
  });

  // VAL-NARR-010: CTAs are honest about destination — live path is primary
  it("renders honest CTAs with correct destinations", () => {
    render(<Home />);
    // Primary CTA leads to live product surface
    const primaryCta = screen.getByTestId("cta-primary");
    expect(primaryCta).toHaveAttribute("href", "#live-now");
    expect(primaryCta.textContent).toMatch(/live/i);

    // Secondary CTA leads to roadmap exploration
    const secondaryCta = screen.getByTestId("cta-secondary");
    expect(secondaryCta).toHaveAttribute("href", "#roadmap");
    expect(secondaryCta.textContent).toMatch(/roadmap/i);
  });

  // Section placeholders still present
  it("renders tokenomics and architecture section placeholders", () => {
    render(<Home />);
    expect(screen.getByText("Whale-First Tokenomics")).toBeInTheDocument();
    expect(screen.getByText("Technical Architecture")).toBeInTheDocument();
  });

  // Roadmap section with narrative cards
  it("renders roadmap narrative section with vision blocks", () => {
    render(<Home />);
    expect(screen.getByText("Ecosystem Roadmap")).toBeInTheDocument();
    // Vision blocks should be rendered
    const cards = screen.getAllByTestId("narrative-card");
    expect(cards.length).toBeGreaterThan(0);
  });
});
