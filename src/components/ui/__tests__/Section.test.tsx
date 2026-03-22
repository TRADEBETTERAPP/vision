/**
 * Tests for the BETTER design system Section layout primitive.
 */
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/ui";

describe("Section", () => {
  it("renders as a <section> element", () => {
    render(<Section data-testid="sec">Content</Section>);
    const el = screen.getByTestId("sec");
    expect(el.tagName).toBe("SECTION");
  });

  it("applies default spacing (py-24)", () => {
    render(<Section data-testid="sec">Content</Section>);
    const el = screen.getByTestId("sec");
    expect(el.className).toContain("py-24");
  });

  it("applies compact spacing (py-16)", () => {
    render(<Section spacing="compact" data-testid="sec">Compact</Section>);
    const el = screen.getByTestId("sec");
    expect(el.className).toContain("py-16");
  });

  it("applies hero spacing (py-0)", () => {
    render(<Section spacing="hero" data-testid="sec">Hero</Section>);
    const el = screen.getByTestId("sec");
    expect(el.className).toContain("py-0");
  });

  it("applies top border divider by default", () => {
    render(<Section data-testid="sec">Content</Section>);
    const el = screen.getByTestId("sec");
    expect(el.className).toContain("border-t");
    expect(el.className).toContain("border-border");
  });

  it("omits border divider when divider=none", () => {
    render(<Section divider="none" data-testid="sec">No border</Section>);
    const el = screen.getByTestId("sec");
    expect(el.className).not.toContain("border-t");
  });

  it("applies horizontal padding", () => {
    render(<Section data-testid="sec">Content</Section>);
    const el = screen.getByTestId("sec");
    expect(el.className).toContain("px-4");
  });

  it("forwards additional className", () => {
    render(<Section className="extra-class" data-testid="sec">Content</Section>);
    const el = screen.getByTestId("sec");
    expect(el.className).toContain("extra-class");
  });

  it("forwards id attribute for anchor navigation", () => {
    render(<Section id="roadmap" data-testid="sec">Content</Section>);
    const el = screen.getByTestId("sec");
    expect(el.id).toBe("roadmap");
  });
});
