"use client";

/**
 * GraphNavigation — replaces section-anchor nav links with graph-destination
 * actions that open graph focus states.
 *
 * VAL-NARR-004: Navigation opens graph destinations and focus states instead
 * of jumping between document anchors.
 *
 * Used by both desktop header nav and mobile overlay nav.
 */

import { GRAPH_NODES, graphNodeHash } from "@/content/graph-nodes";

/**
 * Navigation items derived from graph nodes.
 * Each item opens the corresponding graph focus state via hash navigation.
 */
export const GRAPH_NAV_ITEMS = GRAPH_NODES.map((node) => ({
  label: node.label,
  href: graphNodeHash(node.id),
  nodeId: node.id,
  icon: node.icon,
}));

/**
 * Filter to essential nav items for compact header display.
 * Shows the most important destinations without overwhelming the nav bar.
 */
export const HEADER_NAV_ITEMS = GRAPH_NAV_ITEMS.filter((item) =>
  ["what-is-better", "live-now", "roadmap", "tokenomics", "architecture", "evidence", "risks"].includes(
    item.nodeId
  )
);
