"use client";

/**
 * LazyProofModule — client component wrapper that dynamically imports
 * the ProofModule component with a skeleton loading state.
 *
 * VAL-VISUAL-027: ProofModule is below-fold proof/trust content. Wrapping
 * the dynamic import in a client boundary ensures the code-splitting
 * and lazy loading are effective in Next.js App Router, where server-side
 * dynamic() calls resolve synchronously and do not actually defer loading.
 *
 * Uses `next/dynamic` with `ssr: false` so the proof module's JS is
 * fetched only on the client after the initial page shell renders.
 */

import dynamic from "next/dynamic";
import { ProofModuleSkeleton } from "@/components/skeletons";

const ProofModule = dynamic(
  () => import("@/components/ProofModule"),
  {
    loading: () => <ProofModuleSkeleton />,
    ssr: false,
  }
);

export function LazyProofModule() {
  return <ProofModule />;
}
