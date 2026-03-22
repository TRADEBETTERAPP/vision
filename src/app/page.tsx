import { getBlocksBySurface } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import ProofModule from "@/components/ProofModule";
import { BetterLogotype } from "@/components/BetterLogotype";
import { HeroVisualSystem } from "@/components/visual";
import { Section, Heading } from "@/components/ui";
import { GraphExplorer } from "@/components/graph/GraphExplorer";

export default function Home() {
  const heroBlocks = getBlocksBySurface("hero");

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
              {/* VAL-CROSS-013: Primary CTA opens the proof graph node's
                  focus-state, entering the graph-first exploration shell
                  with proof/trust content as the first destination. */}
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <a
                  href="#graph-proof"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-semibold text-background transition-colors hover:bg-accent-bright"
                  data-testid="cta-primary"
                >
                  See What&apos;s Live
                </a>
                <a
                  href="#graph-roadmap"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm font-medium text-secondary transition-colors hover:border-accent hover:text-foreground"
                  data-testid="cta-secondary"
                >
                  Explore the Atlas
                </a>
              </div>
            </div>
          </div>
        </HeroVisualSystem>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Proof / Trust Surface — VAL-NARR-013, VAL-CROSS-009            */}
      {/* Appears immediately after the hero, before the graph shell,     */}
      {/* so users encounter proof before dense exploration content.       */}
      {/* ---------------------------------------------------------------- */}
      <ProofModule />

      {/* ---------------------------------------------------------------- */}
      {/* Graph-First Exploration Shell                                    */}
      {/* VAL-ROADMAP-001: Reads as a graph-first explorable mindmap      */}
      {/* VAL-ROADMAP-011: Node-first exploration is primary model        */}
      {/* VAL-ROADMAP-013: No linear scrolling required                   */}
      {/* ---------------------------------------------------------------- */}
      <Section id="atlas" divider="top" container="wide">
        <div>
          <Heading
            label="BETTER Atlas"
            title="Explore the Ecosystem"
            description="Navigate the BETTER ecosystem through the interactive graph. Select any node to explore its content, or use the related links to traverse between connected surfaces."
          />
          <div className="mt-8">
            <GraphExplorer />
          </div>
        </div>
      </Section>
    </div>
  );
}
