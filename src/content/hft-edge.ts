import type { MaturityStatus, SourceCue } from "./types";

export interface HftEdgeMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface HftEdgeFormula {
  label: string;
  expression: string;
  detail: string;
}

export interface HftEdgeSection {
  id: string;
  title: string;
  status: MaturityStatus;
  summary: string;
  source: SourceCue;
  metrics: HftEdgeMetric[];
  bullets?: string[];
  formula?: HftEdgeFormula;
}

export interface HftEdgeContent {
  title: string;
  subtitle: string;
  overview: string;
  source: SourceCue;
  sections: HftEdgeSection[];
}

const hftEdgeSource: SourceCue = {
  type: "external",
  label: "@tradebetterapp — $BETTER: A Limitless Prediction Market Flywheel",
  note:
    "HFT Edge figures are sourced from the @tradebetterapp X article digest in .factory/library/x-article-content.md and rendered with the exact values requested for this surface.",
};

export const HFT_EDGE_CONTENT: HftEdgeContent = {
  title: "HFT Edge",
  subtitle: "Rust execution, same-rack co-location, deterministic sizing, and copy-trade distribution",
  overview:
    "BETTER frames its moat as a low-latency prediction-market execution stack: Rust instead of garbage-collected runtimes, same AWS rack co-location with the Polymarket CLOB, deterministic FAST15M and LONG BRAID pipelines, and one-click copy trading that hides the chain complexity from end users.",
  source: hftEdgeSource,
  sections: [
    {
      id: "latency-stack",
      title: "Rust execution stack",
      status: "in_progress",
      summary:
        "BETTER's execution engine is written in Rust because HFT cannot tolerate garbage-collection pauses from Python or Node.js. The stack is co-located on the same AWS rack as the Polymarket CLOB so price discovery and order submission stay as close to the venue as possible.",
      source: hftEdgeSource,
      metrics: [
        {
          id: "rust-engine",
          label: "Execution runtime",
          value: "Rust",
          detail: "Chosen to eliminate garbage-collection pauses that are fatal in HFT loops.",
        },
        {
          id: "colo-location",
          label: "Co-location",
          value: "same AWS rack",
          detail: "BETTER positions the engine on the same AWS rack as the Polymarket CLOB.",
        },
        {
          id: "latency-comparison",
          label: "Latency",
          value: "0.11ms vs 8ms",
          detail: "Internal Rust-path latency is framed against an 8ms Python-style end-to-end path.",
        },
      ],
    },
    {
      id: "alpha-selection",
      title: "Z-Score wallet selection",
      status: "in_progress",
      summary:
        "BETTER's Z-Score algorithm filters for wallets producing 35-70x returns with Sharpe >40 across up/down prediction-market regimes before the execution layer decides whether to join, chase, cross, or abort.",
      source: hftEdgeSource,
      metrics: [
        {
          id: "z-score-returns",
          label: "Wallet return range",
          value: "35-70x",
          detail: "The model surfaces the best-performing wallets instead of copying the median crowd.",
        },
        {
          id: "z-score-sharpe",
          label: "Sharpe filter",
          value: "Sharpe >40",
          detail: "The screening threshold favors consistency, not just isolated wins.",
        },
      ],
      bullets: [
        "Z-Score selection runs before the deterministic execution gates fire.",
        "The edge is framed as repeatable market selection, not discretionary seat-of-the-pants trading.",
      ],
    },
    {
      id: "deterministic-pipelines",
      title: "FAST15M + LONG BRAID",
      status: "in_progress",
      summary:
        "Execution splits into a Rust-only FAST15M lane for short-horizon speed and a LONG BRAID lane for multi-model agreement. Sizing still stays deterministic, with Kelly sizing translating edge into controlled deployment instead of unlimited notional.",
      source: hftEdgeSource,
      metrics: [
        {
          id: "fast15m",
          label: "Short horizon lane",
          value: "FAST15M",
          detail: "Rust-only path with Join → Chase → Cross → Abort states.",
        },
        {
          id: "long-braid",
          label: "Long horizon lane",
          value: "LONG",
          detail: "BRAID-assisted path that keeps execution deterministic after model agreement.",
        },
        {
          id: "paper-trade-roi",
          label: "Paper trade ROI",
          value: "~60x",
          detail: "Thousands of paper trades are cited as evidence of tight drawdown and high capital efficiency.",
        },
      ],
      formula: {
        label: "Kelly sizing",
        expression: "f* = max(0, (p − π_eff) / (1 − π_eff))",
        detail:
          "BETTER describes Kelly sizing as the deterministic bridge between predicted edge and deployed fraction.",
      },
      bullets: [
        "BRAID 4-way consensus posts 88% win rates at 3/4 agreement and 100% at 4/4 agreement.",
      ],
    },
    {
      id: "copy-trading-rails",
      title: "Copy-trading distribution",
      status: "in_progress",
      summary:
        "The product surface packages the HFT stack into gas-sponsored, one-click copy trading so users can fund once and mirror the strategy flow without manually bridging into every venue.",
      source: hftEdgeSource,
      metrics: [
        {
          id: "gas-sponsored",
          label: "Execution UX",
          value: "gas-sponsored",
          detail: "Users are abstracted away from transaction-by-transaction gas management.",
        },
        {
          id: "uda",
          label: "Account model",
          value: "UDA",
          detail: "Unified Deposit Account routing keeps funding portable across the execution flow.",
        },
        {
          id: "copy-trade-flow",
          label: "Distribution path",
          value: "one-click copy trading",
          detail: "BETTER packages the stack into a single-click follow experience instead of manual strategy replication.",
        },
      ],
    },
  ],
};
