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
 * Token allocation breakdown.
 * Percentages must sum to 100 and token amounts must reconcile with MINTED_SUPPLY.
 *
 * Updated allocation split per mission economics guidance:
 * 40 % public sale + liquidity / 20 % team / 25 % treasury / 5 % OpenServ drop / 10 % programmatic funding
 */
export interface TokenAllocation {
  label: string;
  percentage: number;
  tokens: number;
  source: {
    type: "canonical" | "scenario_based" | "illustrative";
    label: string;
    note?: string;
  };
}

export const TOKEN_ALLOCATIONS: TokenAllocation[] = [
  {
    label: "Public Sale & Liquidity",
    percentage: 40,
    tokens: 283_600_776,
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "Combined public sale and DEX liquidity allocation.",
    },
  },
  {
    label: "Team & Advisors",
    percentage: 20,
    tokens: 141_800_388,
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "Subject to vesting schedule.",
    },
  },
  {
    label: "Treasury",
    percentage: 25,
    tokens: 177_250_485,
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "Protocol-controlled treasury for operations and growth.",
    },
  },
  {
    label: "OpenServ Drop",
    percentage: 5,
    tokens: 35_450_097,
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "Allocated for the OpenServ ecosystem airdrop.",
    },
  },
  {
    label: "Programmatic Funding",
    percentage: 10,
    tokens: 70_900_194,
    source: {
      type: "canonical",
      label: "BETTER Tokenomics",
      note: "Reserved for strategic integrations and programmatic funding.",
    },
  },
];

/** Validate that token allocations sum to 100% and reconcile with minted supply */
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
      Math.abs(totalPercentage - 100) < 0.001 && totalTokens === MINTED_SUPPLY,
    totalPercentage,
    totalTokens,
  };
}

// ---------------------------------------------------------------------------
// First-Vault Policy (Q1 2026)
// ---------------------------------------------------------------------------

/**
 * First-vault qualification rules for Q1 2026.
 *
 * These are the explicit gates and caps for the first social vault launch.
 * Worked examples distinguish the per-wallet deposit cap from modeled
 * allocation weight so users don't confuse policy with whale outcomes.
 */
export interface FirstVaultPolicy {
  /** Minimum BETTER tokens required to participate */
  minimumBetter: number;
  /** Per-wallet initial deposit cap in USD */
  perWalletDepositCapUsd: number;
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
  perWalletDepositCapUsd: 25_000,
  qualifyingTierMinimum: "tier-standard",
  source: {
    type: "canonical",
    label: "BETTER Docs",
    note:
      "Q1 2026 first-vault rules: 100,000 BETTER minimum holding, $25,000 per-wallet initial-deposit cap.",
    asOf: "2026-Q1",
  },
};

/**
 * Worked examples for first-vault participation.
 *
 * Each example shows the actual deposit cap vs. the modeled allocation weight
 * so users can clearly distinguish policy from whale-first outcomes.
 */
export interface FirstVaultWorkedExample {
  label: string;
  tierId: string;
  tierName: string;
  betterHolding: number;
  /** The actual deposit cap in USD (per-wallet policy) */
  depositCapUsd: number;
  /** The tier weight used for modeled allocation priority */
  tierWeight: number;
  /** Effective allocation weight = depositCap × tierWeight (modeled, not a cap) */
  effectiveAllocationWeight: number;
  /** Whether this wallet qualifies for the first vault */
  qualifies: boolean;
  explanation: string;
}

export const FIRST_VAULT_WORKED_EXAMPLES: FirstVaultWorkedExample[] = [
  {
    label: "Below minimum — does not qualify",
    tierId: "tier-lite",
    tierName: "Lite",
    betterHolding: 50_000,
    depositCapUsd: 0,
    tierWeight: 1.1,
    effectiveAllocationWeight: 0,
    qualifies: false,
    explanation:
      "Holding 50,000 BETTER places this wallet in the Lite tier, below the 100,000 BETTER minimum required for first-vault participation. Deposit cap: $0 (does not qualify).",
  },
  {
    label: "Standard holder — qualifies at base cap",
    tierId: "tier-standard",
    tierName: "Standard",
    betterHolding: 100_000,
    depositCapUsd: 25_000,
    tierWeight: 1.25,
    effectiveAllocationWeight: 31_250,
    qualifies: true,
    explanation:
      "Holding exactly 100,000 BETTER qualifies for the first vault at the Standard tier. The per-wallet deposit cap is $25,000 (policy). Modeled allocation weight: $25,000 × 1.25 = $31,250 (this is the weight used for priority ranking, not a higher cap).",
  },
  {
    label: "Whale holder — qualifies with elevated priority",
    tierId: "tier-whale",
    tierName: "Whale",
    betterHolding: 500_000,
    depositCapUsd: 25_000,
    tierWeight: 1.6,
    effectiveAllocationWeight: 40_000,
    qualifies: true,
    explanation:
      "Holding 500,000 BETTER qualifies at the Whale tier. The per-wallet deposit cap remains $25,000 (policy). Modeled allocation weight: $25,000 × 1.6 = $40,000. The higher weight means this wallet ranks ahead of Standard wallets if vault space is oversubscribed, but the actual deposit never exceeds $25,000.",
  },
  {
    label: "Apex Whale — maximum priority at base cap",
    tierId: "tier-apex",
    tierName: "Apex Whale",
    betterHolding: 2_000_000,
    depositCapUsd: 25_000,
    tierWeight: 2.0,
    effectiveAllocationWeight: 50_000,
    qualifies: true,
    explanation:
      "Holding 2,000,000 BETTER qualifies at the Apex Whale tier. The per-wallet deposit cap is still $25,000 (policy). Modeled allocation weight: $25,000 × 2.0 = $50,000. This wallet receives the highest possible priority ranking. The $50,000 weight is used for oversubscription resolution — the actual deposit is capped at $25,000.",
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
    modeledMinimumBetter: 100_000,
    minimumTierId: "tier-standard",
    description:
      "Community-managed social vaults for collective prediction-market strategies. Standard-tier access with whale-first allocation priority when oversubscribed. The vault feature is in active development; the specific whale-first access gate shown here is modeled policy.",
    maturity: "planned",
    source: {
      type: "scenario_based",
      label: "BETTER Roadmap",
      note:
        "Social vault access gates are modeled based on the first-vault policy. The vault feature itself is in active development, but these specific access gates are modeled — final thresholds may differ at launch.",
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
    "Referral rewards are funded from the Treasury allocation (25% of minted supply). Payouts draw from a dedicated referral sub-pool, not from user deposits or vault performance fees.",
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
