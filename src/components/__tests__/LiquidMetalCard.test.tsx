import { render, screen, fireEvent } from "@testing-library/react";
import { LiquidMetalCard } from "../LiquidMetalCard";

/**
 * Tests for the LiquidMetalCard component.
 *
 * VAL-VISUAL-030: Cards use glass-morphism (semi-transparent white backgrounds,
 * white borders at low opacity) with a liquid metal interactive finish
 * (cursor-tracking metallic sheen or equivalent radial-gradient effect).
 *
 * VAL-VISUAL-035: Cards are nearly transparent (rgba(255,255,255,0.04) base)
 * so the shader background shows through. No backdrop-blur. Cursor-tracking
 * metallic sheen clearly visible on hover. Subtle inner glow adds depth.
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

  it("hover sheen center highlight is at least 0.35 opacity — VAL-VISUAL-030 sheen visibility boost", () => {
    render(<LiquidMetalCard>Sheen test</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });

    const bg = card.style.background;
    // The radial-gradient center should use rgba(255, 255, 255, X) where X >= 0.35
    const rgbaMatch = bg.match(
      /radial-gradient\(.*?rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/
    );
    expect(rgbaMatch).not.toBeNull();
    const opacity = parseFloat(rgbaMatch![1]);
    expect(opacity).toBeGreaterThanOrEqual(0.35);
  });

  it("hover sheen includes a secondary metallic ring for depth — VAL-VISUAL-030", () => {
    render(<LiquidMetalCard>Ring test</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });

    const bg = card.style.background;
    // Expect a secondary metallic ring with a blue-tinted rgba value
    // e.g. rgba(200, 210, 255, 0.12) or similar
    expect(bg).toMatch(/rgba\(\s*200\s*,\s*210\s*,\s*255/);
  });

  // VAL-VISUAL-035: sheen contrast against the new 0.08 hover base
  it("sheen radial-gradient is materially distinct from the hover base background", () => {
    render(<LiquidMetalCard>Contrast test</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");

    fireEvent.mouseEnter(card);
    fireEvent.mouseMove(card, { clientX: 50, clientY: 50 });

    const bg = card.style.background;
    // The center highlight opacity minus the hover base (0.08) should be >= 0.25
    // to ensure the sheen is clearly visible over the nearly-transparent card
    const rgbaMatch = bg.match(
      /radial-gradient\(.*?rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/
    );
    expect(rgbaMatch).not.toBeNull();
    const sheenOpacity = parseFloat(rgbaMatch![1]);
    const hoverBase = 0.08;
    expect(sheenOpacity - hoverBase).toBeGreaterThanOrEqual(0.25);
  });

  // ---------------------------------------------------------------------------
  // VAL-VISUAL-035: Nearly transparent cards that complement the shader
  // ---------------------------------------------------------------------------

  it("base background is rgba(255,255,255,0.04) — nearly transparent — VAL-VISUAL-035", () => {
    render(<LiquidMetalCard>Transparent base</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    expect(card.style.background).toContain("rgba(255, 255, 255, 0.04)");
  });

  it("hover background is rgba(255,255,255,0.08) — VAL-VISUAL-035", () => {
    render(<LiquidMetalCard>Hover check</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    fireEvent.mouseEnter(card);
    expect(card.style.background).toContain("rgba(255, 255, 255, 0.08)");
  });

  it("border uses rgba(255,255,255,0.12) — subtle edge — VAL-VISUAL-035", () => {
    render(<LiquidMetalCard>Border check</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    expect(card.style.border).toContain("rgba(255, 255, 255, 0.12)");
  });

  it("does NOT apply backdrop-filter blur — shader shows through — VAL-VISUAL-035", () => {
    render(<LiquidMetalCard>No blur</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    // backdropFilter must not be set (or be empty)
    expect(card.style.backdropFilter).toBeFalsy();
    // Also check WebkitBackdropFilter
    expect(card.style.getPropertyValue("-webkit-backdrop-filter")).toBeFalsy();
  });

  it("hover state includes subtle inner glow box-shadow — VAL-VISUAL-035", () => {
    render(<LiquidMetalCard>Glow check</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    fireEvent.mouseEnter(card);
    // Should have an inset box-shadow for the inner glow
    expect(card.style.boxShadow).toContain("inset");
    expect(card.style.boxShadow).toContain("30px");
  });

  it("no inner glow in default (non-hover) state — VAL-VISUAL-035", () => {
    render(<LiquidMetalCard>No glow default</LiquidMetalCard>);
    const card = screen.getByTestId("liquid-metal-card");
    // In default state, no inset box-shadow
    expect(card.style.boxShadow).not.toContain("inset");
  });
});
