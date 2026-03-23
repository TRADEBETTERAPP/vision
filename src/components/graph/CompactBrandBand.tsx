/**
 * CompactBrandBand — minimal BETTER brand treatment integrated into the
 * graph workspace header.
 *
 * This is NOT a full hero section. It provides a compact logotype + tagline
 * treatment at the top of the graph-first workspace so investors see the
 * brand immediately on load without the graph being pushed below the fold.
 *
 * VAL-VISUAL-026: Single hero/brand surface inside graph workspace
 * VAL-NARR-012: BETTER logotype is the dominant above-the-fold brand signal
 * VAL-NARR-001: Hero explains BETTER in plain language (tagline)
 * VAL-NARR-002: Live vs future status framing (compact inline)
 * VAL-NARR-010: CTAs are honest about destination
 */

import { BetterLogotype } from "@/components/BetterLogotype";
import { getBlocksBySurface } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";

export function CompactBrandBand() {
  const heroBlocks = getBlocksBySurface("hero");
  const heroDefinition = heroBlocks.find((b) => b.id === "hero-definition");
  const heroLiveToday = heroBlocks.find((b) => b.id === "hero-live-today");
  const heroVision = heroBlocks.find((b) => b.id === "hero-vision");

  return (
    <div data-testid="compact-brand-band" className="mb-4 text-center">
      {/* Brand signal — BETTER logotype is the loudest element (VAL-NARR-012, VAL-VISUAL-019) */}
      <h1 className="mb-2 flex justify-center">
        <BetterLogotype variant="hero" data-testid="hero-logotype" />
      </h1>

      {/* Tagline — one dominant promise */}
      <p
        className="mx-auto mb-3 max-w-2xl text-lg font-medium leading-snug text-foreground sm:text-xl"
        data-testid="hero-tagline"
      >
        Prediction-market intelligence, automated.
      </p>

      {/* Plain-language definition (VAL-NARR-001) */}
      {heroDefinition && (
        <p className="mx-auto mb-4 max-w-xl text-sm leading-relaxed text-secondary">
          {heroDefinition.body}
        </p>
      )}

      {/* Live vs future status framing (VAL-NARR-002) — compact inline */}
      <div className="mx-auto mb-4 max-w-2xl" data-testid="hero-status-framing">
        <div
          className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-lg px-5 py-2"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          {/* Live status */}
          {heroLiveToday && (
            <div
              className="flex items-center gap-2"
              data-testid="hero-live-status"
            >
              <MaturityBadge status="live" />
              <span className="text-xs text-secondary sm:text-sm">
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
              <span className="text-xs text-secondary sm:text-sm">
                Vaults, agents &amp; HyperEVM ahead
              </span>
              <EvidenceHook source={heroVision.source} />
            </div>
          )}
        </div>

        {/* Caveat framing for future-facing claims (VAL-NARR-009) */}
        {heroVision?.confidence && (
          <CaveatFrame confidence={heroVision.confidence} className="mx-auto mt-2 max-w-lg" />
        )}
      </div>

      {/* Hero CTAs — VAL-NARR-010: live/proof path is primary */}
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        <a
          href="#graph-proof"
          className="inline-flex h-10 items-center justify-center rounded-none bg-white px-6 font-terminal text-sm font-semibold uppercase tracking-[-0.08em] text-[#101010] transition-shadow hover:shadow-[0px_0px_16px_0px_rgba(255,255,255,0.75)]"
          data-testid="cta-primary"
        >
          See What&apos;s Live
        </a>
        <a
          href="#graph-roadmap"
          className="inline-flex h-10 items-center justify-center rounded-none border border-white px-6 font-terminal text-sm font-medium uppercase tracking-[-0.08em] text-white transition-colors hover:bg-white/10"
          data-testid="cta-secondary"
        >
          Explore the Atlas
        </a>
      </div>
    </div>
  );
}
