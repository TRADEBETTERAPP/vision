/**
 * Social Vault Fee & Maturity Consistency — Regression Coverage
 *
 * Protects against recurring scrutiny gaps:
 * 1. Social-vault performance fee must be the canonical 20% everywhere
 * 2. Social Vault maturity must be consistent across surfaces, with explicit
 *    differentiation where the modeled whale access gate (planned) differs
 *    from the feature itself (in_progress)
 *
 * These tests exercise the affected token-policy and revenue components
 * together to catch cross-surface inconsistency early.
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import FeeStackValueFlow from "../FeeStackValueFlow";
import {
  PRODUCT_FAMILY_REVENUE_MODELS,
  MODELED_WHALE_PRODUCTS,
  getNodeById,
} from "@/content";
import { NARRATIVE_BLOCKS } from "@/content/narrative";

// ---------------------------------------------------------------------------
// Canonical social-vault performance fee: 20%
// Source: BETTER Docs — "20% performance fee on profit-only withdrawals
// with wallet-level high-water mark"
// ---------------------------------------------------------------------------

const CANONICAL_SOCIAL_VAULT_FEE_PERCENT = 20;

describe("Social Vault Performance Fee Consistency", () => {
  it("fee-stack worked example uses the canonical 20% performance fee", () => {
    render(<FeeStackValueFlow />);
    const feeItems = screen.getAllByTestId("fee-item");
    const vaultFeeItem = feeItems.find((el) =>
      el.textContent?.includes("Vault Performance Fee")
    );
    expect(vaultFeeItem).toBeDefined();
    // The worked example must show 20%, not 10% or any other figure
    expect(vaultFeeItem!.textContent).toContain(
      `${CANONICAL_SOCIAL_VAULT_FEE_PERCENT}% performance fee`
    );
  });

  it("fee-stack worked example dollar amount matches 20% of the example profit", () => {
    render(<FeeStackValueFlow />);
    const feeItems = screen.getAllByTestId("fee-item");
    const vaultFeeItem = feeItems.find((el) =>
      el.textContent?.includes("Vault Performance Fee")
    );
    expect(vaultFeeItem).toBeDefined();
    // If the example uses $50,000 profit, 20% = $10,000
    expect(vaultFeeItem!.textContent).toContain("$10,000");
  });

  it("product-family revenue model uses the canonical 20% fee for Social Vaults", () => {
    const socialVaultRevenue = PRODUCT_FAMILY_REVENUE_MODELS.find(
      (r) => r.id === "pfr-social-vaults"
    );
    expect(socialVaultRevenue).toBeDefined();
    expect(socialVaultRevenue!.revenueDescription).toContain(
      `${CANONICAL_SOCIAL_VAULT_FEE_PERCENT}% performance fee`
    );
  });

  it("product-family revenue model source note cites the canonical 20% fee", () => {
    const socialVaultRevenue = PRODUCT_FAMILY_REVENUE_MODELS.find(
      (r) => r.id === "pfr-social-vaults"
    );
    expect(socialVaultRevenue).toBeDefined();
    expect(socialVaultRevenue!.source.note).toContain(
      `${CANONICAL_SOCIAL_VAULT_FEE_PERCENT}% performance fee`
    );
  });

  it("fee-stack and revenue-model surfaces agree on the same social-vault fee figure", () => {
    render(<FeeStackValueFlow />);
    const feeItems = screen.getAllByTestId("fee-item");
    const vaultFeeItem = feeItems.find((el) =>
      el.textContent?.includes("Vault Performance Fee")
    );
    expect(vaultFeeItem).toBeDefined();

    const socialVaultRevenue = PRODUCT_FAMILY_REVENUE_MODELS.find(
      (r) => r.id === "pfr-social-vaults"
    );
    expect(socialVaultRevenue).toBeDefined();

    // Both must reference the same percentage
    const feeStackText = vaultFeeItem!.textContent!;
    const revenueText = socialVaultRevenue!.revenueDescription;

    const feeStackMatch = feeStackText.match(/(\d+)% performance fee/);
    const revenueMatch = revenueText.match(/(\d+)% performance fee/);

    expect(feeStackMatch).not.toBeNull();
    expect(revenueMatch).not.toBeNull();
    expect(feeStackMatch![1]).toBe(revenueMatch![1]);
  });
});

// ---------------------------------------------------------------------------
// Social Vault Maturity Consistency
// ---------------------------------------------------------------------------

describe("Social Vault Maturity Consistency", () => {
  it("roadmap social-vaults node is in_progress", () => {
    const node = getNodeById("pe-social-vaults");
    expect(node).toBeDefined();
    expect(node!.status).toBe("in_progress");
  });

  it("narrative social-vaults block is in_progress", () => {
    const block = NARRATIVE_BLOCKS.find(
      (b) => b.id === "vision-social-vaults"
    );
    expect(block).toBeDefined();
    expect(block!.status).toBe("in_progress");
  });

  it("product-family revenue model social-vaults is in_progress", () => {
    const revenue = PRODUCT_FAMILY_REVENUE_MODELS.find(
      (r) => r.id === "pfr-social-vaults"
    );
    expect(revenue).toBeDefined();
    expect(revenue!.maturity).toBe("in_progress");
  });

  it("modeled whale product gate for social vaults is planned (modeled access gate, not feature maturity)", () => {
    const product = MODELED_WHALE_PRODUCTS.find(
      (p) => p.id === "mwp-social-vaults"
    );
    expect(product).toBeDefined();
    // The access gate is modeled policy → planned, even though the feature is in_progress
    expect(product!.maturity).toBe("planned");
  });

  it("modeled whale product description explicitly differentiates gate maturity from feature maturity", () => {
    const product = MODELED_WHALE_PRODUCTS.find(
      (p) => p.id === "mwp-social-vaults"
    );
    expect(product).toBeDefined();
    // The description or source note must mention that the vault feature is in active development
    // while the access gate is modeled policy
    const combinedText = `${product!.description} ${product!.source.note}`;
    expect(combinedText).toMatch(/active development|in.progress|being built/i);
    expect(combinedText).toMatch(/modeled|inferred/i);
  });

  it("fee-stack vault performance fee item has in_progress maturity matching the feature", () => {
    render(<FeeStackValueFlow />);
    const feeItems = screen.getAllByTestId("fee-item");
    const vaultFeeItem = feeItems.find((el) =>
      el.textContent?.includes("Vault Performance Fee")
    );
    expect(vaultFeeItem).toBeDefined();
    const badge = within(vaultFeeItem!).getByTestId("maturity-badge");
    expect(badge.getAttribute("data-status")).toBe("in_progress");
  });

  it("roadmap vault-performance-fees node is in_progress", () => {
    const node = getNodeById("re-vault-performance");
    expect(node).toBeDefined();
    expect(node!.status).toBe("in_progress");
  });

  it("all social-vault feature surfaces agree on in_progress status", () => {
    // Comprehensive check: narrative, roadmap, revenue model, and vault-fees roadmap node
    // all agree that social vaults as a *feature* are in_progress
    const roadmapNode = getNodeById("pe-social-vaults");
    const narrativeBlock = NARRATIVE_BLOCKS.find(
      (b) => b.id === "vision-social-vaults"
    );
    const revenueModel = PRODUCT_FAMILY_REVENUE_MODELS.find(
      (r) => r.id === "pfr-social-vaults"
    );
    const vaultFeesNode = getNodeById("re-vault-performance");

    expect(roadmapNode!.status).toBe("in_progress");
    expect(narrativeBlock!.status).toBe("in_progress");
    expect(revenueModel!.maturity).toBe("in_progress");
    expect(vaultFeesNode!.status).toBe("in_progress");
  });
});
