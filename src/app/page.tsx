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
        className="relative"
      >
        <HeroVisualSystem>
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
            <div className="mx-auto max-w-3xl">
              {/* Brand signal — BETTER logotype is the loudest element (VAL-NARR-012, VAL-VISUAL-019) */}
              <h1 className="mb-3 flex justify-center">
                <BetterLogotype variant="hero" data-testid="hero-logotype" />
              </h1>

              {/* Tagline — one dominant promise */}
              <p
                className="mx-auto mb-4 max-w-2xl text-lg font-medium leading-snug text-foreground sm:text-xl lg:text-2xl"
                data-testid="hero-tagline"
              >
                Prediction-market intelligence, automated.
              </p>

              {/* Plain-language definition (VAL-NARR-001) */}
              {heroDefinition && (
                <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-secondary sm:text-base">
                  {heroDefinition.body}
                </p>
              )}

              {/* Live vs future status framing (VAL-NARR-002) — inline condensed, no split cards */}
              <div
                className="mx-auto mb-6 max-w-2xl"
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
              {/* VAL-CROSS-014: CTAs target graph focus states so the workspace
                  is the entry surface. Primary CTA opens proof/live evidence;
                  secondary CTA opens the full atlas overview. */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href="#graph-proof"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-8 text-sm font-semibold text-background transition-colors hover:bg-accent-bright"
                  data-testid="cta-primary"
                >
                  See What&apos;s Live
                </a>
                <a
                  href="#graph-roadmap"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-border px-8 text-sm font-medium text-secondary transition-colors hover:border-accent hover:text-foreground"
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
      {/* Graph-First Workspace — DEFAULT loaded exploration state         */}
      {/* VAL-ROADMAP-014: Pure graph workspace is primary visible surface */}
      {/* VAL-ROADMAP-015: Guided investor pitch path through ordered gates*/}
      {/* VAL-ROADMAP-017: Start affordance + resumable progress          */}
      {/* VAL-CROSS-014: Investor-path entry from default graph workspace */}
      {/* The graph workspace appears immediately after the compact hero, */}
      {/* making it the primary visible surface — no proof-page handoff   */}
      {/* is required before entering graph exploration.                   */}
      {/* ---------------------------------------------------------------- */}
      <Section id="atlas" divider="top" container="wide">
        <div>
          <Heading
            label="BETTER Atlas"
            title="Explore the Ecosystem"
            description="Navigate the BETTER ecosystem through the interactive graph. Start the Investor Pitch Path for a guided walkthrough, or select any node to explore freely."
          />
          <div className="mt-6">
            <GraphExplorer />
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Proof / Trust Surface — VAL-NARR-013, VAL-CROSS-009            */}
      {/* Now appears below the graph workspace as supplementary proof.   */}
      {/* Users who select the Proof graph node get proof content inline  */}
      {/* via the graph shell; this module provides additional trust       */}
      {/* context for users who scroll past the atlas.                    */}
      {/* ---------------------------------------------------------------- */}
      <ProofModule />
    </div>
  );
}
