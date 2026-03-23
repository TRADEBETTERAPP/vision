/**
 * EvidenceSurface — the "Evidence & Sources" graph surface content.
 */
import { LiquidMetalCard } from "@/components/LiquidMetalCard";

export function EvidenceSurface() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-secondary">
        Every quantitative claim, threshold, and projection on this site traces
        back to a source or assumption. Here&apos;s how to read them.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <EvidenceExplainerCard
          icon="✓"
          label="Canonical"
          description="Verified fact from BETTER docs, smart contracts, or public data. These reflect the current live state."
          example="Minted supply: 709,001,940 BETTER (Base contract)"
        />
        <EvidenceExplainerCard
          icon="◆"
          label="Scenario-Based"
          description='Derived from a specific scenario assumption set (conservative, base, or upside). Not predictions — these show "if X, then Y" relationships.'
          example="Base-case vault AUM: $25M (if social vaults launch and gain traction)"
        />
        <EvidenceExplainerCard
          icon="◇"
          label="Illustrative"
          description="Hypothetical example used to explain a mechanic or concept. Not a claim about what will happen."
          example="Example allocation: 500K BETTER → Whale tier → 15% fee advantage"
        />
        <EvidenceExplainerCard
          icon="⊕"
          label="External"
          description="Third-party market data, research, or publicly cited estimate. Source and date are provided for verification."
          example="Prediction market TAM: $5–50B/year (market research, 2026)"
        />
      </div>
    </div>
  );
}

function EvidenceExplainerCard({
  icon,
  label,
  description,
  example,
}: {
  icon: string;
  label: string;
  description: string;
  example: string;
}) {
  return (
    <LiquidMetalCard className="p-5" data-testid="evidence-explainer">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-terminal text-lg text-accent" aria-hidden="true">
          {icon}
        </span>
        <h3 className="font-terminal text-sm font-semibold text-foreground">
          {label}
        </h3>
      </div>
      <p className="mb-3 text-sm text-secondary">{description}</p>
      <LiquidMetalCard className="px-3 py-2">
        <p className="font-terminal text-xs text-muted">
          Example: {example}
        </p>
      </LiquidMetalCard>
    </LiquidMetalCard>
  );
}
