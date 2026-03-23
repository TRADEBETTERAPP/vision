/**
 * Seed data: Whale-first token tier ladder.
 *
 * Tiers are intentionally whale-first: higher tiers monotonically improve
 * all privileges (access, allocation, preview, agents, fees, exclusives).
 *
 * Source: BETTER tokenomics docs + mission roadmap expansion guidance.
 */

import { TokenTier } from "./types";

export const TOKEN_TIERS: TokenTier[] = [
  {
    id: "tier-explorer",
    name: "Explorer",
    threshold: 0,
    qualificationBasis: "Any wallet — no token holding required.",
    accessPriority: 1,
    allocationPriority: 1,
    previewPriority: 0,
    agentLimit: 0,
    feeMultiplier: 1.0,
    exclusiveProducts: [],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Base tier for non-holders. Read-only or limited access.",
      asOf: "2026-Q1",
    },
    order: 0,
  },
  {
    id: "tier-lite",
    name: "Lite",
    threshold: 50_000,
    qualificationBasis:
      "Hold ≥ 50,000 BETTER tokens (Lite Mode threshold — half of standard Terminal requirement).",
    accessPriority: 2,
    allocationPriority: 2,
    previewPriority: 1,
    agentLimit: 1,
    feeMultiplier: 1.0,
    exclusiveProducts: ["Lite Mode Terminal access"],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note:
        "Lite Mode halves the Terminal requirement. Exact threshold subject to FDV ratchet.",
      asOf: "2026-Q1",
    },
    order: 1,
  },
  {
    id: "tier-standard",
    name: "Standard",
    threshold: 100_000,
    qualificationBasis:
      "Hold ≥ 100,000 BETTER tokens (standard Terminal access gate).",
    accessPriority: 3,
    allocationPriority: 3,
    previewPriority: 2,
    agentLimit: 2,
    feeMultiplier: 1.0,
    exclusiveProducts: ["Full Terminal access", "Vault participation"],
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note:
        "Standard access gate threshold. Subject to FDV ratchet adjustments.",
      asOf: "2026-Q1",
    },
    order: 2,
  },
  {
    id: "tier-whale",
    name: "Whale",
    threshold: 500_000,
    qualificationBasis: "Hold ≥ 500,000 BETTER tokens.",
    accessPriority: 4,
    allocationPriority: 5,
    previewPriority: 3,
    agentLimit: 5,
    feeMultiplier: 0.85,
    exclusiveProducts: [
      "Priority vault allocation",
      "Early strategy previews",
      "Enhanced agent slots",
      "Personal AI-Crafted Vaults (modeled)",
    ],
    source: {
      type: "scenario_based",
      label: "BETTER Tokenomics",
      note:
        "Whale tier thresholds are illustrative — final values depend on token economics and FDV. Personal AI-Crafted Vaults are a modeled product gate, not confirmed live.",
    },
    order: 3,
  },
  {
    id: "tier-apex",
    name: "Apex Whale",
    threshold: 2_000_000,
    qualificationBasis: "Hold ≥ 2,000,000 BETTER tokens.",
    accessPriority: 5,
    allocationPriority: 7,
    previewPriority: 5,
    agentLimit: 10,
    feeMultiplier: 0.75,
    exclusiveProducts: [
      "Maximum vault allocation priority",
      "Private alpha signals (modeled)",
      "Early vault previews",
      "Bespoke agent configurations",
      "OTC facilitation access (modeled)",
      "Premium API lanes",
      "Personal AI-Crafted Vaults (modeled)",
    ],
    source: {
      type: "scenario_based",
      label: "BETTER Tokenomics",
      note:
        "Apex tier is the highest planned tier. Thresholds and benefits are illustrative. Products marked (modeled) are inferred from the whale-first design philosophy.",
    },
    order: 4,
  },
];

/** Get tiers sorted by ascending threshold */
export function getTiersSorted(): TokenTier[] {
  return [...TOKEN_TIERS].sort((a, b) => a.threshold - b.threshold);
}

/** Get a tier by ID */
export function getTierById(id: string): TokenTier | undefined {
  return TOKEN_TIERS.find((t) => t.id === id);
}

/** Get the tier for a given token balance */
export function getTierForBalance(balance: number): TokenTier {
  const sorted = getTiersSorted();
  let tier = sorted[0];
  for (const t of sorted) {
    if (balance >= t.threshold) {
      tier = t;
    }
  }
  return tier;
}

