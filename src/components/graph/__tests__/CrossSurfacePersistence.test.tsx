/**
 * Real cross-surface context persistence tests.
 *
 * These tests mount the actual Tokenomics and Roadmap surfaces through
 * GraphShell to verify that sub-surface state persists across cross-surface
 * handoffs and browser history flows — NOT through placeholder mocks.
 *
 * Fixes the scrutiny blocker: "the new regression suite uses placeholder/mock
 * surfaces for key cross-surface tests, so it overstates coverage of the
 * missing persistence behaviors."
 *
 * Covers:
 * - Tokenomics scenario selection persists across leaving and returning
 * - Tokenomics user-entered inputs persist across surface switches
 * - Roadmap expanded-branch state persists across cross-surface handoffs
 * - Back/forward browser history preserves cross-surface context
 */
import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphShell } from "../GraphShell";
import { TokenomicsSurface } from "../surfaces/TokenomicsSurface";
import { RoadmapSurface } from "../surfaces/RoadmapSurface";

/** Helper: click a graph node button in the main node grid (not minimap) */
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

// Real surface registry for these tests
const REAL_SURFACES: Record<string, React.ReactNode> = {
  tokenomics: <TokenomicsSurface />,
  roadmap: <RoadmapSurface />,
};

// ---------------------------------------------------------------------------
// Tokenomics scenario persistence
// ---------------------------------------------------------------------------
describe("Tokenomics scenario state persists across surface switches", () => {
  it("scenario selection survives leaving and returning to tokenomics", async () => {
    const user = userEvent.setup();
    render(<GraphShell surfaces={REAL_SURFACES} />);

    // Navigate to tokenomics
    await user.click(getOverviewNodeButton(/tokenomics/i));

    // Find and switch to conservative scenario
    const tabs = screen.getAllByTestId("scenario-tab");
    const conservativeTab = tabs.find(
      (t) => t.getAttribute("data-scenario") === "conservative"
    );
    expect(conservativeTab).toBeDefined();
    await user.click(conservativeTab!);
    expect(conservativeTab).toHaveAttribute("aria-selected", "true");

    // Navigate away to roadmap
    await user.click(getOverviewNodeButton(/^roadmap$/i));
    // Tokenomics surface should be unmounted
    expect(screen.queryByTestId("scenario-switcher")).not.toBeInTheDocument();

    // Navigate back to tokenomics
    await user.click(getOverviewNodeButton(/tokenomics/i));

    // Conservative scenario should still be selected
    const restoredTabs = screen.getAllByTestId("scenario-tab");
    const restoredConservative = restoredTabs.find(
      (t) => t.getAttribute("data-scenario") === "conservative"
    );
    expect(restoredConservative).toHaveAttribute("aria-selected", "true");
  });

  it("user-entered token balance persists across surface switches", async () => {
    const user = userEvent.setup();
    render(<GraphShell surfaces={REAL_SURFACES} />);

    // Navigate to tokenomics
    await user.click(getOverviewNodeButton(/tokenomics/i));

    // Enter a token balance
    const balanceInput = screen.getByTestId(
      "user-input-token-balance"
    ) as HTMLInputElement;
    await user.clear(balanceInput);
    await user.type(balanceInput, "500000");
    expect(balanceInput.value).toBe("500000");

    // Navigate away
    await user.click(getOverviewNodeButton(/^roadmap$/i));

    // Navigate back
    await user.click(getOverviewNodeButton(/tokenomics/i));

    // Token balance should be preserved
    const restoredInput = screen.getByTestId(
      "user-input-token-balance"
    ) as HTMLInputElement;
    expect(restoredInput.value).toBe("500000");
  });

  it("user-entered deposit amount persists across surface switches", async () => {
    const user = userEvent.setup();
    render(<GraphShell surfaces={REAL_SURFACES} />);

    // Navigate to tokenomics
    await user.click(getOverviewNodeButton(/tokenomics/i));

    // Enter a deposit amount
    const depositInput = screen.getByTestId(
      "user-input-deposit-amount"
    ) as HTMLInputElement;
    await user.clear(depositInput);
    await user.type(depositInput, "25000");
    expect(depositInput.value).toBe("25000");

    // Navigate away
    await user.click(getOverviewNodeButton(/^roadmap$/i));

    // Navigate back
    await user.click(getOverviewNodeButton(/tokenomics/i));

    // Deposit amount should be preserved
    const restoredInput = screen.getByTestId(
      "user-input-deposit-amount"
    ) as HTMLInputElement;
    expect(restoredInput.value).toBe("25000");
  });
});

