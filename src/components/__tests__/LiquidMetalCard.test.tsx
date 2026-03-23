import { render, screen, fireEvent } from "@testing-library/react";
import { LiquidMetalCard } from "../LiquidMetalCard";

/**
 * Tests for the LiquidMetalCard component.
 *
 * VAL-VISUAL-030: Cards use glass-morphism (semi-transparent white backgrounds,
 * white borders at low opacity) with a liquid metal interactive finish
 * (cursor-tracking metallic sheen or equivalent radial-gradient effect).
 */
describe("LiquidMetalCard", () => {
  it("renders with glass-morphism base styles", () => {
    render(<LiquidMetalCard>Card content</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("rounded-lg");
    expect(card.textContent).toContain("Card content");
  });

  it("applies data-testid attribute", () => {
    render(<LiquidMetalCard data-testid="custom-card">Test</LiquidMetalCard>);
    expect(screen.getByTestId("custom-card")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    render(<LiquidMetalCard className="my-custom-class">Test</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    expect(card).toHaveClass("my-custom-class");
  });

  it("renders as a button when onClick is provided", () => {
    const handleClick = jest.fn();
    render(
      <LiquidMetalCard as="button" onClick={handleClick}>
        Clickable card
      </LiquidMetalCard>
    );
    const card = screen.getByTestId("liquid-metal-card");
    expect(card.tagName.toLowerCase()).toBe("button");
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as a div by default", () => {
    render(<LiquidMetalCard>Default div</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    expect(card.tagName.toLowerCase()).toBe("div");
  });

  it("has inline style for glass-morphism background", () => {
    render(<LiquidMetalCard>Styled</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    // Glass-morphism background: rgba(255,255,255,0.10)
    expect(card.style.background).toBeTruthy();
  });

  it("updates radial gradient position on mouse move", () => {
    render(<LiquidMetalCard>Interactive</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");

    // Simulate mouseenter to activate hover state
    fireEvent.mouseEnter(card);

    // Simulate mousemove at a position
    fireEvent.mouseMove(card, {
      clientX: 100,
      clientY: 50,
    });

    // After mouse move the card should have a custom property set
    // The radial gradient is applied via inline style
    const style = card.style;
    // The component sets --metal-x and --metal-y CSS custom properties
    expect(style.getPropertyValue("--metal-x")).toBeTruthy();
    expect(style.getPropertyValue("--metal-y")).toBeTruthy();
  });

  it("resets metallic sheen on mouse leave", () => {
    render(<LiquidMetalCard>Interactive</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 100, clientY: 50 });
    fireEvent.mouseLeave(card);

    // After mouse leave, the hover state is cleared
    const style = card.style;
    expect(style.getPropertyValue("--metal-x")).toBe("");
  });

  it("supports the active variant for focused graph nodes", () => {
    render(
      <LiquidMetalCard variant="active">Active</LiquidMetalCard>
    );
    const card = screen.getByTestId("liquid-metal-card");
    // Active variant has brighter border
    expect(card.className).toContain("ring");
  });

  it("has 8px border-radius", () => {
    render(<LiquidMetalCard>Radius check</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    // Tailwind rounded-lg maps to 8px
    expect(card).toHaveClass("rounded-lg");
  });
});
