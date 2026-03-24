import { HFT_EDGE_CONTENT } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import { BetterCard } from "@/components/ui/BetterCard";

export function HftEdgeSurface() {
  return (
    <div className="space-y-6">
      <BetterCard className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <MaturityBadge status="in_progress" />
          <EvidenceHook source={HFT_EDGE_CONTENT.source} />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          {HFT_EDGE_CONTENT.title}
        </h3>
        <p className="mb-2 text-sm leading-relaxed text-white">
          {HFT_EDGE_CONTENT.subtitle}
        </p>
        <p className="text-sm leading-relaxed text-white">
          {HFT_EDGE_CONTENT.overview}
        </p>
      </BetterCard>

      <div className="grid gap-4 xl:grid-cols-2">
        {HFT_EDGE_CONTENT.sections.map((section) => (
          <BetterCard key={section.id} className="p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <MaturityBadge status={section.status} />
              <EvidenceHook source={section.source} />
            </div>

            <h4 className="mb-2 text-sm font-semibold text-foreground">
              {section.title}
            </h4>
            <p className="text-xs leading-relaxed text-white">
              {section.summary}
            </p>

            <div className="mt-4 grid gap-3">
              {section.metrics.map((metric) => (
                <BetterCard key={metric.id} className="p-3">
                  <p className="font-terminal text-[11px] uppercase tracking-[-0.08em] text-white">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white">
                    {metric.detail}
                  </p>
                </BetterCard>
              ))}
            </div>

            {section.formula && (
              <BetterCard className="mt-4 p-3">
                <p className="font-terminal text-[11px] uppercase tracking-[-0.08em] text-white">
                  {section.formula.label}
                </p>
                <p className="mt-2 font-terminal text-xs text-white">
                  {section.formula.expression}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white">
                  {section.formula.detail}
                </p>
              </BetterCard>
            )}

            {section.bullets && section.bullets.length > 0 && (
              <div className="mt-4 space-y-2">
                {section.bullets.map((bullet) => (
                  <p
                    key={bullet}
                    className="text-xs leading-relaxed text-white"
                  >
                    • {bullet}
                  </p>
                ))}
              </div>
            )}
          </BetterCard>
        ))}
      </div>
    </div>
  );
}
