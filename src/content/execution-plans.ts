/**
 * Per-stage execution plans for primary roadmap stages.
 *
 * Satisfies VAL-ROADMAP-016: Every primary roadmap stage has its own
 * dedicated execution-plan treatment with workstreams, external dependencies,
 * falsifiable proof gates framed as concrete externally observable success
 * criteria, bounded timing windows expressed as ranges or dependency-relative
 * windows, and public confidence labeling using the approved
 * Committed / Planned / Directional vocabulary.
 *
 * The framing explicitly distinguishes internal AI-agent-compressible work
 * from slower outside constraints such as audits, legal review, venue
 * integrations, partnerships, or liquidity proving.
 */

import type { ExecutionPlan } from "./types";

// ---------------------------------------------------------------------------
// Primary Roadmap Stage IDs
// ---------------------------------------------------------------------------

/**
 * The set of roadmap node IDs that constitute "primary roadmap stages."
 * Each of these gets its own dedicated execution-plan treatment rather
 * than sharing a single summary.
 */
const PRIMARY_STAGE_IDS: string[] = [
  // Product Evolution
  "pe-terminal-beta",
  "pe-terminal-open",
  "pe-social-vaults",
  "pe-strategy-agents",
  "pe-b2b-data",
  // Token Utility & Access Tiers
  "tu-whale-tiers",
  "tu-nonlinear-allocation",
  "tu-agent-utility",
  // Revenue Expansion
  "re-vault-performance",
  "re-whale-premium",
  "re-agent-fees",
  "re-enterprise-data",
  // Technical Infrastructure
  "ti-hyperevm-phase1",
  "ti-ai-rl-phase2",
  "ti-polygon-phase1",
  "ti-low-latency-phase1",
  "ti-data-pipeline-phase2",
  // Social & Agent Ecosystem
  "sa-openserv-integration",
  "sa-bonded-agents",
  "sa-delegation",
  "sa-research-bounties",
  "sa-premium-api",
];

export function getPrimaryRoadmapStageIds(): string[] {
  return [...PRIMARY_STAGE_IDS];
}

// ---------------------------------------------------------------------------
// Execution Plan Data
// ---------------------------------------------------------------------------

