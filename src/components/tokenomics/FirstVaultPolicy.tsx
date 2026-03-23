/**
 * First-Vault Policy — VAL-TOKEN-012, VAL-TOKEN-017, VAL-TOKEN-018
 *
 * Explicitly states Q1 2026 first-vault rules:
 * - 100,000 BETTER universal minimum for all quant-team vaults
 * - $25,000 TOTAL vault deposit cap across ALL qualifying stakers (per-staker bidding allocation)
 * - √-weighted bidding allocation model with 24hr window, per-staker cap, $100 floor
 * - Worked examples showing how different stake amounts translate to allocations
 */

import {
  FIRST_VAULT_POLICY,
  FIRST_VAULT_WORKED_EXAMPLES,
} from "@/content";
import {
  BIDDING_MODEL_PARAMS,
  SOCIAL_VAULT_PARAMS,
  MULTI_VAULT_PROGRESSION,
} from "@/content/vault-capacity";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import MaturityBadge from "@/components/MaturityBadge";
import type { ConfidenceFrame } from "@/content";

/** Format a large number with commas */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

const vaultCaveat: ConfidenceFrame = {
  caveat:
    "The $25,000 total vault cap applies to the first vault only. Individual allocations within that cap are determined by the √-weighted bidding model with a per-staker cap. Future quant-team vaults will have individually set total caps on a case-by-case basis.",
  dependencies: [
    "Social Vaults & vBETTER",
    "Whale-First Tier Ladder",
    "Bidding Allocation Infrastructure",
  ],
};

