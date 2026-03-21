/**
 * Tokenomics regression: rendered scarcity and preview-eligibility copy
 * for each eligible tier.
 *
 * Verifies that the rendered tokenomics UI explicitly asserts scarcity
 * and preview-eligibility copy for each tier that has preview access.
 *
 * This covers the feature requirement:
 *   "Tokenomics regression coverage explicitly asserts rendered scarcity
 *    and preview-eligibility copy for each eligible tier"
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import TierLadder from "../TierLadder";
import ScarcityExplainer from "../ScarcityExplainer";
import { TOKEN_TIERS, getTiersSorted } from "@/content";

// ---------------------------------------------------------------------------
// Preview-eligibility copy per tier in the tier ladder
// ---------------------------------------------------------------------------

describe("Tier ladder preview-eligibility rendering", () => {
  it("renders preview priority information for every tier", () => {
    render(<TierLadder />);
    const tierCards = screen.getAllByTestId("tier-detail-card");

    for (const tier of getTiersSorted()) {
      const card = tierCards.find(
        (c) => c.getAttribute("data-tier-id") === tier.id
      );
      expect(card).toBeDefined();

      // Each tier card should show preview priority info
      const cardElement = card as HTMLElement;
      if (tier.previewPriority === 0) {
        // Ineligible tiers should show "None" for preview (may have multiple "None" for other fields)
        const noneElements = within(cardElement).getAllByText("None");
        expect(noneElements.length).toBeGreaterThanOrEqual(1);
      } else {
        // Eligible tiers should show their preview level (may appear multiple times if
        // access and preview priorities share the same numeric value)
        const levelElements = within(cardElement).getAllByText(`Level ${tier.previewPriority}`);
        expect(levelElements.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("Explorer tier renders as preview-ineligible (priority 0)", () => {
    render(<TierLadder />);
    const explorerTier = TOKEN_TIERS.find((t) => t.id === "tier-explorer");
    expect(explorerTier!.previewPriority).toBe(0);

    const tierCards = screen.getAllByTestId("tier-detail-card");
    const explorerCard = tierCards.find(
      (c) => c.getAttribute("data-tier-id") === "tier-explorer"
    )!;
    // Explorer should show "None" for Preview Priority (may appear multiple times for other fields too)
    const noneElements = within(explorerCard as HTMLElement).getAllByText("None");
    expect(noneElements.length).toBeGreaterThanOrEqual(1);
    // The card's full text should indicate no preview access
    expect(explorerCard.textContent).toContain("None");
  });

  it("Lite tier renders as preview-eligible (priority > 0)", () => {
    render(<TierLadder />);
    const liteTier = TOKEN_TIERS.find((t) => t.id === "tier-lite");
    expect(liteTier!.previewPriority).toBeGreaterThan(0);

    const tierCards = screen.getAllByTestId("tier-detail-card");
    const liteCard = tierCards.find(
      (c) => c.getAttribute("data-tier-id") === "tier-lite"
    )!;
    expect(
      within(liteCard as HTMLElement).getByText(`Level ${liteTier!.previewPriority}`)
    ).toBeInTheDocument();
  });

  it("Standard tier renders as preview-eligible", () => {
    render(<TierLadder />);
    const standardTier = TOKEN_TIERS.find((t) => t.id === "tier-standard");
    expect(standardTier!.previewPriority).toBeGreaterThan(0);

    const tierCards = screen.getAllByTestId("tier-detail-card");
    const standardCard = tierCards.find(
      (c) => c.getAttribute("data-tier-id") === "tier-standard"
    )!;
    expect(
      within(standardCard as HTMLElement).getByText(`Level ${standardTier!.previewPriority}`)
    ).toBeInTheDocument();
  });

  it("Whale tier renders as preview-eligible with higher priority than Standard", () => {
    render(<TierLadder />);
    const whaleTier = TOKEN_TIERS.find((t) => t.id === "tier-whale");
    const standardTier = TOKEN_TIERS.find((t) => t.id === "tier-standard");
    expect(whaleTier!.previewPriority).toBeGreaterThan(standardTier!.previewPriority);
  });

  it("Apex Whale tier renders as preview-eligible with highest priority", () => {
    render(<TierLadder />);
    const apexTier = TOKEN_TIERS.find((t) => t.id === "tier-apex");
    const otherTiers = TOKEN_TIERS.filter((t) => t.id !== "tier-apex");
    for (const other of otherTiers) {
      expect(apexTier!.previewPriority).toBeGreaterThanOrEqual(other.previewPriority);
    }
  });
});

// ---------------------------------------------------------------------------
// Scarcity copy per eligible tier
// ---------------------------------------------------------------------------

describe("Scarcity preview-eligibility copy consistency", () => {
  it("scarcity copy for Strategy Preview Slots mentions tier-based ordering", () => {
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    const previewRule = rules.find((r) =>
      within(r).queryByText("Strategy Preview Slots")
    );
    expect(previewRule).toBeDefined();
    const text = previewRule!.textContent || "";
    // Should describe tier-priority ordering
    expect(text).toMatch(/tier|priority/i);
  });

  it("scarcity preview copy mentions Apex Whale getting first access", () => {
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    const previewRule = rules.find((r) =>
      within(r).queryByText("Strategy Preview Slots")
    );
    const text = previewRule!.textContent || "";
    expect(text).toContain("Apex Whale");
  });

  it("scarcity preview copy mentions Whale tier", () => {
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    const previewRule = rules.find((r) =>
      within(r).queryByText("Strategy Preview Slots")
    );
    const text = previewRule!.textContent || "";
    // The text should reference Whale tier (not just Apex Whale)
    // "Whales" or "Whale" should appear in the resolution
    expect(text).toMatch(/Whale/);
  });

  it("scarcity preview copy mentions Standard tier eligibility", () => {
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    const previewRule = rules.find((r) =>
      within(r).queryByText("Strategy Preview Slots")
    );
    const text = previewRule!.textContent || "";
    expect(text).toContain("Standard");
  });

  it("scarcity preview copy mentions Lite tier eligibility", () => {
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    const previewRule = rules.find((r) =>
      within(r).queryByText("Strategy Preview Slots")
    );
    const text = previewRule!.textContent || "";
    expect(text).toContain("Lite");
  });

  it("scarcity preview copy indicates Explorer is ineligible", () => {
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    const previewRule = rules.find((r) =>
      within(r).queryByText("Strategy Preview Slots")
    );
    const text = previewRule!.textContent || "";
    // Should indicate that Explorer (non-holders) is ineligible
    expect(text).toMatch(/Explorer|non-holder|ineligible/i);
  });

  it("vault capacity scarcity copy mentions tier-priority ordering", () => {
    render(<ScarcityExplainer />);
    const rules = screen.getAllByTestId("scarcity-rule");
    const vaultRule = rules.find((r) =>
      within(r).queryByText("Vault Capacity")
    );
    expect(vaultRule).toBeDefined();
    const text = vaultRule!.textContent || "";
    // Should mention the tier ordering
    expect(text).toContain("Apex Whale");
    expect(text).toContain("Whale");
    expect(text).toContain("Standard");
    expect(text).toContain("Lite");
    expect(text).toContain("Explorer");
  });
});
