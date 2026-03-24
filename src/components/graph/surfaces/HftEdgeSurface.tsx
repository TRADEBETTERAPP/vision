import { HFT_EDGE_CONTENT } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HftEdgeSurface() {
  return (
    <div className="space-y-6">
      <Card className="border-white/12 bg-white/[0.04]">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <MaturityBadge status="in_progress" />
            <EvidenceHook source={HFT_EDGE_CONTENT.source} />
          </div>
          <CardTitle className="text-lg text-white">
            {HFT_EDGE_CONTENT.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-5">
          <p className="text-sm leading-relaxed text-white">
            {HFT_EDGE_CONTENT.subtitle}
          </p>
          <p className="text-sm leading-relaxed text-white">
            {HFT_EDGE_CONTENT.overview}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {HFT_EDGE_CONTENT.sections.map((section) => (
          <Card key={section.id} className="border-white/12 bg-white/[0.04]">
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

              {section.formula && (
                <Card size="sm" className="border-white/12 bg-white/[0.04]">
                  <CardContent className="space-y-2 py-3">
                    <p className="font-terminal text-[11px] uppercase tracking-[-0.08em] text-white">
                      {section.formula.label}
                    </p>
                    <p className="font-terminal text-xs text-white">
                      {section.formula.expression}
                    </p>
                    <p className="text-xs leading-relaxed text-white">
                      {section.formula.detail}
                    </p>
                  </CardContent>
                </Card>
              )}

              {section.bullets && section.bullets.length > 0 && (
                <div className="space-y-2">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