/**
 * BETTER Minted Supply — canonical value from the verified Base contract.
 *
 * Contract: 0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E (Base)
 * This is the only supply figure the site should present as current.
 */
export const MINTED_SUPPLY = 709_001_940;

/**
 * @deprecated Use MINTED_SUPPLY instead. Kept only so that tests referencing
 * the barrel export `TOTAL_SUPPLY` continue to compile during transition.
 */
export const TOTAL_SUPPLY = MINTED_SUPPLY;

/** Canonical Base contract metadata */
export const BASE_CONTRACT = {
  address: "0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E",
  chain: "Base",
  mintedSupply: MINTED_SUPPLY,
  decimals: 18,
  migrationNote:
    "BETTER migrated from Ethereum to Base. The minted supply of 709,001,940 BETTER is the canonical on-chain figure.",
  source: {
    type: "canonical" as const,
    label: "Base Contract",
    href: "https://basescan.org/token/0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E",
    asOf: "2026-Q1",
    note: "Verified minted supply from the Base contract.",
  },
};

/**
 * Token allocation breakdown — on-chain verified from Dune Analytics and basescan.
 *
 * All allocations are verified against the deployer wallet
 * (0x1bbdc95d322b8fd76e6a00e6c318dfb421d7d322) transfer history on Base.
 *
 * Contract: 0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E
 * Reference: /Users/test/dune_query_results.md
 *
 * Percentages sum to 100 and token amounts reconcile with MINTED_SUPPLY.
 */
export interface TokenAllocation {
  label: string;
  percentage: number;
  tokens: number;
  source: {
    type: "canonical" | "scenario_based" | "illustrative";
    label: string;
    href?: string;
    note?: string;
  };
}

export const TOKEN_ALLOCATIONS: TokenAllocation[] = [
  {
    label: "Team/Vesting",
    percentage: 35.26,
    tokens: 250_000_000,
    source: {
      type: "canonical",
      label: "Basescan (On-Chain)",
      href: "https://basescan.org/token/0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E?a=0x17c68a6e8bd3dfda2664105aa87c8bdd2bfccf6a",
      note: "Single 250M transfer from deployer to 0x17c68a…. Verified via Dune erc20_base.evt_Transfer query.",
    },
  },
  {
    label: "Treasury",
    percentage: 28.21,
    tokens: 200_000_000,
    source: {
      type: "canonical",
      label: "Basescan (On-Chain)",
      href: "https://basescan.org/token/0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E?a=0xe2b2dbff14cf396a62487ca05a2fea7f2dcc5c78",
      note: "Single 200M transfer from deployer to 0xe2b2db…. Verified via Dune erc20_base.evt_Transfer query.",
    },
  },
  {
    label: "SERV / Strategic Reserve",
    percentage: 7.05,
    tokens: 50_000_000,
    source: {
      type: "canonical",
      label: "Basescan (On-Chain)",
      href: "https://basescan.org/token/0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E?a=0x1abd20bc5e6f9deecb0067556c90876c619c8b3b",
      note: "Two transfers totaling 50M from deployer to 0x1abd20…. Verified via Dune erc20_base.evt_Transfer query.",
    },
  },
  {
    label: "LP / Liquidity",
    percentage: 8.59,
    tokens: 60_903_359,
    source: {
      type: "canonical",
      label: "Basescan (On-Chain)",
      href: "https://basescan.org/token/0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E",
      note: "Combined LP across 0x80e29f… (~30.75M) and 0x498581… (~30.15M). Verified via Dune erc20_base.evt_Transfer query.",
    },
  },
  {
    label: "Programmatic Funding",
    percentage: 3.65,
    tokens: 25_869_846,
    source: {
      type: "canonical",
      label: "Basescan (On-Chain)",
      href: "https://basescan.org/token/0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E",
      note: "Distributed programmatic funding across 0x2d407b… (~13.1M) and 0x1b33f3… (~12.7M). Verified via Dune erc20_base.evt_Transfer query.",
    },
  },
  {
    label: "Deployer / Undistributed",
    percentage: 5.80,
    tokens: 41_104_714,
    source: {
      type: "canonical",
      label: "Basescan (On-Chain)",
      href: "https://basescan.org/token/0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E?a=0x1bbdc95d322b8fd76e6a00e6c318dfb421d7d322",
      note: "Remaining undistributed in deployer 0x1bbdc9…. Verified via Dune erc20_base.evt_Transfer query.",
    },
  },
  {
    label: "Airdrop / Migration",
    percentage: 11.44,
    tokens: 81_124_021,
    source: {
      type: "canonical",
      label: "Dune Analytics (On-Chain)",
      href: "https://dune.com/queries?q=BETTER+token+0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E",
      note: "Batch of ~200+ smaller transfers at 2026-03-08 21:45:29 UTC. Verified via Dune erc20_base.evt_Transfer query.",
    },
  },
];

