/**
 * Hero deduplication and logotype visibility tests.
 *
 * VAL-VISUAL-026: The page does not render a duplicate standalone hero
 * beneath the graph workspace. The BETTER logotype SVG is visible at the
 * top of the graph-first workspace. Only one hero/brand surface exists.
 */
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Hero deduplication (VAL-VISUAL-026)", () => {
  it("does NOT render a standalone hero section beneath the graph workspace", () => {
    render(<Home />);
    // There should be exactly ONE hero/brand surface (inside the atlas),
    // not a separate standalone hero section below the graph.
    const heroSections = document.querySelectorAll('[data-testid="hero-section"]');
    // Should have exactly one hero surface, integrated into the graph workspace
    expect(heroSections.length).toBe(1);

    // The single hero surface should be INSIDE the atlas section (graph workspace),
    // not a separate sibling section after it.
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();
    const heroSection = heroSections[0];
    expect(atlas!.contains(heroSection)).toBe(true);
  });

  it("BETTER logotype SVG is prominent at the top of the graph-first workspace", () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();

    // The logotype should be inside the atlas section (graph workspace)
    const logotype = atlas!.querySelector('img[data-testid="hero-logotype"]');
    expect(logotype).toBeInTheDocument();
    expect(logotype!.getAttribute("src")).toContain("better-logotype");
  });

  it("only one hero/brand surface exists in the entire page", () => {
    render(<Home />);
    // Count all hero-section testids in the page
    const heroSections = document.querySelectorAll('[data-testid="hero-section"]');
    expect(heroSections.length).toBe(1);
  });

  it("the hero/brand band appears before the graph node grid", () => {
    render(<Home />);
    const heroBrand = screen.getByTestId("hero-section");
    const graphOverview = screen.getByTestId("graph-overview");

    // Hero/brand should come before graph overview in DOM order
    const position = heroBrand.compareDocumentPosition(graphOverview);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
