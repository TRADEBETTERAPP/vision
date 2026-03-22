/**
 * Release-hardening tests for VAL-CROSS-008.
 *
 * Verifies the production build is free of localhost leaks, broken
 * asset references, and that the deployed surface will handle deep
 * links, refreshes, and official external exits cleanly.
 */

import React from "react";
import { render } from "@testing-library/react";
import Home from "../page";
import { NAV_ITEMS } from "@/components/nav-items";
import { NARRATIVE_BLOCKS } from "@/content/narrative";

// ---------------------------------------------------------------------------
// 1. No localhost or development-only references in rendered output
// ---------------------------------------------------------------------------

describe("Release hardening — no localhost leaks", () => {
  it("rendered Home page contains no localhost or 127.0.0.1 references", () => {
    const { container } = render(<Home />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/localhost/i);
    expect(html).not.toMatch(/127\.0\.0\.1/);
    expect(html).not.toMatch(/:3100/);
    expect(html).not.toMatch(/:3101/);
  });

  it("content layer contains no localhost URLs", () => {
    const allContent = JSON.stringify(NARRATIVE_BLOCKS);
    expect(allContent).not.toMatch(/localhost/i);
    expect(allContent).not.toMatch(/127\.0\.0\.1/);
  });

  it("content layer contains no dead docs.betteragent.ai hostname", () => {
    const allContent = JSON.stringify(NARRATIVE_BLOCKS);
    expect(allContent).not.toMatch(/docs\.betteragent\.ai/);
  });
});

// ---------------------------------------------------------------------------
// 2. External links are all HTTPS (no insecure http://)
// ---------------------------------------------------------------------------

describe("Release hardening — external link integrity", () => {
  it("all external hrefs in rendered page use HTTPS", () => {
    const { container } = render(<Home />);
    const anchors = container.querySelectorAll("a[href^='http']");
    anchors.forEach((anchor) => {
      const href = anchor.getAttribute("href")!;
      expect(href).toMatch(/^https:\/\//);
    });
  });

  it("narrative source URLs all use HTTPS", () => {
    for (const block of NARRATIVE_BLOCKS) {
      if (block.source?.href && block.source.href.startsWith("http")) {
        expect(block.source.href).toMatch(/^https:\/\//);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// 3. Deep-link targets — every nav hash has a matching section ID
// ---------------------------------------------------------------------------

describe("Release hardening — deep-link target integrity", () => {
  it("every NAV_ITEM uses the graph-first hash format", () => {
    for (const item of NAV_ITEMS) {
      if (item.href.startsWith("#")) {
        // All nav items should use #graph-<id> format for the graph shell
        expect(item.href).toMatch(/^#graph-/);
      }
    }
  });

  it("graph-first nav targets correspond to valid graph node IDs", () => {
    const { container } = render(<Home />);
    // The graph shell should be rendered with graph node buttons
    const graphNodes = container.querySelectorAll('[data-testid="graph-node-button"]');
    const graphNodeLabels = Array.from(graphNodes).map(
      (n) => n.getAttribute("aria-label")?.toLowerCase() ?? ""
    );
    // Each nav item should have a matching graph node
    for (const item of NAV_ITEMS) {
      const matchFound = graphNodeLabels.some(
        (label) => label.includes(item.label.toLowerCase())
      );
      expect(matchFound).toBe(true);
    }
  });

  it("all in-page CTA hrefs starting with # use valid graph or section targets", () => {
    const { container } = render(<Home />);
    const hashLinks = container.querySelectorAll("a[href^='#']");
    hashLinks.forEach((link) => {
      const href = link.getAttribute("href")!;
      // Graph-first links (#graph-*) are handled by the graph shell,
      // not by section IDs. They are valid by design.
      if (href.startsWith("#graph-")) {
        // Valid graph destination — no section ID needed
        return;
      }
      // Legacy anchors should still resolve
      const targetId = href.slice(1);
      const target = container.querySelector(`#${targetId}`);
      expect(target).not.toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// 4. Production metadata is set correctly
// ---------------------------------------------------------------------------

describe("Release hardening — metadata contract", () => {
  it("metadataBase uses a production URL, not localhost", async () => {
    // Import the metadata export from layout
    // We verify by checking the layout module directly
    const layoutModule = await import("../layout");
    const metadata = (layoutModule as Record<string, unknown>).metadata as {
      metadataBase?: URL;
      title?: string;
      description?: string;
      openGraph?: { title?: string };
    };

    expect(metadata).toBeDefined();
    expect(metadata.metadataBase).toBeDefined();
    expect(metadata.metadataBase!.toString()).not.toMatch(/localhost/i);
    expect(metadata.metadataBase!.toString()).not.toMatch(/127\.0\.0\.1/);
    expect(metadata.metadataBase!.toString()).toMatch(/^https:\/\//);
  });

  it("metadata includes required SEO fields", async () => {
    const layoutModule = await import("../layout");
    const metadata = (layoutModule as Record<string, unknown>).metadata as {
      title?: string;
      description?: string;
      openGraph?: { title?: string };
    };

    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
    expect(metadata.openGraph?.title).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// 5. 404 page provides coherent recovery
// ---------------------------------------------------------------------------

describe("Release hardening — 404 recovery", () => {
  it("NotFound page renders recovery link to home", async () => {
    // Dynamic import to keep test isolated
    const NotFoundModule = await import("../not-found");
    const NotFound = NotFoundModule.default;
    const { container } = render(<NotFound />);

    const recoveryLink = container.querySelector("a[href='/']");
    expect(recoveryLink).not.toBeNull();
    expect(recoveryLink!.textContent).toMatch(/return to home/i);
  });
});