export default function FirstVaultPolicy() {
  return (
    <div data-testid="first-vault-policy">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-foreground">
          Q1 2026 First-Vault Policy
        </h3>
        <MaturityBadge status="in_progress" />
      </div>
      <p className="mb-4 text-sm text-secondary">
        The first quant-team vault has a <strong>total deposit cap of $25,000 USDC
        across all qualifying stakers</strong>. Individual allocations are determined
        by a √-weighted bidding model with a 24-hour commitment window and a
        per-staker cap. Every qualifying staker receives at least $100 USDC.
      </p>

      <div className="mb-4">
        <EvidenceHook source={FIRST_VAULT_POLICY.source} />
      </div>

      {/* Policy rules */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="glass-card p-4">
          <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
            Universal Minimum Stake
          </span>
          <div className="mt-1 font-terminal text-2xl font-bold text-foreground" data-testid="first-vault-minimum">
            {formatNumber(FIRST_VAULT_POLICY.minimumBetter)} BETTER
          </div>
          <p className="mt-1 text-xs text-secondary">
            Required for all quant-team vaults (Standard tier or above).
          </p>
        </div>
        <div className="glass-card p-4">
          <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
            Total Vault Cap
          </span>
          <div className="mt-1 font-terminal text-2xl font-bold text-foreground" data-testid="first-vault-cap">
            ${formatNumber(FIRST_VAULT_POLICY.totalVaultCapUsd)} USDC
          </div>
          <p className="mt-1 text-xs text-secondary">
            Total deposits across ALL qualifying stakers for the first vault. Individual allocations use the per-staker bidding model.
          </p>
        </div>
      </div>

      {/* Bidding model explanation */}
      <div className="glass-card mb-6 p-4" data-testid="bidding-model-explanation">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-foreground">
          √-Weighted Bidding Allocation Model
        </h4>
        <p className="text-sm text-secondary mb-3">
          Vault allocation uses a <span className="font-semibold text-accent">bidding system</span> with
          a {BIDDING_MODEL_PARAMS.biddingWindowHours}-hour commitment window. Stakers sign a transaction
          committing their BETTER stake for a specific vault. After the window closes, allocations are
          computed using square-root (√) weighting — larger stakes receive more, but with
          diminishing returns.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-border/50 bg-background px-3 py-2">
            <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
              Tapering
            </span>
            <span className="font-terminal font-semibold text-foreground">
              √-weighted (α = {BIDDING_MODEL_PARAMS.alpha})
            </span>
          </div>
          <div className="rounded border border-border/50 bg-background px-3 py-2">
            <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
              Per-Staker Cap
            </span>
            <span className="font-terminal font-semibold text-foreground">
              max(V/N, V×{BIDDING_MODEL_PARAMS.perStakerCapRatio * 100}%)
            </span>
          </div>
          <div className="rounded border border-border/50 bg-background px-3 py-2">
            <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
              Minimum Floor
            </span>
            <span className="font-terminal font-semibold text-foreground">
              ${BIDDING_MODEL_PARAMS.minimumFloorUsd} USDC
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          The hybrid model compresses whale allocations via √-tapering, bounds maximum
          individual exposure via the hard cap, and guarantees meaningful participation
          for every qualifier via the $100 floor.
        </p>
      </div>

      {/* Social vault differentiation */}
      <div className="glass-card mb-6 p-4" data-testid="social-vault-differentiation">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-foreground">
          Social Vault Minimum: {formatNumber(SOCIAL_VAULT_PARAMS.minimumStake)} BETTER
        </h4>
        <p className="text-sm text-secondary">
          {SOCIAL_VAULT_PARAMS.differentiationNote}
        </p>
      </div>

      {/* Multi-vault progression */}
      <div className="glass-card mb-6 p-4" data-testid="multi-vault-progression">
        <h4 className="mb-2 font-terminal text-sm font-semibold text-foreground">
          Multi-Vault Progression
        </h4>
        <p className="mb-3 text-sm text-secondary">
          {MULTI_VAULT_PROGRESSION.futureCapPolicy}
        </p>
        <div className="space-y-2">
          {MULTI_VAULT_PROGRESSION.stages.map((stage, i) => (
            <div key={i} className="flex items-center gap-3 rounded border border-border/50 bg-background px-3 py-2">
              <MaturityBadge status={stage.maturity} />
              <div>
                <span className="font-terminal text-sm font-semibold text-foreground">
                  {stage.label}
                </span>
                {stage.totalCapUsd > 0 && (
                  <span className="ml-2 font-terminal text-xs text-accent">
                    ${formatNumber(stage.totalCapUsd)} total cap
                  </span>
                )}
                {stage.totalCapUsd === 0 && (
                  <span className="ml-2 font-terminal text-xs text-muted">
                    Case-by-case
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Worked examples */}
      <h4 className="mb-3 font-terminal text-sm font-semibold uppercase tracking-wider text-muted">
        Worked Examples (20-Staker Scenario)
      </h4>
      <div className="space-y-3" data-testid="first-vault-worked-examples">
        {FIRST_VAULT_WORKED_EXAMPLES.map((ex) => (
          <div
            key={ex.label}
            className={`glass-card p-4 ${
              ex.qualifies ? "ring-1 ring-[rgba(69,94,255,0.30)]" : ""
            }`}
            data-testid="first-vault-example"
            data-qualifies={String(ex.qualifies)}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground">{ex.tierName}</span>
              <span className="font-terminal text-xs text-secondary">
                {formatNumber(ex.betterHolding)} BETTER
              </span>
              <span
                className={`rounded-full px-2 py-0.5 font-terminal text-xs ${
                  ex.qualifies
                    ? "bg-accent/10 text-accent"
                    : "bg-surface text-muted"
                }`}
              >
                {ex.qualifies ? "✓ Qualifies" : "✗ Does not qualify"}
              </span>
              {ex.capped && (
                <span className="rounded-full bg-white/5 px-2 py-0.5 font-terminal text-xs text-[#a0a0a0]">
                  Capped
                </span>
              )}
            </div>
            {ex.qualifies && (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded border border-border/50 bg-background px-3 py-2">
                  <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                    √-Weight
                  </span>
                  <span className="font-terminal font-semibold text-foreground">
                    {ex.sqrtWeight.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="rounded border border-border/50 bg-background px-3 py-2">
                  <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                    Estimated Allocation
                  </span>
                  <span className="font-terminal font-semibold text-accent">
                    ${formatNumber(ex.estimatedAllocationUsd)}
                  </span>
                </div>
                <div className="rounded border border-border/50 bg-background px-3 py-2">
                  <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                    % of Vault
                  </span>
                  <span className="font-terminal font-semibold text-foreground">
                    {ex.percentOfVault.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
            <p className="mt-2 text-xs text-muted">{ex.explanation}</p>
          </div>
        ))}
      </div>

      <CaveatFrame confidence={vaultCaveat} className="mt-4" />
    </div>
  );
}
