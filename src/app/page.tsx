import { getBlocksBySurface } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import MaturityLegend from "@/components/MaturityLegend";
import NarrativeCard from "@/components/NarrativeCard";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import ProofModule from "@/components/ProofModule";
import { BetterLogotype } from "@/components/BetterLogotype";
import { RoadmapAtlas } from "@/components/roadmap";
import { TokenomicsSection } from "@/components/tokenomics";
import { ArchitectureSection } from "@/components/architecture";
import { HeroVisualSystem } from "@/components/visual";
import { Section, Heading } from "@/components/ui";

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
      {/* Hero Section — VAL-NARR-001, VAL-NARR-002, VAL-NARR-011,       */}
      {/* VAL-NARR-012, VAL-VISUAL-000–004                                */}
      {/* Poster-like first viewport: one dominant BETTER composition,    */}
      {/* compressed copy, BETTER blue branding, no dashboard cards.      */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="what-is-better"
        data-testid="hero-section"
        className="relative min-h-screen"
      >
        <HeroVisualSystem>
          <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
            <div className="mx-auto max-w-3xl">
              {/* Brand signal — BETTER logotype is the loudest element (VAL-NARR-012, VAL-VISUAL-019) */}
              <h1 className="mb-4 flex justify-center">
                <BetterLogotype variant="hero" data-testid="hero-logotype" />
              </h1>

              {/* Tagline — one dominant promise */}
              <p
                className="mx-auto mb-6 max-w-2xl text-xl font-medium leading-snug text-foreground sm:text-2xl lg:text-3xl"
                data-testid="hero-tagline"
              >
                Prediction-market intelligence, automated.
              </p>

              {/* Plain-language definition (VAL-NARR-001) */}
              {heroDefinition && (
                <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-secondary">
                  {heroDefinition.body}
                </p>
              )}

              {/* Live vs future status framing (VAL-NARR-002) — inline condensed, no split cards */}
              <div
                className="mx-auto mb-8 max-w-2xl"
                data-testid="hero-status-framing"
              >
                <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-lg border border-border/50 bg-background/40 px-6 py-3 backdrop-blur-sm">
                  {/* Live status */}
                  {heroLiveToday && (
                    <div
                      className="flex items-center gap-2"
                      data-testid="hero-live-status"
                    >
                      <MaturityBadge status="live" />
                      <span className="text-sm text-secondary">
                        Terminal &amp; copy-trading in closed beta
                      </span>
                      <EvidenceHook source={heroLiveToday.source} />
                    </div>
                  )}

                  {/* Divider */}
                  <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />

                  {/* Future status */}
                  {heroVision && (
                    <div
                      className="flex items-center gap-2"
                      data-testid="hero-future-status"
                    >
                      <MaturityBadge status="planned" />
                      <span className="text-sm text-secondary">
                        Vaults, agents &amp; HyperEVM ahead
                      </span>
                      <EvidenceHook source={heroVision.source} />
                    </div>
                  )}
                </div>

                {/* Caveat framing for future-facing claims (VAL-NARR-009) */}
                {heroVision?.confidence && (
                  <CaveatFrame confidence={heroVision.confidence} className="mx-auto mt-3 max-w-lg" />
                )}
              </div>

              {/* Hero CTAs — VAL-NARR-010: live/proof path is primary */}
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href="#live-now"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-semibold text-background transition-colors hover:bg-accent-bright"
                  data-testid="cta-primary"
                >
                  See What&apos;s Live
                </a>
                <a
                  href="#roadmap"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm font-medium text-secondary transition-colors hover:border-accent hover:text-foreground"
                  data-testid="cta-secondary"
                >
                  Explore the Roadmap
                </a>
              </div>
            </div>
          </div>
        </HeroVisualSystem>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Proof / Trust Surface — VAL-NARR-013, VAL-CROSS-009            */}
      {/* Appears immediately after the hero, before dense roadmap/       */}
      {/* tokenomics content. Users encounter product conviction and      */}
      {/* trust cues here before the page asks for deep strategy reading. */}
      {/* ---------------------------------------------------------------- */}
      <ProofModule />

      {/* ---------------------------------------------------------------- */}
      {/* Current Scope — VAL-NARR-003 */}
      {/* ---------------------------------------------------------------- */}
      <Section id="live-now" divider="top">
        <div>
          <Heading
            label="Live Now"
            title="What's Live Today"
            description="The current production capabilities of the BETTER ecosystem — live today for qualifying token holders."
          />
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-muted" data-testid="freshness-cue">
            Status as of 2026-Q1 · Source: BETTER Docs ·{" "}
            <a
              href="https://docs.tradebetter.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-secondary"
            >
              docs.tradebetter.app
            </a>
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {currentScopeBlocks.map((block) => (
              <NarrativeCard key={block.id} block={block} />
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Maturity Legend — VAL-NARR-007 */}
      {/* ---------------------------------------------------------------- */}
      <Section spacing="compact" divider="top">
        <div className="max-w-3xl">
          <MaturityLegend />
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Vision / Future Roadmap Narrative — VAL-NARR-006, VAL-NARR-008, VAL-NARR-009 */}
      {/* ---------------------------------------------------------------- */}
      <Section id="roadmap" divider="top">
        <div>
          <Heading
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
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Tokenomics — VAL-TOKEN-001 through VAL-TOKEN-011 */}
      {/* ---------------------------------------------------------------- */}
      <Section id="tokenomics" divider="top">
        <div>
          <Heading
            label="Tokenomics"
            title="Whale-First Tokenomics"
            description="Reconciled supply math, whale-first tier ladders, fee advantages, scenario projections, and agent-native utility. Content is exploration-only — not a live trading interface."
          />
          <div className="mt-12">
            <TokenomicsSection />
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Architecture — VAL-VISUAL-005 through VAL-VISUAL-009 */}
      {/* ---------------------------------------------------------------- */}
      <Section id="architecture" divider="top">
        <div>
          <Heading
            label="Architecture"
            title="Technical Architecture"
            description="Hyperliquid/HyperEVM, OpenServ/BRAID, proprietary AI/RL, Polygon validators, and phased low-latency execution — the BETTER stack, its cost bands, and the compounding flywheel. Content is informational — not operational."
          />
          <div className="mt-12">
            <ArchitectureSection />
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Evidence & Sources — VAL-NARR-008 */}
      {/* ---------------------------------------------------------------- */}
      <Section id="evidence" divider="top">
        <div>
          <Heading
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
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Risks & Caveats — VAL-NARR-009 */}
      {/* ---------------------------------------------------------------- */}
      <Section id="risks" divider="top">
        <div>
          <Heading
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
      </Section>
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