// ---------------------------------------------------------------------------
// Roadmap expanded-branch persistence
// ---------------------------------------------------------------------------
describe("Roadmap expanded-branch state persists across surface switches", () => {
  it("expanded branches survive leaving and returning to roadmap", async () => {
    const user = userEvent.setup();
    render(<GraphShell surfaces={REAL_SURFACES} />);

    // Navigate to roadmap
    await user.click(getOverviewNodeButton(/^roadmap$/i));

    // Expand a branch family
    const branchToggles = screen.getAllByTestId("roadmap-branch-toggle");
    expect(branchToggles.length).toBeGreaterThan(0);
    const firstBranch = branchToggles[0];
    await user.click(firstBranch);
    expect(firstBranch).toHaveAttribute("aria-expanded", "true");

    // Also expand a second branch to test multiple branches
    if (branchToggles.length > 1) {
      await user.click(branchToggles[1]);
      expect(branchToggles[1]).toHaveAttribute("aria-expanded", "true");
    }

    // Navigate away to tokenomics
    await user.click(getOverviewNodeButton(/tokenomics/i));
    // Roadmap surface should be unmounted
    expect(screen.queryByTestId("roadmap-atlas")).not.toBeInTheDocument();

    // Navigate back to roadmap
    await user.click(getOverviewNodeButton(/^roadmap$/i));

    // Expanded branches should be preserved
    const restoredToggles = screen.getAllByTestId("roadmap-branch-toggle");
    expect(restoredToggles[0]).toHaveAttribute("aria-expanded", "true");
    if (restoredToggles.length > 1) {
      expect(restoredToggles[1]).toHaveAttribute("aria-expanded", "true");
    }
  });

  it("expanded branches persist through browser back/forward history", async () => {
    const user = userEvent.setup();
    render(<GraphShell surfaces={REAL_SURFACES} />);

    // Navigate to roadmap
    await user.click(getOverviewNodeButton(/^roadmap$/i));

    // Expand a branch
    const branchToggles = screen.getAllByTestId("roadmap-branch-toggle");
    await user.click(branchToggles[0]);
    expect(branchToggles[0]).toHaveAttribute("aria-expanded", "true");

    // Navigate to tokenomics
    await user.click(getOverviewNodeButton(/tokenomics/i));

    // Simulate browser back to roadmap
    act(() => {
      window.location.hash = "#graph-roadmap";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    // Roadmap should be focused again
    const breadcrumb = screen.getByTestId("graph-breadcrumb");
    expect(breadcrumb.textContent).toContain("Roadmap");

    // Expanded branches should be preserved
    const restoredToggles = screen.getAllByTestId("roadmap-branch-toggle");
    expect(restoredToggles[0]).toHaveAttribute("aria-expanded", "true");
  });
});

// ---------------------------------------------------------------------------
// Combined cross-surface persistence
// ---------------------------------------------------------------------------
describe("Combined cross-surface context persistence", () => {
  it("both tokenomics and roadmap state survive a round-trip handoff", async () => {
    const user = userEvent.setup();
    render(<GraphShell surfaces={REAL_SURFACES} />);

    // 1. Go to tokenomics, change scenario to upside
    await user.click(getOverviewNodeButton(/tokenomics/i));
    const tabs = screen.getAllByTestId("scenario-tab");
    const upsideTab = tabs.find(
      (t) => t.getAttribute("data-scenario") === "upside"
    );
    await user.click(upsideTab!);
    expect(upsideTab).toHaveAttribute("aria-selected", "true");

    // Enter token balance
    const balanceInput = screen.getByTestId(
      "user-input-token-balance"
    ) as HTMLInputElement;
    await user.clear(balanceInput);
    await user.type(balanceInput, "100000");

    // 2. Switch to roadmap, expand a branch
    await user.click(getOverviewNodeButton(/^roadmap$/i));
    const branchToggles = screen.getAllByTestId("roadmap-branch-toggle");
    await user.click(branchToggles[0]);
    expect(branchToggles[0]).toHaveAttribute("aria-expanded", "true");

    // 3. Switch back to tokenomics — state should persist
    await user.click(getOverviewNodeButton(/tokenomics/i));
    const restoredTabs = screen.getAllByTestId("scenario-tab");
    const restoredUpside = restoredTabs.find(
      (t) => t.getAttribute("data-scenario") === "upside"
    );
    expect(restoredUpside).toHaveAttribute("aria-selected", "true");
    const restoredBalance = screen.getByTestId(
      "user-input-token-balance"
    ) as HTMLInputElement;
    expect(restoredBalance.value).toBe("100000");

    // 4. Switch back to roadmap — branches should persist
    await user.click(getOverviewNodeButton(/^roadmap$/i));
    const restoredBranches = screen.getAllByTestId("roadmap-branch-toggle");
    expect(restoredBranches[0]).toHaveAttribute("aria-expanded", "true");
  });
});