/** Validate that token allocations sum to ~100% and reconcile with minted supply */
export function validateAllocations(): {
  valid: boolean;
  totalPercentage: number;
  totalTokens: number;
} {
  const totalPercentage = TOKEN_ALLOCATIONS.reduce(
    (sum, a) => sum + a.percentage,
    0
  );
  const totalTokens = TOKEN_ALLOCATIONS.reduce(
    (sum, a) => sum + a.tokens,
    0
  );
  return {
    valid:
      Math.abs(totalPercentage - 100) < 0.01 && totalTokens === MINTED_SUPPLY,
    totalPercentage: Math.round(totalPercentage * 100) / 100,
    totalTokens,
  };
}

// ---------------------------------------------------------------------------
// First-Vault Policy (Q1 2026)
// ---------------------------------------------------------------------------

/**
 * First-vault qualification rules for Q1 2026.
 *
 * CORRECTED MODEL: $25,000 is the TOTAL vault deposit cap across ALL users
 * for the first vault — NOT a per-wallet cap. Individual allocations within
 * that total are determined by the √-weighted bidding allocation model.
 *
 * 100,000 BETTER is universal for ALL quant-team vaults.
 * Social vaults require only 25,000 BETTER (see SOCIAL_VAULT_PARAMS).
 */
export interface FirstVaultPolicy {
  /** Minimum BETTER tokens required to participate (universal for all quant-team vaults) */
  minimumBetter: number;
  /** Total vault deposit cap in USD across ALL qualifying users (first vault only) */
  totalVaultCapUsd: number;
  /** Which tier qualifies (Standard and above = 100k+ BETTER) */
  qualifyingTierMinimum: string;
  /** Source backing */
  source: {
    type: "canonical" | "scenario_based" | "illustrative";
    label: string;
    note?: string;
    asOf?: string;
  };
}

export const FIRST_VAULT_POLICY: FirstVaultPolicy = {
  minimumBetter: 100_000,
  totalVaultCapUsd: 25_000,
  qualifyingTierMinimum: "tier-standard",
  source: {
    type: "canonical",
    label: "BETTER Docs",
    note:
      "Q1 2026 first-vault rules: 100,000 BETTER universal minimum for all quant-team vaults, $25,000 total vault deposit cap across all qualifying stakers (not per-wallet). Individual allocations determined by the √-weighted bidding model with a $100 USDC floor.",
    asOf: "2026-Q1",
  },
};

/**
 * Worked examples for first-vault participation using the bidding allocation model.
 *
 * Each example shows the staker's BETTER commitment, their √-weight, and
 * their estimated USDC allocation from the $25,000 total vault cap.
 * Based on the 20-staker scenario from the bidding allocation model spec.
 */
export interface FirstVaultWorkedExample {
  label: string;
  tierId: string;
  tierName: string;
  betterHolding: number;
  /** √-weighted effective weight (√stake) */
  sqrtWeight: number;
  /** Estimated USDC allocation from the bidding model */
  estimatedAllocationUsd: number;
  /** Percentage of total vault */
  percentOfVault: number;
  /** Whether this staker qualifies */
  qualifies: boolean;
  /** Whether the per-staker cap applies */
  capped: boolean;
  explanation: string;
}

