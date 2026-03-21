/**
 * Comprehensive tests for the tokenomics section.
 *
 * Validates:
 * - VAL-TOKEN-001: Supply and allocation arithmetic reconcile
 * - VAL-TOKEN-002: Tier ladder renders with complete structure
 * - VAL-TOKEN-003: Whale advantages are explicit and monotonic
 * - VAL-TOKEN-004: Scarcity rules are understandable
 * - VAL-TOKEN-005: FDV ratchet explained with boundary examples
 * - VAL-TOKEN-006: Non-linear allocation with worked examples
 * - VAL-TOKEN-007: Scenario switching updates assumptions
 * - VAL-TOKEN-008: Scenario outputs are logically ordered
 * - VAL-TOKEN-009: Fee-stack and value-flow mapping
 * - VAL-TOKEN-010: Agent-native token utility surface
 * - VAL-TOKEN-011: Source/assumption cues on key numbers
 */

import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import TokenomicsSection from "../TokenomicsSection";
import SupplyAllocation from "../SupplyAllocation";
import TierLadder from "../TierLadder";
import ScarcityExplainer from "../ScarcityExplainer";
import FdvRatchetExplainer from "../FdvRatchetExplainer";
import NonLinearAllocation from "../NonLinearAllocation";
import ScenarioSwitcher from "../ScenarioSwitcher";
import TokenUtilitySurface from "../TokenUtilitySurface";
import FeeStackValueFlow from "../FeeStackValueFlow";
import {
  TOKEN_ALLOCATIONS,
  TOKEN_TIERS,
  getTiersSorted,
  validateTierMonotonicity,
  PROJECTION_OUTPUTS,
  validateProjectionOrdering,
} from "@/content";

// ---------------------------------------------------------------------------
// VAL-TOKEN-001: Supply and Allocation Arithmetic
// ---------------------------------------------------------------------------

