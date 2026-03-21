import { render, screen } from "@testing-library/react";
import CaveatFrame from "../CaveatFrame";
import type { ConfidenceFrame } from "@/content";

describe("CaveatFrame", () => {
  const withDeps: ConfidenceFrame = {
    caveat: "This depends on several external factors.",
    dependencies: ["pe-terminal-open", "pe-social-vaults"],
  };

  const withoutDeps: ConfidenceFrame = {
    caveat: "Timeline is uncertain.",
  };

  it("renders the caveat text", () => {
    render(<CaveatFrame confidence={withDeps} />);
    expect(
      screen.getByText("This depends on several external factors.")
    ).toBeInTheDocument();
  });

  it("renders dependencies when present", () => {
    render(<CaveatFrame confidence={withDeps} />);
    expect(
      screen.getByText("pe-terminal-open, pe-social-vaults")
    ).toBeInTheDocument();
  });

  it("does not render dependencies when absent", () => {
    render(<CaveatFrame confidence={withoutDeps} />);
    expect(screen.queryByText(/Depends on:/)).not.toBeInTheDocument();
  });

  it("has accessible role and label", () => {
    render(<CaveatFrame confidence={withDeps} />);
    const frame = screen.getByRole("note");
    expect(frame).toHaveAttribute(
      "aria-label",
      "Confidence and caveat framing"
    );
  });
});
