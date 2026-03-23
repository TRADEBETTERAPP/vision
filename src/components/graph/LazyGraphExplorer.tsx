"use client";

/**
 * LazyGraphExplorer — client component wrapper that dynamically imports
 * the heavy GraphExplorer component with a skeleton loading state.
 *
 * VAL-VISUAL-027: The graph workspace (GraphShell + all surfaces +
 * content data) is the heaviest component tree. Dynamic importing it
 * ensures the initial JS bundle stays small and the hero/brand band
 * renders before the graph workspace loads.
 *
 * Uses `next/dynamic` with `ssr: false` to ensure the graph workspace
 * and its heavy dependencies (graph state, surfaces, content models)
 * load entirely on the client after first paint.
 */

import dynamic from "next/dynamic";
import { GraphExplorerSkeleton } from "@/components/skeletons";

const GraphExplorer = dynamic(
  () =>
    import("@/components/graph/GraphExplorer").then((mod) => mod.GraphExplorer),
  {
    loading: () => <GraphExplorerSkeleton />,
    ssr: false,
  }
);

export function LazyGraphExplorer() {
  return <GraphExplorer />;
}
