import type { MaturityStatus, SourceCue } from "./types";

export interface TruthPerpFlywheelMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface TruthPerpFlywheelSection {
  id: string;
  title: string;
  status: MaturityStatus;
  summary: string;
  source: SourceCue;
  metrics: TruthPerpFlywheelMetric[];
  bullets?: string[];
}

export interface TruthPerpFlywheelPhase {
  id: string;
  label: string;
  title: string;
  timing: string;
  status: MaturityStatus;
  summary: string;
  source: SourceCue;
  bullets: string[];
}

export interface TruthPerpFlywheelContent {
  title: string;
  subtitle: string;
  overview: string;
  source: SourceCue;
  sections: TruthPerpFlywheelSection[];
  phases: TruthPerpFlywheelPhase[];
}

const truthPerpFlywheelSource: SourceCue = {
  type: "external",
  label: "@tradebetterapp — $BETTER: A Limitless Prediction Market Flywheel",
  note:
    "TRUTH-PERP and flywheel mechanics are sourced from the @tradebetterapp X article digest in .factory/library/x-article-content.md using the exact requested figures.",
};

export const TRUTH_PERP_FLYWHEEL_CONTENT: TruthPerpFlywheelContent = {
  title: "TRUTH-PERP & Flywheel",
  subtitle:
    "Hyperliquid HIP-3 capital moat, a synthetic Nasdaq of Truth index, and a buy-and-burn arb loop",
  overview:
    "BETTER frames the end game as a deflationary three-step machine: tokenize the vault, turn vBETTER into an ETF-style premium capture loop, then graduate into TRUTH-PERP on Hyperliquid as a synthetic index for prediction-market truth.",
  source: truthPerpFlywheelSource,
  sections: [
    {
      id: "hip-3-moat",
      title: "HIP-3 on Hyperliquid creates the moat",
      status: "planned",
      summary:
        "BETTER's venue thesis runs through HIP-3 on Hyperliquid. Permissionless perp listing still demands 500k HYPE staked — roughly $11M — so the listing path is open in theory but capital-gated in practice.",
      source: truthPerpFlywheelSource,
      metrics: [
        {
          id: "listing-standard",
          label: "Listing path",
          value: "HIP-3 on Hyperliquid",
          detail:
            "BETTER anchors the product around Hyperliquid's permissionless perpetual listing standard.",
        },
        {
          id: "listing-barrier",
          label: "Capital barrier",
          value: "500k HYPE ($11M)",
          detail:
            "The required staking threshold turns a permissionless market into a hard capital moat.",
        },
      ],
    },
    {
      id: "synthetic-index",
      title: "TRUTH-PERP becomes the Nasdaq of Truth",
      status: "speculative",
      summary:
        "The end-state product is a synthetic index for truth markets: TRUTH-PERP compresses prediction-market discovery into one perpetual benchmark that BETTER describes as the Nasdaq of Truth.",
      source: truthPerpFlywheelSource,
      metrics: [
        {
          id: "index-framing",
          label: "Product frame",
          value: "Nasdaq of Truth",
          detail:
            "The surface positions TRUTH-PERP as a synthetic index rather than a single isolated market.",
        },
        {
          id: "market-shape",
          label: "Instrument",
          value: "synthetic index",
          detail:
            "Prediction-market truth gets bundled into a tradable perpetual benchmark on Hyperliquid.",
        },
      ],
    },
    {
      id: "vbetter-arbitrage",
      title: "vBETTER captures the ETF premium",
      status: "planned",
      summary:
        "Before TRUTH-PERP launches, BETTER tokenizes vault shares into vBETTER via enzyme.finance-style receipts. When vBETTER trades rich on DEXs, the protocol mints, sells, and harvests that ETF premium capture before routing 30% of net arb profits into buy & burn.",
      source: truthPerpFlywheelSource,
      metrics: [
        {
          id: "vault-receipt",
          label: "Vault token",
          value: "vBETTER",
          detail:
            "Receipt token for BETTER vault shares that can trade independently of the underlying vault NAV.",
        },
        {
          id: "receipt-rail",
          label: "Receipt rail",
          value: "enzyme.finance",
          detail:
            "The strategy assumes tokenized vault receipts similar to enzyme.finance-style vault infrastructure.",
        },
        {
          id: "arb-mode",
          label: "Arbitrage mode",
          value: "ETF premium capture",
          detail:
            "Premiums above NAV are monetized by minting and selling the richer receipt token into the market.",
        },
        {
          id: "burn-allocation",
          label: "Deflation sink",
          value: "30% net arb profits → buy & burn",
          detail:
            "Net arbitrage profits from vBETTER and later TRUTH-PERP are partially recycled into token destruction.",
        },
      ],
      bullets: [
        "vBETTER is the liquid bridge between a private vault and a public price signal.",
        "The spread loop is framed as protocol-owned arbitrage rather than passive fee leakage.",
      ],
    },
  ],
  phases: [
    {
      id: "phase-1",
      label: "Phase 1",
      title: "Vault",
      timing: "Q1 2026",
      status: "in_progress",
      summary:
        "Token-gated Terminal access plus staking-to-enable vault mechanics set up the underlying asset that the rest of the flywheel can tokenize and monetize.",
      source: truthPerpFlywheelSource,
      bullets: [
        "Tokenizing the Vault",
        "Token-gated Terminal + Staking-to-Enable Vault",
      ],
    },
    {
      id: "phase-2",
      label: "Phase 2",
      title: "Arbitrage",
      timing: "Q2 2026",
      status: "planned",
      summary:
        "vBETTER goes liquid on DEXs, opening the ETF premium capture loop that mints, sells, and recycles spread profits into the token sink.",
      source: truthPerpFlywheelSource,
      bullets: [
        "Arbitrage Flywheel",
        "vBETTER on DEXs",
        "30% net arb profits routed to buy & burn",
      ],
    },
    {
      id: "phase-3",
      label: "Phase 3",
      title: "TRUTH-PERP",
      timing: "Q4 2026",
      status: "speculative",
      summary:
        "Once the Hyperliquid moat is cleared, TRUTH-PERP becomes the synthetic Nasdaq of Truth and extends the arbitrage loop into a larger perpetual market.",
      source: truthPerpFlywheelSource,
      bullets: [
        "End Game HIP-3",
        "TRUTH-PERP on Hyperliquid",
        "Synthetic truth-market index",
      ],
    },
  ],
};
