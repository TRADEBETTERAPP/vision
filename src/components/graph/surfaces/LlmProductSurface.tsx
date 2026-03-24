import { LLM_PRODUCT_CONTENT } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import { BetterCard } from "@/components/ui/BetterCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LlmProductSurface() {
  return (
    <div className="space-y-6">
      <BetterCard>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <MaturityBadge status="planned" />
            <EvidenceHook source={LLM_PRODUCT_CONTENT.source} />
          </div>
          <CardTitle className="text-lg text-white">
            {LLM_PRODUCT_CONTENT.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-5">
          <p className="text-sm leading-relaxed text-white">
            {LLM_PRODUCT_CONTENT.subtitle}
          </p>
          <p className="text-sm leading-relaxed text-white">
            {LLM_PRODUCT_CONTENT.overview}
          </p>
        </CardContent>
      </BetterCard>

      <div className="grid gap-4 xl:grid-cols-3">
        {LLM_PRODUCT_CONTENT.sections.map((section) => (
          <BetterCard key={section.id}>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <MaturityBadge status={section.status} />
                <EvidenceHook source={section.source} />
              </div>
              <CardTitle className="text-sm text-white">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              <p className="text-xs leading-relaxed text-white">
                {section.summary}
              </p>

              <div className="grid gap-3">
                {section.metrics.map((metric) => (
                  <Card
                    key={metric.id}
                    size="sm"
                    className="border-white/12 bg-white/[0.04]"
                  >
                    <CardContent className="space-y-1 py-3">
                      <p className="font-terminal text-[11px] uppercase tracking-[-0.08em] text-white">
                        {metric.label}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {metric.value}
                      </p>
                      <p className="text-xs leading-relaxed text-white">
                        {metric.detail}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {section.bullets && section.bullets.length > 0 && (
                <div className="space-y-2">
                  {section.bullets.map((bullet) => (
                    <p key={bullet} className="text-xs leading-relaxed text-white">
                      • {bullet}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </BetterCard>
        ))}
      </div>
    </div>
  );
}
