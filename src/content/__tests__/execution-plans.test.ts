/**
 * Tests for the per-stage execution plan model.
 *
 * Validates VAL-ROADMAP-016: Every primary roadmap stage has its own
 * dedicated execution-plan treatment with workstreams, external dependencies,
 * falsifiable proof gates, bounded timing windows, and confidence labeling.
 */

import {
  ROADMAP_NODES,
  validateExecutionPlan,
  CONFIDENCE_LABEL_DESCRIPTIONS,
} from "../index";
import type {
  ExecutionPlan,
  ConfidenceLabel,
} from "../index";
import {
  EXECUTION_PLANS,
  getExecutionPlanForNode,
  getPrimaryRoadmapStageIds,
} from "../execution-plans";

// ---------------------------------------------------------------------------
// Confidence Label Taxonomy
// ---------------------------------------------------------------------------

describe("Confidence Label Taxonomy", () => {
  const labels: ConfidenceLabel[] = ["Committed", "Planned", "Directional"];

  it("provides descriptions for all three confidence labels", () => {
    for (const label of labels) {
      expect(CONFIDENCE_LABEL_DESCRIPTIONS[label]).toBeDefined();
      expect(CONFIDENCE_LABEL_DESCRIPTIONS[label].length).toBeGreaterThan(10);
    }
  });
});

// ---------------------------------------------------------------------------
// Primary Roadmap Stages
// ---------------------------------------------------------------------------

