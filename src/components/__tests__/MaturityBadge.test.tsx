import { render, screen } from "@testing-library/react";
import MaturityBadge from "../MaturityBadge";
import type { MaturityStatus } from "@/content";

describe("MaturityBadge", () => {
  const statuses: MaturityStatus[] = ["live", "in_progress", "planned", "speculative"];

  it.each(statuses)("renders the human-readable label for %s", (status) => {
    render(<MaturityBadge status={status} />);
    const badge = screen.getByTestId("maturity-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-status", status);
  });

  it("renders 'Live' for live status", () => {
    render(<MaturityBadge status="live" />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("renders 'In Progress' for in_progress status", () => {
    render(<MaturityBadge status="in_progress" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("renders 'Planned' for planned status", () => {
    render(<MaturityBadge status="planned" />);
    expect(screen.getByText("Planned")).toBeInTheDocument();
  });

  it("renders 'Speculative' for speculative status", () => {
    render(<MaturityBadge status="speculative" />);
    expect(screen.getByText("Speculative")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<MaturityBadge status="live" className="custom-class" />);
    const badge = screen.getByTestId("maturity-badge");
    expect(badge.className).toContain("custom-class");
  });
});