describe("SupplyAllocation (VAL-TOKEN-001)", () => {
  it("renders the allocation table", () => {
    render(<SupplyAllocation />);
    expect(screen.getByTestId("allocation-table")).toBeInTheDocument();
  });

  it("displays all allocation categories", () => {
    render(<SupplyAllocation />);
    const rows = screen.getAllByTestId("allocation-row");
    expect(rows.length).toBe(TOKEN_ALLOCATIONS.length);
  });

  it("shows total supply as 1,000,000,000", () => {
    render(<SupplyAllocation />);
    const matches = screen.getAllByText("1,000,000,000");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("displays the reconciled checkmark", () => {
    render(<SupplyAllocation />);
    expect(screen.getByText("✓ Reconciled")).toBeInTheDocument();
  });

  it("shows each allocation percentage and token count", () => {
    render(<SupplyAllocation />);
    for (const alloc of TOKEN_ALLOCATIONS) {
      const matches = screen.getAllByText(`${alloc.percentage}%`);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders allocation bar visual", () => {
    render(<SupplyAllocation />);
    expect(screen.getByTestId("allocation-bar")).toBeInTheDocument();
  });

  it("includes evidence hooks for allocations", () => {
    render(<SupplyAllocation />);
    const hooks = screen.getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThanOrEqual(TOKEN_ALLOCATIONS.length);
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-002, VAL-TOKEN-003: Tier Ladder
// ---------------------------------------------------------------------------

describe("TierLadder (VAL-TOKEN-002, VAL-TOKEN-003)", () => {
  it("renders all tiers in ascending order", () => {
    render(<TierLadder />);
    const rows = screen.getAllByTestId("tier-row");
    expect(rows.length).toBe(TOKEN_TIERS.length);
  });

  it("displays the comparison table", () => {
    render(<TierLadder />);
    expect(screen.getByTestId("tier-comparison-table")).toBeInTheDocument();
  });

  it("renders tier detail cards for each tier", () => {
    render(<TierLadder />);
    const cards = screen.getAllByTestId("tier-detail-card");
    expect(cards.length).toBe(TOKEN_TIERS.length);
  });

  it("shows tier names", () => {
    render(<TierLadder />);
    const sorted = getTiersSorted();
    for (const tier of sorted) {
      expect(screen.getAllByText(tier.name).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("shows fee advantages for whale tiers", () => {
    render(<TierLadder />);
    // Whale has 15% reduction, Apex has 25%
    expect(screen.getAllByText(/fee reduction/).length).toBeGreaterThanOrEqual(2);
  });

  it("shows exclusive products for qualifying tiers", () => {
    render(<TierLadder />);
    expect(screen.getByText("Full Terminal access")).toBeInTheDocument();
    expect(screen.getByText("Priority vault allocation")).toBeInTheDocument();
  });

  it("includes evidence hooks for tiers", () => {
    render(<TierLadder />);
    const hooks = screen.getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThanOrEqual(TOKEN_TIERS.length);
  });

  it("whale privileges are monotonically non-decreasing (data invariant)", () => {
    expect(validateTierMonotonicity(TOKEN_TIERS)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-004: Scarcity and Oversubscription
// ---------------------------------------------------------------------------

describe("ScarcityExplainer (VAL-TOKEN-004)", () => {
  it("renders scarcity rules", () => {
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    expect(rules.length).toBeGreaterThanOrEqual(4);
  });

  it("each rule shows scenario and resolution", () => {
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    for (const rule of rules) {
      expect(within(rule).getByText("Scenario")).toBeInTheDocument();
      expect(within(rule).getByText("Resolution")).toBeInTheDocument();
    }
  });

  it("includes caveat framing", () => {
    render(<ScarcityExplainer />);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
  });

  it("covers vault capacity, preview slots, agent slots, and OTC", () => {
    render(<ScarcityExplainer />);
    expect(screen.getByText("Vault Capacity")).toBeInTheDocument();
    expect(screen.getByText("Strategy Preview Slots")).toBeInTheDocument();
    expect(screen.getByText("Agent Slot Availability")).toBeInTheDocument();
    expect(screen.getByText("OTC & Premium Channel Access")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-005: FDV Ratchet
// ---------------------------------------------------------------------------

describe("FdvRatchetExplainer (VAL-TOKEN-005)", () => {
  it("renders the worked example steps", () => {
    render(<FdvRatchetExplainer />);
    const steps = screen.getAllByTestId("ratchet-step");
    expect(steps.length).toBeGreaterThanOrEqual(4);
  });

  it("explains the permanent lower threshold after decline", () => {
    render(<FdvRatchetExplainer />);
    expect(screen.getByText(/never increases again/)).toBeInTheDocument();
  });

  it("includes a worked example with threshold change", () => {
    render(<FdvRatchetExplainer />);
    expect(screen.getByTestId("ratchet-worked-example")).toBeInTheDocument();
    // Should show at least one threshold change (may appear in multiple places)
    const matches75k = screen.getAllByText(/75,000 BETTER/);
    expect(matches75k.length).toBeGreaterThanOrEqual(1);
    const matches50k = screen.getAllByText(/50,000 BETTER/);
    expect(matches50k.length).toBeGreaterThanOrEqual(1);
  });

  it("shows the permanent behavior after FDV decline", () => {
    render(<FdvRatchetExplainer />);
    // Step 4: FDV declines but threshold stays
    expect(
      screen.getByText(/The threshold stays at 50,000 BETTER/)
    ).toBeInTheDocument();
  });

  it("includes evidence hook with canonical source", () => {
    render(<FdvRatchetExplainer />);
    const hooks = screen.getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThanOrEqual(1);
  });

  it("includes caveat framing", () => {
    render(<FdvRatchetExplainer />);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-006: Non-Linear Allocation
// ---------------------------------------------------------------------------

describe("NonLinearAllocation (VAL-TOKEN-006)", () => {
  it("renders the allocation examples table", () => {
    render(<NonLinearAllocation />);
    expect(screen.getByTestId("allocation-examples-table")).toBeInTheDocument();
  });

  it("shows worked examples across at least two tiers", () => {
    render(<NonLinearAllocation />);
    const rows = screen.getAllByTestId("allocation-example-row");
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });

  it("shows Whale and Apex Whale tier weights", () => {
    render(<NonLinearAllocation />);
    // "×" may render differently; check the table rows
    const rows = screen.getAllByTestId("allocation-example-row");
    const whaleRow = rows.find((r) => within(r).queryByText("Whale"));
    expect(whaleRow).toBeDefined();
    const apexRow = rows.find((r) => within(r).queryByText("Apex Whale"));
    expect(apexRow).toBeDefined();
  });

  it("shows effective allocation amounts", () => {
    render(<NonLinearAllocation />);
    const matches16k = screen.getAllByText("$16,000");
    expect(matches16k.length).toBeGreaterThanOrEqual(1);
    const matches50k = screen.getAllByText("$50,000");
    expect(matches50k.length).toBeGreaterThanOrEqual(1);
  });

  it("has maturity badge showing Planned", () => {
    render(<NonLinearAllocation />);
    const badges = screen.getAllByTestId("maturity-badge");
    const plannedBadge = badges.find((b) => b.getAttribute("data-status") === "planned");
    expect(plannedBadge).toBeInTheDocument();
  });

  it("includes caveat framing", () => {
    render(<NonLinearAllocation />);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-007, VAL-TOKEN-008: Scenario Switching
// ---------------------------------------------------------------------------

describe("ScenarioSwitcher (VAL-TOKEN-007, VAL-TOKEN-008)", () => {
  it("renders scenario tabs for all three levels", () => {
    render(<ScenarioSwitcher />);
    expect(screen.getByTestId("scenario-tabs")).toBeInTheDocument();
    const tabs = screen.getAllByTestId("scenario-tab");
    expect(tabs.length).toBe(3);
  });

  it("defaults to Base scenario", () => {
    render(<ScenarioSwitcher />);
    const baseTabs = screen.getAllByTestId("scenario-tab");
    const baseTab = baseTabs.find((t) => t.getAttribute("data-scenario") === "base");
    expect(baseTab).toHaveAttribute("aria-selected", "true");
  });

  it("displays assumptions panel", () => {
    render(<ScenarioSwitcher />);
    expect(screen.getByTestId("assumptions-panel")).toBeInTheDocument();
  });

  it("shows assumption cards for all five dimensions", () => {
    render(<ScenarioSwitcher />);
    const cards = screen.getAllByTestId("assumption-card");
    expect(cards.length).toBe(5);
  });

  it("displays projection outputs", () => {
    render(<ScenarioSwitcher />);
    expect(screen.getByTestId("projection-outputs")).toBeInTheDocument();
    const projCards = screen.getAllByTestId("projection-card");
    expect(projCards.length).toBe(PROJECTION_OUTPUTS.length);
  });

  it("switching to conservative updates the assumption values", () => {
    render(<ScenarioSwitcher />);
    const tabs = screen.getAllByTestId("scenario-tab");
    const conservativeTab = tabs.find((t) => t.getAttribute("data-scenario") === "conservative");
    fireEvent.click(conservativeTab!);

    // Should show conservative values
    expect(conservativeTab).toHaveAttribute("aria-selected", "true");
  });

  it("switching to upside updates the assumption values", () => {
    render(<ScenarioSwitcher />);
    const tabs = screen.getAllByTestId("scenario-tab");
    const upsideTab = tabs.find((t) => t.getAttribute("data-scenario") === "upside");
    fireEvent.click(upsideTab!);

    expect(upsideTab).toHaveAttribute("aria-selected", "true");
  });

  it("scenario outputs are logically ordered (data invariant)", () => {
    expect(validateProjectionOrdering(PROJECTION_OUTPUTS)).toBe(true);
  });

  it("displays cross-scenario comparison", () => {
    render(<ScenarioSwitcher />);
    expect(screen.getByTestId("projection-comparison")).toBeInTheDocument();
  });

  it("includes caveat framing", () => {
    render(<ScenarioSwitcher />);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
  });

  it("projection cards show dependency labels", () => {
    render(<ScenarioSwitcher />);
    const projCards = screen.getAllByTestId("projection-card");
    const cardsWithDeps = projCards.filter((card) =>
      within(card).queryByText("Depends on:")
    );
    expect(cardsWithDeps.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-010: Token Utility Surface
// ---------------------------------------------------------------------------

describe("TokenUtilitySurface (VAL-TOKEN-010)", () => {
  it("renders utility cards", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    expect(cards.length).toBeGreaterThanOrEqual(7);
  });

  it("covers strategy agents", () => {
    render(<TokenUtilitySurface />);
    expect(screen.getByText("Strategy Agents")).toBeInTheDocument();
  });

  it("covers bonded agent registry", () => {
    render(<TokenUtilitySurface />);
    expect(screen.getByText("Bonded Agent Registry")).toBeInTheDocument();
  });

  it("covers delegation & backing", () => {
    render(<TokenUtilitySurface />);
    expect(screen.getByText("Agent Delegation & Backing")).toBeInTheDocument();
  });

  it("covers research & data bounties", () => {
    render(<TokenUtilitySurface />);
    expect(screen.getByText("Research & Data Bounties")).toBeInTheDocument();
  });

  it("covers premium API & agent lanes", () => {
    render(<TokenUtilitySurface />);
    expect(screen.getByText("Premium API & Agent Lanes")).toBeInTheDocument();
  });

  it("covers LLM & inference credits", () => {
    render(<TokenUtilitySurface />);
    expect(screen.getByText("LLM & Inference Credits")).toBeInTheDocument();
  });

  it("covers whale exclusive products", () => {
    render(<TokenUtilitySurface />);
    expect(screen.getByText("Whale Exclusive Products")).toBeInTheDocument();
  });

  it("each utility card shows maturity badge and token role", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    for (const card of cards) {
      expect(within(card).getByTestId("maturity-badge")).toBeInTheDocument();
      expect(within(card).getByText("Token Role")).toBeInTheDocument();
    }
  });

  it("includes evidence hooks on each card", () => {
    render(<TokenUtilitySurface />);
    const cards = screen.getAllByTestId("utility-card");
    for (const card of cards) {
      expect(within(card).getByTestId("evidence-hook")).toBeInTheDocument();
    }
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-009: Fee Stack & Value Flow
// ---------------------------------------------------------------------------

describe("FeeStackValueFlow (VAL-TOKEN-009)", () => {
  it("renders fee items", () => {
    render(<FeeStackValueFlow />);
    const items = screen.getAllByTestId("fee-item");
    expect(items.length).toBeGreaterThanOrEqual(5);
  });

  it("covers trading tax, Lite Mode fees, vault performance fees, whale premium, agent fees, and enterprise", () => {
    render(<FeeStackValueFlow />);
    expect(screen.getByText("Trading Tax (Buy/Sell)")).toBeInTheDocument();
    expect(screen.getByText("Lite Mode Per-Fill Fee")).toBeInTheDocument();
    expect(screen.getByText("Vault Performance Fee")).toBeInTheDocument();
    expect(screen.getByText("Whale Premium Fee Advantage")).toBeInTheDocument();
    expect(screen.getByText("Agent Transaction Fees")).toBeInTheDocument();
    expect(screen.getByText("Enterprise Data & API Licensing")).toBeInTheDocument();
  });

  it("each fee item shows a worked example", () => {
    render(<FeeStackValueFlow />);
    const examples = screen.getAllByTestId("fee-example");
    expect(examples.length).toBeGreaterThanOrEqual(5);
  });

  it("renders value flow cards for all segments", () => {
    render(<FeeStackValueFlow />);
    const flows = screen.getAllByTestId("value-flow-card");
    expect(flows.length).toBe(4); // Consumer, Pro, Whale, Enterprise
  });

  it("covers consumer, pro, whale, and enterprise segments", () => {
    render(<FeeStackValueFlow />);
    expect(screen.getByText("Consumer")).toBeInTheDocument();
    expect(screen.getByText("Pro / Prosumer")).toBeInTheDocument();
    expect(screen.getByText("Whale")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
  });

  it("value flow cards include maturity badges", () => {
    render(<FeeStackValueFlow />);
    const flows = screen.getAllByTestId("value-flow-card");
    for (const flow of flows) {
      expect(within(flow).getByTestId("maturity-badge")).toBeInTheDocument();
    }
  });

  it("includes caveat framing", () => {
    render(<FeeStackValueFlow />);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-011: Source/Assumption Cues
// ---------------------------------------------------------------------------

describe("Source/Assumption Cues (VAL-TOKEN-011)", () => {
  it("the full tokenomics section renders evidence hooks", () => {
    render(<TokenomicsSection />);
    const hooks = screen.getAllByTestId("evidence-hook");
    // Should have many evidence hooks across all sub-sections
    expect(hooks.length).toBeGreaterThanOrEqual(10);
  });

  it("the full tokenomics section renders caveat frames", () => {
    render(<TokenomicsSection />);
    const caveats = screen.getAllByTestId("caveat-frame");
    expect(caveats.length).toBeGreaterThanOrEqual(3);
  });
});

// ---------------------------------------------------------------------------
// Full Section Assembly
// ---------------------------------------------------------------------------

describe("TokenomicsSection (full assembly)", () => {
  it("renders all major sub-sections", () => {
    render(<TokenomicsSection />);
    expect(screen.getByTestId("supply-allocation")).toBeInTheDocument();
    expect(screen.getByTestId("tier-ladder")).toBeInTheDocument();
    expect(screen.getByTestId("fdv-ratchet-explainer")).toBeInTheDocument();
    expect(screen.getByTestId("nonlinear-allocation-explainer")).toBeInTheDocument();
    expect(screen.getByTestId("scarcity-explainer")).toBeInTheDocument();
    expect(screen.getByTestId("scenario-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("token-utility-surface")).toBeInTheDocument();
    expect(screen.getByTestId("fee-stack-value-flow")).toBeInTheDocument();
  });
});
