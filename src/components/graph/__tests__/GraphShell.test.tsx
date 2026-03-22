/**
 * Tests for the graph-first exploration shell.
 *
 * Covers:
 * - VAL-NARR-004: Navigation opens graph destinations/focus states
 * - VAL-ROADMAP-001: Shell reads as graph-first explorable mindmap
 * - VAL-ROADMAP-002: Orientation recovery / wayfinding available
 * - VAL-ROADMAP-003: Supporting scroll stays synchronized
 * - VAL-ROADMAP-006: Valid deep links restore graph state
 * - VAL-ROADMAP-007: Invalid deep links fallback to coherent state
 * - VAL-ROADMAP-009: Mobile exploration remains node-first
 * - VAL-ROADMAP-011: Node-first exploration is primary interaction model
 * - VAL-ROADMAP-012: Direct traversal between related nodes
 * - VAL-ROADMAP-013: Major transitions don't require linear scrolling
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

describe("GraphShell", () => {
  // VAL-ROADMAP-001: Shell reads as a graph-first explorable mindmap
  it("renders a graph overview with visible nodes and exploration affordances", () => {
    render(<GraphShell />);
    const shell = screen.getByTestId("graph-shell");
    expect(shell).toBeInTheDocument();

    // Should show graph node buttons for major BETTER surfaces
    const nodeButtons = screen.getAllByTestId("graph-node-button");
    expect(nodeButtons.length).toBeGreaterThanOrEqual(GRAPH_NODES.length);
  });

  // VAL-ROADMAP-001: Active node / focal point visible
  it("shows a default focal node on initial load", () => {
    render(<GraphShell />);
    const activeNode = screen
      .getAllByTestId("graph-node-button")
      .find((el) => el.getAttribute("data-active") === "true");
    expect(activeNode).toBeDefined();
  });

  // VAL-ROADMAP-011: Node-first exploration is primary interaction model
  it("focuses a surface when a graph node is selected", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Click the Roadmap graph node
    const roadmapNode = screen.getByRole("button", { name: /roadmap/i });
    await user.click(roadmapNode);

    // Should show focused surface content
    const focusedPanel = screen.getByTestId("graph-focused-surface");
    expect(focusedPanel).toBeInTheDocument();
  });

  // VAL-ROADMAP-012: Direct traversal between related nodes
  it("shows related nodes on the focused surface for direct traversal", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Focus on Roadmap
    const roadmapNode = screen.getByRole("button", { name: /roadmap/i });
    await user.click(roadmapNode);

    // Should show related node links
    const relatedLinks = screen.getAllByTestId("graph-related-link");
    expect(relatedLinks.length).toBeGreaterThan(0);
  });

  // VAL-ROADMAP-012: Traverse from one node to another through related links
  it("navigates to a related node when clicked, preserving graph context", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Focus on Roadmap
    const roadmapNode = screen.getByRole("button", { name: /roadmap/i });
    await user.click(roadmapNode);

    // Click a related node
    const relatedLinks = screen.getAllByTestId("graph-related-link");
    await user.click(relatedLinks[0]);

    // Graph overview should still be visible (context preserved)
    expect(screen.getByTestId("graph-shell")).toBeInTheDocument();
    // Focused surface should update
    expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();
  });

  // VAL-ROADMAP-002: Orientation recovery
  it("provides a recenter/home control for orientation recovery", () => {
    render(<GraphShell />);
    const recenterButton = screen.getByRole("button", {
      name: /recenter|home|overview|reset/i,
    });
    expect(recenterButton).toBeInTheDocument();
  });

  // VAL-ROADMAP-002: Breadcrumb shows current focus path
  it("shows a breadcrumb indicating current graph focus", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Focus on Architecture
    const archNode = screen.getByRole("button", { name: /architecture/i });
    await user.click(archNode);

    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb).toBeInTheDocument();
    expect(breadcrumb.textContent).toContain("Architecture");
  });

  // VAL-ROADMAP-006: Valid deep links restore graph state
  it("restores graph focus state from a valid #graph-<id> hash", async () => {
    window.location.hash = "#graph-tokenomics";
    render(<GraphShell />);

    // Should focus on tokenomics
    const focusedPanel = await screen.findByTestId("graph-focused-surface");
    expect(focusedPanel).toBeInTheDocument();
    // Breadcrumb should show Tokenomics
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Tokenomics");
  });

  // VAL-ROADMAP-006: Valid deep link persists after refresh
  it("restores the same graph state after refresh via hash", async () => {
    window.location.hash = "#graph-architecture";
    render(<GraphShell />);

    await screen.findByTestId("graph-focused-surface");
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Architecture");
  });

  // VAL-ROADMAP-006: Legacy section anchors also restore graph state
  it("restores graph state from legacy section anchor hashes", async () => {
    window.location.hash = "#roadmap";
    render(<GraphShell />);

    await screen.findByTestId("graph-focused-surface");
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Roadmap");
  });

  // VAL-ROADMAP-007: Invalid deep links fallback to coherent state
  it("falls back to default graph state for invalid deep links", async () => {
    window.location.hash = "#graph-nonexistent";
    render(<GraphShell />);

    // Should show the fallback alert
    const fallback = await screen.findByTestId("graph-invalid-link-fallback");
    expect(fallback).toBeInTheDocument();
    // Should still show the graph shell (not broken)
    expect(screen.getByTestId("graph-shell")).toBeInTheDocument();
  });

  // VAL-ROADMAP-007: Invalid fallback provides recovery path
  it("provides a recovery action in the invalid link fallback", async () => {
    window.location.hash = "#graph-nonexistent";
    render(<GraphShell />);

    const fallback = await screen.findByTestId("graph-invalid-link-fallback");
    const recovery = within(fallback).getByRole("button");
    expect(recovery).toBeInTheDocument();
  });

  // VAL-ROADMAP-013: Major transitions without linear scrolling
  it("allows jumping between graph nodes without scrolling", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Navigate from hero to architecture directly
    const archNode = screen.getByRole("button", { name: /architecture/i });
    await user.click(archNode);

    // Then to tokenomics directly
    const relatedLinks = screen.getAllByTestId("graph-related-link");
    const tokenLink = relatedLinks.find((el) =>
      el.textContent?.toLowerCase().includes("tokenomics")
    );
    if (tokenLink) {
      await user.click(tokenLink);
    }

    // Should have navigated without requiring scroll
    expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();
  });

  // VAL-NARR-004: Navigation opens graph destinations
  it("updates URL hash when navigating between graph nodes", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const roadmapNode = screen.getByRole("button", { name: /roadmap/i });
    await user.click(roadmapNode);

    expect(window.location.hash).toBe("#graph-roadmap");
  });

  // Recenter returns to overview
  it("recenter returns to default overview state", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Focus on a node
    const archNode = screen.getByRole("button", { name: /architecture/i });
    await user.click(archNode);
    expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();

    // Click recenter (use the top-level overview button, not the focused panel one)
    const recenterBtn = screen.getByRole("button", {
      name: "Return to overview",
    });
    await user.click(recenterBtn);

    // Should return to overview (no focused surface)
    expect(screen.queryByTestId("graph-focused-surface")).not.toBeInTheDocument();
  });

  // Keyboard navigation
  it("supports keyboard navigation between graph nodes", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const firstNode = screen.getAllByTestId("graph-node-button")[0];
    firstNode.focus();
    expect(document.activeElement).toBe(firstNode);

    // Press Enter to select
    await user.keyboard("{Enter}");
    // Should navigate to that node
    expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();
  });

  // Escape closes focused surface
  it("closes focused surface with Escape key", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const roadmapNode = screen.getByRole("button", { name: /roadmap/i });
    await user.click(roadmapNode);
    expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("graph-focused-surface")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Mobile graph exploration (VAL-ROADMAP-009)
// ---------------------------------------------------------------------------
describe("GraphShell mobile", () => {
  it("renders graph node list accessible on narrow screens", () => {
    render(<GraphShell />);
    // Graph nodes should be visible regardless of viewport
    const nodeButtons = screen.getAllByTestId("graph-node-button");
    expect(nodeButtons.length).toBeGreaterThanOrEqual(GRAPH_NODES.length);
    // Each should have sufficient label
    for (const btn of nodeButtons) {
      expect(btn).toHaveAccessibleName();
    }
  });

  it("mobile focused surface includes back/overview action for recovery", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const roadmapNode = screen.getByRole("button", { name: /roadmap/i });
    await user.click(roadmapNode);

    // Should have a back/overview recovery button (focused panel has "Back to overview")
    const backBtn = screen.getByRole("button", {
      name: "Back to overview",
    });
    expect(backBtn).toBeInTheDocument();
  });
});
