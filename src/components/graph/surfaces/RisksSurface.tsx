/**
 * RisksSurface — the "Risks & Caveats" graph surface content.
 */
import { LiquidMetalCard } from "@/components/LiquidMetalCard";

export function RisksSurface() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-secondary">
        This site represents BETTER&apos;s vision — not a guarantee. Here are the key uncertainties.
      </p>

      <div className="space-y-4">
        <RiskItem
          title="Roadmap items are not guarantees"
          body="Items labeled Planned or Speculative represent directional ambitions. Timelines, scope, and feasibility depend on market conditions, technical execution, and resource availability."
        />
        <RiskItem
          title="Projections are scenario-based, not predictions"
          body="All projection numbers are derived from explicit assumption sets (conservative, base, upside). They illustrate possibility ranges — actual outcomes will differ."
        />
        <RiskItem
          title="Token thresholds may change"
          body="Access gate thresholds, tier boundaries, and fee structures are subject to FDV ratchet adjustments and governance decisions. Current values reflect the latest published state."
        />
        <RiskItem
          title="External dependencies exist"
          body="BETTER's roadmap depends on external platforms (Polymarket, Hyperliquid, Polygon, OpenServ) whose availability, economics, and APIs may change independently."
        />
        <RiskItem
          title="Regulatory environment is evolving"
          body="Prediction markets and DeFi operate in a rapidly evolving regulatory landscape. Changes in regulation could affect product availability, geographic access, or feature scope."
        />
      </div>

      <p className="text-center text-xs text-muted">
        For the latest verified information, always refer to{" "}
        <a
          href="https://docs.tradebetter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors hover:text-secondary"
        >
          docs.tradebetter.app
        </a>
        {" "}as the canonical source of truth.
      </p>
    </div>
  );
}

function RiskItem({ title, body }: { title: string; body: string }) {
  return (
    <LiquidMetalCard
      className="p-4"
      data-testid="risk-item"
    >
      <h3 className="mb-1 text-sm font-semibold text-[#a0a0a0]">{title}</h3>
      <p className="text-sm text-secondary">{body}</p>
    </LiquidMetalCard>
  );
}
