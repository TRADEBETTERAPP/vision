"use client";

/**
 * Cost Band Explorer — Infrastructure cost-band visualization.
 *
 * Satisfies VAL-VISUAL-007:
 * - Shows phased cost ranges rather than false precision
 * - Each phase has an assumption basis (hook) and capability unlock
 * - Stable dependency identifiers link phases together
 * - Subsystems are expandable for exploration
 */

import React, { useState, useCallback } from "react";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";
import { COST_BAND_MODELS, getPhaseLabel, type CostBandModel, type CostBandPhase } from "@/content";

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value}`;
}

function formatRange(low: number, high: number): string {
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
}

export default function CostBandExplorer() {
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({});

  const toggleSubsystem = useCallback((subsystem: string) => {
    setExpandedSubs((prev) => ({
      ...prev,
      [subsystem]: !prev[subsystem],
    }));
  }, []);

  // Total infrastructure range
  const totalLow = COST_BAND_MODELS.reduce((s, m) => s + m.totalRangeLow, 0);
  const totalHigh = COST_BAND_MODELS.reduce((s, m) => s + m.totalRangeHigh, 0);

  return (
    <div data-testid="cost-band-explorer">
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        Infrastructure Cost Bands
      </h3>
      <p className="mb-2 text-sm text-secondary">
        Rough order-of-magnitude ranges for each infrastructure subsystem — not
        budgets. Each phase shows its assumption basis and the capability it unlocks.
      </p>
      <p className="mb-6 font-terminal text-xs text-muted">
        Total estimated range across all subsystems:{" "}
        <span className="text-accent">{formatRange(totalLow, totalHigh)}</span>
      </p>

      <div className="space-y-3">
        {COST_BAND_MODELS.map((model) => (
          <SubsystemCostBand
            key={model.subsystem}
            model={model}
            isExpanded={!!expandedSubs[model.subsystem]}
            onToggle={() => toggleSubsystem(model.subsystem)}
          />
        ))}
      </div>

      <CaveatFrame
        confidence={{
          caveat:
            "All cost estimates are rough order-of-magnitude ranges — not budgets or commitments. Actual costs depend on vendor selection, timing, scale decisions, and market conditions.",
          dependencies: [
            "Revenue growth sufficient to fund phased expansion",
            "Technical feasibility validated at each phase gate",
            "Market conditions supportive of infrastructure investment",
          ],
        }}
        className="mt-4"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Individual subsystem cost band
// ---------------------------------------------------------------------------

function SubsystemCostBand({
  model,
  isExpanded,
  onToggle,
}: {
  model: CostBandModel;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  // Determine aggregate maturity — pick the most advanced live status
  const statusPriority: Record<string, number> = {
    live: 0,
    in_progress: 1,
    planned: 2,
    speculative: 3,
  };
  const bestPhase = [...model.phases].sort(
    (a, b) => statusPriority[a.status] - statusPriority[b.status]
  )[0];

  return (
    <LiquidMetalCard>
      {/* Toggle header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-label={model.title}
        className={`flex w-full items-center gap-3 p-4 text-left transition-all ${
          isExpanded
            ? "border-b border-border"
            : "hover:bg-elevated"
        }`}
        data-testid="cost-band-toggle"
      >
        <span
          className={`shrink-0 font-terminal text-sm text-accent transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
          aria-hidden="true"
        >
          ▸
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">{model.title}</span>
            <MaturityBadge status={bestPhase.status} />
          </div>
          <span className="font-terminal text-xs text-muted">
            {model.phases.length} phases · {formatRange(model.totalRangeLow, model.totalRangeHigh)}
          </span>
        </div>
      </button>

      {/* Expanded phases */}
      {isExpanded && (
        <div className="space-y-3 p-4">
          {model.phases.map((phase, i) => (
            <PhaseCard key={phase.name} phase={phase} index={i} />
          ))}
        </div>
      )}
    </LiquidMetalCard>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Individual phase card
// ---------------------------------------------------------------------------

function PhaseCard({ phase, index }: { phase: CostBandPhase; index: number }) {
  return (
    <div
      className="rounded-md border border-border bg-background p-3"
      data-testid="cost-band-phase"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-terminal text-xs text-muted" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h5 className="text-sm font-semibold text-foreground">{phase.name}</h5>
        <MaturityBadge status={phase.status} className="text-[10px]" />
      </div>

      {/* Cost range */}
      <div className="mb-2" data-testid="cost-range">
        <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
          Cost Range
        </span>
        <p className="text-sm text-foreground">
          {formatRange(phase.costLow, phase.costHigh)}
        </p>
      </div>

      {/* Assumption basis */}
      <div className="mb-2" data-testid="assumption-basis">
        <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent-warn">
          Assumption Basis
        </span>
        <p className="text-sm text-secondary">{phase.assumptionBasis}</p>
      </div>

      {/* Capability unlock */}
      <div className="mb-2" data-testid="capability-unlock">
        <span className="font-terminal text-xs font-medium uppercase tracking-wider text-accent">
          Capability Unlock
        </span>
        <p className="text-sm text-secondary">{phase.capabilityUnlock}</p>
      </div>

      {/* Dependencies */}
      {phase.dependencies.length > 0 && (
        <p className="mb-2 text-xs text-muted" data-testid="phase-dependency">
          <span className="font-terminal font-medium">Requires:</span>{" "}
          {phase.dependencies.map((depId) => getPhaseLabel(depId)).join(", ")}
        </p>
      )}

      <EvidenceHook source={phase.source} />
    </div>
  );
}
