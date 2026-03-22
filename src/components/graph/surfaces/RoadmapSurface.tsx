/**
 * RoadmapSurface — the "Roadmap" graph surface content.
 * Renders the interactive roadmap atlas when focused via the graph shell.
 */
import { getBlocksBySurface } from "@/content";
import NarrativeCard from "@/components/NarrativeCard";
import MaturityLegend from "@/components/MaturityLegend";
import { RoadmapAtlas } from "@/components/roadmap";

export function RoadmapSurface() {
  const visionBlocks = getBlocksBySurface("vision");

  return (
    <div className="space-y-8">
      {/* Narrative vision cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {visionBlocks.map((block) => (
          <NarrativeCard key={block.id} block={block} />
        ))}
      </div>

      {/* Maturity legend */}
      <div className="max-w-3xl">
        <MaturityLegend />
      </div>

      {/* Interactive Roadmap Atlas */}
      <div>
        <h3 className="mb-6 text-center font-terminal text-sm font-medium uppercase tracking-widest text-accent">
          Interactive Roadmap Atlas
        </h3>
        <RoadmapAtlas />
      </div>
    </div>
  );
}
