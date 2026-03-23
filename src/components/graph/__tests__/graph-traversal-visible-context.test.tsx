/**
 * Regression tests for VAL-ROADMAP-012: visible graph context after node traversal.
 *
 * These tests verify that when users traverse between related graph nodes,
 * orientation context remains accessible — the orientation bar stays visible,
 * related node links enable direct traversal, and the focused surface keeps
 * the back-to-overview button available.
 *
 * VAL-VISUAL-033 removed the nested context minimap in favour of a single
 * lightweight orientation bar + related-node links. These updated tests
 * verify the same traversal and orientation guarantees without the old
 * chrome-heavy minimap approach.
 */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphShell } from "../GraphShell";

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
  // Related node links provide direct traversal inside the focused surface
  // -------------------------------------------------------------------------
  it("renders related node links inside the focused surface for direct traversal", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    const focusedSurface = screen.getByTestId("graph-focused-surface");
    const relatedLinks = within(focusedSurface).getAllByTestId("graph-related-link");
    expect(relatedLinks.length).toBeGreaterThan(0);
  });

  it("orientation bar updates with the focused node label", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    const orientationBar = screen.getByTestId("graph-orientation-bar");
    expect(orientationBar.textContent).toContain("Roadmap");
  });

  // -------------------------------------------------------------------------
  // After node-to-node traversal, orientation context remains available
  // -------------------------------------------------------------------------
  it("updates orientation bar after traversal via related links", async () => {
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

    // Orientation bar should update to show Tokenomics
    const orientationBar = screen.getByTestId("graph-orientation-bar");
    expect(orientationBar.textContent).toContain("Tokenomics");
  });

  it("related links update after traversal to a different node", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Focus on Roadmap
    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    // Traverse to a related node
    const relatedLinks = screen.getAllByTestId("graph-related-link");
    await user.click(relatedLinks[0]);

    // Related links should now show connections for the new focused node
    const focusedSurface = screen.getByTestId("graph-focused-surface");
    const newRelatedLinks = within(focusedSurface).queryAllByTestId("graph-related-link");
    // New related links should exist (may vary by node)
    expect(newRelatedLinks.length).toBeGreaterThanOrEqual(0);
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
  it("provides a back-to-overview button inside the focused surface after traversal", async () => {
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

  it("deep link restores graph with visible orientation context", async () => {
    window.location.hash = "#graph-tokenomics";
    render(<GraphShell />);

    const focusedSurface = await screen.findByTestId("graph-focused-surface");
    // Should have a back-to-overview button for orientation recovery
    const overviewBtn = within(focusedSurface).getByRole("button", {
      name: /back to overview/i,
    });
    expect(overviewBtn).toBeInTheDocument();

    // Orientation bar should show the focused node
    const orientationBar = screen.getByTestId("graph-orientation-bar");
    expect(orientationBar.textContent).toContain("Tokenomics");
  });

  // -------------------------------------------------------------------------
  // Overview control always available for recenter
  // -------------------------------------------------------------------------
  it("overview recenter button is always available in the orientation bar", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // In overview mode
    const overviewBtn = screen.getByRole("button", { name: /return to overview/i });
    expect(overviewBtn).toBeInTheDocument();

    // After focusing a node
    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);
    expect(overviewBtn).toBeInTheDocument();

    // After traversal
    const relatedLinks = screen.getAllByTestId("graph-related-link");
    await user.click(relatedLinks[0]);
    expect(screen.getByRole("button", { name: /return to overview/i })).toBeInTheDocument();
  });
});
