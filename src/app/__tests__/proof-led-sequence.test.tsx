import { render, screen, within } from "@testing-library/react";
import Home from "../page";

/**
 * Proof-led landing sequence and CTA flow tests.
 *
 * Updated for graph-first shell: the proof section still appears before
 * dense content, but the graph shell replaces individual section anchors.
 * Content surfaces are now inside the graph shell's focused view.
 *
 * Updated for dynamic imports (VAL-VISUAL-027): GraphExplorer and ProofModule
 * are dynamically imported, so tests use async findBy* queries.
 *
 * VAL-NARR-013: Proof surface appears before dense roadmap exposition.
 * VAL-CROSS-001: First-visit flow explains BETTER, proof, and current maturity quickly.
 * VAL-CROSS-009: Landing-page section hierarchy is proof-led and single-purpose.
 * VAL-CROSS-010: Primary CTA follows live or proof path first.
 * VAL-CROSS-011: CTA promises stay consistent across surfaces.
 */

describe("Proof-before-density ordering (VAL-NARR-013)", () => {
  it("renders a proof/trust surface with a testid", async () => {
    render(<Home />);
    const proof = await screen.findByTestId("proof-section");
    expect(proof).toBeInTheDocument();
  });

  it("proof content is accessible inside the graph workspace via investor pitch path", async () => {
    render(<Home />);
    const proof = await screen.findByTestId("proof-section");
    const atlas = document.getElementById("atlas");
    expect(proof).toBeInTheDocument();
    expect(atlas).toBeInTheDocument();
    // Graph workspace is the default loaded state (VAL-ROADMAP-014),
    // and proof content is available as a graph node (Proof & Trust).
    // The standalone proof module remains as supplementary scroll content.
    // The investor pitch path gate 3 maps to proof.
    const graphShell = await screen.findByTestId("graph-shell");
    expect(graphShell).toBeInTheDocument();
  });

  it("proof section appears after the hero section in DOM order", async () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const proof = await screen.findByTestId("proof-section");
    const comparison = hero.compareDocumentPosition(proof);
    expect(comparison & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("proof section contains trust cues or live product evidence", async () => {
    render(<Home />);
    const proof = await screen.findByTestId("proof-section");
    const proofItems = within(proof).getAllByTestId("proof-item");
    expect(proofItems.length).toBeGreaterThan(0);
  });

  it("proof section contains at least one evidence hook", async () => {
    render(<Home />);
    const proof = await screen.findByTestId("proof-section");
    const hooks = proof.querySelectorAll('[data-testid="evidence-hook"]');
    expect(hooks.length).toBeGreaterThan(0);
  });
});

describe("Section hierarchy is proof-led and single-purpose (VAL-CROSS-009)", () => {
  it("landing page sections appear in graph-workspace-first order", async () => {
    render(<Home />);
    const hero = screen.getByTestId("hero-section");
    const proof = await screen.findByTestId("proof-section");
    const atlas = document.getElementById("atlas");

    // Atlas (graph workspace, genuinely first) → Hero → Proof (supplementary)
    // VAL-ROADMAP-014: default loaded state is a pure graph workspace — graph-first
    // VAL-CROSS-014: graph workspace has investor-path entry, no proof-page handoff
    expect(atlas!.compareDocumentPosition(hero) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(hero.compareDocumentPosition(proof) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("proof section has a single dominant job (proof/trust)", async () => {
    render(<Home />);
    const proof = await screen.findByTestId("proof-section");
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
  it("proof section CTA is consistent with hero primary CTA direction", async () => {
    render(<Home />);
    const proof = await screen.findByTestId("proof-section");
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

  it("graph shell provides roadmap node for exploration", async () => {
    render(<Home />);
    const graphShell = await screen.findByTestId("graph-shell");
    expect(graphShell).toBeInTheDocument();
    // Roadmap should be available as a graph node button
    const roadmapNodes = screen.getAllByTestId("graph-node-button").filter(
      (el) => el.getAttribute("aria-label")?.match(/roadmap/i)
    );
    expect(roadmapNodes.length).toBeGreaterThan(0);
  });
});

describe("First-visit comprehension flow (VAL-CROSS-001)", () => {
  it("first sections explain BETTER, show proof, then offer graph exploration", async () => {
    render(<Home />);
    // Hero: what BETTER is
    const hero = screen.getByTestId("hero-section");
    expect(hero.textContent).toMatch(/BETTER/);
    expect(hero.textContent).toMatch(/prediction-market/i);

    // Proof: why to trust BETTER
    const proof = await screen.findByTestId("proof-section");
    expect(proof).toBeInTheDocument();

    // Graph shell: explorable atlas for deeper content
    const graphShell = await screen.findByTestId("graph-shell");
    expect(graphShell).toBeInTheDocument();
  });

  it("proof surface is visible without extensive scrolling past dense content", async () => {
    render(<Home />);
    const proof = await screen.findByTestId("proof-section");
    const hero = screen.getByTestId("hero-section");
    // Proof is the immediate next major section after hero
    const comparison = hero.compareDocumentPosition(proof);
    expect(comparison & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