export const FIRST_VAULT_WORKED_EXAMPLES: FirstVaultWorkedExample[] = [
  {
    label: "Below minimum — does not qualify",
    tierId: "tier-lite",
    tierName: "Lite",
    betterHolding: 50_000,
    sqrtWeight: 0,
    estimatedAllocationUsd: 0,
    percentOfVault: 0,
    qualifies: false,
    capped: false,
    explanation:
      "Holding 50,000 BETTER places this wallet in the Lite tier, below the 100,000 BETTER universal minimum required for quant-team vault participation. No allocation: does not qualify for bidding.",
  },
  {
    label: "Standard holder — minimum qualifying stake",
    tierId: "tier-standard",
    tierName: "Standard",
    betterHolding: 100_000,
    sqrtWeight: 316.23,
    estimatedAllocationUsd: 585,
    percentOfVault: 2.3,
    qualifies: true,
    capped: false,
    explanation:
      "Holding 100,000 BETTER qualifies at the Standard tier. In a 20-staker scenario, this staker's √-weight is √100,000 ≈ 316. After the whale's allocation is capped at $5,000 (20% of vault), remaining funds redistribute proportionally. Estimated allocation: ~$585 — well above the $100 floor.",
  },
  {
    label: "Largest holder — capped by per-staker maximum",
    tierId: "tier-apex",
    tierName: "Apex Whale",
    betterHolding: 13_000_000,
    sqrtWeight: 3605.55,
    estimatedAllocationUsd: 5_000,
    percentOfVault: 20.0,
    qualifies: true,
    capped: true,
    explanation:
      "Holding 13,000,000 BETTER (largest known holder, Apex Whale tier). In the √-weighted model, raw share would be ~59% of the vault. However, the hard per-staker cap of max(V/N, V×0.20) = $5,000 applies. This compresses the whale from 87% (pure proportional) to 20% of the $25,000 total vault cap. The excess redistributes to other stakers.",
  },
  {
    label: "Apex Whale — elevated allocation with tapering",
    tierId: "tier-apex",
    tierName: "Apex Whale",
    betterHolding: 2_000_000,
    sqrtWeight: 1414.21,
    estimatedAllocationUsd: 2_616,
    percentOfVault: 10.5,
    qualifies: true,
    capped: false,
    explanation:
      "Holding 2,000,000 BETTER qualifies at the Apex Whale tier. √-weight is √2,000,000 ≈ 1,414 — roughly 4.5× the minimum staker's weight for 20× the stake, demonstrating the √-tapering compression. Estimated allocation: ~$2,616 from the $25,000 total vault cap.",
  },
];

// ---------------------------------------------------------------------------
// Modeled Higher-Tier Whale Products
// ---------------------------------------------------------------------------

/**
 * Inferred whale product gates beyond the first vault.
 *
 * These are aggressive modeled thresholds for follow-on products.
 * Each product is framed as modeled/inferred policy because proof is absent.
 */
export interface ModeledWhaleProduct {
  id: string;
  name: string;
  /** Minimum BETTER holding modeled for access */
  modeledMinimumBetter: number;
  /** Which tier ID corresponds to minimum holding */
  minimumTierId: string;
  description: string;
  maturity: "planned" | "speculative";
  source: {
    type: "scenario_based" | "illustrative";
    label: string;
    note: string;
  };
}

export const MODELED_WHALE_PRODUCTS: ModeledWhaleProduct[] = [
  {
    id: "mwp-social-vaults",
    name: "Social Vaults",
    modeledMinimumBetter: 25_000,
    minimumTierId: "tier-lite",
    description:
      "Community-managed social vaults for collective prediction-market strategies. Requires only 25,000 BETTER (one quarter of the standard 100,000 BETTER minimum for quant-team vaults), reflecting the community-first nature of social vaults. Allocation uses the same √-weighted bidding model with a tighter 15% per-staker cap. The vault feature is in active development; the specific access gates shown here are modeled policy.",
    maturity: "planned",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note:
        "Social vault minimum is 25,000 BETTER (¼ of quant-team standard). The vault feature itself is in active development, but these specific access gates are modeled — final thresholds may differ at launch.",
    },
  },
  {
    id: "mwp-personal-ai-vaults",
    name: "Personal AI-Crafted Vaults",
    modeledMinimumBetter: 500_000,
    minimumTierId: "tier-whale",
    description:
      "Individually tailored AI-crafted vault strategies built around a whale's risk preferences, position sizing, and market views. Whale-tier exclusive.",
    maturity: "planned",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note:
        "Modeled as a Whale-tier exclusive product. No live proof — threshold is an inferred policy gate based on the whale-first design philosophy.",
    },
  },
  {
    id: "mwp-private-alpha",
    name: "Private Alpha Signals",
    modeledMinimumBetter: 2_000_000,
    minimumTierId: "tier-apex",
    description:
      "Pre-release research signals, early strategy previews, and private alpha channels available only to Apex Whale holders.",
    maturity: "planned",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note:
        "Modeled as an Apex Whale exclusive. These signals have no live proof — access gates are inferred from the whale-first tier structure.",
    },
  },
  {
    id: "mwp-otc-facilitation",
    name: "OTC & Institutional Facilitation",
    modeledMinimumBetter: 2_000_000,
    minimumTierId: "tier-apex",
    description:
      "Over-the-counter trade facilitation, institutional on-ramp support, and bespoke execution services for Apex Whale accounts.",
    maturity: "speculative",
    source: {
      type: "illustrative",
      label: "BETTER Roadmap",
      note:
        "Speculative product concept. No confirmed timeline or access gate — included to illustrate the whale-first premium product direction.",
    },
  },
];

