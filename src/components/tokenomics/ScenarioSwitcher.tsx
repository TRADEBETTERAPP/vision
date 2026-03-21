"use client";

/**
 * Scenario Switcher — VAL-TOKEN-007, VAL-TOKEN-008
 *
 * Allows switching between conservative, base, and upside scenarios.
 * Updates all dependent outputs while preserving user inputs.
 * Exposes the assumptions that change across dimensions.
 */

import React, { useState, useCallback } from "react";
import {
  PROJECTION_OUTPUTS,
  SCENARIO_DIMENSION_LABELS,
  SCENARIO_LEVEL_LABELS,
  getScenario,
  getProjectionValues,
  getNodeById,
  type ScenarioLevel,
  type ProjectionOutput,
} from "@/content";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import type { ConfidenceFrame } from "@/content";

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
  const [activeLevel, setActiveLevel] = useState<ScenarioLevel>("base");

  const handleScenarioChange = useCallback((level: ScenarioLevel) => {
    setActiveLevel(level);
  }, []);

  const activeScenario = getScenario(activeLevel);
  const projectionValues = getProjectionValues(activeLevel);

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
            className={`flex-1 rounded-lg border px-4 py-3 text-center font-terminal text-sm font-medium transition-all ${
              activeLevel === level
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-surface text-secondary hover:border-border-active hover:text-foreground"
            }`}
            data-testid="scenario-tab"
            data-scenario={level}
          >
            {SCENARIO_LEVEL_LABELS[level]}
          </button>
        ))}
      </div>

      {/* Active scenario panel */}
      <div
        id={`scenario-panel-${activeLevel}`}
        role="tabpanel"
        aria-label={`${SCENARIO_LEVEL_LABELS[activeLevel]} scenario`}
        data-testid="scenario-panel"
      >
        {/* Scenario description */}
        <div className="mb-6 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <h4 className="mb-1 font-terminal text-sm font-semibold text-accent">
            {activeScenario.label} Scenario
          </h4>
          <p className="text-sm text-secondary">{activeScenario.description}</p>
        </div>

        {/* Assumptions panel */}
        <div className="mb-6" data-testid="assumptions-panel">
          <h4 className="mb-3 font-terminal text-sm font-semibold uppercase tracking-wider text-muted">
            Assumptions
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activeScenario.assumptions.map((assumption) => (
              <div
                key={assumption.dimension}
                className="rounded-lg border border-border bg-surface p-3"
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
              </div>
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
    <div
      className="rounded-lg border border-border bg-surface p-4"
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
    </div>
  );
}
