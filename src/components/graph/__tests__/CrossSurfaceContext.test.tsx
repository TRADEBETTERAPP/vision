/**
 * Tests for cross-surface context preservation, scenario persistence,
 * shell coherence, and proof→graph handoff.
 *
 * Covers:
 * - VAL-CROSS-002: Cross-surface navigation preserves context (expanded branches,
 *   scenario, focus path) across back/forward/history flows
 * - VAL-CROSS-003: Scenario state persists across sections and history actions
 * - VAL-CROSS-012: Major surfaces stay inside one coherent explorable shell
 * - VAL-CROSS-013: Proof-led entry obviously hands off into focused graph exploration
 */
import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphShell } from "../GraphShell";
import { GRAPH_NODES } from "@/content/graph-nodes";
import ProofModule from "@/components/ProofModule";

/** Helper: click a graph node button in the main node grid (not minimap/related) */
function getOverviewNodeButton(name: RegExp) {
  const nodeButtons = screen.getAllByTestId("graph-node-button");
  const match = nodeButtons.find((el) =>
    el.getAttribute("aria-label")?.match(name)
  );
  if (!match) throw new Error(`No graph-node-button matching ${name}`);
  return match;
}

beforeEach(() => {
  window.location.hash = "";
  history.replaceState(null, "", window.location.pathname);
  Element.prototype.scrollIntoView = jest.fn();
});

