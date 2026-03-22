/**
 * Navigation destinations required by VAL-NARR-004.
 * Each destination opens a graph focus state via #graph-<id> hash.
 *
 * Graph-first navigation: nav actions open the intended graph destination
 * or focus state rather than jumping between disconnected document anchors.
 *
 * Separated into a shared module so both server-side layout
 * and client-side MobileNav can import it without issues.
 */
export const NAV_ITEMS = [
  { label: "What is BETTER", href: "#graph-what-is-better" },
  { label: "Live Now", href: "#graph-live-now" },
  { label: "Roadmap", href: "#graph-roadmap" },
  { label: "Tokenomics", href: "#graph-tokenomics" },
  { label: "Architecture", href: "#graph-architecture" },
  { label: "Evidence & Sources", href: "#graph-evidence" },
  { label: "Risks & Caveats", href: "#graph-risks" },
] as const;
