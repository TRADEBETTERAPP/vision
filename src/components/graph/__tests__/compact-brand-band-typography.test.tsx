import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

/**
 * Typography tests for CompactBrandBand — verifies the tradebetter design
 * language requirement that ALL headings and prominent text use UPPERCASE
 * with tight letter-spacing (-0.04em to -0.08em).
 *
 * VAL-VISUAL-031: Tradebetter-exact design language
 *   - ALL headings must be UPPERCASE with tight letter-spacing
 *   - Tight tracking on all prominent text: -0.04em to -0.08em
 */
describe("CompactBrandBand typography (VAL-VISUAL-031)", () => {
  it("hero tagline uses uppercase class", () => {
    render(<Home />);
    const tagline = screen.getByTestId("hero-tagline");
    expect(tagline.className).toMatch(/\buppercase\b/);
  });

  it("hero tagline uses tight letter-spacing tracking class", () => {
    render(<Home />);
    const tagline = screen.getByTestId("hero-tagline");
    // Should use tracking-[-0.06em] as specified in the feature description
    expect(tagline.className).toMatch(/tracking-\[-0\.06em\]/);
  });

  it("hero tagline is a prominent <p> with heading-weight styling", () => {
    render(<Home />);
    const tagline = screen.getByTestId("hero-tagline");
    expect(tagline.tagName).toBe("P");
    // Should still have font-medium or similar weight
    expect(tagline.className).toMatch(/font-medium|font-semibold/);
  });

  it("CTA buttons already follow uppercase + tight tracking", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    const secondaryCta = screen.getByTestId("cta-secondary");

    // Both CTAs should use uppercase
    expect(primaryCta.className).toMatch(/\buppercase\b/);
    expect(secondaryCta.className).toMatch(/\buppercase\b/);

    // Both CTAs should use tight tracking
    expect(primaryCta.className).toMatch(/tracking-\[-0\.08em\]/);
    expect(secondaryCta.className).toMatch(/tracking-\[-0\.08em\]/);
  });
});
