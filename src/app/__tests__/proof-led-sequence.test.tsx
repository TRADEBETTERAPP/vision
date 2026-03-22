import { render, screen, within } from "@testing-library/react";
import Home from "../page";

/**
 * Proof-led landing sequence and CTA flow tests.
 *
 * Updated for graph-first shell: the proof section still appears before
 * dense content, but the graph shell replaces individual section anchors.
 * Content surfaces are now inside the graph shell's focused view.
 *
 * VAL-NARR-013: Proof surface appears before dense roadmap exposition.
 * VAL-CROSS-001: First-visit flow explains BETTER, proof, and current maturity quickly.
 * VAL-CROSS-009: Landing-page section hierarchy is proof-led and single-purpose.
 * VAL-CROSS-010: Primary CTA follows live or proof path first.
 * VAL-CROSS-011: CTA promises stay consistent across surfaces.
 */

describe("Proof-before-density ordering (VAL-NARR-013)", () => {
  it("renders a proof/trust surface with a testid", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    expect(proof).toBeInTheDocument();
  });

  it("proof section appears before the graph atlas section in DOM order", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    const atlas = document.getElementById("atlas");
    expect(proof).toBeInTheDocument();
    expect(atlas).toBeInTheDocument();
    // proof should precede atlas in DOM order
    const comparison = proof.compareDocumentPosition(atlas!);
    expect(comparison & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("proof section appears after the hero section in DOM order", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const proof = screen.getByTestId("proof-section");
    const comparison = hero.compareDocumentPosition(proof);
    expect(comparison & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("proof section contains trust cues or live product evidence", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    const proofItems = within(proof).getAllByTestId("proof-item");
    expect(proofItems.length).toBeGreaterThan(0);
  });

  it("proof section contains at least one evidence hook", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    const hooks = proof.querySelectorAll('[data-testid="evidence-hook"]');
    expect(hooks.length).toBeGreaterThan(0);
  });
});

describe("Section hierarchy is proof-led and single-purpose (VAL-CROSS-009)", () => {
  it("landing page sections appear in proof-before-density order", () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const proof = screen.getByTestId("proof-section");
    const atlas = document.getElementById("atlas");

    // Hero → Proof → Atlas (graph shell)
    expect(hero.compareDocumentPosition(proof) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(proof.compareDocumentPosition(atlas!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("proof section has a single dominant job (proof/trust)", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    // Should NOT contain roadmap atlas or tokenomics content
    const atlasInProof = proof.querySelectorAll('[data-testid="roadmap-atlas"]');
    expect(atlasInProof.length).toBe(0);
    const tokenomicsInProof = proof.querySelectorAll('[data-testid="tokenomics-section"]');
    expect(tokenomicsInProof.length).toBe(0);
  });
});

describe("Primary CTA follows live/proof path first (VAL-CROSS-010)", () => {
  it("hero primary CTA points to a live or proof-oriented destination", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    const href = primaryCta.getAttribute("href");
    // Should point to proof graph state, live-now, or a live external destination
    expect(href).toMatch(/#(graph-)?(live-now|proof)|https:\/\/.*betteragent|https:\/\/.*tradebetter/);
  });

  it("hero primary CTA label mentions live, proof, or product reality", () => {
    render(<Home />);
    const primaryCta = screen.getByTestId("cta-primary");
    expect(primaryCta.textContent).toMatch(/live|proof|product|see|try|trade/i);
  });

  it("hero secondary CTA is for exploration, not the primary action", () => {
    render(<Home />);
    const secondaryCta = screen.getByTestId("cta-secondary");
    expect(secondaryCta.textContent).toMatch(/explore|roadmap|atlas|vision|deep/i);
  });
});

describe("CTA promises stay consistent across surfaces (VAL-CROSS-011)", () => {
  it("proof section CTA is consistent with hero primary CTA direction", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    const proofCtas = proof.querySelectorAll("a[href]");
    const proofHrefs = Array.from(proofCtas).map(a => a.getAttribute("href"));
    // At least one CTA in proof section should lead to live content
    const hasLiveDirection = proofHrefs.some(
      href =>
        href?.includes("#live-now") ||
        href?.includes("#graph-live-now") ||
        href?.includes("betteragent") ||
        href?.includes("tradebetter") ||
        href?.includes("docs.betteragent")
    );
    expect(hasLiveDirection).toBe(true);
  });

  it("graph shell provides roadmap node for exploration", () => {
    render(<Home />);
    const graphShell = screen.getByTestId("graph-shell");
    expect(graphShell).toBeInTheDocument();
    // Roadmap should be available as a graph node
    const roadmapNode = screen.getByRole("button", { name: /roadmap/i });
    expect(roadmapNode).toBeInTheDocument();
  });
});

describe("First-visit comprehension flow (VAL-CROSS-001)", () => {
  it("first sections explain BETTER, show proof, then offer graph exploration", () => {
    render(<Home />);
    // Hero: what BETTER is
    const hero = screen.getByTestId("hero-section");
    expect(hero.textContent).toMatch(/BETTER/);
    expect(hero.textContent).toMatch(/prediction-market/i);

    // Proof: why to trust BETTER
    const proof = screen.getByTestId("proof-section");
    expect(proof).toBeInTheDocument();

    // Graph shell: explorable atlas for deeper content
    const graphShell = screen.getByTestId("graph-shell");
    expect(graphShell).toBeInTheDocument();
  });

  it("proof surface is visible without extensive scrolling past dense content", () => {
    render(<Home />);
    const proof = screen.getByTestId("proof-section");
    const hero = screen.getByTestId("hero-section");
    // Proof is the immediate next major section after hero
    const comparison = hero.compareDocumentPosition(proof);
    expect(comparison & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
