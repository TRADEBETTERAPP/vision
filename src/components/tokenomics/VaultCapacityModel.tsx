"use client";

/**
 * VaultCapacityModel — VAL-TOKEN-016, VAL-TOKEN-017, VAL-TOKEN-018
 *
 * Interactive stake-to-vault-capacity modeling with the √-weighted bidding model:
 * - User's BETTER stake and total staked as explicit inputs
 * - User-adjustable total staked with sensible default
 * - Minted supply ceiling validation
 * - √-weighted allocation estimation
 * - Dollar-denominated allocation estimates
 * - Clear distinction between total vault cap and individual bidding allocation
 * - Explicit whale-vault assumptions
 */

import { useState, useMemo, useCallback } from "react";
import {
  computeVaultCapacityEstimate,
  validateTotalStaked,
  DEFAULT_TOTAL_STAKED,
  WHALE_VAULT_ASSUMPTIONS,
  FIRST_VAULT_DEFAULTS,
  BIDDING_MODEL_PARAMS,
} from "@/content/vault-capacity";
import { MINTED_SUPPLY, FIRST_VAULT_POLICY } from "@/content/token-tiers";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import type { ConfidenceFrame, SourceCue } from "@/content";

/** Format a large number with commas */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/** Format USD with commas and 0 decimals */
function formatUsd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

const modelSource: SourceCue = {
  type: "scenario_based",
  label: "BETTER Vault Capacity Model",
  note:
    "Estimates are modeled outputs based on your inputs and stated assumptions — not predictions or guarantees. Actual vault sizing, participation, and distribution will differ. The total vault cap is the hard policy limit — individual allocations are determined by the √-weighted bidding model within that cap.",
  asOf: "2026-Q1",
};

const modelCaveat: ConfidenceFrame = {
  caveat:
    "This model estimates how your staked BETTER could translate into vault capacity share under stated assumptions. Actual allocation depends on the √-weighted bidding model, total vault cap, participation rates, and the number of qualifying stakers. The total vault cap applies across all stakers — individual allocations are determined by the bidding model with a per-staker cap.",
  dependencies: [
    "Social Vaults & vBETTER launch",
    "Whale-First Tier Ladder",
    "Bidding Allocation Infrastructure",
  ],
};

type VaultScenario = "first_vault" | "whale_vault";

interface ScenarioConfig {
  label: string;
  description: string;
  vaultCapacityUsd: number;
}

const VAULT_SCENARIOS: Record<VaultScenario, ScenarioConfig> = {
  first_vault: {
    label: "First Vault (Q1 2026)",
    description: `The first quant-team vault with a total deposit cap of $${formatNumber(FIRST_VAULT_POLICY.totalVaultCapUsd)} USDC across all qualifying stakers. Allocations determined by √-weighted bidding.`,
    vaultCapacityUsd: FIRST_VAULT_DEFAULTS.vaultCapacityUsd,
  },
  whale_vault: {
    label: "Modeled Whale Vault",
    description: `A larger modeled whale vault ($${formatNumber(WHALE_VAULT_ASSUMPTIONS.assumedVaultCapacityUsd)} total capacity) for future quant-team vaults with case-by-case caps.`,
    vaultCapacityUsd: WHALE_VAULT_ASSUMPTIONS.assumedVaultCapacityUsd,
  },
};

