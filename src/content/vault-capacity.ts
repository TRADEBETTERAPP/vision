/**
 * Stake-to-vault-capacity modeling for the BETTER ecosystem.
 *
 * Satisfies VAL-TOKEN-016:
 * - User's BETTER stake and total staked BETTER as explicit inputs
 * - User-adjustable or scenario-driven total-staked relationship
 * - Sensible default reference for total staked BETTER
 * - Total staked validated against minted supply ceiling (709,001,940)
 * - Statistical-assumption exposure (distribution basis, whale assumptions)
 * - Uncertainty-aware output (ranges/bands, not single points)
 * - Dollar-denominated allocation estimates
 * - Clear distinction between first-vault deposit-cap policy and modeled capacity share
 * - Explicit whale-vault assumptions (whale count, stake distribution, vault capacity)
 */

import type { SourceCue } from "./types";
import { MINTED_SUPPLY, FIRST_VAULT_POLICY } from "./token-tiers";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VaultCapacityInput {
  /** User's staked BETTER tokens */
  userStake: number;
  /** Total staked BETTER across all participants */
  totalStaked: number;
  /** Total vault capacity in USD */
  vaultCapacityUsd: number;
  /** Per-wallet deposit cap in USD (policy rule) */
  perWalletCapUsd: number;
}

export interface VaultCapacityEstimate {
  /** User's share of total staked pool as percentage */
  sharePercentage: number;
  /** Modeled allocation based on share — low estimate (USD) */
  estimatedAllocationLowUsd: number;
  /** Modeled allocation based on share — high estimate (USD) */
  estimatedAllocationHighUsd: number;
  /** Per-wallet deposit cap (policy rule, not modeled) */
  depositCapUsd: number;
  /** Effective deposit: min(modeled high allocation, deposit cap) */
  effectiveDepositUsd: number;
  /** Whether the deposit cap constrains the modeled allocation */
  capConstrained: boolean;
}

/**
 * Role of an assumption in the vault capacity model.
 *
 * - "calculation_input": The assumption directly feeds into the capacity estimate math.
 * - "informational": The assumption provides market-context framing only — it does not
 *   drive the capacity estimate calculation. Displayed so users can evaluate the broader
 *   market environment the model sits within.
 */
export type AssumptionRole = "calculation_input" | "informational";

