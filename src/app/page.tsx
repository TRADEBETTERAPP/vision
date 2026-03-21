import { getBlocksBySurface } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import MaturityLegend from "@/components/MaturityLegend";
import NarrativeCard from "@/components/NarrativeCard";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import { RoadmapAtlas } from "@/components/roadmap";
import { TokenomicsSection } from "@/components/tokenomics";

export default function Home() {
  const heroBlocks = getBlocksBySurface("hero");
  const currentScopeBlocks = getBlocksBySurface("current_scope");
  const visionBlocks = getBlocksBySurface("vision");

  const heroDefinition = heroBlocks.find((b) => b.id === "hero-definition");
  const heroLiveToday = heroBlocks.find((b) => b.id === "hero-live-today");
  const heroVision = heroBlocks.find((b) => b.id === "hero-vision");

  return (
    <div className="flex flex-col">
      {/* ---------------------------------------------------------------- */}
      {/* Hero Section — VAL-NARR-001, VAL-NARR-002 */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="what-is-better"
        className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 py-24 text-center"
      >
        <div className="scanline-overlay absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-4 font-terminal text-sm font-medium uppercase tracking-widest text-accent">
            Ecosystem Vision &amp; Roadmap
          </p>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            <span className="glow-accent text-accent">BETTER</span>{" "}
            <span className="text-foreground">
              is building the future of prediction-market intelligence
            </span>
          </h1>

          {/* Plain-language definition (VAL-NARR-001) */}
          {heroDefinition && (
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-secondary">
              {heroDefinition.body}
            </p>
          )}

          {/* Live vs Vision framing (VAL-NARR-002) */}
          <div className="mx-auto mb-8 grid max-w-2xl gap-4 text-left sm:grid-cols-2">
            {heroLiveToday && (
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MaturityBadge status="live" />
                  <span className="font-terminal text-xs font-medium text-accent">
                    {heroLiveToday.title}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-secondary">
                  {heroLiveToday.body}
                </p>
                <EvidenceHook source={heroLiveToday.source} className="mt-2" />
              </div>
            )}

            {heroVision && (
              <div className="rounded-lg border border-accent-warn/20 bg-accent-warn/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MaturityBadge status="planned" />
                  <span className="font-terminal text-xs font-medium text-accent-warn">
                    {heroVision.title}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-secondary">
                  {heroVision.body}
                </p>
                <EvidenceHook source={heroVision.source} className="mt-2" />
                {heroVision.confidence && (
                  <CaveatFrame confidence={heroVision.confidence} className="mt-2" />
                )}
              </div>
            )}
          </div>

          {/* Hero CTAs — VAL-NARR-010: honest about destination */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#roadmap"
              className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              data-testid="cta-explore-roadmap"
            >
              Explore the Roadmap
            </a>
            <a
              href="#live-now"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm font-medium text-secondary transition-colors hover:border-accent hover:text-foreground"
              data-testid="cta-whats-live"
            >
              See What&apos;s Live Now
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Current Scope — VAL-NARR-003 */}
      {/* ---------------------------------------------------------------- */}
      <section id="live-now" className="border-t border-border px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="Live Now"
            title="What's Live Today"
            description="The current production capabilities of the BETTER ecosystem — everything below is shipping and accessible right now."
          />
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-muted" data-testid="freshness-cue">
            Status as of 2026-Q1 · Source: BETTER Docs ·{" "}
            <a
              href="https://docs.betteragent.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-secondary"
            >
              docs.betteragent.ai
            </a>
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentScopeBlocks.map((block) => (
              <NarrativeCard key={block.id} block={block} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Maturity Legend — VAL-NARR-007 */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <MaturityLegend />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Vision / Future Roadmap Narrative — VAL-NARR-006, VAL-NARR-008, VAL-NARR-009 */}
      {/* ---------------------------------------------------------------- */}
      <section id="roadmap" className="border-t border-border px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="Roadmap"
            title="Ecosystem Roadmap"
            description="Interactive exploration of BETTER's product, infrastructure, and token utility evolution — from active work to long-range ambition."
          />

          {/* Narrative vision cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {visionBlocks.map((block) => (
              <NarrativeCard key={block.id} block={block} />
            ))}
          </div>

          {/* Interactive Roadmap Atlas */}
          <div className="mt-12">
            <h3 className="mb-6 text-center font-terminal text-sm font-medium uppercase tracking-widest text-accent">
              Interactive Roadmap Atlas
            </h3>
            <RoadmapAtlas />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Tokenomics — VAL-TOKEN-001 through VAL-TOKEN-011 */}
      {/* ---------------------------------------------------------------- */}
      <section id="tokenomics" className="border-t border-border px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="Tokenomics"
            title="Whale-First Tokenomics"
            description="Reconciled supply math, whale-first tier ladders, fee advantages, scenario projections, and agent-native utility. Content is exploration-only — not a live trading interface."
          />
          <div className="mt-12">
            <TokenomicsSection />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Architecture placeholder */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-border px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="Architecture"
            title="Technical Architecture"
            description="Hyperliquid, HyperEVM, OpenServ, proprietary AI/RL, and phased infrastructure evolution."
          />
          <div className="mt-12 rounded-lg border border-border bg-surface p-12 text-center">
            <p className="font-terminal text-sm text-muted">
              [ Architecture explorer coming soon ]
            </p>
            <p className="mt-2 text-xs text-muted">
              This section will visualize the BETTER stack layers, cost bands,
              and infrastructure evolution. Content is informational — not operational.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Evidence & Sources — VAL-NARR-008 */}
      {/* ---------------------------------------------------------------- */}
      <section id="evidence" className="border-t border-border px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="Evidence & Sources"
            title="Evidence & Sources"
            description="Every quantitative claim, threshold, and projection on this site traces back to a source or assumption. Here's how to read them."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <EvidenceExplainerCard
              icon="✓"
              label="Canonical"
              description="Verified fact from BETTER docs, smart contracts, or public data. These reflect the current live state."
              example="Total supply: 1,000,000,000 BETTER"
            />
            <EvidenceExplainerCard
              icon="◆"
              label="Scenario-Based"
              description="Derived from a specific scenario assumption set (conservative, base, or upside). Not predictions — these show &quot;if X, then Y&quot; relationships."
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
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Risks & Caveats — VAL-NARR-009 */}
      {/* ---------------------------------------------------------------- */}
      <section id="risks" className="border-t border-border px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            label="Risks & Caveats"
            title="Risks & Caveats"
            description="This site represents BETTER's vision — not a guarantee. Here are the key uncertainties."
          />
          <div className="mt-10 space-y-4">
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
          <p className="mt-6 text-center text-xs text-muted">
            For the latest verified information, always refer to{" "}
            <a
              href="https://docs.betteragent.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-secondary"
            >
              docs.betteragent.ai
            </a>
            {" "}as the canonical source of truth.
          </p>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <p className="mb-2 font-terminal text-xs font-medium uppercase tracking-widest text-accent">
        {label}
      </p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary">
        {description}
      </p>
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
    <div className="rounded-lg border border-border bg-surface p-5" data-testid="evidence-explainer">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-terminal text-lg text-accent" aria-hidden="true">
          {icon}
        </span>
        <h3 className="font-terminal text-sm font-semibold text-foreground">
          {label}
        </h3>
      </div>
      <p className="mb-3 text-sm text-secondary">{description}</p>
      <p className="rounded border border-border bg-background px-3 py-2 font-terminal text-xs text-muted">
        Example: {example}
      </p>
    </div>
  );
}

function RiskItem({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-lg border border-accent-warn/20 bg-accent-warn/5 p-4"
      data-testid="risk-item"
    >
      <h3 className="mb-1 text-sm font-semibold text-accent-warn">{title}</h3>
      <p className="text-sm text-secondary">{body}</p>
    </div>
  );
}