export const EXECUTION_PLANS: ExecutionPlan[] = [
  // =========================================================================
  // PRODUCT EVOLUTION
  // =========================================================================

  {
    nodeId: "pe-terminal-beta",
    confidenceLabel: "Committed",
    workstreams: [
      {
        label: "Signal pipeline operations",
        nature: "internal",
        description:
          "Maintain and improve the AI signal generation pipeline, model retraining cycles, and backend execution infrastructure. AI-agent-compressible: Droid workflows accelerate iteration on model tuning and deployment automation.",
      },
      {
        label: "User onboarding & beta support",
        nature: "internal",
        description:
          "Manage closed-beta user invitations, support channels, and feedback collection. Internal workflow aided by agent-driven ticket triage.",
      },
      {
        label: "Polymarket venue integration maintenance",
        nature: "external",
        description:
          "Monitor Polymarket API changes, contract upgrades, and market structure shifts. Dependent on Polymarket's own release cadence and Polygon network stability.",
      },
    ],
    externalDependencies: [
      "Polymarket API stability and contract upgrade schedule",
      "Polygon network uptime and gas-cost environment",
    ],
    proofGates: [
      {
        label: "Live trading volume",
        criterion:
          "Terminal processes ≥ 1,000 user-initiated copy trades per week on Polymarket mainnet with verifiable on-chain settlement",
        source: {
          type: "canonical",
          label: "BETTER Docs",
          note: "Terminal is the current live product.",
          asOf: "2026-Q1",
        },
      },
      {
        label: "Signal accuracy benchmark",
        criterion:
          "Published hit-rate or Brier-score metric for top-n Terminal signals exceeds random-baseline by ≥ 15% over a rolling 30-day window",
        source: {
          type: "canonical",
          label: "BETTER Docs",
          asOf: "2026-Q1",
        },
      },
    ],
    timingWindow: {
      display: "Live now — ongoing through Q2 2026",
      lowerBound: "2026-01-01",
      upperBound: "2026-06-30",
      mainConstraint: "Polymarket API stability",
    },
    investorSummary:
      "The Terminal closed beta is the live revenue-generating wedge. Maintaining it proves execution capability and generates the data flywheel feeding all downstream products.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      asOf: "2026-Q1",
    },
  },

  {
    nodeId: "pe-terminal-open",
    confidenceLabel: "Committed",
    workstreams: [
      {
        label: "Scalability engineering",
        nature: "internal",
        description:
          "Horizontally scale backend execution services to handle 10–50× beta traffic. AI-agent-compressible: automated load-testing, config generation, and deployment pipelines.",
      },
      {
        label: "Token-gate calibration",
        nature: "internal",
        description:
          "Tune access-gate thresholds and onboarding UX for broader cohorts while preserving whale-first allocation priority.",
      },
      {
        label: "Security audit & penetration test",
        nature: "external",
        description:
          "Engage a third-party security firm to audit smart contracts and backend services before expanding public access. Not compressible by internal AI agents — requires external audit firm scheduling and review cycles.",
      },
    ],
    externalDependencies: [
      "Third-party security audit firm availability and review timeline (typically 4–8 weeks)",
      "Polymarket rate limits and partner-tier API access",
    ],
    proofGates: [
      {
        label: "Open access launch",
        criterion:
          "Terminal is publicly accessible to any wallet meeting the token-gate threshold, with no waitlist or invite code required",
        source: {
          type: "canonical",
          label: "BETTER Docs",
          asOf: "2026-Q1",
        },
      },
      {
        label: "Audit completion",
        criterion:
          "A named third-party security firm publishes or provides BETTER a completed audit report covering smart-contract and execution-layer surfaces",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "4–8 weeks after security audit completion — targeting Q2 2026",
      lowerBound: "2026-Q2",
      upperBound: "2026-Q2",
      mainConstraint: "Security audit timeline",
    },
    investorSummary:
      "Open access is the growth inflection point. It converts beta traction into a scalable user base and validates the token-gate model at production scale.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      asOf: "2026-Q1",
    },
  },

  {
    nodeId: "pe-social-vaults",
    confidenceLabel: "Committed",
    workstreams: [
      {
        label: "Vault smart contract development",
        nature: "internal",
        description:
          "Build, test, and deploy vault contracts with deposit, withdrawal, profit-sharing, and high-water mark logic. AI-agent-compressible: Droid-accelerated contract generation and automated test coverage.",
      },
      {
        label: "vBETTER staking mechanics",
        nature: "internal",
        description:
          "Implement the vBETTER staking layer that governs vault access priority and social coordination signals.",
      },
      {
        label: "Vault smart contract audit",
        nature: "external",
        description:
          "Independent smart-contract audit of vault deposit, withdrawal, and fee logic. External dependency — audit firm scheduling and multi-week review cycle.",
      },
      {
        label: "Base chain deployment & bridge verification",
        nature: "external",
        description:
          "Deploy vault contracts on Base mainnet and verify cross-chain bridge behavior. Dependent on Base network readiness and bridge security posture.",
      },
    ],
    externalDependencies: [
      "Independent smart-contract audit (4–8 weeks external lead time)",
      "Base chain stability and bridge readiness",
      "Regulatory clarity on vault-like deposit products",
    ],
    proofGates: [
      {
        label: "First vault accepts deposits",
        criterion:
          "The first social vault accepts deposits on Base mainnet from qualifying wallets, with on-chain deposit confirmation visible in a block explorer",
        source: {
          type: "canonical",
          label: "BETTER Docs & Whitepaper",
          asOf: "2026-Q1",
        },
      },
      {
        label: "Performance fee enforcement",
        criterion:
          "Vault performance fee (20% on profit-only withdrawals with wallet-level high-water mark) is enforced on-chain and verifiable through contract state inspection",
        source: {
          type: "canonical",
          label: "BETTER Docs",
          asOf: "2026-Q1",
        },
      },
    ],
    timingWindow: {
      display: "Q2 2026–Q3 2026, dependent on audit completion",
      lowerBound: "2026-Q2",
      upperBound: "2026-Q3",
      mainConstraint: "Smart-contract audit timeline",
    },
    investorSummary:
      "Social vaults unlock the AUM-scaling revenue model. They convert single-wallet trading into pooled capital management and create the social layer for community coordination.",
    source: {
      type: "canonical",
      label: "BETTER Docs & Whitepaper",
      asOf: "2026-Q1",
    },
  },

  {
    nodeId: "pe-strategy-agents",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Agent framework development",
        nature: "internal",
        description:
          "Build the autonomous agent execution framework: strategy definition, risk-parameter enforcement, 24/7 execution loop, and failsafe shutdown. AI-agent-compressible: Droid-driven code generation and testing.",
      },
      {
        label: "Agent risk & safety testing",
        nature: "internal",
        description:
          "Extensive backtesting, simulation, and adversarial testing of agent strategies under stress conditions before live capital deployment.",
      },
      {
        label: "OpenServ / BRAID agent interoperability",
        nature: "external",
        description:
          "Integration with OpenServ for cross-platform agent communication. Dependent on OpenServ API stability and partner coordination.",
      },
      {
        label: "Regulatory review for autonomous trading",
        nature: "external",
        description:
          "Legal and compliance review of autonomous agent trading in relevant jurisdictions. Not compressible — requires external legal counsel and regulatory research.",
      },
    ],
    externalDependencies: [
      "OpenServ API stability and partner-tier access",
      "Legal/regulatory review of autonomous trading agents (jurisdiction-dependent)",
      "Vault infrastructure readiness (pe-social-vaults dependency)",
    ],
    proofGates: [
      {
        label: "Agent live trading",
        criterion:
          "At least one autonomous strategy agent executes trades on Polymarket mainnet for ≥ 7 consecutive days with on-chain settlement records publicly verifiable in a block explorer, and a published performance log or dashboard showing the agent's P&L over the evaluation period",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
      {
        label: "Agent delegation",
        criterion:
          "Users can delegate capital to at least one publicly listed autonomous agent, with the agent's bond status queryable on-chain and P&L history visible on a public dashboard accessible to any visitor",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q3 2026–Q1 2027, 6–12 weeks after social vault launch",
      lowerBound: "2026-Q3",
      upperBound: "2027-Q1",
      mainConstraint: "Social vault readiness and regulatory review",
    },
    investorSummary:
      "Strategy agents transform BETTER from a trading tool into a 24/7 autonomous trading platform. They create new fee streams and establish the agent-native token utility that differentiates BETTER from manual-only competitors.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  {
    nodeId: "pe-b2b-data",
    confidenceLabel: "Directional",
    workstreams: [
      {
        label: "Enterprise API development",
        nature: "internal",
        description:
          "Build institutional-grade data APIs with SLAs, audit trails, and tiered access. AI-agent-compressible: automated API scaffolding and documentation generation.",
      },
      {
        label: "Data licensing legal framework",
        nature: "external",
        description:
          "Establish legal framework for licensing prediction-market intelligence and signal models. Requires external legal counsel specializing in data licensing.",
      },
      {
        label: "Institutional partnership development",
        nature: "external",
        description:
          "Identify and sign pilot institutional clients. Dependent on relationship-building, trust-building, and enterprise sales cycles.",
      },
    ],
    externalDependencies: [
      "Legal framework for data licensing (external counsel)",
      "Institutional client pipeline and enterprise sales cycle (3–6 months)",
      "Mature AI/RL models with sufficient prediction history for institutional credibility",
    ],
    proofGates: [
      {
        label: "Pilot institutional client",
        criterion:
          "At least one institutional client is publicly referenceable (via a published case study, press release, or named partnership announcement) as receiving paid API-delivered prediction-market data with documented SLA-backed delivery over ≥ 30 days",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q1 2027–Q3 2027, 3–6 months after AI/RL Phase 2 maturity",
      lowerBound: "2027-Q1",
      upperBound: "2027-Q3",
      mainConstraint: "AI/RL model maturity and institutional sales cycle",
    },
    investorSummary:
      "B2B data licensing represents the high-margin enterprise expansion. It monetizes BETTER's accumulated prediction-market intelligence at institutional price points.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  // =========================================================================
  // TOKEN UTILITY & ACCESS TIERS
  // =========================================================================

  {
    nodeId: "tu-whale-tiers",
    confidenceLabel: "Committed",
    workstreams: [
      {
        label: "Tier-gate smart contract",
        nature: "internal",
        description:
          "Implement on-chain tier verification with multi-threshold logic and real-time balance checking. AI-agent-compressible: contract templating and test generation.",
      },
      {
        label: "UI tier dashboard",
        nature: "internal",
        description:
          "Build the user-facing tier status dashboard, benefit comparison, and upgrade guidance.",
      },
      {
        label: "Tier threshold governance",
        nature: "external",
        description:
          "Community and team review of tier thresholds to ensure whale-first incentive alignment without excessive centralization. Involves stakeholder input cycles.",
      },
    ],
    externalDependencies: [
      "Community and stakeholder input on tier calibration",
      "Token price stability sufficient for threshold-setting",
    ],
    proofGates: [
      {
        label: "Tier verification live",
        criterion:
          "On-chain tier verification returns correct tier classification for any wallet address within 2 seconds, queryable via public contract call",
        source: {
          type: "canonical",
          label: "BETTER Tokenomics",
          asOf: "2026-Q1",
        },
      },
      {
        label: "Whale benefit activation",
        criterion:
          "At least 3 whale-tier benefits (access priority, allocation priority, fee advantage) are demonstrably active for wallets meeting the highest published tier threshold",
        source: {
          type: "canonical",
          label: "BETTER Tokenomics",
          asOf: "2026-Q1",
        },
      },
    ],
    timingWindow: {
      display: "Q2 2026, concurrent with Terminal open access",
      lowerBound: "2026-Q2",
      upperBound: "2026-Q2",
      mainConstraint: "Terminal open access readiness",
    },
    investorSummary:
      "The whale-tier ladder is the primary token demand driver. It creates monotonic incentive gradients that reward larger holdings with tangible, provable benefits.",
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      asOf: "2026-Q1",
    },
  },

  {
    nodeId: "tu-nonlinear-allocation",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Allocation formula design",
        nature: "internal",
        description:
          "Design and simulate non-linear allocation curves (e.g., power-law, sigmoid, or bonding-curve-weighted) that reward whale tiers disproportionately. AI-agent-compressible: automated simulation and sensitivity analysis.",
      },
      {
        label: "Economic modeling & fairness review",
        nature: "internal",
        description:
          "Model allocation outcomes across whale-heavy and retail-heavy scenarios to ensure the formula doesn't cause excessive centralization.",
      },
      {
        label: "Community calibration feedback",
        nature: "external",
        description:
          "Gather community input on allocation fairness before deploying non-linear mechanics. Not compressible — requires genuine community engagement cycles.",
      },
    ],
    externalDependencies: [
      "Community governance or feedback cycle on allocation fairness",
      "Social vault infrastructure readiness (pe-social-vaults dependency)",
    ],
    proofGates: [
      {
        label: "Simulation publication",
        criterion:
          "Published allocation simulation showing outcomes for at least 3 tier levels and 2 oversubscription scenarios, reproducible from stated inputs",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
      {
        label: "Live allocation enforcement",
        criterion:
          "Non-linear allocation formula enforced on-chain in at least one social vault deployment, verifiable through contract state queries",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q3 2026–Q4 2026, 4–8 weeks after first social vault launch",
      lowerBound: "2026-Q3",
      upperBound: "2026-Q4",
      mainConstraint: "Social vault launch and community feedback cycle",
    },
    investorSummary:
      "Non-linear allocation completes the whale-first economic flywheel. It mathematically encodes the principle that larger BETTER positions receive disproportionately better vault access.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  {
    nodeId: "tu-agent-utility",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Agent bonding & staking contracts",
        nature: "internal",
        description:
          "Build smart contracts for agent BETTER bonding, slashing, and reward distribution. AI-agent-compressible: automated contract generation and fuzz testing.",
      },
      {
        label: "LLM credit & inference integration",
        nature: "internal",
        description:
          "Implement BETTER-denominated LLM credit system for agent inference costs, including metering and billing logic.",
      },
      {
        label: "Premium API lane infrastructure",
        nature: "internal",
        description:
          "Deploy dedicated high-throughput API endpoints with rate-limit differentiation by tier. Agent-compressible deployment and monitoring automation.",
      },
      {
        label: "OpenServ agent registry alignment",
        nature: "external",
        description:
          "Align bonding and quality-control mechanics with OpenServ's agent registry standards. Dependent on partner API evolution.",
      },
    ],
    externalDependencies: [
      "OpenServ agent registry API stability and standard finalization",
      "Strategy agent infrastructure readiness (pe-strategy-agents dependency)",
      "Market demand validation for autonomous prediction-market trading",
    ],
    proofGates: [
      {
        label: "Bonded agent operational",
        criterion:
          "At least one bonded agent with staked BETTER operates on mainnet with publicly queryable bond status and performance history",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
      {
        label: "LLM credit consumption",
        criterion:
          "BETTER tokens are consumed as LLM inference credits by at least one agent, with on-chain or verifiable off-chain burn/transfer records",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q4 2026–Q2 2027, 8–16 weeks after strategy agent launch",
      lowerBound: "2026-Q4",
      upperBound: "2027-Q2",
      mainConstraint: "Strategy agent launch and OpenServ registry finalization",
    },
    investorSummary:
      "Agent-native token utility creates autonomous demand for BETTER tokens. Every agent operation — bonding, inference, API access — burns or locks BETTER, creating structural demand beyond human trading.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  // =========================================================================
  // REVENUE EXPANSION
  // =========================================================================

  {
    nodeId: "re-vault-performance",
    confidenceLabel: "Committed",
    workstreams: [
      {
        label: "Fee logic smart contract",
        nature: "internal",
        description:
          "Implement the 20% performance fee on profit-only withdrawals with wallet-level high-water mark tracking in vault contracts. AI-agent-compressible: automated contract testing and edge-case coverage.",
      },
      {
        label: "Fee distribution system",
        nature: "internal",
        description:
          "Build the treasury, vault-manager, and protocol fee-split distribution system with transparent on-chain accounting.",
      },
      {
        label: "Vault contract audit",
        nature: "external",
        description:
          "The fee logic is part of the vault contract audit. External dependency — same audit firm and timeline as pe-social-vaults.",
      },
    ],
    externalDependencies: [
      "Vault smart-contract audit (shared with pe-social-vaults audit timeline)",
      "Base chain gas economics for fee collection transactions",
    ],
    proofGates: [
      {
        label: "Fee collection live",
        criterion:
          "Performance fees are collected on at least one withdrawal from a live vault on Base mainnet, with the fee amount and high-water mark verifiable in on-chain contract state",
        source: {
          type: "canonical",
          label: "BETTER Docs",
          asOf: "2026-Q1",
        },
      },
    ],
    timingWindow: {
      display: "Q2 2026–Q3 2026, ships with first social vault launch",
      lowerBound: "2026-Q2",
      upperBound: "2026-Q3",
      mainConstraint: "Social vault launch and audit completion",
    },
    investorSummary:
      "Vault performance fees are the first AUM-scaling revenue line. They align manager incentives with depositor outcomes and provide transparent, on-chain revenue proof.",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      asOf: "2026-Q1",
    },
  },

  {
    nodeId: "re-whale-premium",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Premium feature development",
        nature: "internal",
        description:
          "Build whale-exclusive features: private alpha signals, early vault previews, OTC facilitation tools, and bespoke agent configurations. AI-agent-compressible development.",
      },
      {
        label: "Subscription billing system",
        nature: "internal",
        description:
          "Implement crypto-native subscription billing with BETTER-denominated recurring payments.",
      },
      {
        label: "Premium pricing strategy",
        nature: "external",
        description:
          "Calibrate premium pricing against market willingness-to-pay. Requires whale community feedback and competitive benchmarking.",
      },
    ],
    externalDependencies: [
      "Whale community feedback on feature bundling and pricing",
      "Whale-tier ladder operational (tu-whale-tiers dependency)",
      "Sufficient whale-tier holders to justify dedicated premium investment",
    ],
    proofGates: [
      {
        label: "Premium subscription revenue",
        criterion:
          "At least 10 whale-tier wallets hold active premium subscriptions with verifiable recurring BETTER payment transactions",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q4 2026–Q1 2027, 8–12 weeks after whale-tier full activation",
      lowerBound: "2026-Q4",
      upperBound: "2027-Q1",
      mainConstraint: "Whale-tier holder critical mass and pricing validation",
    },
    investorSummary:
      "Whale premium subscriptions convert top-tier holders into recurring high-margin revenue. They validate the whale-first thesis at the monetization layer.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  {
    nodeId: "re-agent-fees",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Agent fee metering",
        nature: "internal",
        description:
          "Implement per-transaction, per-delegation, and per-registry-operation fee metering for autonomous agents. AI-agent-compressible: automated metering instrumentation.",
      },
      {
        label: "Fee optimization modeling",
        nature: "internal",
        description:
          "Model fee levels that maximize agent ecosystem participation without discouraging adoption. Simulation-driven with agent-based modeling tools.",
      },
      {
        label: "Agent ecosystem adoption ramp",
        nature: "external",
        description:
          "Revenue from agent fees scales with autonomous trading volume. External dependency — market adoption of agent-based prediction-market trading.",
      },
    ],
    externalDependencies: [
      "Strategy agent ecosystem adoption rate",
      "Strategy agent launch and bonded-agent registry readiness",
      "Market demand for autonomous prediction-market trading",
    ],
    proofGates: [
      {
        label: "Agent fee revenue",
        criterion:
          "Cumulative agent transaction and delegation fees exceed $10,000 equivalent over a rolling 30-day period, verifiable through on-chain fee contract balances",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q1 2027–Q3 2027, scales with agent ecosystem maturity",
      lowerBound: "2027-Q1",
      upperBound: "2027-Q3",
      mainConstraint: "Agent ecosystem adoption and trading volume ramp",
    },
    investorSummary:
      "Agent fees create the first autonomous revenue stream — revenue generated by non-human actors 24/7 without proportional operating cost increases.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  {
    nodeId: "re-enterprise-data",
    confidenceLabel: "Directional",
    workstreams: [
      {
        label: "Enterprise-grade data pipeline",
        nature: "internal",
        description:
          "Build institutional-quality data infrastructure with SLAs, audit trails, and API rate management. AI-agent-compressible: infrastructure automation and monitoring setup.",
      },
      {
        label: "Enterprise sales & BD",
        nature: "external",
        description:
          "Institutional client acquisition through enterprise sales motions. External dependency — long enterprise sales cycles (3–6+ months per client).",
      },
      {
        label: "Data licensing legal framework",
        nature: "external",
        description:
          "Legal agreements for data licensing, IP protection, and liability. Requires external legal counsel specializing in financial data licensing.",
      },
    ],
    externalDependencies: [
      "Enterprise sales cycle (3–6+ months per institutional client)",
      "Data licensing legal framework development",
      "AI/RL model maturity sufficient for institutional credibility",
      "Regulatory environment for financial data products",
    ],
    proofGates: [
      {
        label: "Enterprise pilot",
        criterion:
          "At least one institutional client completes a paid pilot with a signed data-licensing agreement and documented API usage over ≥ 30 days",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q2 2027–Q4 2027, 3–6 months after enterprise data pipeline readiness",
      lowerBound: "2027-Q2",
      upperBound: "2027-Q4",
      mainConstraint: "Enterprise sales cycle and data pipeline maturity",
    },
    investorSummary:
      "Enterprise data licensing is the highest-margin revenue expansion. It monetizes BETTER's accumulated intelligence at institutional price points without proportional infrastructure cost.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  // =========================================================================
  // TECHNICAL INFRASTRUCTURE
  // =========================================================================

  {
    nodeId: "ti-hyperevm-phase1",
    confidenceLabel: "Committed",
    workstreams: [
      {
        label: "HyperEVM contract deployment",
        nature: "internal",
        description:
          "Port and deploy BETTER contracts to HyperEVM for Hyperliquid-native prediction markets. AI-agent-compressible: automated contract migration and cross-chain testing.",
      },
      {
        label: "Cross-chain bridge development",
        nature: "internal",
        description:
          "Build or integrate cross-chain bridging for BETTER token movement between Base, Polygon, and HyperEVM.",
      },
      {
        label: "HyperEVM chain readiness",
        nature: "external",
        description:
          "Dependent on HyperEVM mainnet stability, tooling maturity, and Hyperliquid team's deployment support. Not compressible by internal AI agents.",
      },
      {
        label: "Hyperliquid partnership coordination",
        nature: "external",
        description:
          "Coordination with Hyperliquid team for partner-tier integration access and liquidity bootstrapping support.",
      },
    ],
    externalDependencies: [
      "HyperEVM mainnet stability and developer tooling maturity",
      "Hyperliquid partner-tier access and integration support",
      "Cross-chain bridge security audit",
    ],
    proofGates: [
      {
        label: "HyperEVM contract live",
        criterion:
          "BETTER contracts are deployed and operational on HyperEVM mainnet with at least one successful cross-chain BETTER transfer verified in both chain explorers",
        source: {
          type: "canonical",
          label: "BETTER Docs & Whitepaper",
          asOf: "2026-Q1",
        },
      },
    ],
    timingWindow: {
      display: "Q2 2026–Q3 2026, dependent on HyperEVM mainnet readiness",
      lowerBound: "2026-Q2",
      upperBound: "2026-Q3",
      mainConstraint: "HyperEVM mainnet stability and tooling maturity",
    },
    investorSummary:
      "HyperEVM integration opens access to Hyperliquid's liquidity and composability layer. It's the multi-venue strategy that reduces single-chain risk and unlocks new prediction-market depth.",
    source: {
      type: "canonical",
      label: "BETTER Docs & Whitepaper",
      asOf: "2026-Q1",
    },
  },

  {
    nodeId: "ti-ai-rl-phase2",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Proprietary model training",
        nature: "internal",
        description:
          "Train proprietary prediction-market models on BETTER's accumulated data. AI-agent-compressible: automated hyperparameter sweeps, architecture search, and experiment tracking.",
      },
      {
        label: "Compute infrastructure scaling",
        nature: "internal",
        description:
          "Scale GPU/TPU compute for model training and inference. Includes provisioning, cost optimization, and autoscaling pipelines.",
      },
      {
        label: "Data history accumulation",
        nature: "external",
        description:
          "Sufficient prediction-market data history accumulates only through real trading time. Not compressible — requires elapsed calendar time for market diversity and seasonal coverage.",
      },
      {
        label: "Model validation & benchmarking",
        nature: "external",
        description:
          "Independent model validation against public benchmarks and competing signal providers. Requires external data sources and third-party evaluation.",
      },
    ],
    externalDependencies: [
      "Sufficient trading data history (6–12+ months of diverse market coverage)",
      "External model benchmarking and validation sources",
      "Compute cost environment (GPU/TPU pricing and availability)",
    ],
    proofGates: [
      {
        label: "Proprietary model superiority",
        criterion:
          "Proprietary BETTER models outperform the Phase 1 baseline on a published accuracy or return metric by ≥ 20% over a 90-day evaluation window, with the benchmark methodology and results published on a publicly accessible BETTER research page or third-party evaluation platform",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
      {
        label: "New market coverage",
        criterion:
          "Proprietary models generate publicly visible signals for at least 2 prediction-market categories not covered by Phase 1, verifiable through the BETTER Terminal or a public signal feed showing live predictions in those categories",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q4 2026–Q2 2027, 6–12 months after sufficient data accumulation",
      lowerBound: "2026-Q4",
      upperBound: "2027-Q2",
      mainConstraint: "Data history accumulation (calendar-time-dependent)",
    },
    investorSummary:
      "Proprietary AI/RL models are the core moat. They create intelligence that cannot be replicated without equivalent prediction-market data and compute investment.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  {
    nodeId: "ti-polygon-phase1",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Polygon node deployment",
        nature: "internal",
        description:
          "Deploy and operate Polygon full nodes for direct chain access. AI-agent-compressible: automated node provisioning, health monitoring, and failover configuration.",
      },
      {
        label: "Node operations & monitoring",
        nature: "internal",
        description:
          "Build 24/7 node monitoring, alerting, and automated recovery systems for production-grade uptime.",
      },
      {
        label: "Polygon network coordination",
        nature: "external",
        description:
          "Stay aligned with Polygon network upgrades, fork schedules, and validator set changes. Dependent on Polygon governance decisions.",
      },
    ],
    externalDependencies: [
      "Polygon network upgrade and fork schedule alignment",
      "Cloud infrastructure cost environment",
      "Sufficient trading volume to justify node operation costs",
    ],
    proofGates: [
      {
        label: "Node operational",
        criterion:
          "BETTER-operated Polygon full node achieves ≥ 99.5% uptime over a 30-day period with block height within 3 blocks of network tip, verified through a publicly accessible node status dashboard or monitoring page showing real-time sync status and historical uptime metrics",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q3 2026–Q4 2026, after Terminal open access proves volume justification",
      lowerBound: "2026-Q3",
      upperBound: "2026-Q4",
      mainConstraint: "Trading volume justification and cloud infrastructure costs",
    },
    investorSummary:
      "Own-node operations reduce third-party RPC dependency and latency. They're the first step toward infrastructure independence and validator economics.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  {
    nodeId: "ti-low-latency-phase1",
    confidenceLabel: "Directional",
    workstreams: [
      {
        label: "Co-location site selection & provisioning",
        nature: "internal",
        description:
          "Identify and provision co-located server infrastructure near prediction-market execution venues. AI-agent-compressible: automated benchmark testing and configuration optimization.",
      },
      {
        label: "Execution pipeline optimization",
        nature: "internal",
        description:
          "Optimize order routing, serialization, and network path selection for minimum latency execution.",
      },
      {
        label: "Venue proximity and access",
        nature: "external",
        description:
          "Physical proximity to prediction-market execution venues requires real-world data center selection. Dependent on venue location and colocation availability.",
      },
      {
        label: "Colocation vendor contracts",
        nature: "external",
        description:
          "Negotiate and sign data center colocation agreements. External dependency — vendor availability, pricing, and contract lead times.",
      },
    ],
    externalDependencies: [
      "Colocation vendor availability and contract negotiation",
      "Prediction-market venue execution architecture documentation",
      "Sufficient agent trading volume to justify colocation investment",
    ],
    proofGates: [
      {
        label: "Latency improvement",
        criterion:
          "Co-located execution infrastructure demonstrates ≥ 50% median latency reduction on order round-trip compared to non-colocated baseline, measured over ≥ 1,000 orders and documented in a published performance report or public benchmark page with methodology and raw percentile data visible to any visitor",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q1 2027–Q3 2027, after agent trading volume justifies investment",
      lowerBound: "2027-Q1",
      upperBound: "2027-Q3",
      mainConstraint: "Trading volume justification and venue proximity availability",
    },
    investorSummary:
      "Co-located execution creates a structural speed advantage for BETTER's agent fleet. It's the infrastructure layer that turns marginal signal quality into real P&L advantage.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  {
    nodeId: "ti-data-pipeline-phase2",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Enterprise-grade pipeline architecture",
        nature: "internal",
        description:
          "Design and build institutional-quality data infrastructure with SLA-backed delivery, audit trails, tiered access controls, and API rate management. AI-agent-compressible: automated pipeline scaffolding, test harness generation, and monitoring instrumentation.",
      },
      {
        label: "API documentation & developer portal",
        nature: "internal",
        description:
          "Build comprehensive API documentation, developer portal, and integration guides for institutional clients. Agent-compressible documentation generation.",
      },
      {
        label: "Data quality certification",
        nature: "external",
        description:
          "Validate data pipeline quality against institutional standards through third-party data quality assessment or SOC 2-equivalent compliance process. Not compressible — requires external audit firm scheduling and review.",
      },
      {
        label: "Institutional client beta program",
        nature: "external",
        description:
          "Onboard pilot institutional clients to validate API design, SLA targets, and data product-market fit. Dependent on enterprise sales cycle and relationship-building timelines.",
      },
    ],
    externalDependencies: [
      "Third-party data quality assessment or SOC 2 compliance process (4–12 weeks)",
      "Enterprise client pipeline and pilot onboarding cycle (2–4 months)",
      "AI/RL Phase 2 model maturity providing institutional-credible signal data",
      "Regulatory clarity on financial data distribution products",
    ],
    proofGates: [
      {
        label: "Enterprise API publicly documented",
        criterion:
          "A publicly accessible developer portal or API documentation site lists BETTER's enterprise data endpoints with versioned schemas, rate-limit tiers, and SLA targets visible to any visitor",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
      {
        label: "Pilot data delivery verified",
        criterion:
          "At least one institutional pilot client receives API-delivered prediction-market data for ≥ 30 consecutive days with publicly referenceable uptime metrics or a published case study confirming SLA-backed delivery",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q1 2027–Q3 2027, 3–6 months after AI/RL Phase 2 model maturity",
      lowerBound: "2027-Q1",
      upperBound: "2027-Q3",
      mainConstraint: "AI/RL Phase 2 model maturity and enterprise pilot onboarding cycle",
    },
    investorSummary:
      "The enterprise-grade data pipeline transforms BETTER's accumulated prediction-market intelligence into a licensable institutional product. It creates the infrastructure layer required for B2B revenue at institutional price points.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  // =========================================================================
  // SOCIAL & AGENT ECOSYSTEM
  // =========================================================================

  {
    nodeId: "sa-openserv-integration",
    confidenceLabel: "Committed",
    workstreams: [
      {
        label: "OpenServ SDK integration",
        nature: "internal",
        description:
          "Integrate OpenServ SDK for agent interoperability and BRAID coordination frameworks. AI-agent-compressible: SDK integration, wrapper generation, and automated testing.",
      },
      {
        label: "BRAID protocol implementation",
        nature: "internal",
        description:
          "Implement BRAID coordination protocol for multi-agent communication and task orchestration within the BETTER ecosystem.",
      },
      {
        label: "OpenServ partner API access",
        nature: "external",
        description:
          "Dependent on OpenServ's API stability, rate limits, and partner-tier access approval. Not compressible by internal work.",
      },
    ],
    externalDependencies: [
      "OpenServ API stability and partner-tier access approval",
      "OpenServ SDK versioning and breaking-change schedule",
    ],
    proofGates: [
      {
        label: "Cross-platform agent communication",
        criterion:
          "At least one BETTER agent sends and receives structured messages via the OpenServ network with round-trip latency < 5 seconds in production, verifiable through the public OpenServ agent registry or a published integration announcement confirming BETTER's live agent presence on the network",
        source: {
          type: "canonical",
          label: "BETTER Docs & Whitepaper",
          asOf: "2026-Q1",
        },
      },
    ],
    timingWindow: {
      display: "Q2 2026–Q3 2026, aligned with OpenServ partner API schedule",
      lowerBound: "2026-Q2",
      upperBound: "2026-Q3",
      mainConstraint: "OpenServ API stability and partner approval",
    },
    investorSummary:
      "OpenServ integration positions BETTER as a first-mover in the emerging agent interoperability layer. It unlocks cross-platform agent flows that no single-ecosystem competitor can replicate.",
    source: {
      type: "canonical",
      label: "BETTER Docs & Whitepaper",
      asOf: "2026-Q1",
    },
  },

  {
    nodeId: "sa-bonded-agents",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Bonding contract development",
        nature: "internal",
        description:
          "Build smart contracts for agent bonding, slashing conditions, and bond recovery. AI-agent-compressible: contract generation and fuzz testing.",
      },
      {
        label: "Agent quality scoring",
        nature: "internal",
        description:
          "Design and implement agent quality scoring algorithms based on historical performance, slashing history, and delegation outcomes.",
      },
      {
        label: "Bonding economics calibration",
        nature: "external",
        description:
          "Calibrate bonding requirements against actual agent performance distributions. Requires real agent operational data that accumulates over time.",
      },
    ],
    externalDependencies: [
      "Strategy agent operational data accumulation (calendar-time-dependent)",
      "Community governance input on slashing parameters",
      "Agent safety framework maturity",
    ],
    proofGates: [
      {
        label: "Bonded agent registry live",
        criterion:
          "A public on-chain registry lists ≥ 5 bonded agents with queryable bond status, performance history, and slashing records",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q1 2027–Q2 2027, 8–16 weeks after strategy agent launch and data accumulation",
      lowerBound: "2027-Q1",
      upperBound: "2027-Q2",
      mainConstraint: "Agent operational data accumulation and safety framework",
    },
    investorSummary:
      "The bonded agent registry is the quality-control layer for autonomous trading. It creates economic alignment between agents and delegators through stake-backed accountability.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  {
    nodeId: "sa-delegation",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Delegation smart contracts",
        nature: "internal",
        description:
          "Build capital delegation contracts: deposit, withdrawal, profit-sharing, and risk-parameter enforcement for agent-delegator relationships. AI-agent-compressible development.",
      },
      {
        label: "Delegator dashboard",
        nature: "internal",
        description:
          "Build user-facing delegation management UI with real-time agent P&L, risk metrics, and withdrawal controls.",
      },
      {
        label: "Legal review of delegation mechanics",
        nature: "external",
        description:
          "Legal assessment of capital delegation between users and autonomous agents in applicable jurisdictions. Requires external legal counsel.",
      },
    ],
    externalDependencies: [
      "Legal/regulatory review of capital delegation (jurisdiction-dependent)",
      "Bonded agent registry readiness (sa-bonded-agents dependency)",
      "Social vault infrastructure maturity",
    ],
    proofGates: [
      {
        label: "Active delegations",
        criterion:
          "At least 3 unique wallets have active capital delegations to bonded agents with transparent P&L reporting visible in the delegation dashboard",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q2 2027–Q3 2027, 4–8 weeks after bonded agent registry launch",
      lowerBound: "2027-Q2",
      upperBound: "2027-Q3",
      mainConstraint: "Bonded agent registry and legal review completion",
    },
    investorSummary:
      "Agent delegation enables passive capital participation in the BETTER agent ecosystem. Users contribute capital without running agents, creating a capital-efficient flywheel.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },

  {
    nodeId: "sa-research-bounties",
    confidenceLabel: "Directional",
    workstreams: [
      {
        label: "Bounty platform development",
        nature: "internal",
        description:
          "Build the bounty submission, review, and reward system for community prediction-market research contributions. AI-agent-compressible: automated bounty matching and quality scoring.",
      },
      {
        label: "Bounty economics design",
        nature: "internal",
        description:
          "Design sustainable bounty reward economics: payout sources, caps, quality gates, and anti-gaming measures.",
      },
      {
        label: "Community contributor ramp",
        nature: "external",
        description:
          "Building a contributor community takes time. External dependency — organic community growth and quality contributor onboarding cannot be compressed by internal AI agents.",
      },
    ],
    externalDependencies: [
      "Community contributor base development (organic growth)",
      "Research quality validation methodology maturation",
      "Token allocation governance for bounty rewards",
    ],
    proofGates: [
      {
        label: "Bounty completions",
        criterion:
          "At least 10 unique community contributors complete paid research bounties with published outputs visible in the BETTER research feed",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q3 2027–Q1 2028, dependent on community contributor ramp",
      lowerBound: "2027-Q3",
      upperBound: "2028-Q1",
      mainConstraint: "Community contributor base development",
    },
    investorSummary:
      "Research bounties crowdsource prediction-market intelligence improvement. They convert community engagement into data-quality gains that benefit the entire BETTER signal pipeline.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },
  {
    nodeId: "sa-premium-api",
    confidenceLabel: "Planned",
    workstreams: [
      {
        label: "Dedicated API lane infrastructure",
        nature: "internal",
        description:
          "Deploy dedicated high-throughput API endpoints with rate-limit differentiation by whale tier, including isolated compute pools and priority queue routing. AI-agent-compressible: automated infrastructure provisioning, load testing, and monitoring setup.",
      },
      {
        label: "Tier-gated access control",
        nature: "internal",
        description:
          "Implement on-chain tier verification at the API gateway layer so only qualifying whale-tier wallets receive premium lane access. Integrates with the whale-tier smart contract.",
      },
      {
        label: "SLA definition & monitoring",
        nature: "internal",
        description:
          "Define and instrument SLA targets (latency percentiles, uptime guarantees, throughput limits) for premium lanes with real-time public status monitoring.",
      },
      {
        label: "Enterprise data pipeline readiness",
        nature: "external",
        description:
          "Premium API lanes depend on the enterprise-grade data pipeline (ti-data-pipeline-phase2) being operational. Not compressible — requires upstream infrastructure maturity.",
      },
      {
        label: "Whale-tier demand validation",
        nature: "external",
        description:
          "Sufficient whale-tier holders must exist and demonstrate demand for premium API access to justify dedicated infrastructure investment. Dependent on whale-tier adoption pace.",
      },
    ],
    externalDependencies: [
      "Enterprise data pipeline (ti-data-pipeline-phase2) operational readiness",
      "Whale-tier ladder (tu-whale-tiers) fully deployed with sufficient holder base",
      "Demand validation from whale-tier holders for premium API access",
    ],
    proofGates: [
      {
        label: "Premium lane publicly accessible",
        criterion:
          "A publicly documented premium API endpoint returns differentiated rate limits and latency for whale-tier-verified wallets versus standard-tier wallets, verifiable by any wallet holder through a public API status page or self-service tier-check endpoint",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
      {
        label: "Tier-gated throughput verified",
        criterion:
          "On-chain tier verification at the API gateway is publicly queryable, and a public status dashboard or API response header exposes the caller's verified tier and corresponding rate-limit allocation",
        source: {
          type: "scenario_based",
          label: "BETTER Roadmap",
        },
      },
    ],
    timingWindow: {
      display: "Q2 2027–Q4 2027, 4–8 weeks after enterprise data pipeline and whale-tier maturity",
      lowerBound: "2027-Q2",
      upperBound: "2027-Q4",
      mainConstraint: "Enterprise data pipeline readiness and whale-tier holder critical mass",
    },
    investorSummary:
      "Premium API lanes monetize infrastructure access at whale-tier price points. They create differentiated throughput that rewards larger BETTER positions with tangible execution advantages for agents and integrations.",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the execution plan for a specific roadmap node, or undefined if not a primary stage */
export function getExecutionPlanForNode(
  nodeId: string
): ExecutionPlan | undefined {
  return EXECUTION_PLANS.find((p) => p.nodeId === nodeId);
}
