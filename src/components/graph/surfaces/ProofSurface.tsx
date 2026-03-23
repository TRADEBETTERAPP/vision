/**
 * ProofSurface — the "Proof & Trust" graph surface content.
 * Renders proof/trust content when focused via the graph shell.
 */
import { getBlocksBySurface } from "@/content";
import MaturityBadge from "@/components/MaturityBadge";
import EvidenceHook from "@/components/EvidenceHook";
import { LiquidMetalCard } from "@/components/LiquidMetalCard";

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
          <LiquidMetalCard
            key={block.id}
            className="p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <MaturityBadge status={block.status} />
              <EvidenceHook source={block.source} />
            </div>
            <h4 className="mb-1 text-sm font-semibold text-foreground">
              {block.title}
            </h4>
            <p className="text-xs leading-relaxed text-secondary">{block.body}</p>
          </LiquidMetalCard>
        ))}
      </div>

      <div className="flex justify-center">
        <a
          href="https://docs.tradebetter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-none bg-white px-6 font-terminal text-sm font-semibold uppercase tracking-[-0.08em] text-[#101010] transition-shadow hover:shadow-[0px_0px_16px_0px_rgba(255,255,255,0.75)]"
        >
          Read the Docs ↗
        </a>
      </div>
    </div>
  );
}
