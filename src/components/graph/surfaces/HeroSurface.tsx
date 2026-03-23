/**
 * HeroSurface — the "What is BETTER" graph surface content.
 * Renders the hero messaging content when focused via the graph shell.
 */
import { getBlocksBySurface } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import CaveatFrame from "@/components/CaveatFrame";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";

export function HeroSurface() {
  const heroBlocks = getBlocksBySurface("hero");
  const heroDefinition = heroBlocks.find((b) => b.id === "hero-definition");
  const heroLiveToday = heroBlocks.find((b) => b.id === "hero-live-today");
  const heroVision = heroBlocks.find((b) => b.id === "hero-vision");

  return (
    <div className="space-y-6">
      {heroDefinition && (
        <LiquidMetalCard className="p-5">
          <h3 className="mb-2 text-lg font-bold text-foreground">
            What is BETTER?
          </h3>
          <p className="text-sm leading-relaxed text-secondary">
            {heroDefinition.body}
          </p>
        </LiquidMetalCard>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {heroLiveToday && (
          <LiquidMetalCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <MaturityBadge status="live" />
              <EvidenceHook source={heroLiveToday.source} />
            </div>
            <h4 className="mb-1 text-sm font-semibold text-foreground">
              {heroLiveToday.title}
            </h4>
            <p className="text-xs text-secondary">{heroLiveToday.body}</p>
          </LiquidMetalCard>
        )}

        {heroVision && (
          <LiquidMetalCard className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <MaturityBadge status="planned" />
              <EvidenceHook source={heroVision.source} />
            </div>
            <h4 className="mb-1 text-sm font-semibold text-foreground">
              {heroVision.title}
            </h4>
            <p className="text-xs text-secondary">{heroVision.body}</p>
            {heroVision.confidence && (
              <CaveatFrame confidence={heroVision.confidence} className="mt-3" />
            )}
          </LiquidMetalCard>
        )}
      </div>
    </div>
  );
}
