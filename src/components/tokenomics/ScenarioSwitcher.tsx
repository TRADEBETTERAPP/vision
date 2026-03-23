"use client";

/**
 * Scenario Switcher — VAL-TOKEN-007, VAL-TOKEN-008
 *
 * Allows switching between conservative, base, and upside scenarios.
 * Updates all dependent outputs while preserving user-entered inputs.
 * Exposes the assumptions that change across dimensions.
 *
 * User-editable inputs (token balance, deposit amount) are stored
 * independently from the active scenario level so they persist
 * across scenario switches.
 */

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  PROJECTION_OUTPUTS,
  SCENARIO_DIMENSION_LABELS,
  SCENARIO_LEVEL_LABELS,
  getScenario,
  getProjectionValues,
  getNodeById,
  getTierForBalance,
  type ScenarioLevel,
  type ProjectionOutput,
} from "@/content";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";
import type { ConfidenceFrame, SourceCue } from "@/content";
import { useGraphShellPersistence } from "@/components/graph/GraphShellPersistence";

/**
 * √-weight computation for allocation preview.
 * Matches the bidding allocation model: weight = √(staked BETTER).
 */
function computeSqrtWeight(stake: number): number {
  return stake > 0 ? Math.sqrt(stake) : 0;
}

const projectionCaveat: ConfidenceFrame = {
  caveat:
    "All projections are derived from explicit scenario assumptions. They are \"if X, then Y\" illustrations — not predictions or guarantees. Actual outcomes will differ.",
  dependencies: [
    "Terminal Open Access",
    "Social Vaults & vBETTER",
    "Autonomous Strategy Agents",
    "Enterprise Data & API Licensing",
  ],
};

const userInputSource: SourceCue = {
  type: "illustrative",
  label: "Your Inputs",
  note: "These results are based on your entered values and the selected scenario. They are illustrative — not guaranteed.",
};

/** Format a number with appropriate precision */
function formatValue(value: number, unit: string): string {
  if (unit === "$M") {
    return value >= 1
      ? `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}M`
      : `$${(value * 1000).toFixed(0)}K`;
  }
  if (unit === "users" || unit === "agents") {
    return value.toLocaleString("en-US");
  }
  return `${value} ${unit}`;
}



