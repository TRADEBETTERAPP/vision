/**
 * Tests for the Architecture Section.
 *
 * Validates:
 * - VAL-VISUAL-005: Architecture surfaces required BETTER stack layers and roles
 * - VAL-VISUAL-006: Layers show maturity and dependency sequencing
 * - VAL-VISUAL-007: Cost bands show assumption hooks and capability unlocks
 * - VAL-VISUAL-008: Graceful degradation under constrained conditions
 * - VAL-VISUAL-009: Flywheel and infra evolution are explorable
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArchitectureSection from "../ArchitectureSection";
import { COST_BAND_MODELS } from "@/content";

// ---------------------------------------------------------------------------
// VAL-VISUAL-005: Architecture surfaces required BETTER stack layers
// ---------------------------------------------------------------------------

describe("ArchitectureSection (VAL-VISUAL-005)", () => {
  it("renders the architecture section container", () => {
    render(<ArchitectureSection />);
    expect(screen.getByTestId("architecture-section")).toBeInTheDocument();
  });

  it("surfaces all five required BETTER stack layers", () => {
    render(<ArchitectureSection />);
    const expectedLayers = [
      /hyperliquid|hyperevm/i,
      /openserv|braid/i,
      /ai|rl|llm|model/i,
      /polygon|validator/i,
      /low.latency|colo|fpga/i,
    ];
    for (const pattern of expectedLayers) {
      expect(screen.getAllByText(pattern).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("explains each layer's role in plain language", () => {
    render(<ArchitectureSection />);
    const layerCards = screen.getAllByTestId("architecture-layer");
    expect(layerCards.length).toBeGreaterThanOrEqual(5);
    // Each layer card should have a description
    for (const card of layerCards) {
      const description = within(card).getByTestId("layer-description");
      expect(description.textContent!.length).toBeGreaterThan(20);
    }
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-006: Layers show maturity and dependency sequencing
// ---------------------------------------------------------------------------

describe("ArchitectureSection (VAL-VISUAL-006)", () => {
  it("shows maturity badges on architecture layers", () => {
    render(<ArchitectureSection />);
    const badges = screen.getAllByTestId("maturity-badge");
    expect(badges.length).toBeGreaterThanOrEqual(5);
  });

  it("shows dependency sequencing between layers", () => {
    render(<ArchitectureSection />);
    // Should have dependency indicators
    const depIndicators = screen.getAllByTestId("layer-dependency");
    expect(depIndicators.length).toBeGreaterThanOrEqual(1);
  });

  it("users can tell which layers are live, in progress, planned, or speculative", () => {
    render(<ArchitectureSection />);
    // Should show at least two different statuses
    const badges = screen.getAllByTestId("maturity-badge");
    const statuses = new Set(badges.map((b) => b.getAttribute("data-status")));
    expect(statuses.size).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-007: Cost bands show assumption hooks and capability unlocks
// ---------------------------------------------------------------------------

describe("ArchitectureSection (VAL-VISUAL-007)", () => {
  it("renders cost-band explorer with all subsystems", () => {
    render(<ArchitectureSection />);
    const costSection = screen.getByTestId("cost-band-explorer");
    expect(costSection).toBeInTheDocument();
    // Each subsystem should be present (titles may appear in both stack layers and cost bands)
    for (const model of COST_BAND_MODELS) {
      expect(screen.getAllByText(model.title).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("shows phased ranges rather than false precision when expanded", async () => {
    const user = userEvent.setup();
    render(<ArchitectureSection />);
    // Expand the first subsystem to reveal phases
    const toggles = screen.getAllByTestId("cost-band-toggle");
    await user.click(toggles[0]);
    // Should find cost-band phase entries
    const phases = screen.getAllByTestId("cost-band-phase");
    expect(phases.length).toBeGreaterThanOrEqual(2);
    // Each phase should show a cost range format
    for (const phase of phases) {
      const rangeEl = within(phase).getByTestId("cost-range");
      expect(rangeEl.textContent).toMatch(/\$/);
    }
  });

  it("each phase shows an assumption basis when expanded", async () => {
    const user = userEvent.setup();
    render(<ArchitectureSection />);
    // Expand all subsystems
    const toggles = screen.getAllByTestId("cost-band-toggle");
    for (const toggle of toggles) {
      await user.click(toggle);
    }
    const phases = screen.getAllByTestId("cost-band-phase");
    for (const phase of phases) {
      const assumption = within(phase).getByTestId("assumption-basis");
      expect(assumption.textContent!.length).toBeGreaterThan(10);
    }
  });

  it("each phase shows a capability unlock when expanded", async () => {
    const user = userEvent.setup();
    render(<ArchitectureSection />);
    // Expand all subsystems
    const toggles = screen.getAllByTestId("cost-band-toggle");
    for (const toggle of toggles) {
      await user.click(toggle);
    }
    const phases = screen.getAllByTestId("cost-band-phase");
    for (const phase of phases) {
      const unlock = within(phase).getByTestId("capability-unlock");
      expect(unlock.textContent!.length).toBeGreaterThan(10);
    }
  });

  it("phases show dependency identifiers when expanded", async () => {
    const user = userEvent.setup();
    render(<ArchitectureSection />);
    // Expand all subsystems to reveal phases with dependencies
    const toggles = screen.getAllByTestId("cost-band-toggle");
    for (const toggle of toggles) {
      await user.click(toggle);
    }
    // At least some phases should have dependency info
    const depLabels = screen.getAllByTestId("phase-dependency");
    expect(depLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("subsystem cost bands can be expanded/explored", async () => {
    const user = userEvent.setup();
    render(<ArchitectureSection />);
    // Should have expandable subsystem sections
    const toggles = screen.getAllByTestId("cost-band-toggle");
    expect(toggles.length).toBe(COST_BAND_MODELS.length);

    // Click to expand
    await user.click(toggles[0]);
    expect(toggles[0]).toHaveAttribute("aria-expanded", "true");
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-009: Flywheel and infrastructure evolution are explorable
// ---------------------------------------------------------------------------

describe("ArchitectureSection (VAL-VISUAL-009)", () => {
  it("renders the flywheel exploration surface", () => {
    render(<ArchitectureSection />);
    expect(screen.getByTestId("flywheel-explorer")).toBeInTheDocument();
  });

  it("flywheel shows infrastructure, product, revenue, and token-sink loops", () => {
    render(<ArchitectureSection />);
    const flywheel = screen.getByTestId("flywheel-explorer");
    // Should have all four category labels
    expect(within(flywheel).getAllByText(/infrastructure/i).length).toBeGreaterThanOrEqual(1);
    expect(within(flywheel).getAllByText(/revenue/i).length).toBeGreaterThanOrEqual(1);
    expect(within(flywheel).getAllByText(/token/i).length).toBeGreaterThanOrEqual(1);
    expect(within(flywheel).getAllByText(/product/i).length).toBeGreaterThanOrEqual(1);
  });

  it("flywheel nodes are interactive and explorable", async () => {
    const user = userEvent.setup();
    render(<ArchitectureSection />);
    const flywheelNodes = screen.getAllByTestId("flywheel-node");
    expect(flywheelNodes.length).toBeGreaterThanOrEqual(4);

    // Clicking a node should select it and show details
    await user.click(flywheelNodes[0]);
    expect(screen.getByTestId("flywheel-detail")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-VISUAL-008: Graceful degradation (structural checks)
// ---------------------------------------------------------------------------

describe("ArchitectureSection (VAL-VISUAL-008)", () => {
  it("renders readable content without requiring advanced visuals", () => {
    render(<ArchitectureSection />);
    // All content should be rendered as accessible DOM elements, not canvas/webGL only
    const section = screen.getByTestId("architecture-section");
    expect(section.textContent!.length).toBeGreaterThan(200);
  });

  it("architecture layers use standard HTML elements for accessibility", () => {
    render(<ArchitectureSection />);
    // Should use semantic elements, not just div soup
    const layerCards = screen.getAllByTestId("architecture-layer");
    for (const card of layerCards) {
      // Each card should have some heading-level content
      const heading = within(card).getByRole("heading");
      expect(heading).toBeInTheDocument();
    }
  });
});

// ---------------------------------------------------------------------------
// Regression: Stable-ID dependency modeling in cost bands
// ---------------------------------------------------------------------------

describe("ArchitectureSection — Stable-ID Dependencies", () => {
  it("cost-band dependency labels render as readable phase names, not raw IDs", async () => {
    const user = userEvent.setup();
    render(<ArchitectureSection />);
    // Expand all subsystems to reveal phases with dependencies
    const toggles = screen.getAllByTestId("cost-band-toggle");
    for (const toggle of toggles) {
      await user.click(toggle);
    }
    const depLabels = screen.getAllByTestId("phase-dependency");
    for (const el of depLabels) {
      const text = el.textContent || "";
      // Should contain "Phase" (from readable name) and NOT raw "cb-" prefixed IDs
      expect(text).not.toMatch(/cb-[a-z]+-phase\d/);
      expect(text).toMatch(/Phase \d/);
    }
  });
});

// ---------------------------------------------------------------------------
// Regression: Cross-surface Strategy Agents & Social Vaults maturity consistency
// ---------------------------------------------------------------------------

describe("ArchitectureSection — Flywheel Maturity Consistency", () => {
  it("flywheel Autonomous Strategy Agents renders with 'Planned' status", async () => {
    const user = userEvent.setup();
    render(<ArchitectureSection />);
    const flywheelNodes = screen.getAllByTestId("flywheel-node");
    const agentNode = flywheelNodes.find((el) =>
      el.textContent?.includes("Autonomous Strategy Agents")
    );
    expect(agentNode).toBeDefined();
    await user.click(agentNode!);
    const detail = screen.getByTestId("flywheel-detail");
    const badges = within(detail).getAllByTestId("maturity-badge");
    const statusValues = badges.map((b) => b.getAttribute("data-status"));
    expect(statusValues).toContain("planned");
  });

  it("flywheel Social Vaults & vBETTER renders with 'In Progress' status", async () => {
    const user = userEvent.setup();
    render(<ArchitectureSection />);
    const flywheelNodes = screen.getAllByTestId("flywheel-node");
    const vaultNode = flywheelNodes.find((el) =>
      el.textContent?.includes("Social Vaults")
    );
    expect(vaultNode).toBeDefined();
    await user.click(vaultNode!);
    const detail = screen.getByTestId("flywheel-detail");
    const badges = within(detail).getAllByTestId("maturity-badge");
    const statusValues = badges.map((b) => b.getAttribute("data-status"));
    expect(statusValues).toContain("in_progress");
  });

  it("does not render a combined Strategy Agents & Vaults node", () => {
    render(<ArchitectureSection />);
    const flywheelNodes = screen.getAllByTestId("flywheel-node");
    const combinedNode = flywheelNodes.find((el) =>
      el.textContent?.includes("Strategy Agents & Vaults")
    );
    expect(combinedNode).toBeUndefined();
  });
});
