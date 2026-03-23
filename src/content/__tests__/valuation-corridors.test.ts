/**
 * Tests for valuation corridors and vault-capacity modeling.
 *
 * Satisfies VAL-TOKEN-015 and VAL-TOKEN-016:
 * - Conservative stage-based valuation corridors with numeric bounds
 * - Proof-gate mapping and comparable-category labels
 * - Consistent valuation/supply basis across corridors
 * - Live anchor corridor for present-day market state
 * - Implied per-token value reconciliation
 * - Stake-to-vault-capacity modeling with adjustable inputs
 * - Supply-ceiling validation
 * - Uncertainty-aware output with dollar-denominated estimates
 * - Deposit-cap vs modeled-share distinction
 */

import {
  MINTED_SUPPLY,
  FIRST_VAULT_POLICY,
} from "../token-tiers";

import {
  VALUATION_CORRIDORS,
  validateValuationCorridors,
  getCorridorById,
  getLiveAnchorCorridor,
  computeImpliedTokenPrice,
} from "../valuation-corridors";

import {
  computeVaultCapacityEstimate,
  validateTotalStaked,
  DEFAULT_TOTAL_STAKED,
  WHALE_VAULT_ASSUMPTIONS,
  type VaultCapacityInput,
} from "../vault-capacity";

// ---------------------------------------------------------------------------
// Valuation Corridors (VAL-TOKEN-015)
// ---------------------------------------------------------------------------

