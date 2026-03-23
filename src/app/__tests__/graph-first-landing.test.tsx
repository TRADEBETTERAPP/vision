/**
 * Tests for graph-first default landing.
 *
 * The root load should land on a genuinely graph-first workspace
 * with the interactive graph as the primary visible surface.
 * The hero/brand band is integrated at the top of the atlas section,
 * not as a separate standalone section. (VAL-VISUAL-026)
 *
 * VAL-ROADMAP-014: Default loaded state is a pure graph workspace
 * VAL-CROSS-014: Graph workspace with investor-path entry, no separate handoff
 * VAL-VISUAL-026: Single hero/brand surface inside graph workspace
 */
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Graph-first default landing", () => {
  it("atlas section contains the hero/brand band and graph shell as one workspace", async () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    expect(atlas).toBeInTheDocument();

    // Both the hero and graph shell are INSIDE the atlas section
    // GraphShell loads via dynamic import (VAL-VISUAL-027)
    const graphShell = await screen.findByTestId("graph-shell");
    const hero = screen.getByTestId("hero-section");
    expect(atlas!.contains(graphShell)).toBe(true);
    expect(atlas!.contains(hero)).toBe(true);
  });

  it("hero/brand band appears before the graph shell inside the atlas (VAL-VISUAL-026)", async () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const graphShell = await screen.findByTestId("graph-shell");

    // The hero/brand band should come BEFORE the graph shell in DOM order
    const position = hero.compareDocumentPosition(graphShell);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("the atlas is the topmost content section", async () => {
    render(<Home />);
    const atlas = document.getElementById("atlas");
    // ProofModule loads via dynamic import (VAL-VISUAL-027)
    const proof = await screen.findByTestId("proof-section");

    expect(atlas).toBeInTheDocument();
    // Atlas should come before the proof section in DOM order
    const position = atlas!.compareDocumentPosition(proof);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("investor-path entry affordance is visible in the first graph workspace", async () => {
    render(<Home />);
    // GraphExplorer loads via dynamic import (VAL-VISUAL-027)
    const startAffordance = await screen.findByTestId("investor-path-start");
    expect(startAffordance).toBeInTheDocument();
  });
});
