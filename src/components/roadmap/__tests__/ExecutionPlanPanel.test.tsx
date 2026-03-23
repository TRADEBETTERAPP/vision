/**
 * Tests for ExecutionPlanPanel — per-stage execution plan rendering.
 *
 * Validates VAL-ROADMAP-016 rendering:
 * - Workstreams with internal/external distinction
 * - External dependencies
 * - Falsifiable proof gates as concrete criteria
 * - Bounded timing windows
 * - Confidence labels (Committed / Planned / Directional)
 * - Internal vs external work distinction
 */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import ExecutionPlanPanel from "../ExecutionPlanPanel";
import { EXECUTION_PLANS, getExecutionPlanForNode } from "@/content";

// Use a real execution plan from the data for realistic rendering tests
const samplePlan = EXECUTION_PLANS[0];

describe("ExecutionPlanPanel", () => {
  it("renders the execution plan panel", () => {
    render(<ExecutionPlanPanel plan={samplePlan} />);
    expect(screen.getByTestId("execution-plan-panel")).toBeInTheDocument();
  });

  it("shows the confidence label badge", () => {
    render(<ExecutionPlanPanel plan={samplePlan} />);
    const badge = screen.getByTestId("execution-plan-confidence-label");
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBe(samplePlan.confidenceLabel);
  });

  it("shows the bounded timing window", () => {
    render(<ExecutionPlanPanel plan={samplePlan} />);
    const timing = screen.getByTestId("execution-plan-timing");
    expect(timing).toBeInTheDocument();
    expect(timing.textContent).toContain(samplePlan.timingWindow.display);
  });

  it("shows the main constraint when present", () => {
    render(<ExecutionPlanPanel plan={samplePlan} />);
    if (samplePlan.timingWindow.mainConstraint) {
      expect(
        screen.getByText(samplePlan.timingWindow.mainConstraint)
      ).toBeInTheDocument();
    }
  });

  it("shows internal workstreams section", () => {
    render(<ExecutionPlanPanel plan={samplePlan} />);
    const internal = screen.getByTestId(
      "execution-plan-internal-workstreams"
    );
    expect(internal).toBeInTheDocument();
    // Should contain internal workstream labels
    const internalWs = samplePlan.workstreams.filter(
      (w) => w.nature === "internal"
    );
    for (const ws of internalWs) {
      expect(within(internal).getByText(ws.label)).toBeInTheDocument();
    }
  });

  it("shows external workstreams section for plans with external work", () => {
    const planWithExternal = EXECUTION_PLANS.find((p) =>
      p.workstreams.some((w) => w.nature === "external")
    );
    if (!planWithExternal) return;

    render(<ExecutionPlanPanel plan={planWithExternal} />);
    const external = screen.getByTestId(
      "execution-plan-external-workstreams"
    );
    expect(external).toBeInTheDocument();
  });

  it("shows external dependencies", () => {
    const planWithDeps = EXECUTION_PLANS.find(
      (p) => p.externalDependencies.length > 0
    );
    if (!planWithDeps) return;

    render(<ExecutionPlanPanel plan={planWithDeps} />);
    const deps = screen.getByTestId("execution-plan-external-deps");
    expect(deps).toBeInTheDocument();
    for (const dep of planWithDeps.externalDependencies) {
      expect(within(deps).getByText(dep)).toBeInTheDocument();
    }
  });

  it("shows proof gates", () => {
    render(<ExecutionPlanPanel plan={samplePlan} />);
    const gates = screen.getByTestId("execution-plan-proof-gates");
    expect(gates).toBeInTheDocument();
    for (const gate of samplePlan.proofGates) {
      expect(within(gates).getByText(gate.label)).toBeInTheDocument();
      expect(within(gates).getByText(gate.criterion)).toBeInTheDocument();
    }
  });

  it("shows investor summary", () => {
    render(<ExecutionPlanPanel plan={samplePlan} />);
    expect(
      screen.getByText(samplePlan.investorSummary)
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Per-stage rendering across all plans
// ---------------------------------------------------------------------------

describe("ExecutionPlanPanel — all plans render correctly", () => {
  it("renders every execution plan without errors", () => {
    for (const plan of EXECUTION_PLANS) {
      const { unmount } = render(<ExecutionPlanPanel plan={plan} />);
      expect(screen.getByTestId("execution-plan-panel")).toBeInTheDocument();
      expect(
        screen.getByTestId("execution-plan-confidence-label")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("execution-plan-timing")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("execution-plan-proof-gates")
      ).toBeInTheDocument();
      unmount();
    }
  });

  it("shows the correct confidence label for each plan", () => {
    for (const plan of EXECUTION_PLANS) {
      const { unmount } = render(<ExecutionPlanPanel plan={plan} />);
      const badge = screen.getByTestId("execution-plan-confidence-label");
      expect(badge.textContent).toBe(plan.confidenceLabel);
      unmount();
    }
  });
});

// ---------------------------------------------------------------------------
// RoadmapNodeDetail integration — execution plan appears for primary stages
// ---------------------------------------------------------------------------

describe("RoadmapNodeDetail shows execution plan for primary stages", () => {
  it("pe-terminal-beta has an execution plan", () => {
    const plan = getExecutionPlanForNode("pe-terminal-beta");
    expect(plan).toBeDefined();
    expect(plan!.confidenceLabel).toBe("Committed");
  });

  it("pe-social-vaults has an execution plan", () => {
    const plan = getExecutionPlanForNode("pe-social-vaults");
    expect(plan).toBeDefined();
    expect(plan!.proofGates.length).toBeGreaterThan(0);
  });

  it("ti-hyperevm-phase1 has an execution plan", () => {
    const plan = getExecutionPlanForNode("ti-hyperevm-phase1");
    expect(plan).toBeDefined();
    expect(plan!.workstreams.some((w) => w.nature === "external")).toBe(true);
  });

  it("non-primary node returns undefined", () => {
    // pe-lite-mode is live but not a primary stage for execution planning
    const plan = getExecutionPlanForNode("pe-lite-mode");
    expect(plan).toBeUndefined();
  });
});
