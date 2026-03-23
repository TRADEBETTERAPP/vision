/**
 * Tests for visible on-chain citation links in allocation rows.
 *
 * Feature: correction-on-chain-citations-visible-links-fix
 *
 * Validates that:
 * - Every allocation row has a DIRECT, VISIBLE clickable basescan or Dune link
 *   (not just hidden in SourceCue.note metadata)
 * - Allocation-specific evidence details (wallet addresses, verification method)
 *   are surfaced as visible hook copy in the rendered UI
 * - Users can click through to verify each allocation's on-chain source directly
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import SupplyAllocation from "../SupplyAllocation";
import { TOKEN_ALLOCATIONS } from "@/content";

describe("On-Chain Citations — Visible Links Fix", () => {
  beforeEach(() => {
    render(<SupplyAllocation />);
  });

  it("every allocation row contains a directly visible clickable link to basescan or Dune", () => {
    const rows = screen.getAllByTestId("allocation-row");
    expect(rows.length).toBe(TOKEN_ALLOCATIONS.length);

    for (const row of rows) {
      const links = within(row).getAllByRole("link");
      const onChainLinks = links.filter((l) => {
        const href = l.getAttribute("href") ?? "";
        return href.includes("basescan.org") || href.includes("dune.com");
      });
      expect(onChainLinks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every allocation row surfaces allocation-specific evidence details as visible text", () => {
    const rows = screen.getAllByTestId("allocation-row");

    for (const row of rows) {
      // The source.note contains evidence details (wallet addresses, verification)
      // These must be visible in the row, not hidden in metadata
      const evidenceDetail = within(row).queryByTestId("allocation-evidence-detail");
      expect(evidenceDetail).not.toBeNull();
      // The evidence detail should contain some text content
      expect(evidenceDetail!.textContent!.trim().length).toBeGreaterThan(0);
    }
  });

  it("each allocation's visible link href matches the allocation source href", () => {
    const rows = screen.getAllByTestId("allocation-row");

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const alloc = TOKEN_ALLOCATIONS[i];
      if (alloc.source.href) {
        const links = within(row).getAllByRole("link");
        const matchingLink = links.find(
          (l) => l.getAttribute("href") === alloc.source.href,
        );
        expect(matchingLink).toBeDefined();
      }
    }
  });

  it("visible evidence details mention wallet addresses from source.note", () => {
    const rows = screen.getAllByTestId("allocation-row");

    // Check at least the top allocations (Team, Treasury, SERV) which have specific addresses
    for (let i = 0; i < Math.min(3, rows.length); i++) {
      const row = rows[i];
      const alloc = TOKEN_ALLOCATIONS[i];
      // Extract address fragment from note
      const addressMatch = alloc.source.note?.match(/0x[a-fA-F0-9]{4,}/);
      if (addressMatch) {
        const shortAddr = addressMatch[0].slice(0, 8);
        const evidenceDetail = within(row).getByTestId("allocation-evidence-detail");
        expect(evidenceDetail.textContent).toContain(shortAddr);
      }
    }
  });

  it("every allocation link opens in a new tab (target=_blank)", () => {
    const rows = screen.getAllByTestId("allocation-row");

    for (const row of rows) {
      const links = within(row).getAllByRole("link");
      const onChainLinks = links.filter((l) => {
        const href = l.getAttribute("href") ?? "";
        return href.includes("basescan.org") || href.includes("dune.com");
      });
      for (const link of onChainLinks) {
        expect(link.getAttribute("target")).toBe("_blank");
      }
    }
  });

  it("visible link text includes verification method hint (Basescan or Dune)", () => {
    const rows = screen.getAllByTestId("allocation-row");

    for (const row of rows) {
      const links = within(row).getAllByRole("link");
      const onChainLinks = links.filter((l) => {
        const href = l.getAttribute("href") ?? "";
        return href.includes("basescan.org") || href.includes("dune.com");
      });
      for (const link of onChainLinks) {
        const text = link.textContent ?? "";
        const mentionsSource =
          text.toLowerCase().includes("basescan") ||
          text.toLowerCase().includes("dune") ||
          text.includes("↗");
        expect(mentionsSource).toBe(true);
      }
    }
  });

  /**
   * Row-specific stable-target assertions (round-2 scrutiny fix).
   *
   * LP, Programmatic Funding, and Airdrop/Migration rows must link to
   * direct wallet-specific Basescan address pages (containing ?a=0x…)
   * or the deployer transfer-history page — NOT generic token pages
   * or Dune search pages.
   */
  describe("row-specific stable targets (no generic token/search pages)", () => {
    /** Generic URLs that are NOT acceptable for these rows */
    const GENERIC_TOKEN_PAGE =
      "https://basescan.org/token/0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E";
    const GENERIC_DUNE_SEARCH =
      "https://dune.com/queries?q=";

    function getRowByLabel(label: string) {
      const rows = screen.getAllByTestId("allocation-row");
      return rows.find((r) => r.textContent?.includes(label));
    }

    function getOnChainLinksInRow(row: HTMLElement) {
      const links = within(row).getAllByRole("link");
      return links.filter((l) => {
        const href = l.getAttribute("href") ?? "";
        return href.includes("basescan.org") || href.includes("dune.com");
      });
    }

    it("LP / Liquidity row links to a wallet-specific Basescan address page, not the generic token page", () => {
      const row = getRowByLabel("LP / Liquidity");
      expect(row).toBeDefined();
      const links = getOnChainLinksInRow(row!);
      expect(links.length).toBeGreaterThanOrEqual(1);
      for (const link of links) {
        const href = link.getAttribute("href")!;
        // Must NOT be exactly the generic token page
        expect(href).not.toBe(GENERIC_TOKEN_PAGE);
        // Must contain a wallet address parameter (?a=0x…) for basescan links
        if (href.includes("basescan.org")) {
          expect(href).toMatch(/\?a=0x[a-fA-F0-9]+/);
        }
      }
    });

    it("Programmatic Funding row links to a wallet-specific Basescan address page, not the generic token page", () => {
      const row = getRowByLabel("Programmatic Funding");
      expect(row).toBeDefined();
      const links = getOnChainLinksInRow(row!);
      expect(links.length).toBeGreaterThanOrEqual(1);
      for (const link of links) {
        const href = link.getAttribute("href")!;
        expect(href).not.toBe(GENERIC_TOKEN_PAGE);
        if (href.includes("basescan.org")) {
          expect(href).toMatch(/\?a=0x[a-fA-F0-9]+/);
        }
      }
    });

    it("Airdrop / Migration row links to a wallet-specific Basescan address page or deployer page, not a generic Dune search", () => {
      const row = getRowByLabel("Airdrop / Migration");
      expect(row).toBeDefined();
      const links = getOnChainLinksInRow(row!);
      expect(links.length).toBeGreaterThanOrEqual(1);
      for (const link of links) {
        const href = link.getAttribute("href")!;
        // Must NOT be a generic Dune search page
        expect(href).not.toMatch(new RegExp(GENERIC_DUNE_SEARCH.replace(/[?]/g, "\\?")));
        // If basescan, must be wallet-specific
        if (href.includes("basescan.org")) {
          expect(href).toMatch(/\?a=0x[a-fA-F0-9]+/);
        }
      }
    });

    it("LP row href includes one of the known LP wallet addresses", () => {
      const row = getRowByLabel("LP / Liquidity");
      expect(row).toBeDefined();
      const links = getOnChainLinksInRow(row!);
      const hrefs = links.map((l) => l.getAttribute("href")!).join(" ");
      // At least one of the two LP wallets should be in the href
      const hasLpWallet =
        hrefs.includes("0x80e29ff551400fb8313af916a8fa164ca310c0d7") ||
        hrefs.includes("0x498581ff718922c3f8e6a244956af099b2652b2b");
      expect(hasLpWallet).toBe(true);
    });

    it("Programmatic Funding row href includes one of the known programmatic wallet addresses", () => {
      const row = getRowByLabel("Programmatic Funding");
      expect(row).toBeDefined();
      const links = getOnChainLinksInRow(row!);
      const hrefs = links.map((l) => l.getAttribute("href")!).join(" ");
      const hasProgWallet =
        hrefs.includes("0x2d407b5a24800a058b8f34b04e6b7b18ad0cae16") ||
        hrefs.includes("0x1b33f383e297f71c85ae55da5d42aea7a08f1a60");
      expect(hasProgWallet).toBe(true);
    });

    it("Airdrop / Migration row href references the deployer address for batch transfer verification", () => {
      const row = getRowByLabel("Airdrop / Migration");
      expect(row).toBeDefined();
      const links = getOnChainLinksInRow(row!);
      const hrefs = links.map((l) => l.getAttribute("href")!).join(" ");
      // The deployer address is the source of the batch airdrop transfers
      expect(hrefs).toContain("0x1bbdc95d322b8fd76e6a00e6c318dfb421d7d322");
    });
  });
});
