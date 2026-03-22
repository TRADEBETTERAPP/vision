/**
 * LiveNowSurface — the "Live Now" graph surface content.
 * Renders current scope content when focused via the graph shell.
 */
import { getBlocksBySurface } from "@/content";
import NarrativeCard from "@/components/NarrativeCard";

export function LiveNowSurface() {
  const currentScopeBlocks = getBlocksBySurface("current_scope");

  return (
    <div className="space-y-6">
      <p className="text-sm text-secondary">
        The current production capabilities of the BETTER ecosystem — live today
        for qualifying token holders.
      </p>
      <p className="text-xs text-muted" data-testid="freshness-cue">
        Status as of 2026-Q1 · Source: BETTER Docs ·{" "}
        <a
          href="https://docs.tradebetter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors hover:text-secondary"
        >
          docs.tradebetter.app
        </a>
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentScopeBlocks.map((block) => (
          <NarrativeCard key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
