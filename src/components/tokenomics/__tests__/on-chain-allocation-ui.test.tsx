/**
 * UI tests for on-chain verified token allocation display — VAL-TOKEN-020
 *
 * Validates that the SupplyAllocation component shows:
 * - On-chain verified allocation categories
 * - Visible source citations with direct basescan wallet-address links
 * - Correct Team (~250M) and Treasury (~200M) per on-chain truth
 * - No wrong allocation mapping
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import SupplyAllocation from "../SupplyAllocation";

describe("SupplyAllocation — On-Chain Verified Display (VAL-TOKEN-020)", () => {
  beforeEach(() => {
    render(<SupplyAllocation />);
  });

  it("shows Team/Vesting allocation category", () => {
    expect(screen.getByText("Team/Vesting")).toBeInTheDocument();
  });

  it("shows Treasury allocation category", () => {
    expect(screen.getByText("Treasury")).toBeInTheDocument();
  });

  it("shows SERV/Strategic Reserve allocation category", () => {
    expect(screen.getByText("SERV / Strategic Reserve")).toBeInTheDocument();
  });

  it("shows LP/Liquidity allocation category", () => {
    expect(screen.getByText("LP / Liquidity")).toBeInTheDocument();
  });

  it("shows Airdrop/Migration allocation category", () => {
    expect(screen.getByText("Airdrop / Migration")).toBeInTheDocument();
  });

  it("displays basescan source citations as links", () => {
    const links = screen.getAllByRole("link");
    const basescanLinks = links.filter(
      (l) => l.getAttribute("href")?.includes("basescan.org")
    );
    expect(basescanLinks.length).toBeGreaterThan(0);
  });

  it("all allocation source links point to basescan (direct wallet addresses)", () => {
    const links = screen.getAllByRole("link");
    const basescanAllocationLinks = links.filter(
      (l) => l.getAttribute("href")?.includes("basescan.org/token/")
    );
    // All 7 allocation rows should link to basescan
    expect(basescanAllocationLinks.length).toBeGreaterThanOrEqual(7);
  });

  it("shows 250,000,000 for Team/Vesting (not 200M)", () => {
    // Team should be 250M per on-chain truth
    const rows = screen.getAllByTestId("allocation-row");
    const teamRow = rows.find((r) =>
      r.textContent?.toLowerCase().includes("team")
    );
    expect(teamRow).toBeDefined();
    expect(teamRow!.textContent).toContain("250,000,000");
  });

  it("shows 200,000,000 for Treasury (not 250M)", () => {
    // Treasury should be 200M per on-chain truth
    const rows = screen.getAllByTestId("allocation-row");
    const treasuryRow = rows.find((r) =>
      r.textContent?.toLowerCase().includes("treasury")
    );
    expect(treasuryRow).toBeDefined();
    expect(treasuryRow!.textContent).toContain("200,000,000");
  });

  it("shows all 7 allocation rows", () => {
    const rows = screen.getAllByTestId("allocation-row");
    expect(rows.length).toBe(7);
  });

  it("allocation tokens reconcile (shows ✓ Reconciled)", () => {
    expect(screen.getByText("✓ Reconciled")).toBeInTheDocument();
  });

  it("mentions on-chain verification in the header description", () => {
    // The description should mention on-chain verification
    // Use getAllByText since multiple elements may match, then check at least one exists
    const matches = screen.getAllByText(/on-chain verified|basescan|Dune Analytics/i);
    expect(matches.length).toBeGreaterThan(0);
  });
});