describe("Primary Roadmap Stages", () => {
  const primaryIds = getPrimaryRoadmapStageIds();

  it("returns at least 5 primary roadmap stages (one per family minimum)", () => {
    expect(primaryIds.length).toBeGreaterThanOrEqual(5);
  });

  it("every primary stage ID maps to a valid roadmap node", () => {
    for (const id of primaryIds) {
      const node = ROADMAP_NODES.find((n) => n.id === id);
      expect(node).toBeDefined();
    }
  });

  it("primary stages cover all five branch families", () => {
    const families = new Set(
      primaryIds
        .map((id) => ROADMAP_NODES.find((n) => n.id === id)?.family)
        .filter(Boolean)
    );
    expect(families.has("product_evolution")).toBe(true);
    expect(families.has("token_utility")).toBe(true);
    expect(families.has("revenue_expansion")).toBe(true);
    expect(families.has("technical_infrastructure")).toBe(true);
    expect(families.has("social_agent_ecosystem")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Per-Stage Execution Plans
// ---------------------------------------------------------------------------

describe("Per-Stage Execution Plans", () => {
  it("every primary roadmap stage has a dedicated execution plan", () => {
    const primaryIds = getPrimaryRoadmapStageIds();
    for (const id of primaryIds) {
      const plan = getExecutionPlanForNode(id);
      expect(plan).toBeDefined();
      expect(plan!.nodeId).toBe(id);
    }
  });

  it("every execution plan has a valid confidence label", () => {
    const validLabels: ConfidenceLabel[] = ["Committed", "Planned", "Directional"];
    for (const plan of EXECUTION_PLANS) {
      expect(validLabels).toContain(plan.confidenceLabel);
    }
  });

  it("every execution plan has at least one workstream", () => {
    for (const plan of EXECUTION_PLANS) {
      expect(plan.workstreams.length).toBeGreaterThan(0);
    }
  });

  it("every execution plan explicitly distinguishes internal from external work", () => {
    for (const plan of EXECUTION_PLANS) {
      const hasInternal = plan.workstreams.some((w) => w.nature === "internal");
      const hasExternal =
        plan.workstreams.some((w) => w.nature === "external") ||
        plan.externalDependencies.length > 0;
      expect(hasInternal).toBe(true);
      expect(hasExternal).toBe(true);
    }
  });

  it("every execution plan has at least one falsifiable proof gate", () => {
    for (const plan of EXECUTION_PLANS) {
      expect(plan.proofGates.length).toBeGreaterThan(0);
    }
  });

  it("every proof gate is framed as a concrete externally observable criterion", () => {
    for (const plan of EXECUTION_PLANS) {
      for (const gate of plan.proofGates) {
        expect(gate.label.length).toBeGreaterThan(0);
        // Criterion must be concrete — at least 20 chars and avoid vague language
        expect(gate.criterion.length).toBeGreaterThan(20);
        // Should not use aspirational or subjective labels
        expect(gate.criterion.toLowerCase()).not.toContain("best-in-class");
        expect(gate.criterion.toLowerCase()).not.toContain("world-class");
        expect(gate.criterion.toLowerCase()).not.toContain("industry-leading");
        // Must have a source cue
        expect(gate.source).toBeDefined();
        expect(gate.source.type).toBeTruthy();
      }
    }
  });

  it("every execution plan has a bounded timing window (not vague)", () => {
    for (const plan of EXECUTION_PLANS) {
      const display = plan.timingWindow.display;
      expect(display.length).toBeGreaterThan(0);
      // Must not use vague labels
      expect(display.toLowerCase()).not.toContain("short-term");
      expect(display.toLowerCase()).not.toContain("long-term");
      expect(display.toLowerCase()).not.toBe("later");
      expect(display.toLowerCase()).not.toBe("tbd");
      // Should contain range/bounded markers (quarters, weeks, months, or dependency-relative)
      const hasBoundedMarker =
        /Q[1-4]\s+20\d{2}/i.test(display) || // Quarter references
        /\d+[–-]\d+\s*(weeks?|months?)/i.test(display) || // N–M weeks/months
        /after\s/i.test(display) || // dependency-relative
        /20\d{2}[–-]/.test(display) || // year range
        /[–-]\s*Q[1-4]/i.test(display); // quarter range
      expect(hasBoundedMarker).toBe(true);
    }
  });

  it("every execution plan has a non-empty investor summary", () => {
    for (const plan of EXECUTION_PLANS) {
      expect(plan.investorSummary.length).toBeGreaterThan(20);
    }
  });

  it("every execution plan has a source cue", () => {
    for (const plan of EXECUTION_PLANS) {
      expect(plan.source).toBeDefined();
      expect(plan.source.type).toBeTruthy();
      expect(plan.source.label).toBeTruthy();
    }
  });

  it("every execution plan passes structural validation", () => {
    for (const plan of EXECUTION_PLANS) {
      expect(validateExecutionPlan(plan)).toBe(true);
    }
  });

  it("plans do not share nodeIds (each stage has exactly one plan)", () => {
    const nodeIds = EXECUTION_PLANS.map((p) => p.nodeId);
    const uniqueIds = new Set(nodeIds);
    expect(uniqueIds.size).toBe(nodeIds.length);
  });

  it("external dependencies list meaningful outside constraints", () => {
    for (const plan of EXECUTION_PLANS) {
      // External dependencies (if any) should be descriptive
      for (const dep of plan.externalDependencies) {
        expect(dep.length).toBeGreaterThan(5);
      }
    }
  });

  it("workstream descriptions are non-trivial", () => {
    for (const plan of EXECUTION_PLANS) {
      for (const ws of plan.workstreams) {
        expect(ws.label.length).toBeGreaterThan(0);
        expect(ws.description.length).toBeGreaterThan(10);
        expect(["internal", "external"]).toContain(ws.nature);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Timing Realism Constraints
// ---------------------------------------------------------------------------

describe("Timing Realism", () => {
  it("external-heavy plans use Planned or Directional, not Committed", () => {
    for (const plan of EXECUTION_PLANS) {
      const externalWorkstreams = plan.workstreams.filter(
        (w) => w.nature === "external"
      );
      const totalWorkstreams = plan.workstreams.length;
      const externalRatio = externalWorkstreams.length / totalWorkstreams;

      // If more than half the workstreams are external, confidence should not be Committed
      if (externalRatio > 0.5) {
        expect(["Planned", "Directional"]).toContain(plan.confidenceLabel);
      }
    }
  });

  it("timing windows with external constraints mention the main constraint", () => {
    for (const plan of EXECUTION_PLANS) {
      if (plan.externalDependencies.length > 0) {
        // Main constraint should be mentioned in the timing window or externally documented
        const hasConstraint =
          plan.timingWindow.mainConstraint !== undefined &&
          plan.timingWindow.mainConstraint.length > 0;
        expect(hasConstraint).toBe(true);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// validateExecutionPlan unit tests
// ---------------------------------------------------------------------------

describe("validateExecutionPlan", () => {
  const validPlan: ExecutionPlan = {
    nodeId: "test-node",
    confidenceLabel: "Planned",
    workstreams: [
      { label: "Build", nature: "internal", description: "Internal build workstream" },
      { label: "Audit", nature: "external", description: "External audit dependency" },
    ],
    externalDependencies: ["Security audit provider"],
    proofGates: [
      {
        label: "Test Gate",
        criterion: "Concrete externally observable criterion for test",
        source: { type: "canonical", label: "Test" },
      },
    ],
    timingWindow: {
      display: "Q3 2026–Q4 2026",
      mainConstraint: "Audit timeline",
    },
    investorSummary: "A meaningful summary for investors about this stage.",
    source: { type: "canonical", label: "Test" },
  };

  it("returns true for a valid plan", () => {
    expect(validateExecutionPlan(validPlan)).toBe(true);
  });

  it("returns false when workstreams are empty", () => {
    expect(
      validateExecutionPlan({ ...validPlan, workstreams: [] })
    ).toBe(false);
  });

  it("returns false when proof gates are empty", () => {
    expect(
      validateExecutionPlan({ ...validPlan, proofGates: [] })
    ).toBe(false);
  });

  it("returns false when timing window display is empty", () => {
    expect(
      validateExecutionPlan({
        ...validPlan,
        timingWindow: { display: "" },
      })
    ).toBe(false);
  });

  it("returns false when investor summary is empty", () => {
    expect(
      validateExecutionPlan({ ...validPlan, investorSummary: "" })
    ).toBe(false);
  });

  it("returns false when only internal workstreams and no external deps", () => {
    expect(
      validateExecutionPlan({
        ...validPlan,
        workstreams: [
          { label: "Build", nature: "internal", description: "Internal work" },
        ],
        externalDependencies: [],
      })
    ).toBe(false);
  });

  it("passes when workstreams are all internal but externalDependencies is non-empty", () => {
    expect(
      validateExecutionPlan({
        ...validPlan,
        workstreams: [
          { label: "Build", nature: "internal", description: "Internal work" },
        ],
        externalDependencies: ["Audit provider"],
      })
    ).toBe(true);
  });
});
