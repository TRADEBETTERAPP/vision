import { MACRO_THESIS_CONTENT } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import { BetterCard } from "@/components/ui/BetterCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MacroThesisSurface() {
  return (
    <div className="space-y-6">
      <BetterCard>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <MaturityBadge status="live" />
            <EvidenceHook source={MACRO_THESIS_CONTENT.source} />
          </div>
          <CardTitle className="text-lg text-white">
            {MACRO_THESIS_CONTENT.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-5">
          <p className="text-sm leading-relaxed text-white">
            {MACRO_THESIS_CONTENT.subtitle}
          </p>
          <p className="text-sm leading-relaxed text-white">
            {MACRO_THESIS_CONTENT.overview}
          </p>
        </CardContent>
      </BetterCard>

      <div className="grid gap-4 xl:grid-cols-3">
        {MACRO_THESIS_CONTENT.claims.map((claim) => (
          <BetterCard key={claim.id}>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <MaturityBadge status={claim.status} />
                <EvidenceHook source={claim.source} />
              </div>
              <CardTitle className="text-sm text-white">{claim.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              <p className="text-xs leading-relaxed text-white">
                {claim.summary}
              </p>

              {claim.references && claim.references.length > 0 && (
                <div>
                  <p className="mb-2 font-terminal text-[11px] uppercase tracking-[-0.08em] text-white">
                    Reference frame
                  </p>
                  <ul className="space-y-1 text-xs text-white">
                    {claim.references.map((reference) => (
                      <li key={reference}>• {reference}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-3">
                {claim.metrics.map((metric) => (
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
            </CardContent>
          </BetterCard>
        ))}
      </div>
    </div>
  );
}
