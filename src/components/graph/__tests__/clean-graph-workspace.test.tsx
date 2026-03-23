/**
 * Tests for VAL-VISUAL-033: Clean graph workspace without chrome clutter.
 *
 * Verifies that the graph workspace uses one clean navigation model without
 * competing chrome layers. No simultaneous nested minimaps, breadcrumb bars,
 * inspector docks, and context panels all visible at once. The workspace
 * feels like a clean exploration tool for quick glances.
 */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphShell } from "../GraphShell";
import { GRAPH_NODES } from "@/content/graph-nodes";

beforeEach(() => {
  window.location.hash = "";
  history.replaceState(null, "", window.location.pathname);
  Element.prototype.scrollIntoView = jest.fn();
});

/** Helper: get a graph node button from the main node grid */
function getNodeButton(name: RegExp) {
  const nodeButtons = screen.getAllByTestId("graph-node-button");
  const match = nodeButtons.find((el) =>
    el.getAttribute("aria-label")?.match(name)
  );
  if (!match) throw new Error(`No graph-node-button matching ${name}`);
  return match;
}

describe("Clean graph workspace (VAL-VISUAL-033)", () => {
  // -----------------------------------------------------------------------
  // No nested minimap inside focused surface
  // -----------------------------------------------------------------------
  it("does not render a context minimap inside the focused surface", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const roadmapNode = getNodeButton(/roadmap/i);
    await user.click(roadmapNode);

    const focusedSurface = screen.getByTestId("graph-focused-surface");
    // No nested/context minimap should exist within the focused surface
    expect(
      within(focusedSurface).queryByTestId("graph-context-minimap")
    ).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // No persistent minimap below the graph grid
  // -----------------------------------------------------------------------
  it("does not render a persistent minimap bar below the node grid", () => {
    render(<GraphShell />);
    expect(
      screen.queryByTestId("graph-persistent-minimap")
    ).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // No sticky inspector dock
  // -----------------------------------------------------------------------
  it("does not render a sticky inspector dock", () => {
    render(<GraphShell />);
    expect(
      screen.queryByTestId("graph-sticky-inspector")
    ).not.toBeInTheDocument();
  });

  it("does not render a sticky inspector dock when a node is focused", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    await user.click(getNodeButton(/roadmap/i));
    expect(
      screen.queryByTestId("graph-sticky-inspector")
    ).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // No investor path progress bar cluttering the workspace
  // -----------------------------------------------------------------------
  it("does not render an investor path progress bar inside the focused surface", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start investor pitch path
    await user.click(screen.getByTestId("investor-path-start"));

    // The progress bar should not clutter the workspace
    expect(
      screen.queryByTestId("investor-path-progress")
    ).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Single lightweight orientation: top bar with label + overview control
  // -----------------------------------------------------------------------
  it("has exactly one lightweight orientation bar at the top", () => {
    render(<GraphShell />);
    const orientationBar = screen.getByTestId("graph-orientation-bar");
    expect(orientationBar).toBeInTheDocument();
  });

  it("orientation bar shows focused node label when a node is selected", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    await user.click(getNodeButton(/architecture/i));
    const orientationBar = screen.getByTestId("graph-orientation-bar");
    expect(orientationBar.textContent).toContain("Architecture");
  });

  it("orientation bar has an overview button for recenter", () => {
    render(<GraphShell />);
    const overviewBtn = screen.getByRole("button", {
      name: /overview|recenter/i,
    });
    expect(overviewBtn).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Graph node grid remains the primary exploration surface
  // -----------------------------------------------------------------------
  it("renders the full graph node grid as the primary exploration surface", () => {
    render(<GraphShell />);
    const nodeButtons = screen.getAllByTestId("graph-node-button");
    expect(nodeButtons.length).toBe(GRAPH_NODES.length);
  });

  // -----------------------------------------------------------------------
  // Focused surface is clean with content + related nodes only
  // -----------------------------------------------------------------------
  it("focused surface shows content and related nodes without chrome clutter", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    await user.click(getNodeButton(/roadmap/i));
    const focusedSurface = screen.getByTestId("graph-focused-surface");

    // Should have related node links for traversal
    const relatedLinks = within(focusedSurface).getAllByTestId(
      "graph-related-link"
    );
    expect(relatedLinks.length).toBeGreaterThan(0);

    // Should have a back/close button
    const backBtn = within(focusedSurface).getByRole("button", {
      name: /back to overview|close/i,
    });
    expect(backBtn).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Information flow: brand → exploration → depth on demand
  // -----------------------------------------------------------------------
  it("workspace structure follows brand → exploration → depth on demand", () => {
    render(<GraphShell />);
    const shell = screen.getByTestId("graph-shell");

    // The shell should have the graph overview (exploration) as its
    // primary child, without heavy chrome competing for attention
    const graphOverview = within(shell).getByTestId("graph-overview");
    expect(graphOverview).toBeInTheDocument();

    // Depth (focused surface) should not be visible by default — it
    // appears only on demand when a node is selected
    expect(
      within(shell).queryByTestId("graph-focused-surface")
    ).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Investor path controls remain accessible but not as chrome clutter
  // -----------------------------------------------------------------------
  it("investor path start button is available without adding chrome layers", () => {
    render(<GraphShell />);
    const startBtn = screen.getByTestId("investor-path-start");
    expect(startBtn).toBeInTheDocument();

    // But no progress bars, path breadcrumbs, etc. at rest
    expect(
      screen.queryByTestId("investor-path-progress")
    ).not.toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // Pitch path prev/next controls stay inside focused surface (not new chrome)
  // -----------------------------------------------------------------------
  it("pitch path prev/next controls are inside focused surface, not separate chrome", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start investor path
    await user.click(screen.getByTestId("investor-path-start"));

    // Next button should be inside the focused surface
    const focusedSurface = screen.getByTestId("graph-focused-surface");
    const nextBtn = within(focusedSurface).queryByTestId("investor-path-next");
    expect(nextBtn).toBeInTheDocument();
  });
});