// ---------------------------------------------------------------------------
// Referral Incentives
// ---------------------------------------------------------------------------

/**
 * Sustainable referral incentive model.
 *
 * Explains payout source, caps, anti-abuse measures, and sustainability logic.
 */
export interface ReferralIncentivePolicy {
  rewardSourceDescription: string;
  rewardBasis: string;
  payoutCapPerReferrer: string;
  payoutCapPerReferral: string;
  antiAbuseMeasures: string[];
  sustainabilityLogic: string;
  maturity: "planned";
  source: {
    type: "scenario_based" | "illustrative";
    label: string;
    note: string;
    asOf?: string;
  };
}

export const REFERRAL_INCENTIVE_POLICY: ReferralIncentivePolicy = {
  rewardSourceDescription:
    "Referral rewards are funded from the Treasury allocation (~28% of minted supply, 200M BETTER). Payouts draw from a dedicated referral sub-pool, not from user deposits or vault performance fees.",
  rewardBasis:
    "Referrers earn a percentage of the trading fees generated by their referred users during a defined qualification window (e.g. first 90 days). The payout is a share of fees already collected by the protocol, not an additional cost.",
  payoutCapPerReferrer:
    "$10,000 cumulative referral earnings per wallet, reviewed quarterly. Exceeding the cap requires manual review.",
  payoutCapPerReferral:
    "$500 maximum payout per individual referral, regardless of referred-user volume.",
  antiAbuseMeasures: [
    "Self-referral detection via wallet clustering and on-chain patterns",
    "Minimum referred-user activity threshold before payout eligibility",
    "Quarterly cap review with automatic throttle if referral pool draw exceeds budget",
    "Sybil resistance: referred wallets must hold ≥ 50,000 BETTER (Lite tier) before the referrer earns credit",
  ],
  sustainabilityLogic:
    "The referral pool is capped at a fixed quarterly budget drawn from the Treasury allocation. Once the quarterly budget is exhausted, further referral payouts are deferred to the next quarter. This prevents runaway reward spend and keeps referral incentives funded by protocol revenue rather than inflationary issuance.",
  maturity: "planned",
  source: {
    type: "scenario_based",
    label: "BETTER Tokenomics",
    note:
      "Referral incentive structure is modeled policy — final rates, caps, and qualification windows may be adjusted before launch.",
    asOf: "2026-Q1",
  },
};

// ---------------------------------------------------------------------------
// Product-Family Revenue/Value-Return Model
// ---------------------------------------------------------------------------

/**
 * Revenue and value-return modeling for each major BETTER product family.
 *
 * Distinguishes direct monetized revenue from broader ecosystem-value flows,
 * with explicit maturity labels per product line.
 */
export interface ProductFamilyRevenueModel {
  id: string;
  productFamily: string;
  returnType: "direct_revenue" | "ecosystem_value" | "hybrid";
  returnTypeLabel: string;
  maturity: "live" | "in_progress" | "planned" | "speculative";
  revenueDescription: string;
  returnPath: string;
  estimatedRange?: string;
  source: {
    type: "canonical" | "scenario_based" | "illustrative";
    label: string;
    note?: string;
  };
}

