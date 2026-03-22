import { render, screen, within } from "@testing-library/react";
import Home from "../page";

/**
 * Hero composition tests for the tradebetter-led redesign.
 *
 * VAL-NARR-011: The first viewport reads as one poster-like composition.
 * VAL-NARR-012: BETTER brand is dominant above the fold.
 * VAL-NARR-001: Hero explains BETTER in plain language.
 * VAL-NARR-002: Hero separates live product reality from future vision
 *               without relying on split-card pattern.
 * VAL-NARR-010: CTAs honest about destination with live path prominent.
 */
describe("Hero poster-like composition (VAL-NARR-011)", () => {
  it("hero section exists as one composition container", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    expect(hero).toBeInTheDocument();
  });

  it("hero does NOT contain split side-by-side card panels", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    // The old design used two side-by-side rounded-lg bordered cards
    // for "Live Today" and "The Vision Ahead". The redesign should NOT
    // have that split-card pattern within the hero.
    const splitCards = hero.querySelectorAll(
      '[data-testid="hero-split-card"]'
    );
    expect(splitCards.length).toBe(0);
  });

  it("hero contains a single dominant brand heading with logotype", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const heading = within(hero).getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    // The heading now contains the logotype image instead of text
    const logotype = heading.querySelector('img[data-testid="hero-logotype"]');
    expect(logotype).toBeInTheDocument();
  });

  it("hero visual system wraps the composition", () => {
    render(<Home />);
    const visualSystem = screen.getByTestId("hero-visual-system");
    expect(visualSystem).toBeInTheDocument();
    // Content should be inside the visual system
    const heroContent = within(visualSystem).getByTestId("hero-content");
    expect(heroContent).toBeInTheDocument();
  });
});

describe("BETTER brand dominance (VAL-NARR-012)", () => {
  it("BETTER logotype is the dominant above-the-fold brand signal", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const h1 = within(hero).getByRole("heading", { level: 1 });
    // The h1 should contain the BETTER logotype image (VAL-VISUAL-019)
    const logotypeImg = h1.querySelector('img[data-testid="hero-logotype"]');
    expect(logotypeImg).toBeInTheDocument();
    expect(logotypeImg!.getAttribute("alt")).toContain("BETTER");
  });

  it("hero has a tagline below the brand mark", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const tagline = within(hero).getByTestId("hero-tagline");
    expect(tagline).toBeInTheDocument();
    expect(tagline.textContent!.length).toBeGreaterThan(10);
  });
});

describe("Plain-language definition (VAL-NARR-001)", () => {
  it("hero contains a plain-language definition of BETTER", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    // Should contain the definition text
    expect(hero.textContent).toMatch(/prediction-market intelligence/i);
  });
});

describe("Live vs future framing without split cards (VAL-NARR-002)", () => {
  it("hero conveys live product reality with honest availability qualifier", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    // Live framing should be present in the hero
    const liveIndicator = within(hero).getByTestId("hero-live-status");
    expect(liveIndicator).toBeInTheDocument();
    // Must include a closed-beta or equivalent availability qualifier —
    // generic "shipping now" or "live now" phrasing is not acceptable
    // because the Terminal is not yet openly available.
    expect(liveIndicator.textContent).toMatch(/closed beta|early access|limited access|beta/i);
  });

  it("hero live-status does NOT use generic shipping-now phrasing without qualifier", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const liveIndicator = within(hero).getByTestId("hero-live-status");
    // Reject overstated availability phrasing that omits the beta qualifier
    const text = liveIndicator.textContent ?? "";
    const hasQualifier = /closed beta|early access|limited access|beta/i.test(text);
    // If the text says "shipping" or "live now" without a qualifier, fail
    if (/shipping now|available now/i.test(text)) {
      expect(hasQualifier).toBe(true);
    }
  });

  it("hero conveys future vision", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    // Future framing should be present
    const futureIndicator = within(hero).getByTestId("hero-future-status");
    expect(futureIndicator).toBeInTheDocument();
    expect(futureIndicator.textContent).toMatch(/vision|roadmap|planned|ahead|building/i);
  });

  it("live and future framing use inline/condensed layout, not split cards", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    // The framing container should be a single flow, not split cards
    const framingContainer = within(hero).getByTestId("hero-status-framing");
    expect(framingContainer).toBeInTheDocument();
    // Should NOT have the old split-card layout markers
    const oldSplitCards = framingContainer.querySelectorAll('[data-testid="hero-split-card"]');
    expect(oldSplitCards.length).toBe(0);
  });
});

describe("Evidence and caveats in hero (VAL-NARR-008, VAL-NARR-009)", () => {
  it("hero contains at least one evidence hook", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const hooks = hero.querySelectorAll('[data-testid="evidence-hook"]');
    expect(hooks.length).toBeGreaterThan(0);
  });

  it("hero contains caveat framing for future-facing claims", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const caveats = hero.querySelectorAll('[data-testid="caveat-frame"]');
    expect(caveats.length).toBeGreaterThan(0);
  });
});

describe("CTA hierarchy and honesty (VAL-NARR-010)", () => {
  it("primary CTA leads to live product or proof surface", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    expect(primaryCta).toBeInTheDocument();
    // Primary CTA should go to live content
    const href = primaryCta.getAttribute("href");
    expect(href).toMatch(/#live-now|https:\/\/.*betteragent|#evidence/);
  });

  it("secondary CTA leads to roadmap exploration", () => {
    render(<Home />);
    const secondaryCta = screen.getByTestId("cta-secondary");
    expect(secondaryCta).toBeInTheDocument();
    const href = secondaryCta.getAttribute("href");
    expect(href).toMatch(/#roadmap/);
  });

  it("CTA labels are honest about their destinations", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    const secondaryCta = screen.getByTestId("cta-secondary");
    // Primary CTA should mention live/product reality
    expect(primaryCta.textContent).toMatch(/live|product|see|try/i);
    // Secondary should mention exploration
    expect(secondaryCta.textContent).toMatch(/explore|roadmap|vision/i);
  });
});

describe("Maturity badges in hero (VAL-NARR-006 regression)", () => {
  it("hero renders maturity badges", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const badges = hero.querySelectorAll('[data-testid="maturity-badge"]');
    expect(badges.length).toBeGreaterThan(0);
    // Should have at least a live badge
    const statuses = Array.from(badges).map((b) => b.getAttribute("data-status"));
    expect(statuses).toContain("live");
  });
});