export interface WhaleVaultAssumptions {
  /** Assumed number of whale-tier+ participants */
  assumedWhaleCount: number;
  /** Role of the whale-count assumption in the model */
  whaleCountRole: AssumptionRole;
  /** Human-readable description of assumed stake distribution */
  assumedStakeDistribution: string;
  /** Role of the stake-distribution assumption in the model */
  stakeDistributionRole: AssumptionRole;
  /** Assumed total vault capacity in USD for a modeled whale vault */
  assumedVaultCapacityUsd: number;
  /** Role of the vault-capacity assumption in the model */
  vaultCapacityRole: AssumptionRole;
  /** Source/assumption cue */
  source: SourceCue;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Default total staked reference — a sensible starting point.
 *
 * Based on comparable DeFi staking participation rates (10-20% of circulating
 * supply) applied to the minted supply. We use ~14% as a moderate default.
 */
export const DEFAULT_TOTAL_STAKED = 100_000_000;

/**
 * Uncertainty band factor applied to the share-based allocation.
 * The low estimate is 80% of the point estimate, high is 120%.
 * This accounts for varying participant behavior and timing.
 */
const UNCERTAINTY_LOW_FACTOR = 0.8;
const UNCERTAINTY_HIGH_FACTOR = 1.2;

/**
 * Explicit whale-vault modeling assumptions.
 *
 * These are stated so users can evaluate the estimate's sensitivity
 * to changes in whale count, distribution, and vault sizing.
 */
export const WHALE_VAULT_ASSUMPTIONS: WhaleVaultAssumptions = {
  assumedWhaleCount: 50,
  whaleCountRole: "informational",
  assumedStakeDistribution:
    "Modeled as a concentrated distribution where the top 50 whale-tier holders (≥500,000 BETTER each) collectively stake ~40% of total staked BETTER. Remaining 60% is distributed among Standard and Lite-tier holders.",
  stakeDistributionRole: "informational",
  assumedVaultCapacityUsd: 5_000_000,
  vaultCapacityRole: "calculation_input",
  source: {
    type: "scenario_based" as const,
    label: "BETTER Vault Capacity Model",
    note:
      "Whale count and stake distribution are informational-only context assumptions — they do not drive the capacity estimate calculation. Vault capacity directly feeds the model. Actual values will depend on market conditions, participation rates, and vault sizing decisions.",
  },
};

/**
 * First-vault modeling defaults — packaged for the UI.
 */
export const FIRST_VAULT_DEFAULTS = {
  vaultCapacityUsd: 500_000,
  perWalletCapUsd: FIRST_VAULT_POLICY.perWalletDepositCapUsd,
  source: {
    type: "scenario_based" as const,
    label: "BETTER Vault Capacity Model",
    note:
      "First-vault capacity is a modeled estimate based on early social-vault sizing guidance. The per-wallet cap ($25,000) is policy; the total capacity ($500K) is a planning assumption.",
    asOf: "2026-Q1",
  },
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validate that total staked BETTER does not exceed the minted supply ceiling
 * and is positive.
 */
export function validateTotalStaked(totalStaked: number): boolean {
  return totalStaked > 0 && totalStaked <= MINTED_SUPPLY;
}

// ---------------------------------------------------------------------------
// Computation
// ---------------------------------------------------------------------------

/**
 * Compute a vault capacity estimate from explicit inputs.
 *
 * The output includes:
 * - Share percentage of the staked pool
 * - Uncertainty-aware allocation range (low/high in USD)
 * - Deposit cap (policy rule)
 * - Effective deposit (capped at policy limit)
 *
 * Throws if inputs violate constraints (total > minted supply, user > total).
 */
export function computeVaultCapacityEstimate(
  input: VaultCapacityInput
): VaultCapacityEstimate {
  const { userStake, totalStaked, vaultCapacityUsd, perWalletCapUsd } = input;

  // Validate constraints
  if (!validateTotalStaked(totalStaked)) {
    throw new Error(
      `Total staked (${totalStaked}) exceeds minted supply ceiling (${MINTED_SUPPLY}) or is non-positive`
    );
  }
  if (userStake > totalStaked) {
    throw new Error(
      `User stake (${userStake}) cannot exceed total staked (${totalStaked})`
    );
  }

  // Handle zero user stake
  if (userStake <= 0) {
    return {
      sharePercentage: 0,
      estimatedAllocationLowUsd: 0,
      estimatedAllocationHighUsd: 0,
      depositCapUsd: perWalletCapUsd,
      effectiveDepositUsd: 0,
      capConstrained: false,
    };
  }

  // Share of staked pool
  const sharePercentage = (userStake / totalStaked) * 100;

  // Point estimate of allocation based on share
  const pointEstimateUsd = (userStake / totalStaked) * vaultCapacityUsd;

  // Uncertainty band
  const estimatedAllocationLowUsd = pointEstimateUsd * UNCERTAINTY_LOW_FACTOR;
  const estimatedAllocationHighUsd = pointEstimateUsd * UNCERTAINTY_HIGH_FACTOR;

  // Policy-constrained effective deposit
  const effectiveDepositUsd = Math.min(estimatedAllocationHighUsd, perWalletCapUsd);
  const capConstrained = estimatedAllocationHighUsd > perWalletCapUsd;

  return {
    sharePercentage,
    estimatedAllocationLowUsd,
    estimatedAllocationHighUsd,
    depositCapUsd: perWalletCapUsd,
    effectiveDepositUsd,
    capConstrained,
  };
}