export const PRODUCT_FAMILY_REVENUE_MODELS: ProductFamilyRevenueModel[] = [
  {
    id: "pfr-trading-tax",
    productFamily: "Token Trading & Taxes",
    returnType: "direct_revenue",
    returnTypeLabel: "Direct Monetized Revenue",
    maturity: "live",
    revenueDescription:
      "2% buy tax and 2% sell tax on every BETTER token swap via the Aerodrome LP path.",
    returnPath:
      "Tax proceeds flow directly to the protocol treasury, funding operations, buybacks, and ecosystem growth.",
    estimatedRange: "Scales linearly with trading volume",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Live on the Aerodrome LP pair.",
    },
  },
  {
    id: "pfr-lite-terminal",
    productFamily: "Lite Mode & Terminal",
    returnType: "direct_revenue",
    returnTypeLabel: "Direct Monetized Revenue",
    maturity: "live",
    revenueDescription:
      "2% per-fill fee on Lite Mode prediction-market fills. Terminal users pay via token holding requirement (indirect demand sink).",
    returnPath:
      "Lite Mode fees flow to protocol revenue. Terminal token-gate creates sustained buy-side demand for BETTER.",
    estimatedRange: "$1–$10M+ annualized (scenario-dependent)",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "Lite Mode fee is live; Terminal open access in progress.",
    },
  },
  {
    id: "pfr-social-vaults",
    productFamily: "Social Vaults",
    returnType: "hybrid",
    returnTypeLabel: "Hybrid: Revenue + Ecosystem Value",
    maturity: "in_progress",
    revenueDescription:
      "20% performance fee on vault profits (split between vault manager and protocol). Additional ecosystem value from TVL growth and community engagement.",
    returnPath:
      "Performance fees flow to treasury and vault managers. TVL growth strengthens the BETTER brand and attracts new participants.",
    estimatedRange: "$0.5–$20M+ annualized (scenario-dependent)",
    source: {
      type: "canonical",
      label: "BETTER Docs",
      note: "20% performance fee on profit-only withdrawals with wallet-level high-water mark.",
    },
  },
  {
    id: "pfr-strategy-agents",
    productFamily: "Strategy Agents",
    returnType: "hybrid",
    returnTypeLabel: "Hybrid: Revenue + Ecosystem Value",
    maturity: "planned",
    revenueDescription:
      "Agent transaction fees, delegation bond fees, and bonded-agent registry fees. Broader value from autonomous capital deployment expanding protocol activity.",
    returnPath:
      "Transaction fees flow to protocol treasury. Agent activity generates trading volume, vault deposits, and data signals that benefit the wider ecosystem.",
    estimatedRange: "$0.1–$5M+ annualized (scenario-dependent)",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Agent fee structure is modeled. Final rates depend on agent adoption.",
    },
  },
  {
    id: "pfr-whale-premium",
    productFamily: "Whale Premium Products",
    returnType: "direct_revenue",
    returnTypeLabel: "Direct Monetized Revenue",
    maturity: "planned",
    revenueDescription:
      "Premium subscriptions for personal AI-crafted vaults, private alpha signals, bespoke execution, and OTC facilitation. Whale-tier exclusives with high-margin pricing.",
    returnPath:
      "Subscription and facilitation fees flow directly to protocol revenue. Creates a high-ARPU segment that funds R&D and infrastructure expansion.",
    estimatedRange: "$0.5–$10M+ annualized (scenario-dependent)",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Whale premium product suite is modeled policy — pricing and access gates are inferred.",
    },
  },
  {
    id: "pfr-referrals",
    productFamily: "Referrals",
    returnType: "ecosystem_value",
    returnTypeLabel: "Ecosystem Value (Growth Driver)",
    maturity: "planned",
    revenueDescription:
      "Referral payouts are a cost, not a revenue source. The referral program is modeled as a sustainable growth driver funded from treasury, with capped payouts.",
    returnPath:
      "Referred users generate trading fees, vault deposits, and token demand. The net lifetime value of referred users is expected to exceed the capped referral payout.",
    estimatedRange: "Cost: ≤ quarterly treasury referral budget",
    source: {
      type: "scenario_based",
      label: "BETTER Tokenomics",
      note: "Referral economics are modeled — see referral incentive policy for caps and sustainability.",
    },
  },
  {
    id: "pfr-enterprise-api",
    productFamily: "Enterprise & API Rails",
    returnType: "direct_revenue",
    returnTypeLabel: "Direct Monetized Revenue",
    maturity: "planned",
    revenueDescription:
      "B2B data licensing, premium API access, and custom model/signal packages for institutional clients.",
    returnPath:
      "Subscription and licensing fees flow to protocol revenue. High-margin B2B revenue diversifies beyond consumer trading.",
    estimatedRange: "$0.5–$15M+ annualized (scenario-dependent)",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note: "Enterprise revenue is modeled. Actual figures depend on institutional adoption.",
    },
  },
];