describe("Valuation Corridors (VAL-TOKEN-015)", () => {
  it("has at least three corridor stages", () => {
    expect(VALUATION_CORRIDORS.length).toBeGreaterThanOrEqual(3);
  });

  it("includes a live anchor corridor reflecting present-day state", () => {
    const live = getLiveAnchorCorridor();
    expect(live).toBeDefined();
    expect(live!.isLiveAnchor).toBe(true);
  });

  it("every corridor has explicit numeric lower and upper bounds", () => {
    for (const c of VALUATION_CORRIDORS) {
      expect(typeof c.lowerBoundM).toBe("number");
      expect(typeof c.upperBoundM).toBe("number");
      expect(c.upperBoundM).toBeGreaterThan(c.lowerBoundM);
      expect(c.lowerBoundM).toBeGreaterThan(0);
    }
  });

  it("corridors are ordered by ascending lower bound", () => {
    for (let i = 1; i < VALUATION_CORRIDORS.length; i++) {
      expect(VALUATION_CORRIDORS[i].lowerBoundM).toBeGreaterThanOrEqual(
        VALUATION_CORRIDORS[i - 1].lowerBoundM
      );
    }
  });

  it("every corridor maps to at least one proof gate", () => {
    for (const c of VALUATION_CORRIDORS) {
      expect(c.proofGates.length).toBeGreaterThan(0);
      for (const pg of c.proofGates) {
        expect(pg.length).toBeGreaterThan(5);
      }
    }
  });

  it("every corridor labels comparable categories", () => {
    for (const c of VALUATION_CORRIDORS) {
      expect(c.comparableCategories.length).toBeGreaterThan(0);
      for (const cat of c.comparableCategories) {
        expect(cat.length).toBeGreaterThan(3);
      }
    }
  });

  it("every corridor declares its valuation basis and supply basis", () => {
    for (const c of VALUATION_CORRIDORS) {
      expect(c.valuationBasis.length).toBeGreaterThan(3);
      expect(c.supplyBasis.length).toBeGreaterThan(3);
    }
  });

  it("all corridors share a consistent valuation and supply basis", () => {
    const bases = new Set(VALUATION_CORRIDORS.map((c) => c.valuationBasis));
    const supplyBases = new Set(VALUATION_CORRIDORS.map((c) => c.supplyBasis));
    // All corridors must use the same basis for comparability
    expect(bases.size).toBe(1);
    expect(supplyBases.size).toBe(1);
  });

  it("every corridor shows implied per-token price range", () => {
    for (const c of VALUATION_CORRIDORS) {
      const low = computeImpliedTokenPrice(c.lowerBoundM);
      const high = computeImpliedTokenPrice(c.upperBoundM);
      expect(low).toBeGreaterThan(0);
      expect(high).toBeGreaterThan(low);
    }
  });

  it("implied token prices reconcile with FDV / minted supply", () => {
    for (const c of VALUATION_CORRIDORS) {
      const lowPrice = computeImpliedTokenPrice(c.lowerBoundM);
      const expectedLow = (c.lowerBoundM * 1_000_000) / MINTED_SUPPLY;
      expect(Math.abs(lowPrice - expectedLow)).toBeLessThan(0.0001);
    }
  });

  it("every corridor has a source cue", () => {
    for (const c of VALUATION_CORRIDORS) {
      expect(c.source).toBeDefined();
      expect(c.source.type).toBeTruthy();
      expect(c.source.label).toBeTruthy();
    }
  });

  it("getCorridorById returns the correct corridor", () => {
    const first = VALUATION_CORRIDORS[0];
    expect(getCorridorById(first.id)).toBe(first);
    expect(getCorridorById("nonexistent")).toBeUndefined();
  });

  it("passes structural validation", () => {
    expect(validateValuationCorridors(VALUATION_CORRIDORS)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Vault-Capacity Modeling (VAL-TOKEN-016)
// ---------------------------------------------------------------------------

describe("Vault-Capacity Modeling (VAL-TOKEN-016)", () => {
  describe("supply ceiling validation", () => {
    it("accepts valid total staked below minted supply", () => {
      expect(validateTotalStaked(100_000_000)).toBe(true);
      expect(validateTotalStaked(MINTED_SUPPLY)).toBe(true);
    });

    it("rejects total staked above minted supply ceiling", () => {
      expect(validateTotalStaked(MINTED_SUPPLY + 1)).toBe(false);
      expect(validateTotalStaked(1_000_000_000)).toBe(false);
    });

    it("rejects zero or negative total staked", () => {
      expect(validateTotalStaked(0)).toBe(false);
      expect(validateTotalStaked(-1)).toBe(false);
    });
  });

  describe("default total staked reference", () => {
    it("provides a sensible default total staked value", () => {
      expect(DEFAULT_TOTAL_STAKED).toBeGreaterThan(0);
      expect(DEFAULT_TOTAL_STAKED).toBeLessThanOrEqual(MINTED_SUPPLY);
    });
  });

  describe("whale-vault assumptions", () => {
    it("exposes whale count, stake distribution, and vault capacity assumptions", () => {
      expect(WHALE_VAULT_ASSUMPTIONS.assumedWhaleCount).toBeGreaterThan(0);
      expect(WHALE_VAULT_ASSUMPTIONS.assumedStakeDistribution.length).toBeGreaterThan(10);
      expect(WHALE_VAULT_ASSUMPTIONS.assumedVaultCapacityUsd).toBeGreaterThan(0);
      expect(WHALE_VAULT_ASSUMPTIONS.source).toBeDefined();
    });

    it("labels whale-count as informational-only (does not drive the calculation)", () => {
      expect(WHALE_VAULT_ASSUMPTIONS.whaleCountRole).toBe("informational");
    });

    it("labels stake-distribution as informational-only (does not drive the calculation)", () => {
      expect(WHALE_VAULT_ASSUMPTIONS.stakeDistributionRole).toBe("informational");
    });

    it("labels vault-capacity as a calculation input (drives the model)", () => {
      expect(WHALE_VAULT_ASSUMPTIONS.vaultCapacityRole).toBe("calculation_input");
    });
  });

  describe("computeVaultCapacityEstimate", () => {
    const baseInput: VaultCapacityInput = {
      userStake: 200_000,
      totalStaked: 100_000_000,
      vaultCapacityUsd: 500_000,
      perWalletCapUsd: FIRST_VAULT_POLICY.perWalletDepositCapUsd,
    };

    it("returns an estimate with share percentage", () => {
      const est = computeVaultCapacityEstimate(baseInput);
      expect(est.sharePercentage).toBeGreaterThan(0);
      expect(est.sharePercentage).toBeLessThanOrEqual(100);
    });

    it("returns uncertainty-aware output as a range", () => {
      const est = computeVaultCapacityEstimate(baseInput);
      expect(est.estimatedAllocationLowUsd).toBeGreaterThanOrEqual(0);
      expect(est.estimatedAllocationHighUsd).toBeGreaterThanOrEqual(
        est.estimatedAllocationLowUsd
      );
    });

    it("includes dollar-denominated allocation estimates", () => {
      const est = computeVaultCapacityEstimate(baseInput);
      expect(typeof est.estimatedAllocationLowUsd).toBe("number");
      expect(typeof est.estimatedAllocationHighUsd).toBe("number");
    });

    it("clearly distinguishes deposit cap from modeled share", () => {
      const est = computeVaultCapacityEstimate(baseInput);
      expect(typeof est.depositCapUsd).toBe("number");
      expect(est.depositCapUsd).toBe(FIRST_VAULT_POLICY.perWalletDepositCapUsd);
      // The modeled share may exceed the cap — the cap is always a hard limit
      expect(est.effectiveDepositUsd).toBeLessThanOrEqual(est.depositCapUsd);
    });

    it("caps effective deposit at the per-wallet deposit cap", () => {
      // Even if share-based allocation would be huge, cap applies
      const bigInput: VaultCapacityInput = {
        userStake: 50_000_000,
        totalStaked: 50_000_000,
        vaultCapacityUsd: 10_000_000,
        perWalletCapUsd: 25_000,
      };
      const est = computeVaultCapacityEstimate(bigInput);
      expect(est.effectiveDepositUsd).toBeLessThanOrEqual(25_000);
    });

    it("returns zero share for zero user stake", () => {
      const est = computeVaultCapacityEstimate({
        ...baseInput,
        userStake: 0,
      });
      expect(est.sharePercentage).toBe(0);
      expect(est.estimatedAllocationLowUsd).toBe(0);
      expect(est.estimatedAllocationHighUsd).toBe(0);
    });

    it("rejects total staked above minted supply", () => {
      expect(() =>
        computeVaultCapacityEstimate({
          ...baseInput,
          totalStaked: MINTED_SUPPLY + 1,
        })
      ).toThrow();
    });

    it("rejects user stake greater than total staked", () => {
      expect(() =>
        computeVaultCapacityEstimate({
          ...baseInput,
          userStake: baseInput.totalStaked + 1,
        })
      ).toThrow();
    });

    it("handles whale-vault scenario with higher capacity", () => {
      const whaleInput: VaultCapacityInput = {
        userStake: 2_000_000,
        totalStaked: 200_000_000,
        vaultCapacityUsd: 5_000_000,
        perWalletCapUsd: 100_000,
      };
      const est = computeVaultCapacityEstimate(whaleInput);
      expect(est.sharePercentage).toBeGreaterThan(0);
      expect(est.estimatedAllocationHighUsd).toBeGreaterThan(0);
    });
  });
});