export default function VaultCapacityModel() {
  const [userStake, setUserStake] = useState<number>(200_000);
  const [totalStaked, setTotalStaked] = useState<number>(DEFAULT_TOTAL_STAKED);
  const [activeScenario, setActiveScenario] = useState<VaultScenario>("first_vault");

  const scenario = VAULT_SCENARIOS[activeScenario];

  // Validate total staked against supply ceiling
  const totalStakedValid = useMemo(() => validateTotalStaked(totalStaked), [totalStaked]);
  const userStakeValid = useMemo(
    () => userStake >= 0 && userStake <= totalStaked,
    [userStake, totalStaked]
  );

  // Compute estimate
  const estimate = useMemo(() => {
    if (!totalStakedValid || !userStakeValid || userStake <= 0) return null;
    try {
      return computeVaultCapacityEstimate({
        userStake,
        totalStaked,
        vaultCapacityUsd: scenario.vaultCapacityUsd,
      });
    } catch {
      return null;
    }
  }, [userStake, totalStaked, totalStakedValid, userStakeValid, scenario]);

  const handleUserStakeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/,/g, ""), 10);
    if (!isNaN(val)) setUserStake(val);
    else if (e.target.value === "") setUserStake(0);
  }, []);

  const handleTotalStakedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/,/g, ""), 10);
    if (!isNaN(val)) setTotalStaked(val);
    else if (e.target.value === "") setTotalStaked(0);
  }, []);

  return (
    <div data-testid="vault-capacity-model">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Stake-to-Vault Capacity Model
        </h3>
        <span className="rounded-full bg-accent/10 px-2 py-0.5 font-terminal text-xs text-accent">
          Interactive
        </span>
      </div>
      <p className="mb-4 text-sm text-secondary">
        Estimate how your staked BETTER translates into vault deposit capacity
        using the √-weighted bidding model. The total vault cap is shared across
        all qualifying stakers — individual allocations are determined by the
        bidding model with a per-staker cap.
      </p>

      <div className="mb-4">
        <EvidenceHook source={modelSource} />
      </div>

      {/* Vault scenario toggle */}
      <div className="mb-6" data-testid="vault-scenario-toggle">
        <span className="mb-2 block font-terminal text-xs font-medium uppercase tracking-wider text-muted">
          Vault Scenario
        </span>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(VAULT_SCENARIOS) as VaultScenario[]).map((key) => (
            <button
              key={key}
              onClick={() => setActiveScenario(key)}
              className={`rounded-lg px-4 py-2 font-terminal text-sm transition-colors ${
                activeScenario === key
                  ? "text-accent ring-1 ring-[rgba(69,94,255,0.30)]"
                  : "text-secondary hover:text-foreground"
              }`}
              style={{
                background: activeScenario === key ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.10)",
                border: "1px solid rgba(255, 255, 255, 0.20)",
              }}
              data-testid={`vault-scenario-${key}`}
            >
              {VAULT_SCENARIOS[key].label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{scenario.description}</p>
      </div>

      {/* Input fields */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-terminal text-xs font-medium uppercase tracking-wider text-muted">
            Your BETTER Stake
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatNumber(userStake)}
            onChange={handleUserStakeChange}
            className={`w-full rounded-lg border bg-background px-3 py-2 font-terminal text-foreground ${
              userStakeValid ? "border-border" : "border-red-500"
            }`}
            data-testid="vault-user-stake-input"
          />
          {!userStakeValid && (
            <p className="mt-1 text-xs text-red-400">
              Cannot exceed total staked ({formatNumber(totalStaked)} BETTER)
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block font-terminal text-xs font-medium uppercase tracking-wider text-muted">
            Total Staked BETTER
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={formatNumber(totalStaked)}
            onChange={handleTotalStakedChange}
            className={`w-full rounded-lg border bg-background px-3 py-2 font-terminal text-foreground ${
              totalStakedValid ? "border-border" : "border-red-500"
            }`}
            data-testid="vault-total-staked-input"
          />
          {!totalStakedValid && (
            <p className="mt-1 text-xs text-red-400" data-testid="supply-ceiling-error">
              Must be between 1 and {formatNumber(MINTED_SUPPLY)} BETTER (minted supply ceiling)
            </p>
          )}
          <p className="mt-1 text-xs text-muted">
            Default: {formatNumber(DEFAULT_TOTAL_STAKED)} BETTER (~{Math.round((DEFAULT_TOTAL_STAKED / MINTED_SUPPLY) * 100)}% of minted supply).{" "}
            <span className="text-accent">Adjustable</span> — try different values to see how share changes.
          </p>
        </div>
      </div>

      {/* Results */}
      {estimate ? (
        <div className="mb-6 space-y-4" data-testid="vault-capacity-results">
          {/* Share percentage */}
          <div className="glass-card p-4">
            <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
              Your Share of Staked Pool
            </span>
            <div className="mt-1 font-terminal text-2xl font-bold text-foreground" data-testid="vault-share-percentage">
              {estimate.sharePercentage.toFixed(4)}%
            </div>
            <p className="mt-1 text-xs text-muted">
              {formatNumber(userStake)} ÷ {formatNumber(totalStaked)} = {estimate.sharePercentage.toFixed(4)}% of the staked pool
            </p>
          </div>

          {/* Modeled allocation range vs total vault cap */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-card p-4" data-testid="vault-modeled-allocation">
              <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
                Modeled Capacity Share (Range)
              </span>
              <div className="mt-1 font-terminal text-lg font-bold text-foreground">
                {formatUsd(estimate.estimatedAllocationLowUsd)} – {formatUsd(estimate.estimatedAllocationHighUsd)}
              </div>
              <p className="mt-1 text-xs text-muted">
                Statistical estimate with ±20% uncertainty band around the
                point estimate. This is a <span className="text-accent">modeled capacity share</span> within
                the total vault cap, determined by the √-weighted bidding allocation model.
              </p>
            </div>
            <div
              className="glass-card p-4"
              data-testid="vault-total-cap"
            >
              <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent-warn">
                Total Vault Cap (Policy)
              </span>
              <div className="mt-1 font-terminal text-lg font-bold text-foreground">
                {formatUsd(estimate.totalVaultCapUsd)}
              </div>
              <p className="mt-1 text-xs text-muted">
                Total deposits across all qualifying stakers.
                {activeScenario === "first_vault"
                  ? ` First-vault total cap: $${formatNumber(FIRST_VAULT_POLICY.totalVaultCapUsd)} USDC shared by all stakers.`
                  : " Modeled future vault cap (case-by-case)."}
              </p>
            </div>
          </div>

          {/* Effective deposit */}
          <div className="glass-card p-4" data-testid="vault-effective-deposit">
            <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
              Effective Allocation Estimate
            </span>
            <div className="mt-1 font-terminal text-2xl font-bold text-foreground">
              {formatUsd(estimate.effectiveDepositUsd)}
            </div>
            <p className="mt-1 text-xs text-muted">
              {estimate.capConstrained ? (
                <>
                  <span className="text-accent-warn">Cap-constrained</span> — your modeled share
                  ({formatUsd(estimate.estimatedAllocationHighUsd)}) exceeds the per-staker cap
                  derived from max(V/N, V×{BIDDING_MODEL_PARAMS.perStakerCapRatio * 100}%), so the cap applies.
                </>
              ) : (
                <>
                  Your modeled share is below the per-staker cap, so the full
                  high-end estimate applies. The total vault cap is shared across all stakers.
                </>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-card mb-6 p-4 text-center text-sm text-muted" data-testid="vault-no-results">
          {!totalStakedValid
            ? "Fix the total staked input to see results."
            : !userStakeValid
            ? "Your stake must be ≤ total staked."
            : "Enter a stake amount greater than 0 to see results."}
        </div>
      )}

      {/* Whale-vault assumptions (always visible) */}
      <div className="glass-card mb-4 p-4" data-testid="whale-vault-assumptions">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-foreground">
          Modeled Whale-Vault Assumptions
        </h4>
        <p className="mb-3 text-xs text-secondary">
          Whale count and stake distribution are <span className="font-semibold text-accent-warn">informational-only context</span> — they do not drive the capacity estimate calculation.
          Only vault capacity feeds directly into the model as a calculation input.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
              Assumed Whale Count
            </span>
            <span className="font-terminal font-semibold text-foreground">
              {WHALE_VAULT_ASSUMPTIONS.assumedWhaleCount} whales
            </span>
            <span
              className="mt-1 block rounded bg-accent-warn/10 px-1.5 py-0.5 font-terminal text-[10px] font-medium text-accent-warn w-fit"
              data-testid="assumption-role-informational"
            >
              Informational Only
            </span>
          </div>
          <div>
            <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
              Assumed Vault Capacity
            </span>
            <span className="font-terminal font-semibold text-foreground">
              ${formatNumber(WHALE_VAULT_ASSUMPTIONS.assumedVaultCapacityUsd)}
            </span>
            <span
              className="mt-1 block rounded bg-accent/10 px-1.5 py-0.5 font-terminal text-[10px] font-medium text-accent w-fit"
              data-testid="assumption-role-calculation"
            >
              Calculation Input
            </span>
          </div>
          <div>
            <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
              Minted Supply Ceiling
            </span>
            <span className="font-terminal font-semibold text-foreground">
              {formatNumber(MINTED_SUPPLY)} BETTER
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-secondary" data-testid="whale-stake-distribution">
          <span className="font-semibold text-foreground">Stake Distribution:</span>{" "}
          {WHALE_VAULT_ASSUMPTIONS.assumedStakeDistribution}
        </p>
        <span
          className="mt-1 inline-block rounded bg-accent-warn/10 px-1.5 py-0.5 font-terminal text-[10px] font-medium text-accent-warn"
          data-testid="assumption-role-informational"
        >
          Informational Only
        </span>
        <div className="mt-3">
          <EvidenceHook source={WHALE_VAULT_ASSUMPTIONS.source} />
        </div>
      </div>

      <CaveatFrame confidence={modelCaveat} className="mt-4" />
    </div>
  );
}
