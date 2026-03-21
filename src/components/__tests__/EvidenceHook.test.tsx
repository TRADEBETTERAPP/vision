import { render, screen } from "@testing-library/react";
import EvidenceHook from "../EvidenceHook";
import type { SourceCue } from "@/content";

describe("EvidenceHook", () => {
  const canonicalSource: SourceCue = {
    type: "canonical",
    label: "BETTER Docs",
    asOf: "2026-Q1",
    href: "https://docs.betteragent.ai",
  };

  const scenarioSource: SourceCue = {
    type: "scenario_based",
    label: "BETTER Scenario Model",
  };

  it("renders the source label", () => {
    render(<EvidenceHook source={canonicalSource} />);
    expect(screen.getByText("BETTER Docs")).toBeInTheDocument();
  });

  it("renders the as-of date when present", () => {
    render(<EvidenceHook source={canonicalSource} />);
    expect(screen.getByText("as of 2026-Q1")).toBeInTheDocument();
  });

  it("does not render as-of when absent", () => {
    render(<EvidenceHook source={scenarioSource} />);
    expect(screen.queryByText(/as of/)).not.toBeInTheDocument();
  });

  it("renders as a link when href is present", () => {
    render(<EvidenceHook source={canonicalSource} />);
    const hook = screen.getByTestId("evidence-hook");
    expect(hook.tagName).toBe("A");
    expect(hook).toHaveAttribute("href", "https://docs.betteragent.ai");
    expect(hook).toHaveAttribute("target", "_blank");
    expect(hook).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders as a span when href is absent", () => {
    render(<EvidenceHook source={scenarioSource} />);
    const hook = screen.getByTestId("evidence-hook");
    expect(hook.tagName).toBe("SPAN");
  });
});