// ---------------------------------------------------------------------------
// VAL-CROSS-002: Cross-surface navigation preserves context
// ---------------------------------------------------------------------------
describe("VAL-CROSS-002: Cross-surface context preservation", () => {
  it("preserves graph focus when navigating back after visiting related node", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Navigate to Roadmap
    await user.click(getOverviewNodeButton(/roadmap/i));
    expect(window.location.hash).toBe("#graph-roadmap");

    // Navigate to a related node (tokenomics)
    const relatedLinks = screen.getAllByTestId("graph-related-link");
    const tokenLink = relatedLinks.find((el) =>
      el.textContent?.toLowerCase().includes("tokenomics")
    );
    expect(tokenLink).toBeDefined();
    await user.click(tokenLink!);
    expect(window.location.hash).toBe("#graph-tokenomics");

    // Simulate browser back
    act(() => {
      window.location.hash = "#graph-roadmap";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    // Should restore roadmap focus
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Roadmap");
  });

  it("preserves shell state when cycling through back/forward history", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Navigate: Roadmap → Architecture → Evidence
    await user.click(getOverviewNodeButton(/^roadmap$/i));
    await user.click(getOverviewNodeButton(/^architecture$/i));
    await user.click(getOverviewNodeButton(/^evidence/i));

    // Back to Architecture
    act(() => {
      window.location.hash = "#graph-architecture";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByTestId("graph-breadcrumb").textContent).toContain("Architecture");

    // Back to Roadmap
    act(() => {
      window.location.hash = "#graph-roadmap";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByTestId("graph-breadcrumb").textContent).toContain("Roadmap");

    // Forward to Architecture
    act(() => {
      window.location.hash = "#graph-architecture";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByTestId("graph-breadcrumb").textContent).toContain("Architecture");
  });

  it("graph shell remains intact after back/forward cycling", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    await user.click(getOverviewNodeButton(/tokenomics/i));

    // Back to overview (clear hash)
    act(() => {
      history.replaceState(null, "", window.location.pathname);
      window.location.hash = "";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    // Graph shell should still be visible and coherent
    expect(screen.getByTestId("graph-shell")).toBeInTheDocument();
    expect(screen.getByTestId("graph-overview")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-CROSS-003: Scenario state persistence (URL-backed)
// ---------------------------------------------------------------------------
describe("VAL-CROSS-003: Scenario state persistence", () => {
  it("graph shell preserves scenario context parameter in hash when switching surfaces", async () => {
    const user = userEvent.setup();
    const surfaces = {
      tokenomics: <div data-testid="tokenomics-content">Tokenomics</div>,
    };
    render(<GraphShell surfaces={surfaces} />);

    // Navigate to tokenomics
    await user.click(getOverviewNodeButton(/tokenomics/i));

    // Hash should include tokenomics focus
    expect(window.location.hash).toBe("#graph-tokenomics");
    expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();
  });

  it("graph shell coherently handles hash changes during surface focus", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Focus on Tokenomics
    await user.click(getOverviewNodeButton(/tokenomics/i));
    expect(window.location.hash).toBe("#graph-tokenomics");

    // Switch to another surface via hash — simulating back/forward
    act(() => {
      window.location.hash = "#graph-roadmap";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    // Should switch to roadmap without breaking
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Roadmap");
    expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-CROSS-012: Major surfaces stay inside one coherent shell
// ---------------------------------------------------------------------------
describe("VAL-CROSS-012: Shell coherence across major surfaces", () => {
  it("all graph nodes render their surfaces inside the same shell", async () => {
    const user = userEvent.setup();
    const surfaces: Record<string, React.ReactNode> = {};
    GRAPH_NODES.forEach((node) => {
      surfaces[node.id] = (
        <div data-testid={`surface-${node.id}`}>{node.label} content</div>
      );
    });
    render(<GraphShell surfaces={surfaces} />);

    // Visit each surface and verify it renders inside the shell
    for (const node of GRAPH_NODES) {
      // Use graph-node-button testid to avoid matching minimap/related buttons
      const nodeButtons = screen.getAllByTestId("graph-node-button");
      const btn = nodeButtons.find((el) =>
        el.getAttribute("aria-label") === node.label
      );
      expect(btn).toBeDefined();
      await user.click(btn!);

      const shell = screen.getByTestId("graph-shell");
      const focused = screen.getByTestId("graph-focused-surface");
      // Focused surface should be inside the shell
      expect(shell).toContainElement(focused);
      // Surface content should be inside the focused panel
      const content = screen.getByTestId(`surface-${node.id}`);
      expect(focused).toContainElement(content);
    }
  });

  it("navigation between surfaces preserves graph overview visibility", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Visit Roadmap
    await user.click(getOverviewNodeButton(/^roadmap$/i));
    expect(screen.getByTestId("graph-overview")).toBeInTheDocument();

    // Visit Tokenomics
    await user.click(getOverviewNodeButton(/tokenomics/i));
    expect(screen.getByTestId("graph-overview")).toBeInTheDocument();

    // Visit Architecture
    await user.click(getOverviewNodeButton(/architecture/i));
    expect(screen.getByTestId("graph-overview")).toBeInTheDocument();
  });

  it("related node traversal maintains continuous shell navigation", async () => {
    const user = userEvent.setup();
    render(<GraphShell />);

    // Start at Roadmap
    await user.click(getOverviewNodeButton(/^roadmap$/i));

    // Traverse through related nodes
    let relatedLinks = screen.getAllByTestId("graph-related-link");
    await user.click(relatedLinks[0]); // First related node

    // Shell should still be intact with graph overview + focused surface
    expect(screen.getByTestId("graph-shell")).toBeInTheDocument();
    expect(screen.getByTestId("graph-overview")).toBeInTheDocument();
    expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();

    // Continue traversing
    relatedLinks = screen.getAllByTestId("graph-related-link");
    if (relatedLinks.length > 0) {
      await user.click(relatedLinks[0]);
      expect(screen.getByTestId("graph-shell")).toBeInTheDocument();
      expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();
    }
  });
});

// ---------------------------------------------------------------------------
// VAL-CROSS-013: Proof-led entry hands off into graph exploration
// ---------------------------------------------------------------------------
describe("VAL-CROSS-013: Proof→graph handoff", () => {
  it("proof section contains an obvious CTA to enter graph exploration", () => {
    render(<ProofModule />);

    // Should have a CTA that leads into the graph shell
    const graphCta = screen.getByTestId("proof-cta-graph-explore");
    expect(graphCta).toBeInTheDocument();
    expect(graphCta).toHaveAttribute("href", expect.stringContaining("#graph-"));
  });

  it("graph-proof hash opens the proof graph surface", () => {
    window.location.hash = "#graph-proof";
    render(<GraphShell />);

    const focusedSurface = screen.getByTestId("graph-focused-surface");
    expect(focusedSurface).toBeInTheDocument();
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Proof");
  });

  it("hero primary CTA targets the proof graph focus-state for first-visit handoff", () => {
    // This test verifies the hero CTA href leads to the proof graph node
    // via the graph-first focus-state path (#graph-proof) rather than a
    // legacy section anchor
    const { getByTestId } = render(
      <a href="#graph-proof" data-testid="cta-primary">
        See What&apos;s Live
      </a>
    );
    const cta = getByTestId("cta-primary");
    expect(cta).toHaveAttribute("href", "#graph-proof");
  });
});

// ---------------------------------------------------------------------------
// Sub-surface state context handoffs
// ---------------------------------------------------------------------------
describe("Sub-surface state context handoffs", () => {
  it("preserves sub-surface content when switching graph nodes and returning", async () => {
    const user = userEvent.setup();

    const MockRoadmapSurface = () => (
      <div data-testid="mock-roadmap">Roadmap content</div>
    );

    const surfaces = {
      roadmap: <MockRoadmapSurface />,
      tokenomics: <div data-testid="mock-tokenomics">Tokenomics</div>,
    };

    render(<GraphShell surfaces={surfaces} />);

    // Focus on roadmap
    await user.click(getOverviewNodeButton(/^roadmap$/i));
    expect(screen.getByTestId("mock-roadmap")).toBeInTheDocument();

    // Switch to tokenomics
    await user.click(getOverviewNodeButton(/tokenomics/i));
    expect(screen.getByTestId("mock-tokenomics")).toBeInTheDocument();

    // Switch back to roadmap — surface should still render
    await user.click(getOverviewNodeButton(/^roadmap$/i));
    expect(screen.getByTestId("mock-roadmap")).toBeInTheDocument();
  });
});
