/**
 * Stack Layers — The BETTER technical architecture visualization.
 *
 * Surfaces each required stack layer with:
 * - Plain-language role description
 * - Maturity badge (live / in progress / planned / speculative)
 * - Dependency sequencing showing what each layer depends on
 *
 * VAL-VISUAL-005: Clearly represents Hyperliquid/HyperEVM, OpenServ/BRAID,
 * LLM/RL systems, Polygon node/validator, and low-latency/colo/FPGA.
 * VAL-VISUAL-006: Users can tell maturity and dependency order.
 */

import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";
import type { MaturityStatus, SourceCue } from "@/content";

// ---------------------------------------------------------------------------
// Architecture layer data
// ---------------------------------------------------------------------------

interface ArchitectureLayer {
  id: string;
  title: string;
  status: MaturityStatus;
  role: string;
  dependsOn: string[];
  source: SourceCue;
}

const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: "hyperevm",
    title: "Hyperliquid / HyperEVM",
    status: "in_progress",
    role:
      "BETTER's primary DeFi execution rail. Smart contracts on HyperEVM enable Hyperliquid-native prediction markets, on-chain settlement, and cross-chain order routing — giving BETTER agents direct access to Hyperliquid's high-throughput order book.",
    dependsOn: [],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "HyperEVM integration is actively being built.",
      asOf: "2026-Q1",
    },
  },
  {
    id: "openserv-braid",
    title: "OpenServ / BRAID",
    status: "in_progress",
    role:
      "Agent orchestration and inter-agent communication layer. OpenServ provides the framework for deploying, coordinating, and composing autonomous BETTER agents. BRAID enables structured collaboration between multiple specialized agents working on different aspects of a prediction.",
    dependsOn: [],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "OpenServ integration is in active development.",
      asOf: "2026-Q1",
    },
  },
  {
    id: "ai-rl-models",
    title: "Proprietary AI / RL Models",
    status: "live",
    role:
      "The intelligence core of BETTER. Foundation models power signal generation today. Phased evolution through proprietary training on accumulated prediction-market data, culminating in full-stack intelligence with LLM fine-tuning and cross-market inference capabilities.",
    dependsOn: [],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Foundation models are operational; proprietary training is planned.",
      asOf: "2026-Q1",
    },
  },
  {
    id: "polygon-validators",
    title: "Polygon Node & Validator Operations",
    status: "planned",
    role:
      "Direct chain infrastructure for Polygon. Full nodes provide reduced RPC latency and independent transaction verification. Validator operations add staking rewards and protocol-level influence, deepening BETTER's network reliability and reducing third-party dependencies.",
    dependsOn: ["hyperevm"],
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Phased deployment depending on scaling requirements.",
    },
  },
  {
    id: "low-latency-fpga",
    title: "Low-Latency / Colo / FPGA Execution",
    status: "speculative",
    role:
      "HFT-grade execution infrastructure. Co-located rack space near major exchange and chain infrastructure provides meaningful speed advantages. FPGA acceleration adds ultra-low-latency execution for BETTER's entire agent fleet — a structural advantage over non-colocated competitors.",
    dependsOn: ["polygon-validators", "hyperevm"],
    source: {
      type: "illustrative",
      label: "BETTER Infrastructure Estimates",
      note: "Long-range ambition — not yet committed to a timeline.",
    },
  },
  {
    id: "data-pipeline",
    title: "Data Pipeline & Market Intelligence",
    status: "live",
    role:
      "The data foundation powering all BETTER intelligence products. Current pipeline handles ingestion, processing, and storage. Planned enterprise-grade evolution adds SLA monitoring, audit trails, API gateway, and institutional-quality data products for B2B licensing.",
    dependsOn: [],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Core collection is live; enterprise pipeline is planned.",
      asOf: "2026-Q1",
    },
  },
];

/** Get readable title from layer ID */
function getLayerTitle(id: string): string {
  return ARCHITECTURE_LAYERS.find((l) => l.id === id)?.title ?? id;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StackLayers() {
  return (
    <div>
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        BETTER Stack Architecture
      </h3>
      <p className="mb-6 text-sm text-secondary">
        The technical layers powering BETTER — from live intelligence infrastructure
        to long-range execution ambitions. Each layer shows its current maturity and
        what it depends on.
      </p>

      <div className="space-y-3">
        {ARCHITECTURE_LAYERS.map((layer) => (
          <LiquidMetalCard
            key={layer.id}
            className="p-4"
            data-testid="architecture-layer"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-foreground" role="heading" aria-level={4}>
                {layer.title}
              </h4>
              <MaturityBadge status={layer.status} />
            </div>

            <p
              className="mb-3 text-sm leading-relaxed text-secondary"
              data-testid="layer-description"
            >
              {layer.role}
            </p>

            {/* Dependency sequencing */}
            {layer.dependsOn.length > 0 && (
              <p
                className="mb-2 text-xs text-muted"
                data-testid="layer-dependency"
              >
                <span className="font-terminal font-medium">Depends on:</span>{" "}
                {layer.dependsOn.map((depId) => getLayerTitle(depId)).join(", ")}
              </p>
            )}

            <EvidenceHook source={layer.source} />
          </LiquidMetalCard>
        ))}
      </div>
    </div>
  );
}
