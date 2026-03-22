/**
 * Tests for the BETTER design system Button primitive.
 */
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui";

describe("Button", () => {
  it("renders with default variant (primary) and size (md)", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("bg-accent");
    expect(btn.className).toContain("h-10");
  });

  it("renders secondary variant with border styling", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole("button", { name: "Secondary" });
    expect(btn.className).toContain("border");
    expect(btn.className).toContain("text-secondary");
  });

  it("renders ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button", { name: "Ghost" });
    expect(btn.className).toContain("text-secondary");
    expect(btn.className).not.toContain("border");
  });

  it("renders live variant with green accent", () => {
    render(<Button variant="live">Live Action</Button>);
    const btn = screen.getByRole("button", { name: "Live Action" });
    expect(btn.className).toContain("bg-accent-green");
  });

  it("applies small size", () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole("button", { name: "Small" });
    expect(btn.className).toContain("h-8");
    expect(btn.className).toContain("text-xs");
  });

  it("applies large size", () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByRole("button", { name: "Large" });
    expect(btn.className).toContain("h-12");
  });

  it("forwards custom className via cn merge", () => {
    render(<Button className="custom-class">Custom</Button>);
    const btn = screen.getByRole("button", { name: "Custom" });
    expect(btn.className).toContain("custom-class");
  });

  it("supports disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button", { name: "Disabled" });
    expect(btn).toBeDisabled();
    expect(btn.className).toContain("disabled:opacity-50");
  });

  it("includes focus-visible ring for accessibility", () => {
    render(<Button>Accessible</Button>);
    const btn = screen.getByRole("button", { name: "Accessible" });
    expect(btn.className).toContain("focus-visible:ring-2");
  });
});
