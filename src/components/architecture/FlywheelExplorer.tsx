"use client";

/**
 * Flywheel Explorer — Interactive BETTER flywheel visualization.
 *
 * Satisfies VAL-VISUAL-009:
 * - Shows how infrastructure evolution, product layers, revenue lines,
 *   and token sinks compound into the broader BETTER flywheel
 * - Explorable rather than buried in static copy
 */

import React, { useState, useCallback } from "react";
import MaturityBadge from "@/components/MaturityBadge";
import CaveatFrame from "@/components/CaveatFrame";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";
import type { MaturityStatus } from "@/content";

// ---------------------------------------------------------------------------
// Flywheel node data
// ---------------------------------------------------------------------------

interface FlywheelNode {
  id: string;
  title: string;
  category: "infrastructure" | "product" | "revenue" | "token";
  status: MaturityStatus;
  summary: string;
  detail: string;
  feedsInto: string[];
}

const FLYWHEEL_NODES: FlywheelNode[] = [
  {
    id: "fw-infra-ai",
    title: "AI / RL Infrastructure",
    category: "infrastructure",
    status: "live",
    summary:
      "Foundation models generate prediction signals. Proprietary training improves signal quality over time.",
    detail:
      "Accumulated prediction-market data creates a compounding data moat. Better models attract more users, who generate more data, further improving models. This creates a self-reinforcing intelligence advantage that competitors cannot easily replicate without equivalent data accumulation.",
    feedsInto: ["fw-product-terminal", "fw-product-vaults", "fw-product-agents"],
  },
  {
    id: "fw-infra-execution",
    title: "Execution Infrastructure",
    category: "infrastructure",
    status: "planned",
    summary:
      "Co-location and FPGA acceleration provide structural speed advantages for BETTER agents.",
    detail:
      "Low-latency execution allows BETTER agents to capture opportunities before competitors. Speed advantages compound with intelligence advantages — fast execution of better signals produces superior returns, attracting more capital and users to the ecosystem.",
    feedsInto: ["fw-product-vaults", "fw-product-agents", "fw-revenue-whale"],
  },
  {
    id: "fw-infra-chain",
    title: "Chain Infrastructure",
    category: "infrastructure",
    status: "in_progress",
    summary:
      "HyperEVM deployment and Polygon nodes provide direct chain access and reduced latency.",
    detail:
      "Direct chain infrastructure reduces dependency on third-party RPCs, lowers settlement costs, and enables protocol-level participation. Validator operations add staking rewards that feed back into infrastructure funding, creating a self-sustaining infrastructure loop.",
    feedsInto: ["fw-product-terminal", "fw-revenue-consumer"],
  },
  {
    id: "fw-product-terminal",
    title: "BETTER Terminal & Products",
    category: "product",
    status: "live",
    summary:
      "Signal discovery, copy trading, and Lite Mode drive user adoption and trading volume.",
    detail:
      "Terminal is the user-facing entry point. As signal quality improves (from better AI) and execution speed increases (from infrastructure investment), more users join. More users generate more fees, more data, and more demand for BETTER tokens — feeding the entire flywheel.",
    feedsInto: ["fw-revenue-consumer", "fw-token-demand"],
  },
  {
    id: "fw-product-vaults",
    title: "Social Vaults & vBETTER",
    category: "product",
    status: "in_progress",
    summary:
      "Community-managed vaults with vBETTER staking create social trading layers and performance-fee revenue.",
    detail:
      "Social vaults let users deposit into community-managed pools. Vault managers earn performance fees aligned with depositor outcomes, creating a social coordination loop. More capital under management attracts better vault managers, who create better strategies, attracting more capital — a product-level flywheel within the broader ecosystem. vBETTER staking adds community engagement mechanics.",
    feedsInto: ["fw-product-agents", "fw-revenue-whale", "fw-token-demand"],
  },
  {
    id: "fw-product-agents",
    title: "Autonomous Strategy Agents",
    category: "product",
    status: "planned",
    summary:
      "AI agents that execute prediction-market strategies autonomously with user-defined risk parameters.",
    detail:
      "Agents automate complex trading strategies using AI-driven signals and user-defined risk parameters. Agent bonds and delegation mechanics create new fee streams. Better agents attract more capital, which funds better models, which produce better agents — a compounding intelligence-and-capital loop. Depends on vault infrastructure and agent safety frameworks being production-ready.",
    feedsInto: ["fw-revenue-whale", "fw-token-demand", "fw-revenue-enterprise"],
  },
  {
    id: "fw-revenue-consumer",
    title: "Consumer Revenue",
    category: "revenue",
    status: "live",
    summary:
      "Trading taxes, Lite Mode fees, and standard access generate the baseline revenue stream.",
    detail:
      "Consumer revenue is the foundation. Trading taxes (2% buy/sell) and Lite Mode per-fill fees (2%) flow to the protocol treasury. This revenue funds infrastructure expansion, which improves products, which attracts more users, generating more consumer revenue.",
    feedsInto: ["fw-infra-ai", "fw-infra-chain"],
  },
  {
    id: "fw-revenue-whale",
    title: "Whale & Pro Revenue",
    category: "revenue",
    status: "planned",
    summary:
      "Whale-tier fee advantages, priority vault allocations, and premium subscriptions are designed to generate high-margin revenue from committed holders.",
    detail:
      "Whale-first design creates premium demand for BETTER tokens. Priority access, allocation, and fee advantages drive large-scale token acquisition and holding. Performance fees from whale-managed vaults and agent delegation bonds create high-margin revenue. Premium subscriptions add recurring revenue. These revenue streams depend on the whale-first tier ladder and vault infrastructure reaching production readiness.",
    feedsInto: ["fw-token-demand", "fw-infra-execution"],
  },
  {
    id: "fw-revenue-enterprise",
    title: "Enterprise Revenue",
    category: "revenue",
    status: "planned",
    summary:
      "B2B data licensing, premium API access, and custom model packages diversify revenue.",
    detail:
      "Institutional clients pay for data, API access, and model licensing. This high-margin B2B revenue is less dependent on token price and market conditions. Enterprise revenue provides a stable funding base for long-term infrastructure investment, reducing the ecosystem's reliance on speculative market cycles.",
    feedsInto: ["fw-infra-ai", "fw-infra-execution"],
  },
  {
    id: "fw-token-demand",
    title: "Token Demand & Sinks",
    category: "token",
    status: "live",
    summary:
      "Access gates, whale tiers, vault deposits, and agent bonds create structural token demand.",
    detail:
      "Every product layer creates token demand: Terminal access requires holding BETTER, whale tiers require larger holdings, vault deposits lock tokens, agent bonds require staking. Buy taxes reduce circulating supply. This structural demand supports token price, which sustains FDV-ratcheted access levels, which maintains the access-gate value proposition — a self-reinforcing token economics loop.",
    feedsInto: ["fw-infra-ai", "fw-infra-chain", "fw-infra-execution"],
  },
];

