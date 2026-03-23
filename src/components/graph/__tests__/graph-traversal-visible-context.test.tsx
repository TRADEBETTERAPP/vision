/**
 * Regression tests for VAL-ROADMAP-012: visible graph context after node traversal.
 *
 * These tests verify that when users traverse between related graph nodes,
 * a clearly visible graph overview, minimap, or equivalent orientation frame
 * remains on-screen — not just in the DOM but within the viewport-visible
 * focused surface area.
 *
 * The prior implementation scrolled the focused surface to block: "start",
 * which pushed the graph overview off-screen during traversal, collapsing
 * the experience into a panel-only document view.
 */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphShell } from "../GraphShell";
import { GRAPH_NODES, getGraphNodeById } from "@/content/graph-nodes";

beforeEach(() => {
  window.location.hash = "";
  history.replaceState(null, "", window.location.pathname);
  Element.prototype.scrollIntoView = jest.fn();
});

/** Helper: get a graph node button from the main node grid (not minimap) */
function getNodeButton(name: RegExp) {
  const nodeButtons = screen.getAllByTestId("graph-node-button");
  const match = nodeButtons.find((el) =>
    el.getAttribute("aria-label")?.match(name)
  );
  if (!match) throw new Error(`No graph-node-button matching ${name}`);
  return match;
}

describe("Graph traversal visible context (VAL-ROADMAP-012)", () => {
  // -------------------------------------------------------------------------
  // A compact graph context minimap must appear inside the focused surface
  // so it stays visually on-screen after scrollIntoView targets the panel.
  // -------------------------------------------------------------------------
  it("renders a visible graph context minimap inside the focused surface after node focus", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Focus on Roadmap
    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    const focusedSurface = screen.getByTestId("graph-focused-surface");
    // A minimap or graph context indicator should exist INSIDE the focused surface
    const minimap = within(focusedSurface).getByTestId("graph-context-minimap");
    expect(minimap).toBeInTheDocument();
  });

  it("minimap shows all graph nodes as orientation indicators", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    const focusedSurface = screen.getByTestId("graph-focused-surface");
    const minimap = within(focusedSurface).getByTestId("graph-context-minimap");

    // All graph nodes should appear in the minimap as orientation indicators
    const minimapNodes = within(minimap).getAllByTestId("minimap-node");
    expect(minimapNodes.length).toBe(GRAPH_NODES.length);
  });

  it("minimap highlights the currently focused node", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    const focusedSurface = screen.getByTestId("graph-focused-surface");
    const minimap = within(focusedSurface).getByTestId("graph-context-minimap");

    // The focused node should be marked as active in the minimap
    const activeMinimapNode = within(minimap)
      .getAllByTestId("minimap-node")
      .find((el) => el.getAttribute("data-active") === "true");
    expect(activeMinimapNode).toBeDefined();
    expect(activeMinimapNode?.textContent).toContain("Roadmap");
  });

  it("minimap highlights related nodes distinctly", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    const focusedSurface = screen.getByTestId("graph-focused-surface");
    const minimap = within(focusedSurface).getByTestId("graph-context-minimap");

    // Related nodes should be marked as related
    const roadmapNodeDef = getGraphNodeById("roadmap");
    const relatedMinimapNodes = within(minimap)
      .getAllByTestId("minimap-node")
      .filter((el) => el.getAttribute("data-related") === "true");
    expect(relatedMinimapNodes.length).toBe(roadmapNodeDef!.related.length);
  });

  // -------------------------------------------------------------------------
  // After node-to-node traversal, the minimap must update and remain visible
  // -------------------------------------------------------------------------
  it("updates minimap active node after traversal via related links", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Focus on Roadmap
    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    // Traverse to a related node (e.g. Tokenomics)
    const relatedLinks = screen.getAllByTestId("graph-related-link");
    const tokenLink = relatedLinks.find((el) =>
      el.textContent?.toLowerCase().includes("tokenomics")
    );
    expect(tokenLink).toBeDefined();
    await user.click(tokenLink!);

    // Minimap should still exist inside the focused surface
    const focusedSurface = screen.getByTestId("graph-focused-surface");
    const minimap = within(focusedSurface).getByTestId("graph-context-minimap");
    expect(minimap).toBeInTheDocument();

    // Active node in minimap should now be Tokenomics
    const activeNode = within(minimap)
      .getAllByTestId("minimap-node")
      .find((el) => el.getAttribute("data-active") === "true");
    expect(activeNode?.textContent).toContain("Tokenomics");
  });

  it("minimap nodes are clickable for direct navigation", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Focus on Roadmap
    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    const focusedSurface = screen.getByTestId("graph-focused-surface");
    const minimap = within(focusedSurface).getByTestId("graph-context-minimap");

    // Click Architecture node in the minimap
    const archMinimapNode = within(minimap)
      .getAllByTestId("minimap-node")
      .find((el) => el.textContent?.includes("Architecture"));
    expect(archMinimapNode).toBeDefined();
    await user.click(archMinimapNode!);

    // Should navigate to architecture — breadcrumb should update
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Architecture");
  });

  // -------------------------------------------------------------------------
  // Scroll behavior: node-to-node traversal should NOT push graph overview
  // completely off-screen
  // -------------------------------------------------------------------------
  it("does not call scrollIntoView with block:'start' on the focused surface during node-to-node traversal", async () => {
    const scrollSpy = jest.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    const user = userEvent.setup();
    render(<GraphShell />);

    // First focus — this can scroll to start (initial navigation)
    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);
    scrollSpy.mockClear();

    // Traverse to a related node
    const relatedLinks = screen.getAllByTestId("graph-related-link");
    await user.click(relatedLinks[0]);

    // On traversal, scroll should NOT use block:'start' which hides graph
    // overview — it should either not scroll or use a gentler approach
    const startCalls = scrollSpy.mock.calls.filter(
      (call) => call[0]?.block === "start"
    );
    expect(startCalls.length).toBe(0);
  });

  // -------------------------------------------------------------------------
  // Orientation affordances after traversal
  // -------------------------------------------------------------------------
  it("provides a recenter button inside the focused surface after traversal", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    // Traverse to related
    const relatedLinks = screen.getAllByTestId("graph-related-link");
    await user.click(relatedLinks[0]);

    const focusedSurface = screen.getByTestId("graph-focused-surface");
    // Should have a back-to-overview button inside the focused surface
    const overviewBtn = within(focusedSurface).getByRole("button", {
      name: /back to overview/i,
    });
    expect(overviewBtn).toBeInTheDocument();
  });

  it("deep link restores graph with visible minimap context", async () => {
    window.location.hash = "#graph-tokenomics";
    render(<GraphShell />);

    const focusedSurface = await screen.findByTestId("graph-focused-surface");
    const minimap = within(focusedSurface).getByTestId("graph-context-minimap");
    expect(minimap).toBeInTheDocument();

    // Active node should be tokenomics
    const activeNode = within(minimap)
      .getAllByTestId("minimap-node")
      .find((el) => el.getAttribute("data-active") === "true");
    expect(activeNode?.textContent).toContain("Tokenomics");
  });
});
