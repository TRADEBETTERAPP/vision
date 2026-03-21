import type { SourceCue } from "@/content";

/**
 * Renders a visible evidence / source hook next to a claim.
 * Satisfies VAL-NARR-008: aggressive claims expose evidence hooks.
 *
 * If the source has an href, it renders as a link. Otherwise it renders
 * as a non-interactive cue. The asOf date provides freshness framing.
 */
export default function EvidenceHook({
  source,
  className = "",
}: {
  source: SourceCue;
  className?: string;
}) {
  const inner = (
    <>
      <SourceIcon type={source.type} />
      <span className="font-medium">{source.label}</span>
      {source.asOf && (
        <span className="text-muted">as of {source.asOf}</span>
      )}
    </>
  );

  const baseClasses = `inline-flex items-center gap-1.5 rounded border border-border bg-surface px-2 py-1 font-terminal text-xs text-secondary ${className}`;

  if (source.href) {
    return (
      <a
        href={source.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} transition-colors hover:border-accent hover:text-foreground`}
        data-testid="evidence-hook"
      >
        {inner}
        <span aria-hidden="true">↗</span>
      </a>
    );
  }

  return (
    <span className={baseClasses} data-testid="evidence-hook">
      {inner}
    </span>
  );
}

function SourceIcon({ type }: { type: SourceCue["type"] }) {
  const icons: Record<string, string> = {
    canonical: "✓",
    scenario_based: "◆",
    illustrative: "◇",
    external: "⊕",
  };
  return (
    <span className="opacity-70" aria-hidden="true">
      {icons[type] ?? "•"}
    </span>
  );
}
