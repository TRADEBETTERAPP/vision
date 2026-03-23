/**
 * Tests for the Investor Pitch Path guided traversal.
 *
 * VAL-ROADMAP-015: Guided pitch path through ordered gates
 * VAL-ROADMAP-017: Discoverable start affordance, resumable with progress cues
 * VAL-CROSS-014: Default graph workspace exposes investor-path entry affordance
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphShell } from "../GraphShell";
import { TOTAL_GATES } from "@/content/investor-pitch-path";

beforeEach(() => {
  window.location.hash = "";
  history.replaceState(null, "", window.location.pathname);
  Element.prototype.scrollIntoView = jest.fn();
});

describe("Investor Pitch Path (VAL-ROADMAP-015)", () => {
  // ------------------------------------------------------------------
  // The graph workspace must expose a visible start affordance
  // ------------------------------------------------------------------
  it("renders a visible investor-path start affordance in the graph workspace", () => {
    render(<GraphShell />);
    const startAffordance = screen.getByTestId("investor-path-start");
    expect(startAffordance).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // Starting the pitch path should focus on the first gate
  // ------------------------------------------------------------------
  it("starts the investor pitch path at the first gate (Problem)", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    const startBtn = screen.getByTestId("investor-path-start");
    await user.click(startBtn);

    // Should show the focused surface for the first gate
    const focusedSurface = screen.getByTestId("graph-focused-surface");
    expect(focusedSurface).toBeInTheDocument();

    // Should show the pitch path progress bar
    const progressBar = screen.getByTestId("investor-path-progress");
    expect(progressBar).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // Users can follow the ordered gates sequentially
  // ------------------------------------------------------------------
  it("provides a next-gate button to advance through the pitch path", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start the path
    await user.click(screen.getByTestId("investor-path-start"));

    // Should have a "Next" button
    const nextBtn = screen.getByTestId("investor-path-next");
    expect(nextBtn).toBeInTheDocument();

    // Clicking next should advance to gate 2 (Wedge)
    await user.click(nextBtn);

    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Live Now");
  });

  // ------------------------------------------------------------------
  // Users can go back through the pitch path
  // ------------------------------------------------------------------
  it("provides a previous-gate button after the first gate", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start the path and advance to gate 2
    await user.click(screen.getByTestId("investor-path-start"));
    await user.click(screen.getByTestId("investor-path-next"));

    // Should have a "Previous" button
    const prevBtn = screen.getByTestId("investor-path-prev");
    expect(prevBtn).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // First gate should not show a previous button
  // ------------------------------------------------------------------
  it("does not show previous-gate button at the first gate", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    await user.click(screen.getByTestId("investor-path-start"));

    expect(screen.queryByTestId("investor-path-prev")).not.toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // Progress cues show the current gate position
  // ------------------------------------------------------------------
  it("shows progress cues indicating current gate position out of total", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    await user.click(screen.getByTestId("investor-path-start"));

    const progress = screen.getByTestId("investor-path-progress");
    // Should indicate gate 1 of N
    expect(progress.textContent).toMatch(/1.*of.*8|1\s*\/\s*8/i);
  });

  // ------------------------------------------------------------------
  // All 8 gates are traversable in order
  // ------------------------------------------------------------------
  it("allows traversal through all 8 gates in order", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    await user.click(screen.getByTestId("investor-path-start"));

    // Traverse through all gates
    for (let i = 1; i < TOTAL_GATES; i++) {
      const nextBtn = screen.getByTestId("investor-path-next");
      await user.click(nextBtn);
    }

    // At the last gate, should not have a next button
    expect(screen.queryByTestId("investor-path-next")).not.toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // Each gate maps to the correct graph node
  // ------------------------------------------------------------------
  it("maps each gate to its corresponding graph node surface", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    await user.click(screen.getByTestId("investor-path-start"));

    // First gate should focus "what-is-better"
    expect(window.location.hash).toBe("#graph-what-is-better");
  });

  // ------------------------------------------------------------------
  // Gate indicators show visited/current/upcoming states
  // ------------------------------------------------------------------
  it("renders gate indicators with visited, current, and upcoming states", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    await user.click(screen.getByTestId("investor-path-start"));

    // Should have gate indicators
    const gateIndicators = screen.getAllByTestId("investor-gate-indicator");
    expect(gateIndicators.length).toBe(TOTAL_GATES);

    // First gate should be marked as current
    expect(gateIndicators[0].getAttribute("data-state")).toBe("current");

    // Others should be upcoming
    expect(gateIndicators[1].getAttribute("data-state")).toBe("upcoming");
  });
});

describe("Investor Path Resume Behavior (VAL-ROADMAP-017)", () => {
  // ------------------------------------------------------------------
  // Users who leave the path can resume from their last gate
  // ------------------------------------------------------------------
  it("shows a resume affordance after leaving the pitch path mid-way", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start the path
    await user.click(screen.getByTestId("investor-path-start"));
    // Advance to gate 3
    await user.click(screen.getByTestId("investor-path-next"));
    await user.click(screen.getByTestId("investor-path-next"));

    // Leave the path by clicking a non-path node via overview button
    const overviewBtn = screen.getByRole("button", {
      name: "Return to overview",
    });
    await user.click(overviewBtn);

    // Should show a resume affordance
    const resumeBtn = screen.getByTestId("investor-path-resume");
    expect(resumeBtn).toBeInTheDocument();
    // Resume should indicate where they left off
    expect(resumeBtn.textContent).toMatch(/resume|continue/i);
  });

  // ------------------------------------------------------------------
  // Resuming restores the last visited gate
  // ------------------------------------------------------------------
  it("resumes the pitch path at the last visited gate", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start and advance to gate 3 (Proof)
    await user.click(screen.getByTestId("investor-path-start"));
    await user.click(screen.getByTestId("investor-path-next"));
    await user.click(screen.getByTestId("investor-path-next"));

    // Leave the path
    await user.click(
      screen.getByRole("button", { name: "Return to overview" })
    );

    // Resume
    await user.click(screen.getByTestId("investor-path-resume"));

    // Should be at gate 3 (Proof)
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Proof");
  });

  // ------------------------------------------------------------------
  // Progress cues show previously visited gates
  // ------------------------------------------------------------------
  it("marks previously visited gates as visited in progress cues", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start and advance to gate 3
    await user.click(screen.getByTestId("investor-path-start"));
    await user.click(screen.getByTestId("investor-path-next"));
    await user.click(screen.getByTestId("investor-path-next"));

    const gateIndicators = screen.getAllByTestId("investor-gate-indicator");
    // Gates 1 and 2 should be visited
    expect(gateIndicators[0].getAttribute("data-state")).toBe("visited");
    expect(gateIndicators[1].getAttribute("data-state")).toBe("visited");
    // Gate 3 should be current
    expect(gateIndicators[2].getAttribute("data-state")).toBe("current");
  });
});

describe("Default Graph Workspace (VAL-ROADMAP-014, VAL-CROSS-014)", () => {
  // ------------------------------------------------------------------
  // The graph workspace must have a sticky inspector
  // ------------------------------------------------------------------
  it("renders a sticky inspector element in the graph shell", () => {
    render(<GraphShell />);
    const inspector = screen.getByTestId("graph-sticky-inspector");
    expect(inspector).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // The minimap/orientation cue must be always visible, not just
  // inside the focused surface
  // ------------------------------------------------------------------
  it("renders a persistent minimap visible in overview mode (no focused node)", () => {
    render(<GraphShell />);
    // Even without a focused node, there should be an orientation minimap
    const minimap = screen.getByTestId("graph-persistent-minimap");
    expect(minimap).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // The investor-path entry affordance must be visible in the default
  // graph workspace (VAL-CROSS-014)
  // ------------------------------------------------------------------
  it("exposes the investor-path entry affordance in the default graph workspace without proof-page handoff", () => {
    render(<GraphShell />);
    // The start affordance should be visible in the default (overview) state
    const startAffordance = screen.getByTestId("investor-path-start");
    expect(startAffordance).toBeInTheDocument();
    // It should be a clickable element
    expect(startAffordance.tagName).toMatch(/BUTTON|A/i);
  });
});
