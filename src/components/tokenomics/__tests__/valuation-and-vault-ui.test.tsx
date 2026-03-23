/**
 * UI tests for ValuationCorridors and VaultCapacityModel components.
 *
 * Satisfies VAL-TOKEN-015 and VAL-TOKEN-016 at the component level.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ValuationCorridors from "../ValuationCorridors";
import VaultCapacityModel from "../VaultCapacityModel";
import TokenomicsSection from "../TokenomicsSection";
import { VALUATION_CORRIDORS } from "@/content/valuation-corridors";

// ---------------------------------------------------------------------------
// ValuationCorridors (VAL-TOKEN-015)
// ---------------------------------------------------------------------------

describe("ValuationCorridors UI", () => {
  it("renders the corridor section heading", () => {
    render(<ValuationCorridors />);
    expect(
      screen.getByText("Stage-Based Valuation Corridors")
    ).toBeInTheDocument();
  });

  it("renders all corridor stages", () => {
    render(<ValuationCorridors />);
    const corridors = screen.getAllByTestId("valuation-corridor");
    expect(corridors.length).toBe(VALUATION_CORRIDORS.length);
  });

  it("renders the live anchor corridor with a visible badge", () => {
    render(<ValuationCorridors />);
    expect(screen.getByText("Live Anchor")).toBeInTheDocument();
  });

  it("renders FDV range with numeric bounds for each corridor", () => {
    render(<ValuationCorridors />);
    const ranges = screen.getAllByTestId("corridor-fdv-range");
    expect(ranges.length).toBe(VALUATION_CORRIDORS.length);
    // Each range should contain a dash separator
    for (const range of ranges) {
      expect(range.textContent).toMatch(/\$[\d,]+M\s*–\s*\$[\d,]+M/);
    }
  });

  it("renders implied token price for each corridor", () => {
    render(<ValuationCorridors />);
    const prices = screen.getAllByTestId("corridor-token-price");
    expect(prices.length).toBe(VALUATION_CORRIDORS.length);
    for (const price of prices) {
      expect(price.textContent).toMatch(/\$[\d.]+ – \$[\d.]+/);
    }
  });

  it("renders comparable categories for each corridor", () => {
    render(<ValuationCorridors />);
    const comparables = screen.getAllByTestId("corridor-comparables");
    expect(comparables.length).toBe(VALUATION_CORRIDORS.length);
    for (const comp of comparables) {
      expect(comp.textContent!.length).toBeGreaterThan(10);
    }
  });

  it("renders proof gates for each corridor", () => {
    render(<ValuationCorridors />);
    const gateSections = screen.getAllByTestId("corridor-proof-gates");
    expect(gateSections.length).toBe(VALUATION_CORRIDORS.length);
  });

  it("renders the shared valuation and supply basis declaration", () => {
    render(<ValuationCorridors />);
    expect(screen.getByTestId("corridor-basis-declaration")).toBeInTheDocument();
    expect(screen.getByTestId("valuation-basis")).toHaveTextContent(
      "Fully Diluted Valuation"
    );
    expect(screen.getByTestId("supply-basis")).toHaveTextContent(
      "Minted supply"
    );
  });

  it("renders a planning/non-promise caveat", () => {
    render(<ValuationCorridors />);
    expect(screen.getByText(/NOT price targets/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// VaultCapacityModel (VAL-TOKEN-016)
// ---------------------------------------------------------------------------

describe("VaultCapacityModel UI", () => {
  it("renders the vault capacity heading", () => {
    render(<VaultCapacityModel />);
    expect(
      screen.getByText("Stake-to-Vault Capacity Model")
    ).toBeInTheDocument();
  });

  it("renders user stake and total staked input fields", () => {
    render(<VaultCapacityModel />);
    expect(screen.getByTestId("vault-user-stake-input")).toBeInTheDocument();
    expect(screen.getByTestId("vault-total-staked-input")).toBeInTheDocument();
  });

  it("renders vault scenario toggle with first-vault and whale-vault options", () => {
    render(<VaultCapacityModel />);
    expect(screen.getByTestId("vault-scenario-first_vault")).toBeInTheDocument();
    expect(screen.getByTestId("vault-scenario-whale_vault")).toBeInTheDocument();
  });

  it("shows results with default inputs", () => {
    render(<VaultCapacityModel />);
    expect(screen.getByTestId("vault-capacity-results")).toBeInTheDocument();
    expect(screen.getByTestId("vault-share-percentage")).toBeInTheDocument();
    expect(screen.getByTestId("vault-modeled-allocation")).toBeInTheDocument();
    expect(screen.getByTestId("vault-deposit-cap")).toBeInTheDocument();
    expect(screen.getByTestId("vault-effective-deposit")).toBeInTheDocument();
  });

  it("renders whale-vault assumptions section", () => {
    render(<VaultCapacityModel />);
    expect(screen.getByTestId("whale-vault-assumptions")).toBeInTheDocument();
    expect(screen.getByText("50 whales")).toBeInTheDocument();
    expect(screen.getByTestId("whale-stake-distribution")).toBeInTheDocument();
  });

  it("labels whale-count and stake-distribution as informational-only context", () => {
    render(<VaultCapacityModel />);
    const assumptions = screen.getByTestId("whale-vault-assumptions");
    // Both whale-count and stake-distribution should carry informational-only badges
    const infoBadges = assumptions.querySelectorAll('[data-testid="assumption-role-informational"]');
    expect(infoBadges.length).toBeGreaterThanOrEqual(2);
  });

  it("labels vault-capacity as a calculation input", () => {
    render(<VaultCapacityModel />);
    const assumptions = screen.getByTestId("whale-vault-assumptions");
    const calcBadges = assumptions.querySelectorAll('[data-testid="assumption-role-calculation"]');
    expect(calcBadges.length).toBeGreaterThanOrEqual(1);
  });

  it("explains the informational-only role near the assumption display", () => {
    render(<VaultCapacityModel />);
    // Should have a visible explanation that informational assumptions provide context but do not drive the model
    expect(
      screen.getByText(/do not drive the capacity estimate/i)
    ).toBeInTheDocument();
  });

  it("shows supply ceiling error for invalid total staked", () => {
    render(<VaultCapacityModel />);
    const totalInput = screen.getByTestId("vault-total-staked-input");

    // Set to value above minted supply
    fireEvent.change(totalInput, { target: { value: "800000000" } });
    expect(screen.getByTestId("supply-ceiling-error")).toBeInTheDocument();
    expect(screen.getByTestId("supply-ceiling-error")).toHaveTextContent(
      "minted supply ceiling"
    );
  });

  it("switches between first-vault and whale-vault scenarios", () => {
    render(<VaultCapacityModel />);
    const whaleBtn = screen.getByTestId("vault-scenario-whale_vault");
    fireEvent.click(whaleBtn);
    // After switching, the deposit cap changes to $100,000 for whale vault
    const capSection = screen.getByTestId("vault-deposit-cap");
    expect(capSection).toHaveTextContent("$100,000");
  });

  it("distinguishes deposit cap from modeled share", () => {
    render(<VaultCapacityModel />);
    // The deposit cap section should be labeled as policy
    const capSection = screen.getByTestId("vault-deposit-cap");
    expect(capSection).toHaveTextContent(/Policy/i);
    // The modeled allocation should be labeled as modeled
    const allocSection = screen.getByTestId("vault-modeled-allocation");
    expect(allocSection).toHaveTextContent(/modeled/i);
  });

  it("renders a caveat about modeling assumptions", () => {
    render(<VaultCapacityModel />);
    // The CaveatFrame renders the modeling caveat
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
    expect(screen.getByText(/per-wallet deposit cap is always the hard policy limit/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// TokenomicsSection Assembly
// ---------------------------------------------------------------------------

describe("TokenomicsSection includes valuation and vault components", () => {
  it("renders ValuationCorridors within the section", () => {
    render(<TokenomicsSection />);
    expect(screen.getByTestId("valuation-corridors")).toBeInTheDocument();
  });

  it("renders VaultCapacityModel within the section", () => {
    render(<TokenomicsSection />);
    expect(screen.getByTestId("vault-capacity-model")).toBeInTheDocument();
  });
});
