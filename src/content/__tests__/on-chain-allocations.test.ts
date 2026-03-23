/**
 * On-chain verified token allocation tests — VAL-TOKEN-020
 *
 * Validates that token allocations use Dune/basescan-verified on-chain data
 * for contract 0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E on Base.
 *
 * Verified allocations from Dune:
 * - Team/Vesting: ~250M (35.26%)
 * - Treasury: ~200M (28.21%)
 * - SERV/Strategic Reserve: ~50M (7.05%)
 * - LP/Liquidity: ~60.9M (8.59%)
 * - Deployer/Programmatic Funding: ~41.1M (5.80%)
 * - Programmatic Funding (distributed): ~25.9M (3.65%)
 * - Airdrop/Migration: ~81.1M (11.44%)
 *
 * Reference: /Users/test/dune_query_results.md
 */

import {
  TOKEN_ALLOCATIONS,
  MINTED_SUPPLY,
  BASE_CONTRACT,
  validateAllocations,
} from "../index";

// ---------------------------------------------------------------------------
// VAL-TOKEN-020: On-chain verified allocations
// ---------------------------------------------------------------------------

describe("On-Chain Verified Token Allocations (VAL-TOKEN-020)", () => {
  it("Team/Vesting allocation is ~250,000,000 BETTER", () => {
    const team = TOKEN_ALLOCATIONS.find(
      (a) => a.label.toLowerCase().includes("team") || a.label.toLowerCase().includes("vesting")
    );
    expect(team).toBeDefined();
    expect(team!.tokens).toBe(250_000_000);
  });

  it("Treasury allocation is ~200,000,000 BETTER", () => {
    const treasury = TOKEN_ALLOCATIONS.find(
      (a) => a.label.toLowerCase().includes("treasury")
    );
    expect(treasury).toBeDefined();
    expect(treasury!.tokens).toBe(200_000_000);
  });

  it("SERV/Strategic Reserve allocation is ~50,000,000 BETTER", () => {
    const serv = TOKEN_ALLOCATIONS.find(
      (a) => a.label.toLowerCase().includes("serv") || a.label.toLowerCase().includes("strategic")
    );
    expect(serv).toBeDefined();
    expect(serv!.tokens).toBe(50_000_000);
  });

  it("LP/Liquidity allocation is ~60,903,359 BETTER", () => {
    const lp = TOKEN_ALLOCATIONS.find(
      (a) => a.label.toLowerCase().includes("lp") || a.label.toLowerCase().includes("liquidity")
    );
    expect(lp).toBeDefined();
    expect(lp!.tokens).toBe(60_903_359);
  });

  it("Programmatic Funding (distributed) allocation is ~25,869,846 BETTER", () => {
    const prog = TOKEN_ALLOCATIONS.find(
      (a) => a.label.toLowerCase().includes("programmatic") && !a.label.toLowerCase().includes("deployer")
    );
    expect(prog).toBeDefined();
    expect(prog!.tokens).toBe(25_869_846);
  });

  it("Deployer/Programmatic allocation is ~41,104,714 BETTER", () => {
    const deployer = TOKEN_ALLOCATIONS.find(
      (a) => a.label.toLowerCase().includes("deployer")
    );
    expect(deployer).toBeDefined();
    expect(deployer!.tokens).toBe(41_104_714);
  });

  it("Airdrop/Migration allocation is ~81,124,021 BETTER", () => {
    const airdrop = TOKEN_ALLOCATIONS.find(
      (a) => a.label.toLowerCase().includes("airdrop") || a.label.toLowerCase().includes("migration")
    );
    expect(airdrop).toBeDefined();
    expect(airdrop!.tokens).toBe(81_124_021);
  });

  it("has exactly 7 allocation categories matching on-chain data", () => {
    expect(TOKEN_ALLOCATIONS.length).toBe(7);
  });

  it("allocations still sum to 100% and reconcile with minted supply", () => {
    const result = validateAllocations();
    expect(result.valid).toBe(true);
    expect(result.totalPercentage).toBeCloseTo(100, 0);
    expect(result.totalTokens).toBe(MINTED_SUPPLY);
  });

  it("Team allocation is NOT 200M (corrected from wrong mapping)", () => {
    const team = TOKEN_ALLOCATIONS.find(
      (a) => a.label.toLowerCase().includes("team") || a.label.toLowerCase().includes("vesting")
    );
    expect(team).toBeDefined();
    expect(team!.tokens).not.toBe(200_000_000);
  });

  it("Treasury allocation is NOT 250M (corrected from wrong mapping)", () => {
    const treasury = TOKEN_ALLOCATIONS.find(
      (a) => a.label.toLowerCase().includes("treasury")
    );
    expect(treasury).toBeDefined();
    expect(treasury!.tokens).not.toBe(250_000_000);
  });
});

// ---------------------------------------------------------------------------
// Source Citations (VAL-TOKEN-020)
// ---------------------------------------------------------------------------

