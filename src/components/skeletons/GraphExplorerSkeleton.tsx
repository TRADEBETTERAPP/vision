/**
 * GraphExplorerSkeleton — progressive loading placeholder for the
 * dynamically imported GraphExplorer component.
 *
 * VAL-VISUAL-027: Skeleton screens provide progressive loading feedback
 * so users see meaningful content before heavy graph JS loads.
 *
 * Renders a lightweight placeholder that mimics the graph workspace
 * structure: orientation header, node grid skeleton, minimap bar,
 * and inspector placeholder.
 */
export function GraphExplorerSkeleton() {
  return (
    <div
      data-testid="graph-explorer-skeleton"
      className="space-y-6 animate-pulse"
      role="status"
      aria-label="Loading graph workspace…"
    >
      {/* Orientation header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-4 w-24 rounded bg-surface" />
          <div className="h-3 w-16 rounded bg-surface/60" />
        </div>
        <div className="h-8 w-24 rounded border border-border/30 bg-surface/40" />
      </div>

      {/* Investor path affordance skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-44 rounded-md border border-accent/10 bg-accent/5" />
      </div>

      {/* Node grid skeleton — 4-column grid matching GraphNodeMap */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border border-border/40 bg-surface/30 p-3"
          >
            <div className="h-5 w-5 shrink-0 rounded bg-muted/20" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-surface" />
              <div className="h-3 w-full rounded bg-surface/60" />
            </div>
            <div className="h-4 w-12 shrink-0 rounded bg-surface/40" />
          </div>
        ))}
      </div>

      {/* Minimap skeleton */}
      <div className="flex items-center gap-1 rounded-md border border-border/20 bg-background/30 px-3 py-1.5">
        <div className="mr-1 h-3 w-8 rounded bg-muted/20" />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-5 w-10 rounded bg-surface/30" />
        ))}
      </div>

      {/* Inspector skeleton */}
      <div className="rounded-lg border border-border/30 bg-surface/40 px-4 py-2">
        <div className="h-4 w-64 rounded bg-surface/60 mx-auto" />
      </div>
    </div>
  );
}
