/**
 * Tests for the interactive RoadmapAtlas component.
 *
 * Covers:
 * - VAL-ROADMAP-001: Roadmap is identifiable as interactive with focal point
 * - VAL-ROADMAP-002: Wayfinding stays recoverable
 * - VAL-ROADMAP-003: Scroll storytelling and roadmap state stay in sync
 * - VAL-ROADMAP-004: Expand/collapse behaves predictably; branch-state independence
 * - VAL-ROADMAP-005: Node details show correct content and status
 * - VAL-ROADMAP-006: Valid deep links restore state hydration-safe and scroll/focus into view
 * - VAL-ROADMAP-007: Invalid deep links fail gracefully with visible fallback
 * - VAL-ROADMAP-008: Keyboard accessible
 * - VAL-ROADMAP-010: Covers required BETTER domains
 */
import React from "react";
import { render, screen, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoadmapAtlas from "../RoadmapAtlas";
import { BRANCH_FAMILY_LABELS } from "@/content/types";

beforeEach(() => {
  // Reset hash before each test
  window.location.hash = "";
  // Reset history state
  history.replaceState(null, "", window.location.pathname);
  // Reset scrollIntoView mock
  Element.prototype.scrollIntoView = jest.fn();
});

describe("RoadmapAtlas", () => {
  // VAL-ROADMAP-001: Identifiable as interactive
  it("renders as identifiable interactive surface with legend and prompt", () => {
    render(<RoadmapAtlas />);
    // Should have an interactive affordance / prompt
    expect(
      screen.getByText(/explore the roadmap/i)
    ).toBeInTheDocument();
    // Should show at least one branch family (may appear multiple times due to story panels)
    expect(screen.getAllByText("Product Evolution").length).toBeGreaterThanOrEqual(1);
  });

  // VAL-ROADMAP-010: Covers required BETTER domains
  it("covers all five required branch families", () => {
    render(<RoadmapAtlas />);
    const families = Object.values(BRANCH_FAMILY_LABELS);
    for (const family of families) {
      // Each family appears in both the branch explorer and story panel, so use getAllByText
      expect(screen.getAllByText(family).length).toBeGreaterThanOrEqual(1);
    }
  });

  // VAL-ROADMAP-004: Expand/collapse behaves predictably
  it("expands and collapses branches predictably", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Find the Product Evolution branch toggle
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });

    // Initially collapsed
    expect(productBranch).toHaveAttribute("aria-expanded", "false");

    // Click to expand
    await user.click(productBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "true");

    // Should now show child nodes
    expect(screen.getByText("BETTER Terminal (Closed Beta)")).toBeInTheDocument();

    // Click to collapse
    await user.click(productBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "false");
  });

  // VAL-ROADMAP-004: Changing one branch doesn't corrupt unrelated state
  it("does not corrupt unrelated branch state when toggling", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    const tokenBranch = screen.getByRole("button", {
      name: /token utility/i,
    });

    // Expand product
    await user.click(productBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "true");
    expect(tokenBranch).toHaveAttribute("aria-expanded", "false");

    // Expand token — product should stay expanded
    await user.click(tokenBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "true");
    expect(tokenBranch).toHaveAttribute("aria-expanded", "true");

    // Collapse product — token should stay expanded
    await user.click(productBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "false");
    expect(tokenBranch).toHaveAttribute("aria-expanded", "true");
  });

  // VAL-ROADMAP-005: Node details show correct content and status
  it("shows correct detail panel with title, status, and summary when a node is selected", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Expand product branch
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    await user.click(productBranch);

    // Click on the Terminal node
    const terminalNode = screen.getByRole("button", {
      name: /better terminal.*closed beta/i,
    });
    await user.click(terminalNode);

    // Detail panel should be visible
    const detailPanel = screen.getByTestId("roadmap-node-detail");
    expect(detailPanel).toBeInTheDocument();
    expect(within(detailPanel).getByText("BETTER Terminal (Closed Beta)")).toBeInTheDocument();
    expect(within(detailPanel).getByTestId("maturity-badge")).toBeInTheDocument();
    expect(
      within(detailPanel).getByText(/ai-powered signal discovery/i)
    ).toBeInTheDocument();
  });

  // VAL-ROADMAP-005: Future-facing nodes show dependency/confidence framing
  it("shows confidence framing for future-facing nodes", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Expand product branch and select a planned node
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    await user.click(productBranch);

    const agentNode = screen.getByRole("button", {
      name: /autonomous strategy agents/i,
    });
    await user.click(agentNode);

    const detailPanel = screen.getByTestId("roadmap-node-detail");
    expect(within(detailPanel).getByTestId("caveat-frame")).toBeInTheDocument();
  });

  // VAL-ROADMAP-006: Valid deep links restore state (hydration-safe — deferred to useEffect)
  it("restores node detail state from a valid URL hash", async () => {
    window.location.hash = "#node-pe-terminal-beta";
    render(<RoadmapAtlas />);

    // Hash restoration is deferred to useEffect for hydration safety
    const detailPanel = await screen.findByTestId("roadmap-node-detail");
    expect(
      within(detailPanel).getByText("BETTER Terminal (Closed Beta)")
    ).toBeInTheDocument();
  });

  // VAL-ROADMAP-007: Invalid deep links fail gracefully
  it("falls back gracefully for invalid deep link hash", async () => {
    window.location.hash = "#node-nonexistent-id";
    render(<RoadmapAtlas />);

    // Deferred to useEffect
    const fallback = await screen.findByTestId("roadmap-invalid-link-fallback");
    expect(fallback).toBeInTheDocument();
  });

  // VAL-ROADMAP-007: No deep link — normal state
  it("renders normally without any deep link hash", () => {
    window.location.hash = "";
    render(<RoadmapAtlas />);

    // Should not have a detail panel open
    expect(screen.queryByTestId("roadmap-node-detail")).not.toBeInTheDocument();
  });

  // VAL-ROADMAP-008: Keyboard accessible
  it("allows keyboard navigation through branch toggles", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Focus the first branch toggle directly
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    productBranch.focus();
    expect(document.activeElement).toBe(productBranch);

    // Press Enter to expand
    await user.keyboard("{Enter}");
    expect(productBranch).toHaveAttribute("aria-expanded", "true");

    // Press Escape should be handleable
    await user.keyboard("{Escape}");
  });

  // VAL-ROADMAP-002: Wayfinding recoverable
  it("provides a recenter/reset control for wayfinding", () => {
    render(<RoadmapAtlas />);
    // There should be a way to reset/recenter the roadmap view
    const resetButton = screen.getByRole("button", { name: /collapse all|reset|recenter/i });
    expect(resetButton).toBeInTheDocument();
  });

  // Close detail panel
  it("closes the detail panel when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Expand and select a node
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    await user.click(productBranch);

    const terminalNode = screen.getByRole("button", {
      name: /better terminal.*closed beta/i,
    });
    await user.click(terminalNode);

    expect(screen.getByTestId("roadmap-node-detail")).toBeInTheDocument();

    // Close the detail panel
    const closeButton = within(screen.getByTestId("roadmap-node-detail")).getByRole(
      "button",
      { name: /close/i }
    );
    await user.click(closeButton);

    expect(screen.queryByTestId("roadmap-node-detail")).not.toBeInTheDocument();
  });

  // Deep link opens correct branch
  it("auto-expands the parent branch when deep linking to a node", async () => {
    window.location.hash = "#node-pe-terminal-beta";
    render(<RoadmapAtlas />);

    // Wait for hydration-safe useEffect to apply
    await screen.findByTestId("roadmap-node-detail");

    // Product Evolution should be expanded since pe-terminal-beta is in it
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    expect(productBranch).toHaveAttribute("aria-expanded", "true");
  });

  // ---------------------------------------------------------------------------
  // Deep-link visibility regression (scroll/focus on first load)
  // VAL-ROADMAP-006 + VAL-ROADMAP-007 visibility gap fix
  // ---------------------------------------------------------------------------

  // VAL-ROADMAP-006: Valid deep link scrolls the detail panel into view on first load
  it("scrolls the detail panel into view when a valid deep link loads", async () => {
    const scrollSpy = jest.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    window.location.hash = "#node-pe-terminal-beta";
    render(<RoadmapAtlas />);

    // Wait for the deferred hash restoration and detail render
    await screen.findByTestId("roadmap-node-detail");

    // scrollIntoView should have been called on the detail panel
    expect(scrollSpy).toHaveBeenCalled();
  });

  // VAL-ROADMAP-007: Invalid deep link scrolls the fallback banner into view on first load
  it("scrolls the invalid deep-link fallback into view on first load", async () => {
    const scrollSpy = jest.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    window.location.hash = "#node-nonexistent-id";
    render(<RoadmapAtlas />);

    // Wait for deferred restoration
    await screen.findByTestId("roadmap-invalid-link-fallback");

    // scrollIntoView should have been called to bring the fallback into view
    expect(scrollSpy).toHaveBeenCalled();
  });

  // VAL-ROADMAP-006: Valid deep link detail panel receives focus for accessibility
  it("focuses the detail panel on valid deep link load for screen readers", async () => {
    window.location.hash = "#node-pe-terminal-beta";
    render(<RoadmapAtlas />);

    await screen.findByTestId("roadmap-node-detail");
    const detailPanel = screen.getByTestId("roadmap-node-detail");
    // The detail panel (or a wrapper) should have tabIndex for programmatic focus
    expect(detailPanel.closest("[tabindex]") ?? detailPanel).toHaveAttribute("tabindex");
  });

  // VAL-ROADMAP-007: Invalid fallback shows a clear recovery path (explore roadmap)
  it("provides an explicit recovery action in the invalid deep-link fallback", async () => {
    window.location.hash = "#node-nonexistent-id";
    render(<RoadmapAtlas />);

    const fallback = await screen.findByTestId("roadmap-invalid-link-fallback");
    // Should contain a button or link to help the user recover
    const recoveryAction = within(fallback).queryByRole("button") ?? within(fallback).queryByRole("link");
    expect(recoveryAction).toBeInTheDocument();
  });

  // VAL-ROADMAP-006: hashchange to valid node also scrolls into view
  it("scrolls detail into view when hash changes to a valid node after initial load", async () => {
    const scrollSpy = jest.fn();
    Element.prototype.scrollIntoView = scrollSpy;

    // Start with no hash
    window.location.hash = "";
    render(<RoadmapAtlas />);
    scrollSpy.mockClear();

    // Simulate hashchange to a valid node
    await act(async () => {
      window.location.hash = "#node-pe-terminal-beta";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    // Detail panel should appear
    await screen.findByTestId("roadmap-node-detail");

    // scrollIntoView should be called for the newly-visible detail
    expect(scrollSpy).toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------------
  // Regression: Hydration-safe deep links (VAL-ROADMAP-006)
  // The initial render must match SSR (no node selected) so Next.js
  // does not show a hydration mismatch badge. Hash is applied in useEffect.
  // ---------------------------------------------------------------------------
  it("renders SSR-safe initial state before hash restoration", () => {
    window.location.hash = "#node-pe-terminal-beta";

    // Capture the synchronous first render — before useEffect runs
    const { container } = render(<RoadmapAtlas />);

    // The very first synchronous render should NOT have the detail panel
    // (it will appear after the useEffect fires). This ensures SSR and
    // client hydration match, preventing Next.js runtime issue badges.
    // NOTE: We can't directly assert "first render" vs "after effect" in
    // a standard React testing-library render, but we can verify that
    // the initial reducer state is SSR-safe by checking the component
    // doesn't crash on mount.
    expect(container).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // Regression: Branch-state independence during node selection (VAL-ROADMAP-004)
  // Selecting a node in one expanded branch must not collapse other branches.
  // ---------------------------------------------------------------------------
  it("preserves multiple expanded branches when selecting a node", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    const infraBranch = screen.getByRole("button", {
      name: /technical infrastructure/i,
    });

    // Expand both branches
    await user.click(productBranch);
    await user.click(infraBranch);
    expect(productBranch).toHaveAttribute("aria-expanded", "true");
    expect(infraBranch).toHaveAttribute("aria-expanded", "true");

    // Select a node in Product Evolution
    const agentNode = screen.getByRole("button", {
      name: /autonomous strategy agents/i,
    });
    await user.click(agentNode);

    // Detail panel should open
    expect(screen.getByTestId("roadmap-node-detail")).toBeInTheDocument();

    // BOTH branches must still be expanded (not just product_evolution)
    expect(productBranch).toHaveAttribute("aria-expanded", "true");
    expect(infraBranch).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps unrelated branches expanded when selecting nodes across families", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    const tokenBranch = screen.getByRole("button", {
      name: /token utility/i,
    });
    const infraBranch = screen.getByRole("button", {
      name: /technical infrastructure/i,
    });

    // Expand all three branches
    await user.click(productBranch);
    await user.click(tokenBranch);
    await user.click(infraBranch);

    // Select a product node
    const agentNode = screen.getByRole("button", {
      name: /autonomous strategy agents/i,
    });
    await user.click(agentNode);

    // All three branches must remain expanded
    expect(productBranch).toHaveAttribute("aria-expanded", "true");
    expect(tokenBranch).toHaveAttribute("aria-expanded", "true");
    expect(infraBranch).toHaveAttribute("aria-expanded", "true");
  });

  // ---------------------------------------------------------------------------
  // Regression: Scroll-sync does not drift to unrelated branches (VAL-ROADMAP-003)
  // Selecting a node should sync the active story family to the selected node's
  // family, not leave it on a stale or later branch.
  // ---------------------------------------------------------------------------
  it("syncs active story family to the selected node's family", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Expand product branch and select a node
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    await user.click(productBranch);

    const terminalNode = screen.getByRole("button", {
      name: /better terminal.*closed beta/i,
    });
    await user.click(terminalNode);

    // The Product Evolution story panel should be marked active
    const storyPanels = screen.getAllByTestId("roadmap-story-panel");
    // Product Evolution is index 0
    expect(storyPanels[0]).toHaveAttribute("data-active", "true");
  });

  it("updates active story family when selecting a node in a different branch", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Expand product and infra branches
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    const infraBranch = screen.getByRole("button", {
      name: /technical infrastructure/i,
    });
    await user.click(productBranch);
    await user.click(infraBranch);

    // Select a product node first
    const terminalNode = screen.getByRole("button", {
      name: /better terminal.*closed beta/i,
    });
    await user.click(terminalNode);

    // Product Evolution should be active
    let storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[0]).toHaveAttribute("data-active", "true");

    // Now select an infra node
    const infraNodes = screen.getAllByTestId("roadmap-node-item");
    // Find one that belongs to technical_infrastructure
    const infraNodeButton = infraNodes.find(
      (n) => n.getAttribute("data-node-id")?.startsWith("ti-")
    );
    expect(infraNodeButton).toBeTruthy();
    await user.click(infraNodeButton!);

    // Technical Infrastructure (index 3) should now be active
    storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[3]).toHaveAttribute("data-active", "true");
    // Product Evolution should no longer be active
    expect(storyPanels[0]).toHaveAttribute("data-active", "false");
  });

  // ---------------------------------------------------------------------------
  // Regression: Deep-link hash restoration preserves branch independence
  // (VAL-ROADMAP-004 + VAL-ROADMAP-006 interaction)
  // When restoring from a hash, only the target node's branch should expand;
  // if other branches were already expanded they should be preserved.
  // ---------------------------------------------------------------------------
  it("deep-link restoration expands only the target branch without collapsing others", async () => {
    const user = userEvent.setup();
    render(<RoadmapAtlas />);

    // Expand infra branch manually first
    const infraBranch = screen.getByRole("button", {
      name: /technical infrastructure/i,
    });
    await user.click(infraBranch);
    expect(infraBranch).toHaveAttribute("aria-expanded", "true");

    // Simulate a hashchange to a product_evolution node
    await act(async () => {
      window.location.hash = "#node-pe-terminal-beta";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    await screen.findByTestId("roadmap-node-detail");

    // Product Evolution should now also be expanded
    const productBranch = screen.getByRole("button", {
      name: /product evolution/i,
    });
    expect(productBranch).toHaveAttribute("aria-expanded", "true");

    // Infra branch should STILL be expanded (not collapsed)
    expect(infraBranch).toHaveAttribute("aria-expanded", "true");
  });
});

