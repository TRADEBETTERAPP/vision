import { render, screen } from "@testing-library/react";
import Home from "../page";
import { NAV_ITEMS } from "@/components/nav-items";
import { parseGraphHash } from "@/content/graph-nodes";

/**
 * Regression tests for hero and primary CTA destinations under the
 * graph-first shell architecture.
 *
 * These tests ensure that no prominent CTA in the main shell uses a
 * legacy anchor-scroll destination (e.g., #proof, #live-now, #roadmap)
 * instead of the graph-first focus-state path (#graph-*).
 *
 * Satisfies the feature requirement:
 *   "Regression coverage fails if a prominent legacy anchor-scroll
 *    destination reappears in the main shell"
 */

describe("Hero primary CTA uses graph destination", () => {
  it("hero primary CTA uses a #graph-* focus-state path, not a legacy section anchor", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    const href = primaryCta.getAttribute("href");
    // Must be a graph-first destination
    expect(href).toMatch(/^#graph-/);
    // Specifically should target the proof graph node for proof-led entry
    expect(href).toBe("#graph-proof");
  });

  it("hero secondary CTA uses a #graph-* focus-state path", () => {
    render(<Home />);
    const secondaryCta = screen.getByTestId("cta-secondary");
    const href = secondaryCta.getAttribute("href");
    expect(href).toMatch(/^#graph-/);
  });

  it("hero primary CTA label remains proof/live-oriented", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    expect(primaryCta.textContent).toMatch(/live|proof|product|see|try|trade/i);
  });

  it("hero primary CTA is an anchor element navigable by the graph shell", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    expect(primaryCta.tagName).toBe("A");
  });
});

describe("No prominent legacy anchor-scroll routes survive in the main shell", () => {
  it("all in-page hash CTAs rendered on the home page use #graph-* format", () => {
    const { container } = render(<Home />);
    const hashLinks = container.querySelectorAll("a[href^='#']");
    const legacyAnchors: string[] = [];

    hashLinks.forEach((link) => {
      const href = link.getAttribute("href")!;
      if (!href.startsWith("#graph-")) {
        legacyAnchors.push(href);
      }
    });

    // No legacy anchor-scroll destinations should remain in the shell
    expect(legacyAnchors).toEqual([]);
  });

  it("navigation items all use #graph-* format", () => {
    for (const item of NAV_ITEMS) {
      if (item.href.startsWith("#")) {
        expect(item.href).toMatch(/^#graph-/);
      }
    }
  });

  it("proof section CTAs use #graph-* format for in-page targets", () => {
    render(<Home />);
    const proofSection = screen.getByTestId("proof-section");
    const proofHashLinks = proofSection.querySelectorAll("a[href^='#']");

    proofHashLinks.forEach((link) => {
      const href = link.getAttribute("href")!;
      expect(href).toMatch(/^#graph-/);
    });
  });
});

describe("Graph shell handles proof focus from hero CTA", () => {
  it("graph shell has a proof node that the hero CTA can target", () => {
    render(<Home />);
    const graphNodes = screen.getAllByTestId("graph-node-button");
    const proofNode = graphNodes.find(
      (n) => n.getAttribute("aria-label")?.toLowerCase().includes("proof")
    );
    expect(proofNode).toBeDefined();
  });

  it("#graph-proof hash correctly parses to the proof graph node", () => {
    expect(parseGraphHash("#graph-proof")).toBe("proof");
  });
});
