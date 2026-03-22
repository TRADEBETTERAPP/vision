import { getBlocksBySurface } from "@/content";
import MaturityBadge from "./MaturityBadge";
import EvidenceHook from "./EvidenceHook";

/**
 * ProofModule — proof/trust surface that appears between the hero and dense
 * roadmap content. Shows live product evidence, trust cues, and real
 * credibility signals so users encounter conviction before strategy exposition.
 *
 * VAL-NARR-013: Proof surface appears before dense roadmap exposition.
 * VAL-CROSS-001: First-visit flow explains BETTER, proof, and current maturity quickly.
 * VAL-CROSS-009: Section has one dominant job — proof/trust.
 * VAL-CROSS-010: CTA follows live/proof path.
 * VAL-CROSS-011: CTA promises consistent with hero and other surfaces.
 */
export default function ProofModule() {
  const proofBlocks = getBlocksBySurface("proof");

  return (
    <section
      id="proof"
      data-testid="proof-section"
      className="border-t border-border px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Section header — single dominant job: proof/trust */}
        <p className="mb-2 text-center font-terminal text-xs font-medium uppercase tracking-widest text-accent">
          Live &amp; Proven
        </p>
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Built and Shipping
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-secondary">
          BETTER isn&apos;t a whitepaper — it&apos;s a live product with real
          users, real trades, and real on-chain mechanics. Here&apos;s what&apos;s
          already working.
        </p>

        {/* Proof items grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {proofBlocks.map((block) => (
            <article
              key={block.id}
              className="group relative rounded-lg border border-accent-green/20 bg-accent-green/5 p-5 transition-colors hover:border-accent-green/40"
              data-testid="proof-item"
            >
              <div className="mb-3 flex items-center gap-3">
                <MaturityBadge status={block.status} />
                <EvidenceHook source={block.source} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {block.title}
              </h3>
              <p className="text-sm leading-relaxed text-secondary">
                {block.body}
              </p>
            </article>
          ))}
        </div>

        {/* Proof section CTA — consistent with hero's live-first direction (VAL-CROSS-011) */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="https://docs.tradebetter.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-semibold text-background transition-colors hover:bg-accent-bright"
            data-testid="proof-cta-primary"
          >
            Read the Docs ↗
          </a>
          <a
            href="#graph-live-now"
            className="inline-flex h-12 items-center justify-center rounded-md border border-border px-8 text-sm font-medium text-secondary transition-colors hover:border-accent hover:text-foreground"
            data-testid="proof-cta-secondary"
          >
            See Full Live Scope
          </a>
        </div>
      </div>
    </section>
  );
}