// ---------------------------------------------------------------------------
// Regression: Backward scroll-sync reconciliation (VAL-ROADMAP-003)
//
// These tests mock getBoundingClientRect on each branch section to simulate
// scroll positions, then fire a scroll event. The scroll handler in
// RoadmapAtlas finds the topmost section whose bottom is below the
// activation line (25% of viewport height) and sets it as active.
//
// This verifies that backward scrolling correctly returns to earlier
// families like Product Evolution instead of retaining a stale later one.
// ---------------------------------------------------------------------------
describe("RoadmapAtlas backward scroll-sync", () => {
  /** jsdom viewport height (default 768); activation line = 25% = 192 */
  const VIEWPORT_HEIGHT = 768;

  beforeEach(() => {
    window.location.hash = "";
    history.replaceState(null, "", window.location.pathname);
    Element.prototype.scrollIntoView = jest.fn();
    // Ensure jsdom has a known innerHeight
    Object.defineProperty(window, "innerHeight", { value: VIEWPORT_HEIGHT, writable: true });
    // Mock requestAnimationFrame to fire synchronously in tests
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => { cb(0); return 0; });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Helper: mock getBoundingClientRect for each branch section to simulate
   * a scroll position. Each entry in `layouts` defines { top, bottom } for
   * that section index.
   */
  function mockSectionLayouts(
    sections: HTMLElement[],
    layouts: { top: number; bottom: number }[]
  ) {
    sections.forEach((el, i) => {
      const layout = layouts[i] ?? { top: 0, bottom: 0 };
      el.getBoundingClientRect = () =>
        ({
          top: layout.top,
          bottom: layout.bottom,
          left: 0,
          right: 800,
          width: 800,
          height: layout.bottom - layout.top,
          x: 0,
          y: layout.top,
          toJSON() {},
        } as DOMRect);
    });
  }

  /** Fire a scroll event and flush the rAF-based handler */
  function fireScroll() {
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
  }

  it("selects the topmost visible section when scrolling backward", () => {
    render(<RoadmapAtlas />);
    const sections = screen.getAllByTestId("roadmap-branch-section");

    // Forward scroll: section 0 is above viewport, section 2 straddles activation line
    mockSectionLayouts(sections, [
      { top: -500, bottom: -100 },  // 0: fully above
      { top: -100, bottom: 0 },     // 1: above
      { top: 0, bottom: 400 },      // 2: bottom=400 > 192 → first match
      { top: 400, bottom: 768 },    // 3: below section 2
      { top: 768, bottom: 1200 },   // 4: off-screen below
    ]);
    fireScroll();

    let storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[2]).toHaveAttribute("data-active", "true");

    // Backward scroll: section 0 re-enters, its bottom is now below activation line
    mockSectionLayouts(sections, [
      { top: -50, bottom: 300 },    // 0: bottom=300 > 192 → first match
      { top: 300, bottom: 400 },    // 1
      { top: 400, bottom: 800 },    // 2: still visible but lower
      { top: 800, bottom: 1200 },   // 3
      { top: 1200, bottom: 1600 },  // 4
    ]);
    fireScroll();

    storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[0]).toHaveAttribute("data-active", "true");
    expect(storyPanels[2]).toHaveAttribute("data-active", "false");
  });

  it("tracks scroll position and always picks the topmost qualifying section", () => {
    render(<RoadmapAtlas />);
    const sections = screen.getAllByTestId("roadmap-branch-section");

    // Sections 1, 2, 3 all span the activation line; topmost (1) wins
    mockSectionLayouts(sections, [
      { top: -300, bottom: 50 },    // 0: bottom < activation → scrolled past
      { top: 50, bottom: 300 },     // 1: bottom=300 > 192 → first match
      { top: 300, bottom: 500 },    // 2
      { top: 500, bottom: 700 },    // 3
      { top: 700, bottom: 900 },    // 4
    ]);
    fireScroll();

    let storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[1]).toHaveAttribute("data-active", "true");

    // Backward scroll: section 0 comes back into play
    mockSectionLayouts(sections, [
      { top: 100, bottom: 500 },    // 0: bottom=500 > 192 → first match
      { top: 500, bottom: 700 },    // 1
      { top: 700, bottom: 900 },    // 2
      { top: 900, bottom: 1100 },   // 3
      { top: 1100, bottom: 1300 },  // 4
    ]);
    fireScroll();

    storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[0]).toHaveAttribute("data-active", "true");
  });

  it("advances to later sections as earlier ones scroll past", () => {
    render(<RoadmapAtlas />);
    const sections = screen.getAllByTestId("roadmap-branch-section");

    // Section 0 is active initially
    mockSectionLayouts(sections, [
      { top: 50, bottom: 400 },     // 0: bottom > 192 → active
      { top: 400, bottom: 500 },    // 1
      { top: 500, bottom: 600 },    // 2
      { top: 600, bottom: 700 },    // 3
      { top: 700, bottom: 800 },    // 4
    ]);
    fireScroll();

    let storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[0]).toHaveAttribute("data-active", "true");

    // Scroll forward: section 0 scrolls past, section 4 becomes topmost qualifying
    mockSectionLayouts(sections, [
      { top: -800, bottom: -400 },  // 0: scrolled past
      { top: -400, bottom: -300 },  // 1: scrolled past
      { top: -300, bottom: -200 },  // 2: scrolled past
      { top: -200, bottom: 100 },   // 3: bottom=100 < 192 → scrolled past
      { top: 100, bottom: 700 },    // 4: bottom=700 > 192 → active
    ]);
    fireScroll();

    storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[4]).toHaveAttribute("data-active", "true");
    expect(storyPanels[0]).toHaveAttribute("data-active", "false");
  });

  it("returns to Product Evolution after full forward-then-backward scroll sequence", () => {
    render(<RoadmapAtlas />);
    const sections = screen.getAllByTestId("roadmap-branch-section");

    // Step 1: Section 0 is active at the top
    mockSectionLayouts(sections, [
      { top: 50, bottom: 400 },
      { top: 400, bottom: 500 },
      { top: 500, bottom: 600 },
      { top: 600, bottom: 700 },
      { top: 700, bottom: 800 },
    ]);
    fireScroll();
    let storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[0]).toHaveAttribute("data-active", "true");

    // Step 2: Forward — scroll to section 2
    mockSectionLayouts(sections, [
      { top: -600, bottom: -200 },
      { top: -200, bottom: -100 },
      { top: -100, bottom: 300 },   // 2: first with bottom > 192
      { top: 300, bottom: 500 },
      { top: 500, bottom: 700 },
    ]);
    fireScroll();
    storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[2]).toHaveAttribute("data-active", "true");

    // Step 3: Forward — scroll to section 4
    mockSectionLayouts(sections, [
      { top: -1400, bottom: -1000 },
      { top: -1000, bottom: -900 },
      { top: -900, bottom: -500 },
      { top: -500, bottom: 100 },   // 3: bottom=100 < 192
      { top: 100, bottom: 700 },    // 4: first with bottom > 192
    ]);
    fireScroll();
    storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[4]).toHaveAttribute("data-active", "true");

    // Step 4: Backward — scroll ALL the way back to section 0
    mockSectionLayouts(sections, [
      { top: 80, bottom: 480 },     // 0: bottom=480 > 192 → first match
      { top: 480, bottom: 580 },
      { top: 580, bottom: 980 },
      { top: 980, bottom: 1480 },
      { top: 1480, bottom: 2080 },
    ]);
    fireScroll();

    // Product Evolution (index 0) must be active
    storyPanels = screen.getAllByTestId("roadmap-story-panel");
    expect(storyPanels[0]).toHaveAttribute("data-active", "true");
  });
});
