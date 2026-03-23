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

  it("renders 'Live' for live status with a green dot", () => {
    render(<MaturityBadge status="live" />);
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByTestId("status-dot")).toBeInTheDocument();
  });

  it("renders 'In Progress' for in_progress status without a dot", () => {
    render(<MaturityBadge status="in_progress" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.queryByTestId("status-dot")).not.toBeInTheDocument();
  });

  it("renders 'Planned' for planned status without a dot", () => {
    render(<MaturityBadge status="planned" />);
    expect(screen.getByText("Planned")).toBeInTheDocument();
    expect(screen.queryByTestId("status-dot")).not.toBeInTheDocument();
  });

  it("renders 'Speculative' for speculative status without a dot", () => {
    render(<MaturityBadge status="speculative" />);
    expect(screen.getByText("Speculative")).toBeInTheDocument();
    expect(screen.queryByTestId("status-dot")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<MaturityBadge status="live" className="custom-class" />);
    const badge = screen.getByTestId("maturity-badge");
    expect(badge.className).toContain("custom-class");
  });
});
