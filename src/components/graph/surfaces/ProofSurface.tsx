/**
 * ProofSurface — the "Proof & Trust" graph surface content.
 * Renders proof/trust content when focused via the graph shell.
 */
import { getBlocksBySurface } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";

export function ProofSurface() {
  const proofBlocks = getBlocksBySurface("proof");

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-secondary">
        BETTER isn&apos;t a whitepaper — it&apos;s a live product with real users,
        real trades, and real on-chain mechanics.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {proofBlocks.map((block) => (
          <div
            key={block.id}
            className="rounded-lg border border-accent-green/20 bg-accent-green/5 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <MaturityBadge status={block.status} />
              <EvidenceHook source={block.source} />
            </div>
            <h4 className="mb-1 text-sm font-semibold text-foreground">
              {block.title}
            </h4>
            <p className="text-xs leading-relaxed text-secondary">{block.body}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <a
          href="https://docs.tradebetter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-6 text-sm font-semibold text-background transition-colors hover:bg-accent-bright"
        >
          Read the Docs ↗
        </a>
      </div>
    </div>
  );
}
