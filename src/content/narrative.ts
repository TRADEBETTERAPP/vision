/**
 * Seed data: Narrative blocks for the BETTER vision site.
 *
 * These blocks power the hero, current-scope, live-vs-vision framing,
 * and sectional narrative content. Every block carries maturity status,
 * source cues, and confidence framing where appropriate.
 */

import { NarrativeBlock } from "./types";

export const NARRATIVE_BLOCKS: NarrativeBlock[] = [
  // -----------------------------------------------------------------------
  // Hero surface
  // -----------------------------------------------------------------------
  {
    id: "hero-definition",
    surface: "hero",
    title: "What is BETTER?",
    body: "BETTER is a prediction-market intelligence platform that combines AI-powered signal discovery with one-click copy trading on Polymarket. It gives traders — from curious newcomers to committed whales — faster access to market-moving predictions and automated execution, all gated by BETTER token holdings.",
    status: "live",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      href: "https://docs.betteragent.ai",
      asOf: "2026-Q1",
    },
    order: 1,
  },
  {
    id: "hero-live-today",
    surface: "hero",
    title: "Live Today",
    body: "The BETTER Terminal is live in closed beta with AI signal discovery, one/two-click Polymarket copy trading, Lite Mode (halved token requirement with a 2% per-fill fee), and community signal sharing. Token access gating and the permanent FDV ratchet are active on-chain.",
    status: "live",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      href: "https://docs.betteragent.ai",
      asOf: "2026-Q1",
    },
    order: 2,
  },
  {
    id: "hero-vision",
    surface: "hero",
    title: "The Vision Ahead",
    body: "Beyond the current Terminal, BETTER is building toward social vaults with community-managed strategies, autonomous AI trading agents, whale-first access tiers, a Hyperliquid/HyperEVM expansion, and enterprise data licensing — scaling from a single-product trading tool into a full-stack prediction-market ecosystem.",
    status: "planned",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Roadmap items span in-progress, planned, and speculative stages. None are guaranteed.",
    },
    confidence: {
      caveat:
        "These are directional ambitions, not commitments. Timelines, scope, and feasibility depend on market conditions, technical execution, and adoption.",
      dependencies: ["pe-terminal-open", "pe-social-vaults", "ti-hyperevm-phase1"],
    },
    order: 3,
  },

  // -----------------------------------------------------------------------
  // Current scope surface
  // -----------------------------------------------------------------------
  {
    id: "scope-terminal",
    surface: "current_scope",
    title: "BETTER Terminal (Closed Beta)",
    body: "AI-powered signal discovery and one/two-click Polymarket copy trading. The core live product today. Access requires holding BETTER tokens above the current gate threshold.",
    status: "live",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      href: "https://docs.betteragent.ai",
      asOf: "2026-Q1",
    },
    order: 1,
  },
  {
    id: "scope-lite-mode",
    surface: "current_scope",
    title: "Lite Mode",
    body: "Halves the Terminal token requirement and charges a 2% nominal per-fill fee. An accessible onramp for smaller holders.",
    status: "live",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      href: "https://docs.betteragent.ai",
      asOf: "2026-Q1",
      note: "Lite Mode is live with a 2% per-fill fee.",
    },
    order: 2,
  },
  {
    id: "scope-access-gate",
    surface: "current_scope",
    title: "Token Access Gate & FDV Ratchet",
    body: "Minimum BETTER token holding required for Terminal access. The permanent FDV ratchet lowers the threshold at new FDV milestones — once lowered, it never increases, even if FDV later declines.",
    status: "live",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      href: "https://docs.betteragent.ai",
      asOf: "2026-Q1",
    },
    order: 3,
  },
  {
    id: "scope-trading-tax",
    surface: "current_scope",
    title: "Trading Tax Revenue",
    body: "2% buy and 2% sell tax on the Aerodrome LP path. The primary treasury funding mechanism today.",
    status: "live",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      href: "https://docs.betteragent.ai",
      asOf: "2026-Q1",
    },
    order: 4,
  },
  {
    id: "scope-community",
    surface: "current_scope",
    title: "Community Signal Sharing",
    body: "Community-driven signal sharing and social coordination around Terminal predictions.",
    status: "live",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      href: "https://docs.betteragent.ai",
      asOf: "2026-Q1",
    },
    order: 5,
  },

  // -----------------------------------------------------------------------
  // Vision / roadmap narrative blocks
  // -----------------------------------------------------------------------
  {
    id: "vision-social-vaults",
    surface: "vision",
    title: "Social Vaults & vBETTER",
    body: "Community-managed vaults with vBETTER staking and social coordination for collective alpha. Vault performance fees align manager incentives with depositor outcomes.",
    status: "in_progress",
    source: {
      type: "canonical",
      label: "BETTER Docs & Whitepaper",
      asOf: "2026-Q1",
      note: "Vaults and vBETTER are in active development.",
    },
    confidence: {
      caveat: "Vault mechanics are under active development and may evolve before launch.",
      dependencies: ["pe-social-vaults"],
    },
    order: 1,
  },
  {
    id: "vision-whale-tiers",
    surface: "vision",
    title: "Whale-First Tier Ladder",
    body: "A multi-tier access structure where higher BETTER holdings unlock better access priority, allocation priority, preview priority, higher agent limits, and fee advantages. Designed to reward long-term committed holders.",
    status: "in_progress",
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      asOf: "2026-Q1",
      note: "Tier structure is being finalized.",
    },
    confidence: {
      caveat: "Exact thresholds and tier benefits are subject to adjustment before launch.",
      dependencies: ["tu-whale-tiers"],
    },
    order: 2,
  },
  {
    id: "vision-hyperevm",
    surface: "vision",
    title: "Hyperliquid / HyperEVM Expansion",
    body: "Deploy BETTER contracts on HyperEVM for Hyperliquid-native prediction markets and cross-chain execution, opening access to Hyperliquid's deep liquidity.",
    status: "in_progress",
    source: {
      type: "canonical",
      label: "BETTER Docs & Whitepaper",
      asOf: "2026-Q1",
    },
    confidence: {
      caveat: "HyperEVM deployment timeline depends on chain readiness and audit completion.",
      dependencies: ["ti-hyperevm-phase1"],
    },
    order: 3,
  },
  {
    id: "vision-strategy-agents",
    surface: "vision",
    title: "Autonomous Strategy Agents",
    body: "AI agents that execute prediction-market strategies autonomously with user-defined risk parameters, enabling 24/7 trading without manual intervention.",
    status: "planned",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Planned product expansion.",
    },
    confidence: {
      caveat: "Depends on Terminal open access, vault infrastructure, and agent safety frameworks. Not yet in active development.",
      dependencies: ["pe-strategy-agents"],
    },
    order: 4,
  },
  {
    id: "vision-enterprise",
    surface: "vision",
    title: "Enterprise Data & API Licensing",
    body: "License BETTER's prediction-market intelligence and signal models to institutional clients through enterprise-grade data pipelines and premium API lanes.",
    status: "planned",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Future-facing product line requiring mature AI/RL models.",
    },
    confidence: {
      caveat: "Enterprise revenue requires mature models, sufficient data credibility, and institutional demand validation.",
      dependencies: ["pe-b2b-data", "ti-data-pipeline-phase2"],
    },
    order: 5,
  },
  {
    id: "vision-agent-ecosystem",
    surface: "vision",
    title: "Agent-Native Ecosystem",
    body: "Bonded agent registry, delegation mechanics, research bounties, LLM inference credits, and premium API lanes — turning BETTER tokens into the fuel for an autonomous prediction-market agent economy.",
    status: "speculative",
    source: {
      type: "illustrative",
      label: "BETTER Vision",
      note: "Speculative long-range exploration of agent-native token utility.",
    },
    confidence: {
      caveat: "These are exploratory ideas representing maximum ambition — none are committed to a timeline or guaranteed to ship.",
      dependencies: ["tu-agent-utility", "sa-bonded-agents", "sa-delegation"],
    },
    order: 6,
  },
];

/** Get narrative blocks for a specific surface, sorted by order */
export function getBlocksBySurface(surface: string): NarrativeBlock[] {
  return NARRATIVE_BLOCKS
    .filter((b) => b.surface === surface)
    .sort((a, b) => a.order - b.order);
}

/** Get a specific narrative block by ID */
export function getBlockById(id: string): NarrativeBlock | undefined {
  return NARRATIVE_BLOCKS.find((b) => b.id === id);
}
