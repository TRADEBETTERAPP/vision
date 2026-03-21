import { render, screen } from "@testing-library/react";
import MaturityLegend from "../MaturityLegend";

describe("MaturityLegend", () => {
  it("renders the legend region", () => {
    render(<MaturityLegend />);
    expect(screen.getByTestId("maturity-legend")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /maturity label legend/i })
    ).toBeInTheDocument();
  });

  it("explains all four maturity labels", () => {
    render(<MaturityLegend />);
    expect(screen.getByText("Live:")).toBeInTheDocument();
    expect(screen.getByText("In Progress:")).toBeInTheDocument();
    expect(screen.getByText("Planned:")).toBeInTheDocument();
    expect(screen.getByText("Speculative:")).toBeInTheDocument();
  });

  it("includes descriptions for each label", () => {
    render(<MaturityLegend />);
    expect(
      screen.getByText(/shipped and accessible to users today/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/actively being built/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/committed roadmap item/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ambitious long-range exploration/i)
    ).toBeInTheDocument();
  });

  it("renders maturity badges for each status", () => {
    render(<MaturityLegend />);
    const badges = screen.getAllByTestId("maturity-badge");
    expect(badges.length).toBe(4);
  });
});
