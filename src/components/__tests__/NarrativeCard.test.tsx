import { render, screen } from "@testing-library/react";
import NarrativeCard from "../NarrativeCard";
import type { NarrativeBlock } from "@/content";

describe("NarrativeCard", () => {
  const liveBlock: NarrativeBlock = {
    id: "test-live",
    surface: "current_scope",
    title: "Test Live Feature",
    body: "This is a live feature description.",
    status: "live",
    source: {
      type: "canonical",
      label: "Test Source",
      asOf: "2026-Q1",
    },
    order: 1,
  };

  const plannedBlock: NarrativeBlock = {
    id: "test-planned",
    surface: "vision",
    title: "Test Planned Feature",
    body: "This is a planned feature description.",
    status: "planned",
    source: {
      type: "scenario_based",
      label: "Test Roadmap",
    },
    confidence: {
      caveat: "This is not guaranteed to ship.",
      dependencies: ["dep-1"],
    },
    order: 2,
  };

  it("renders the title and body", () => {
    render(<NarrativeCard block={liveBlock} />);
    expect(screen.getByText("Test Live Feature")).toBeInTheDocument();
    expect(
      screen.getByText("This is a live feature description.")
    ).toBeInTheDocument();
  });

  it("renders a maturity badge", () => {
    render(<NarrativeCard block={liveBlock} />);
    expect(screen.getByTestId("maturity-badge")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("renders an evidence hook", () => {
    render(<NarrativeCard block={liveBlock} />);
    expect(screen.getByTestId("evidence-hook")).toBeInTheDocument();
    expect(screen.getByText("Test Source")).toBeInTheDocument();
  });

  it("does NOT render caveat for live blocks", () => {
    render(<NarrativeCard block={liveBlock} />);
    expect(screen.queryByTestId("caveat-frame")).not.toBeInTheDocument();
  });

  it("renders caveat for future-facing blocks", () => {
    render(<NarrativeCard block={plannedBlock} />);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
    expect(
      screen.getByText("This is not guaranteed to ship.")
    ).toBeInTheDocument();
  });

  it("sets the correct data-status attribute", () => {
    render(<NarrativeCard block={plannedBlock} />);
    const card = screen.getByTestId("narrative-card");
    expect(card).toHaveAttribute("data-status", "planned");
  });
});
