import { HeroVisualSystem } from "@/components/visual";
import { Section } from "@/components/ui";
import { CompactBrandBand } from "@/components/graph/CompactBrandBand";
import { LazyGraphExplorer } from "@/components/graph/LazyGraphExplorer";
import { LazyProofModule } from "@/components/LazyProofModule";

/**
 * Heavy component imports are handled through client-boundary wrappers
 * that use next/dynamic with ssr:false. This ensures lazy loading is
 * effective in Next.js App Router (where server-side dynamic() resolves
 * synchronously and does NOT defer loading).
 *
 * VAL-VISUAL-027:
 * - LazyGraphExplorer wraps GraphExplorer behind a client boundary
 * - LazyProofModule wraps ProofModule behind a client boundary
 * Both show skeleton loading states while the real component JS loads.
 */

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ---------------------------------------------------------------- */}
      {/* Graph-First Workspace — DEFAULT loaded exploration state         */}
      {/* VAL-ROADMAP-014: Pure graph workspace is primary visible surface */}
      {/* VAL-ROADMAP-015: Guided investor pitch path through ordered gates*/}
      {/* VAL-ROADMAP-017: Start affordance + resumable progress          */}
      {/* VAL-CROSS-014: Investor-path entry from default graph workspace */}
      {/* VAL-VISUAL-026: Single hero/brand surface inside graph workspace*/}
      {/*                                                                  */}
      {/* The graph workspace is the FIRST and ONLY above-the-fold section.*/}
      {/* A compact brand band (logotype + tagline) is server-rendered     */}
      {/* directly at the top of the atlas for content-first display, then */}
      {/* the graph explorer loads below it. No full hero section exists.  */}
      {/* The HeroVisualSystem wraps the entire atlas for immersive bg.    */}
      {/* ---------------------------------------------------------------- */}
      <Section id="atlas" divider="none" container="wide" spacing="hero">
        <HeroVisualSystem>
          <div>
            {/* Compact brand treatment — server-rendered for content-first */}
            <CompactBrandBand />

            {/* Graph explorer — the explorable mindmap (lazy-loaded) */}
            <LazyGraphExplorer />
          </div>
        </HeroVisualSystem>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Proof / Trust Surface — VAL-NARR-013, VAL-CROSS-009            */}
      {/* Appears below the atlas as supplementary proof.                 */}
      {/* Users who select the Proof graph node get proof content inline  */}
      {/* via the graph shell; this module provides additional trust       */}
      {/* context for users who scroll past the atlas.                    */}
      {/* ---------------------------------------------------------------- */}
      <LazyProofModule />
    </div>
  );
}
