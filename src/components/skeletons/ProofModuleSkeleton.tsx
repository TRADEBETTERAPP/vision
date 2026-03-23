/**
 * ProofModuleSkeleton — placeholder for below-fold lazy-loaded ProofModule.
 *
 * VAL-VISUAL-027: Skeleton screens for progressive loading.
 * Renders a lightweight version of the proof section structure.
 */
export function ProofModuleSkeleton() {
  return (
    <section
      data-testid="proof-module-skeleton"
      className="border-t border-border px-4 py-20 sm:px-6 lg:px-8 animate-pulse"
      role="status"
      aria-label="Loading proof section…"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section header skeleton */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-3 w-24 rounded bg-surface" />
          <div className="h-8 w-64 rounded bg-surface" />
          <div className="h-5 w-96 max-w-full rounded bg-surface/60" />
        </div>

        {/* Proof cards skeleton grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg p-5"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="h-5 w-14 rounded bg-surface/40" />
                <div className="h-4 w-4 rounded bg-surface/30" />
              </div>
              <div className="mb-2 h-5 w-3/4 rounded bg-surface" />
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-surface/60" />
                <div className="h-3 w-5/6 rounded bg-surface/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
