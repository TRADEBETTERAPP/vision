/**
 * Tests for token-policy recalibration and whale-revenue model.
 *
 * Validates:
 * - VAL-TOKEN-001: Minted supply presentation (709,001,940 BETTER)
 * - VAL-TOKEN-002: Higher-tier whale products with modeled framing
 * - VAL-TOKEN-009: Referral and per-product revenue modeling
 * - VAL-TOKEN-012: First-vault policy with worked examples
 * - VAL-TOKEN-013: Referral incentive sustainability
 * - VAL-TOKEN-014: Product-family revenue/value-return breakout
 * - VAL-CROSS-005: No 1B supply references as active supply
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import SupplyAllocation from "../SupplyAllocation";
import TierLadder from "../TierLadder";
import FirstVaultPolicy from "../FirstVaultPolicy";
import ModeledWhaleLadder from "../ModeledWhaleLadder";
import ReferralIncentives from "../ReferralIncentives";
import ProductFamilyRevenueModel from "../ProductFamilyRevenueModel";
import TokenomicsSection from "../TokenomicsSection";
import {
  FIRST_VAULT_WORKED_EXAMPLES,
  MODELED_WHALE_PRODUCTS,
  PRODUCT_FAMILY_REVENUE_MODELS,
} from "@/content";

// ---------------------------------------------------------------------------
// VAL-TOKEN-001: Minted Supply Presentation
// ---------------------------------------------------------------------------

describe("Minted Supply Presentation (VAL-TOKEN-001)", () => {
  it("displays 709,001,940 as the minted supply figure", () => {
    render(<SupplyAllocation />);
    const supplyEl = screen.getByTestId("minted-supply-figure");
    expect(supplyEl.textContent).toBe("709,001,940");
  });

  it("does not display 1,000,000,000 as the active supply", () => {
    render(<SupplyAllocation />);
    const supplyEl = screen.getByTestId("minted-supply-figure");
    expect(supplyEl.textContent).not.toBe("1,000,000,000");
  });

  it("mentions Base contract address", () => {
    render(<SupplyAllocation />);
    expect(screen.getByText(/0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E/)).toBeInTheDocument();
  });

  it("allocation tokens reconcile to minted supply", () => {
    render(<SupplyAllocation />);
    expect(screen.getByText("✓ Reconciled")).toBeInTheDocument();
  });

  it("shows on-chain verified allocation categories", () => {
    render(<SupplyAllocation />);
    expect(screen.getByText("Team/Vesting")).toBeInTheDocument();
    expect(screen.getByText("Treasury")).toBeInTheDocument();
    expect(screen.getByText("SERV / Strategic Reserve")).toBeInTheDocument();
    expect(screen.getByText("LP / Liquidity")).toBeInTheDocument();
    expect(screen.getByText("Programmatic Funding")).toBeInTheDocument();
    expect(screen.getByText("Deployer / Undistributed")).toBeInTheDocument();
    expect(screen.getByText("Airdrop / Migration")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-002: Higher-tier whale products with modeled framing
// ---------------------------------------------------------------------------

describe("Modeled Whale Product Ladder (VAL-TOKEN-002)", () => {
  it("renders all modeled whale products", () => {
    render(<ModeledWhaleLadder />);
    const products = screen.getAllByTestId("modeled-whale-product");
    expect(products.length).toBe(MODELED_WHALE_PRODUCTS.length);
  });

  it("includes Social Vaults with modeled framing", () => {
    render(<ModeledWhaleLadder />);
    expect(screen.getByText("Social Vaults")).toBeInTheDocument();
    const badges = screen.getAllByText("Modeled Gate");
    expect(badges.length).toBe(MODELED_WHALE_PRODUCTS.length);
  });

  it("includes Personal AI-Crafted Vaults with modeled framing", () => {
    render(<ModeledWhaleLadder />);
    expect(screen.getByText("Personal AI-Crafted Vaults")).toBeInTheDocument();
  });

  it("each product shows evidence hooks", () => {
    render(<ModeledWhaleLadder />);
    const hooks = screen.getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThanOrEqual(MODELED_WHALE_PRODUCTS.length);
  });

  it("shows caveat frame for modeled products", () => {
    render(<ModeledWhaleLadder />);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
  });
});

describe("TierLadder includes modeled whale product references (VAL-TOKEN-002)", () => {
  it("shows Personal AI-Crafted Vaults (modeled) in whale tiers", () => {
    render(<TierLadder />);
    // Both Whale and Apex Whale tiers include this product
    const matches = screen.getAllByText("Personal AI-Crafted Vaults (modeled)");
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it("Apex tier shows modeled exclusive products", () => {
    render(<TierLadder />);
    expect(screen.getByText("Private alpha signals (modeled)")).toBeInTheDocument();
    expect(screen.getByText("OTC facilitation access (modeled)")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-012: First-Vault Policy with Worked Examples
// ---------------------------------------------------------------------------

describe("FirstVaultPolicy (VAL-TOKEN-012)", () => {
  it("renders the first-vault-policy section", () => {
    render(<FirstVaultPolicy />);
    expect(screen.getByTestId("first-vault-policy")).toBeInTheDocument();
  });

  it("displays the 100,000 BETTER minimum", () => {
    render(<FirstVaultPolicy />);
    const minimum = screen.getByTestId("first-vault-minimum");
    expect(minimum.textContent).toContain("100,000");
  });

  it("displays the $25,000 total vault cap", () => {
    render(<FirstVaultPolicy />);
    const cap = screen.getByTestId("first-vault-cap");
    expect(cap.textContent).toContain("25,000");
  });

  it("explains the √-weighted bidding allocation model", () => {
    render(<FirstVaultPolicy />);
    const explanation = screen.getByTestId("bidding-model-explanation");
    expect(explanation.textContent).toContain("√-weighted");
    expect(explanation.textContent).toContain("bidding");
  });

  it("renders all worked examples", () => {
    render(<FirstVaultPolicy />);
    const examples = screen.getAllByTestId("first-vault-example");
    expect(examples.length).toBe(FIRST_VAULT_WORKED_EXAMPLES.length);
  });

  it("shows qualifying and non-qualifying examples", () => {
    render(<FirstVaultPolicy />);
    const qualifying = screen.getAllByTestId("first-vault-example")
      .filter((el) => el.getAttribute("data-qualifies") === "true");
    const nonQualifying = screen.getAllByTestId("first-vault-example")
      .filter((el) => el.getAttribute("data-qualifies") === "false");
    expect(qualifying.length).toBeGreaterThanOrEqual(2);
    expect(nonQualifying.length).toBeGreaterThanOrEqual(1);
  });

  it("shows √-Weight and Estimated Allocation labels for qualifying examples", () => {
    render(<FirstVaultPolicy />);
    const examples = screen.getAllByTestId("first-vault-example");
    const qualifyingExamples = examples.filter(
      (el) => el.getAttribute("data-qualifies") === "true"
    );
    for (const ex of qualifyingExamples) {
      expect(within(ex).getByText("√-Weight")).toBeInTheDocument();
      expect(within(ex).getByText("Estimated Allocation")).toBeInTheDocument();
    }
  });

  it("includes evidence hook and caveat", () => {
    render(<FirstVaultPolicy />);
    const hooks = screen.getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-013: Referral Incentive Sustainability
// ---------------------------------------------------------------------------

describe("ReferralIncentives (VAL-TOKEN-013)", () => {
  it("renders the referral-incentives section", () => {
    render(<ReferralIncentives />);
    expect(screen.getByTestId("referral-incentives")).toBeInTheDocument();
  });

  it("explains payout source", () => {
    render(<ReferralIncentives />);
    expect(screen.getByTestId("referral-payout-source")).toBeInTheDocument();
    expect(screen.getByText(/funded from the Treasury/i)).toBeInTheDocument();
  });

  it("shows per-referrer and per-referral caps", () => {
    render(<ReferralIncentives />);
    expect(screen.getByTestId("referral-cap-per-referrer")).toBeInTheDocument();
    expect(screen.getByTestId("referral-cap-per-referral")).toBeInTheDocument();
  });

  it("shows anti-abuse measures", () => {
    render(<ReferralIncentives />);
    expect(screen.getByTestId("referral-anti-abuse")).toBeInTheDocument();
    const items = within(screen.getByTestId("referral-anti-abuse")).getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it("explains sustainability logic", () => {
    render(<ReferralIncentives />);
    expect(screen.getByTestId("referral-sustainability")).toBeInTheDocument();
    expect(screen.getByText(/quarterly budget/i)).toBeInTheDocument();
  });

  it("shows planned maturity badge", () => {
    render(<ReferralIncentives />);
    const badges = screen.getAllByTestId("maturity-badge");
    const plannedBadge = badges.find((b) => b.getAttribute("data-status") === "planned");
    expect(plannedBadge).toBeInTheDocument();
  });

  it("includes evidence hook and caveat", () => {
    render(<ReferralIncentives />);
    const hooks = screen.getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VAL-TOKEN-014: Product-Family Revenue/Value-Return Model
// ---------------------------------------------------------------------------

describe("ProductFamilyRevenueModel (VAL-TOKEN-014)", () => {
  it("renders the product-family-revenue-model section", () => {
    render(<ProductFamilyRevenueModel />);
    expect(screen.getByTestId("product-family-revenue-model")).toBeInTheDocument();
  });

  it("renders all product revenue lines", () => {
    render(<ProductFamilyRevenueModel />);
    const lines = screen.getAllByTestId("product-revenue-line");
    expect(lines.length).toBe(PRODUCT_FAMILY_REVENUE_MODELS.length);
  });

  it("covers required product families", () => {
    render(<ProductFamilyRevenueModel />);
    expect(screen.getByText("Token Trading & Taxes")).toBeInTheDocument();
    expect(screen.getByText("Lite Mode & Terminal")).toBeInTheDocument();
    expect(screen.getByText("Social Vaults")).toBeInTheDocument();
    expect(screen.getByText("Strategy Agents")).toBeInTheDocument();
    expect(screen.getByText("Whale Premium Products")).toBeInTheDocument();
    expect(screen.getByText("Referrals")).toBeInTheDocument();
    expect(screen.getByText("Enterprise & API Rails")).toBeInTheDocument();
  });

  it("each product line shows a return type label", () => {
    render(<ProductFamilyRevenueModel />);
    const labels = screen.getAllByTestId("return-type-label");
    expect(labels.length).toBe(PRODUCT_FAMILY_REVENUE_MODELS.length);
  });

  it("shows maturity badges on each product line", () => {
    render(<ProductFamilyRevenueModel />);
    const lines = screen.getAllByTestId("product-revenue-line");
    for (const line of lines) {
      expect(within(line).getByTestId("maturity-badge")).toBeInTheDocument();
    }
  });

  it("shows evidence hooks on each product line", () => {
    render(<ProductFamilyRevenueModel />);
    const lines = screen.getAllByTestId("product-revenue-line");
    for (const line of lines) {
      expect(within(line).getByTestId("evidence-hook")).toBeInTheDocument();
    }
  });

  it("includes caveat framing", () => {
    render(<ProductFamilyRevenueModel />);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
  });

  it("distinguishes direct revenue from ecosystem value", () => {
    render(<ProductFamilyRevenueModel />);
    const labels = screen.getAllByTestId("return-type-label");
    const labelTexts = labels.map((l) => l.textContent);
    expect(labelTexts).toContain("Direct Monetized Revenue");
    expect(labelTexts).toContain("Ecosystem Value (Growth Driver)");
  });
});

// ---------------------------------------------------------------------------
// Full TokenomicsSection Assembly
// ---------------------------------------------------------------------------

describe("TokenomicsSection includes new policy surfaces", () => {
  it("renders first-vault policy section", () => {
    render(<TokenomicsSection />);
    expect(screen.getByTestId("first-vault-policy")).toBeInTheDocument();
  });

  it("renders modeled whale ladder section", () => {
    render(<TokenomicsSection />);
    expect(screen.getByTestId("modeled-whale-ladder")).toBeInTheDocument();
  });

  it("renders referral incentives section", () => {
    render(<TokenomicsSection />);
    expect(screen.getByTestId("referral-incentives")).toBeInTheDocument();
  });

  it("renders product-family revenue model section", () => {
    render(<TokenomicsSection />);
    expect(screen.getByTestId("product-family-revenue-model")).toBeInTheDocument();
  });
});