// Category styling
const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  infrastructure: { bg: "bg-white/[0.06] border-white/15", text: "text-[#e6e6e6]", label: "Infrastructure" },
  product: { bg: "bg-accent/10 border-accent/30", text: "text-accent", label: "Product" },
  revenue: { bg: "bg-white/5 border-white/15", text: "text-[#a0a0a0]", label: "Revenue" },
  token: { bg: "bg-white/[0.03] border-white/10", text: "text-[#707070]", label: "Token" },
};

function getNodeTitle(id: string): string {
  return FLYWHEEL_NODES.find((n) => n.id === id)?.title ?? id;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FlywheelExplorer() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  }, []);

  const selectedNode = selectedNodeId
    ? FLYWHEEL_NODES.find((n) => n.id === selectedNodeId) ?? null
    : null;

  return (
    <div data-testid="flywheel-explorer">
      <h3 className="mb-1 text-lg font-semibold text-foreground">
        The BETTER Flywheel
      </h3>
      <p className="mb-6 text-sm text-secondary">
        How infrastructure evolution, product layers, revenue lines, and token sinks
        compound into a self-reinforcing ecosystem. Click any node to explore how it
        connects to the rest of the flywheel.
      </p>

      {/* Flywheel grid by category */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(["infrastructure", "product", "revenue", "token"] as const).map((category) => {
          const style = CATEGORY_STYLES[category];
          const nodes = FLYWHEEL_NODES.filter((n) => n.category === category);

          return (
            <div key={category}>
              <p className={`mb-2 font-terminal text-xs font-medium uppercase tracking-widest ${style.text}`}>
                {style.label}
              </p>
              <div className="space-y-2">
                {nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <LiquidMetalCard
                      key={node.id}
                      as="button"
                      variant={isSelected ? "active" : "default"}
                      onClick={() => handleNodeClick(node.id)}
                      aria-pressed={isSelected}
                      className="w-full p-3 text-left transition-all"
                      data-testid="flywheel-node"
                      data-node-id={node.id}
                    >
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {node.title}
                        </span>
                        <MaturityBadge
                          status={node.status}
                          className="text-[10px]"
                        />
                      </div>
                      <p className="text-xs text-muted line-clamp-2">
                        {node.summary}
                      </p>
                    </LiquidMetalCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected node detail panel */}
      {selectedNode && (
        <LiquidMetalCard
          variant="active"
          className="mt-6 p-5"
          data-testid="flywheel-detail"
          role="region"
          aria-label={`Flywheel detail for ${selectedNode.title}`}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`font-terminal text-xs font-medium uppercase tracking-widest ${
                CATEGORY_STYLES[selectedNode.category].text
              }`}
            >
              {CATEGORY_STYLES[selectedNode.category].label}
            </span>
            <MaturityBadge status={selectedNode.status} />
          </div>

          <h4 className="mb-2 text-lg font-bold text-foreground">
            {selectedNode.title}
          </h4>
          <p className="mb-4 text-sm leading-relaxed text-secondary">
            {selectedNode.detail}
          </p>

          {/* Feeds into */}
          {selectedNode.feedsInto.length > 0 && (
            <LiquidMetalCard className="px-3 py-2">
              <p className="text-xs text-accent">
                <span className="mr-1 font-terminal font-semibold">
                  Feeds into:
                </span>
                {selectedNode.feedsInto
                  .map((id) => getNodeTitle(id))
                  .join(" → ")}
              </p>
            </LiquidMetalCard>
          )}

          {/* Which nodes feed into this one */}
          {(() => {
            const feedsFrom = FLYWHEEL_NODES.filter((n) =>
              n.feedsInto.includes(selectedNode.id)
            );
            if (feedsFrom.length === 0) return null;
            return (
              <LiquidMetalCard className="mt-2 px-3 py-2">
                <p className="text-xs text-[#e6e6e6]">
                  <span className="mr-1 font-terminal font-semibold">
                    Fed by:
                  </span>
                  {feedsFrom.map((n) => n.title).join(", ")}
                </p>
              </LiquidMetalCard>
            );
          })()}
        </LiquidMetalCard>
      )}

      <CaveatFrame
        confidence={{
          caveat:
            "The flywheel represents the intended compounding dynamics of the BETTER ecosystem. Actual flywheel velocity depends on market conditions, product adoption, infrastructure delivery, and token demand.",
          dependencies: [
            "Product adoption reaches critical mass for data-moat effects",
            "Infrastructure investment funded by sufficient revenue growth",
            "Token demand sustained by genuine utility rather than speculation",
          ],
        }}
        className="mt-4"
      />
    </div>
  );
}
