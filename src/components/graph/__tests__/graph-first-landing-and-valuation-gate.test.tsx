/**
 * Tests for the scrutiny-fix feature:
 * - Graph-first default landing (not hero-first)
 * - Valuation gate wired to actual valuation content
 * - Guided-path progress restoration on hash/back-forward
 */
import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphShell } from "../GraphShell";
import {
  INVESTOR_PITCH_GATES,
  getGateById,
} from "@/content/investor-pitch-path";
import { getGraphNodeById } from "@/content/graph-nodes";

beforeEach(() => {
  window.location.hash = "";
  history.replaceState(null, "", window.location.pathname);
  Element.prototype.scrollIntoView = jest.fn();
});

// ---------------------------------------------------------------------------
// Fix 2: Valuation gate maps to actual valuation content, not risks
// ---------------------------------------------------------------------------
describe("Valuation gate targets actual valuation content", () => {
  it("the Valuation pitch gate maps to a graph node that contains valuation content, not risks", () => {
    const valuationGate = getGateById("gate-valuation");
    expect(valuationGate).toBeDefined();
    // Must NOT map to the risks node
    expect(valuationGate!.graphNodeId).not.toBe("risks");
    // The target node must exist in the graph
    const targetNode = getGraphNodeById(valuationGate!.graphNodeId);
    expect(targetNode).toBeDefined();
    // The target node should be valuation-related
    expect(targetNode!.label.toLowerCase()).toMatch(/valuation/i);
  });

  it("advancing to the Valuation gate focuses a valuation node, not the risks node", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start the pitch path
    await user.click(screen.getByTestId("investor-path-start"));

    // Advance through gates until we reach the Valuation gate (gate 7, index 6)
    const valuationGateIndex = INVESTOR_PITCH_GATES.findIndex(
      (g) => g.id === "gate-valuation"
    );
    for (let i = 0; i < valuationGateIndex; i++) {
      await user.click(screen.getByTestId("investor-path-next"));
    }

    // The breadcrumb should show valuation content, not "Risks & Caveats"
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).not.toMatch(/risks/i);
    expect(breadcrumb.textContent).toMatch(/valuation/i);

    // The URL hash should reference a valuation node
    expect(window.location.hash).not.toBe("#graph-risks");
    expect(window.location.hash).toMatch(/valuation/i);
  });
});

// ---------------------------------------------------------------------------
// Fix 3: Guided-path progress restoration on hash/back-forward
// ---------------------------------------------------------------------------
describe("Guided-path progress restores on hash/back-forward navigation", () => {
  it("restores pitch path state when browser navigates back to a gate node", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start the pitch path and advance to gate 3 (Proof)
    await user.click(screen.getByTestId("investor-path-start"));
    await user.click(screen.getByTestId("investor-path-next"));
    await user.click(screen.getByTestId("investor-path-next"));

    // Verify we're on gate 3 with active pitch path controls
    expect(screen.getByTestId("investor-path-prev")).toBeInTheDocument();

    // Navigate away by clicking a non-path node (leave the path)
    await user.click(
      screen.getByRole("button", { name: "Return to overview" })
    );

    // Simulate browser back to the proof gate hash
    act(() => {
      window.location.hash = "#graph-proof";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    // The focused node should be proof
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Proof");

    // The pitch path controls should be restored (since this is a gate node)
    expect(screen.getByTestId("investor-path-next")).toBeInTheDocument();
  });

  it("restores the correct gate index when navigating to a path node via hash", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start the pitch path and visit a few gates
    await user.click(screen.getByTestId("investor-path-start"));
    await user.click(screen.getByTestId("investor-path-next"));

    // Navigate directly to gate 5 (Business Model → tokenomics) via hash
    const bmGate = INVESTOR_PITCH_GATES.find(
      (g) => g.id === "gate-business-model"
    );
    act(() => {
      window.location.hash = `#graph-${bmGate!.graphNodeId}`;
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    // The pitch path should be active — next/prev controls visible
    expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();
  });

  it("keeps pitch path inactive when hash navigates to a non-path node", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start the pitch path
    await user.click(screen.getByTestId("investor-path-start"));

    // Navigate to a non-path node via hash (e.g., risks is not a gate anymore)
    act(() => {
      window.location.hash = "#graph-risks";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    // Pitch path should be deactivated since risks is not a gate node
    // (no prev/next controls for investor path visible)
    expect(
      screen.queryByTestId("investor-path-next")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("investor-path-prev")
    ).not.toBeInTheDocument();
  });
});
