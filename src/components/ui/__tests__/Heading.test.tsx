/**
 * Tests for the BETTER design system Heading typography primitive.
 */
import { render, screen } from "@testing-library/react";
import { Heading } from "@/components/ui";

describe("Heading", () => {
  it("renders title as an h2 element", () => {
    render(<Heading title="Test Title" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Test Title"
    );
  });

  it("renders label when provided", () => {
    render(<Heading label="Section" title="Title" />);
    expect(screen.getByText("Section")).toBeInTheDocument();
    // Label should have terminal styling
    expect(screen.getByText("Section").className).toContain("font-terminal");
    expect(screen.getByText("Section").className).toContain("text-accent");
    expect(screen.getByText("Section").className).toContain("uppercase");
  });

  it("renders description when provided", () => {
    render(<Heading title="Title" description="A helpful description" />);
    expect(screen.getByText("A helpful description")).toBeInTheDocument();
  });

  it("does not render label when not provided", () => {
    const { container } = render(<Heading title="Title" />);
    // Should only have the h2, no label paragraph
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(0);
  });

  it("does not render description when not provided", () => {
    const { container } = render(<Heading title="Title" label="Lab" />);
    // Only the label paragraph
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(1);
  });

  it("defaults to center alignment", () => {
    const { container } = render(<Heading title="Title" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("text-center");
  });

  it("supports left alignment", () => {
    const { container } = render(<Heading title="Title" align="left" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("text-left");
  });

  it("center-aligned description has max-width constraint", () => {
    render(<Heading title="Title" description="Desc" align="center" />);
    const desc = screen.getByText("Desc");
    expect(desc.className).toContain("mx-auto");
    expect(desc.className).toContain("max-w-2xl");
  });

  it("left-aligned description does not center itself", () => {
    render(<Heading title="Title" description="Desc" align="left" />);
    const desc = screen.getByText("Desc");
    expect(desc.className).not.toContain("mx-auto");
  });
});