describe("On-Chain Source Citations (VAL-TOKEN-020)", () => {
  it("every allocation has a source with href pointing to basescan or Dune", () => {
    for (const alloc of TOKEN_ALLOCATIONS) {
      expect(alloc.source).toBeDefined();
      expect(alloc.source.href).toBeDefined();
      const href = alloc.source.href!;
      const isBasescan = href.includes("basescan.org");
      const isDune = href.includes("dune.com");
      expect(isBasescan || isDune).toBe(true);
    }
  });

  it("every allocation source type is canonical", () => {
    for (const alloc of TOKEN_ALLOCATIONS) {
      expect(alloc.source.type).toBe("canonical");
    }
  });

  it("BASE_CONTRACT source includes basescan link", () => {
    expect(BASE_CONTRACT.source.href).toBeDefined();
    expect(BASE_CONTRACT.source.href).toContain("basescan.org");
  });

  it("allocation sources include on-chain address references", () => {
    // At least the major allocations should reference their on-chain addresses
    const team = TOKEN_ALLOCATIONS.find(
      (a) => a.label.toLowerCase().includes("team")
    );
    expect(team!.source.note).toMatch(/0x[a-fA-F0-9]+/);
  });

  it("allocation sources reference Dune queries as verification", () => {
    // At least some allocations should mention Dune verification
    const withDuneRef = TOKEN_ALLOCATIONS.filter(
      (a) => a.source.note?.toLowerCase().includes("dune") || a.source.href?.includes("dune.com")
    );
    expect(withDuneRef.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Row-Specific Direct Links (round-2 scrutiny fix)
// ---------------------------------------------------------------------------

describe("Row-Specific Direct Wallet Links (round-2 scrutiny)", () => {
  const GENERIC_TOKEN_PAGE =
    "https://basescan.org/token/0x396FfAd9469e3d3E3fc4061B79accE2Ad0Ce4B9E";

  it("LP / Liquidity source.href is a direct wallet-specific Basescan link, not the generic token page", () => {
    const lp = TOKEN_ALLOCATIONS.find((a) => a.label.includes("LP"));
    expect(lp).toBeDefined();
    expect(lp!.source.href).toBeDefined();
    expect(lp!.source.href).not.toBe(GENERIC_TOKEN_PAGE);
    expect(lp!.source.href).toMatch(/basescan\.org\/token\/.*\?a=0x[a-fA-F0-9]+/);
  });

  it("Programmatic Funding source.href is a direct wallet-specific Basescan link, not the generic token page", () => {
    const prog = TOKEN_ALLOCATIONS.find(
      (a) => a.label.includes("Programmatic") && !a.label.includes("Deployer")
    );
    expect(prog).toBeDefined();
    expect(prog!.source.href).toBeDefined();
    expect(prog!.source.href).not.toBe(GENERIC_TOKEN_PAGE);
    expect(prog!.source.href).toMatch(/basescan\.org\/token\/.*\?a=0x[a-fA-F0-9]+/);
  });

  it("Airdrop / Migration source.href is a direct wallet-specific Basescan link, not a generic Dune search page", () => {
    const airdrop = TOKEN_ALLOCATIONS.find((a) => a.label.includes("Airdrop"));
    expect(airdrop).toBeDefined();
    expect(airdrop!.source.href).toBeDefined();
    expect(airdrop!.source.href).not.toMatch(/dune\.com\/queries\?q=/);
    expect(airdrop!.source.href).toMatch(/basescan\.org\/token\/.*\?a=0x[a-fA-F0-9]+/);
  });

  it("LP / Liquidity href references a known LP wallet address", () => {
    const lp = TOKEN_ALLOCATIONS.find((a) => a.label.includes("LP"));
    const href = lp!.source.href!;
    const hasKnownLp =
      href.includes("0x80e29ff551400fb8313af916a8fa164ca310c0d7") ||
      href.includes("0x498581ff718922c3f8e6a244956af099b2652b2b");
    expect(hasKnownLp).toBe(true);
  });

  it("Programmatic Funding href references a known programmatic wallet address", () => {
    const prog = TOKEN_ALLOCATIONS.find(
      (a) => a.label.includes("Programmatic") && !a.label.includes("Deployer")
    );
    const href = prog!.source.href!;
    const hasKnownProg =
      href.includes("0x2d407b5a24800a058b8f34b04e6b7b18ad0cae16") ||
      href.includes("0x1b33f383e297f71c85ae55da5d42aea7a08f1a60");
    expect(hasKnownProg).toBe(true);
  });

  it("Airdrop / Migration href references the deployer address for batch-transfer verification", () => {
    const airdrop = TOKEN_ALLOCATIONS.find((a) => a.label.includes("Airdrop"));
    expect(airdrop!.source.href).toContain("0x1bbdc95d322b8fd76e6a00e6c318dfb421d7d322");
  });
});