export default function ScenarioSwitcher() {
  const persistence = useGraphShellPersistence();

  // When inside the graph shell, initialize from persisted state;
  // otherwise default to "base" / empty strings for standalone usage.
  const [activeLevel, setActiveLevel] = useState<ScenarioLevel>(
    persistence?.tokenomics.activeLevel ?? "base"
  );

  // User-editable inputs — stored independently from scenario level
  // so they persist across scenario switches (VAL-TOKEN-007)
  const [tokenBalance, setTokenBalance] = useState<string>(
    persistence?.tokenomics.tokenBalance ?? ""
  );
  const [depositAmount, setDepositAmount] = useState<string>(
    persistence?.tokenomics.depositAmount ?? ""
  );

  // Sync local state changes back to the persistence context so they
  // survive surface unmount/remount across graph shell handoffs.
  // We use the stable setTokenomicsState callback from the provider
  // (wrapped in useCallback) so these effects only fire when the
  // actual values change.
  const syncTokenomics = persistence?.setTokenomicsState;

  useEffect(() => {
    syncTokenomics?.({ activeLevel });
  }, [activeLevel, syncTokenomics]);

  useEffect(() => {
    syncTokenomics?.({ tokenBalance });
  }, [tokenBalance, syncTokenomics]);

  useEffect(() => {
    syncTokenomics?.({ depositAmount });
  }, [depositAmount, syncTokenomics]);

  const handleScenarioChange = useCallback((level: ScenarioLevel) => {
    setActiveLevel(level);
  }, []);

  const activeScenario = getScenario(activeLevel);
  const projectionValues = getProjectionValues(activeLevel);

  // Derived values from user inputs
  const parsedBalance = useMemo(
    () => (tokenBalance ? Number(tokenBalance) : 0),
    [tokenBalance]
  );
  const parsedDeposit = useMemo(
    () => (depositAmount ? Number(depositAmount) : 0),
    [depositAmount]
  );
  const resolvedTier = useMemo(
    () => getTierForBalance(parsedBalance),
    [parsedBalance]
  );
  const sqrtWeight = computeSqrtWeight(parsedBalance);
  const sqrtWeightFormatted = sqrtWeight > 0 ? Math.round(sqrtWeight).toLocaleString("en-US") : "0";

  return (
    <div data-testid="scenario-switcher">
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        Scenario Projections
      </h3>
      <p className="mb-4 text-sm text-secondary">
        Explore three projection scenarios across prediction markets,
        Hyperliquid/HyperEVM, social vaults, AI-agent tooling, and enterprise
        revenue. Switching scenarios updates all outputs while showing exactly
        which assumptions changed.
      </p>

      {/* Scenario tabs */}
      <div
        className="mb-6 flex gap-2"
        role="tablist"
        aria-label="Projection scenario selector"
        data-testid="scenario-tabs"
      >
        {(["conservative", "base", "upside"] as ScenarioLevel[]).map((level) => (
          <button
            key={level}
            type="button"
            role="tab"
            aria-selected={activeLevel === level}
            aria-controls={`scenario-panel-${level}`}
            onClick={() => handleScenarioChange(level)}
            className={`flex-1 rounded-lg px-4 py-3 text-center font-terminal text-sm font-medium transition-all ${
              activeLevel === level
                ? "text-accent ring-1 ring-[rgba(69,94,255,0.30)]"
                : "text-secondary hover:text-foreground"
            }`}
            style={{
              background: activeLevel === level ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.10)",
              border: "1px solid rgba(255, 255, 255, 0.20)",
            }}
            data-testid="scenario-tab"
            data-scenario={level}
          >
            {SCENARIO_LEVEL_LABELS[level]}
          </button>
        ))}
      </div>

      {/* User-editable inputs — persisted independently from scenario level */}
      <LiquidMetalCard
        className="mb-6 p-4"
        data-testid="user-inputs-panel"
      >
        <h4 className="mb-3 font-terminal text-sm font-semibold uppercase tracking-wider text-muted">
          Your Position
        </h4>
        <p className="mb-3 text-xs text-muted">
          Enter your token balance and a hypothetical vault deposit to see how
          your tier and allocation would look under each scenario. These inputs
          persist when you switch scenarios.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="user-token-balance"
              className="mb-1 block font-terminal text-xs font-medium uppercase tracking-wider text-muted"
            >
              Token Balance (BETTER)
            </label>
            <input
              id="user-token-balance"
              type="number"
              min="0"
              step="1"
              value={tokenBalance}
              onChange={(e) => setTokenBalance(e.target.value)}
              placeholder="e.g. 500000"
              className="w-full rounded border border-border bg-background px-3 py-2 font-terminal text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              data-testid="user-input-token-balance"
            />
          </div>
          <div>
            <label
              htmlFor="user-deposit-amount"
              className="mb-1 block font-terminal text-xs font-medium uppercase tracking-wider text-muted"
            >
              Vault Deposit ($)
            </label>
            <input
              id="user-deposit-amount"
              type="number"
              min="0"
              step="1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="e.g. 10000"
              className="w-full rounded border border-border bg-background px-3 py-2 font-terminal text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              data-testid="user-input-deposit-amount"
            />
          </div>
        </div>

        {/* Allocation preview — only shown when user has entered values */}
        {(parsedBalance > 0 || parsedDeposit > 0) && (
          <div className="mt-4" data-testid="allocation-preview">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-border/50 bg-background px-3 py-2">
                <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                  Your Tier
                </span>
                <span
                  className="font-semibold text-accent"
                  data-testid="resolved-tier-name"
                >
                  {resolvedTier.name}
                </span>
              </div>
              <div className="rounded border border-border/50 bg-background px-3 py-2">
                <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                  √-Weight
                </span>
                <span className="font-terminal text-secondary">
                  {sqrtWeightFormatted}
                </span>
              </div>
              {parsedBalance >= 100_000 && (
                <div className="rounded border border-border/50 bg-background px-3 py-2">
                  <span className="block font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
                    Vault Eligible
                  </span>
                  <span className="font-terminal font-semibold text-accent">
                    ✓ Qualifies
                  </span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <EvidenceHook source={userInputSource} />
            </div>
          </div>
        )}
      </LiquidMetalCard>

      {/* Active scenario panel */}
      <div
        id={`scenario-panel-${activeLevel}`}
        role="tabpanel"
        aria-label={`${SCENARIO_LEVEL_LABELS[activeLevel]} scenario`}
        data-testid="scenario-panel"
      >
        {/* Scenario description */}
        <LiquidMetalCard className="mb-6 p-4">
          <h4 className="mb-1 font-terminal text-sm font-semibold text-accent">
            {activeScenario.label} Scenario
          </h4>
          <p className="text-sm text-secondary">{activeScenario.description}</p>
        </LiquidMetalCard>

        {/* Assumptions panel */}
        <div className="mb-6" data-testid="assumptions-panel">
          <h4 className="mb-3 font-terminal text-sm font-semibold uppercase tracking-wider text-muted">
            Assumptions
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeScenario.assumptions.map((assumption) => (
              <LiquidMetalCard
                key={assumption.dimension}
                className="p-3"
                data-testid="assumption-card"
              >
                <span className="font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                  {SCENARIO_DIMENSION_LABELS[assumption.dimension]}
                </span>
                <div className="mt-1 font-terminal text-lg font-semibold text-accent">
                  {assumption.value}{" "}
                  <span className="text-xs font-normal text-secondary">
                    {assumption.unit}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{assumption.description}</p>
                <div className="mt-2">
                  <EvidenceHook source={assumption.source} />
                </div>
              </LiquidMetalCard>
            ))}
          </div>
        </div>

        {/* Projection outputs */}
        <div data-testid="projection-outputs">
          <h4 className="mb-3 font-terminal text-sm font-semibold uppercase tracking-wider text-muted">
            Projected Outcomes ({SCENARIO_LEVEL_LABELS[activeLevel]})
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTION_OUTPUTS.map((projection, index) => (
              <ProjectionCard
                key={projection.metric}
                projection={projection}
                value={projectionValues[index].value}
              />
            ))}
          </div>
        </div>

        {/* Cross-scenario comparison table */}
        <div className="mt-6" data-testid="projection-comparison">
          <h4 className="mb-3 font-terminal text-sm font-semibold uppercase tracking-wider text-muted">
            Cross-Scenario Comparison
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 font-terminal text-xs font-medium uppercase tracking-wider text-muted">
                    Metric
                  </th>
                  {(["conservative", "base", "upside"] as ScenarioLevel[]).map(
                    (level) => (
                      <th
                        key={level}
                        className={`pb-2 pr-4 text-right font-terminal text-xs font-medium uppercase tracking-wider ${
                          level === activeLevel ? "text-accent" : "text-muted"
                        }`}
                      >
                        {SCENARIO_LEVEL_LABELS[level]}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {PROJECTION_OUTPUTS.map((p) => (
                  <tr key={p.metric} className="border-b border-border/50">
                    <td className="py-2.5 pr-4 text-foreground">{p.metric}</td>
                    {(["conservative", "base", "upside"] as ScenarioLevel[]).map(
                      (level) => (
                        <td
                          key={level}
                          className={`py-2.5 pr-4 text-right font-terminal ${
                            level === activeLevel
                              ? "font-semibold text-accent"
                              : "text-secondary"
                          }`}
                        >
                          {formatValue(p[level], p.unit)}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CaveatFrame confidence={projectionCaveat} className="mt-4" />
    </div>
  );
}

function ProjectionCard({
  projection,
  value,
}: {
  projection: ProjectionOutput;
  value: number;
}) {
  // Resolve dependency labels
  const dependencyLabels = projection.dependsOn
    .map((depId) => {
      const node = getNodeById(depId);
      return node ? node.title : depId;
    })
    .slice(0, 3);

  return (
    <LiquidMetalCard
      className="p-4"
      data-testid="projection-card"
    >
      <span className="font-terminal text-xs font-medium uppercase tracking-wider text-muted">
        {projection.metric}
      </span>
      <div className="mt-1 font-terminal text-2xl font-bold text-accent">
        {formatValue(value, projection.unit)}
      </div>
      <div className="mt-2">
        <EvidenceHook source={projection.source} />
      </div>
      {dependencyLabels.length > 0 && (
        <div className="mt-2">
          <span className="font-terminal text-[10px] font-medium uppercase tracking-wider text-muted">
            Depends on:
          </span>
          <p className="text-xs text-muted">
            {dependencyLabels.join(", ")}
          </p>
        </div>
      )}
    </LiquidMetalCard>
  );
}
