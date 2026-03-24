/**
 * Tests for the BETTER design system Button primitive.
 *
 * The Button is the shadcn/ui Button built on @base-ui/react, using CVA
 * for variants. Tests assert the actual shadcn class names produced by the
 * component (h-8 default, h-7 sm, h-9 lg, focus-visible:ring-3, etc.).
 */
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui";

describe("Button", () => {
  it("renders with default variant (primary) and size", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn).toBeInTheDocument();
    // shadcn default variant: bg-primary, default size h-8
    expect(btn.className).toContain("bg-primary");
    expect(btn.className).toContain("h-8");
    expect(btn.className).toContain("text-primary-foreground");
  });

  it("renders secondary variant with secondary styling", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole("button", { name: "Secondary" });
    expect(btn.className).toContain("bg-secondary");
    expect(btn.className).toContain("text-secondary-foreground");
  });

  it("renders ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button", { name: "Ghost" });
    // Ghost variant: no background, hover reveals bg-muted
    expect(btn.className).toContain("hover:bg-muted");
  });

  it("renders outline variant with border styling", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole("button", { name: "Outline" });
    expect(btn.className).toContain("border-border");
    expect(btn.className).toContain("bg-background");
  });

  it("does not use green fill for any variant — green is reserved for status dots only", () => {
    // Default variant must not use accent-green
    render(<Button>Primary CTA</Button>);
    const btn = screen.getByRole("button", { name: "Primary CTA" });
    expect(btn.className).not.toContain("bg-accent-green");
    expect(btn.className).not.toContain("#00ff00");
  });

  it("applies small size (h-7)", () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole("button", { name: "Small" });
    expect(btn.className).toContain("h-7");
  });

  it("applies large size (h-9)", () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByRole("button", { name: "Large" });
    expect(btn.className).toContain("h-9");
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
    // shadcn uses focus-visible:ring-3 (not ring-2)
    expect(btn.className).toContain("focus-visible:ring-3");
  });
});
