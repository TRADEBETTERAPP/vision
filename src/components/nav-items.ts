/**
 * Navigation destinations required by VAL-NARR-004.
 * Each destination maps to an anchor section on the page.
 *
 * Separated into a shared module so both server-side layout
 * and client-side MobileNav can import it without issues.
 */
export const NAV_ITEMS = [
  { label: "What is BETTER", href: "#what-is-better" },
  { label: "Live Now", href: "#live-now" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Evidence & Sources", href: "#evidence" },
  { label: "Risks & Caveats", href: "#risks" },
] as const;
