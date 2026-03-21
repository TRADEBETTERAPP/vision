/**
 * Projection dependency label traceability tests.
 *
 * VAL-CROSS-006: Projection dependencies trace clearly back to roadmap
 * and architecture stages. Users should see readable labels, not raw IDs,
 * and non-live dependencies should be apparent.
 *
 * VAL-CROSS-007: CTA honesty in tokenomics — exploration CTAs behave
 * as exploration paths, and the section is clearly labeled as non-live.
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import ScenarioSwitcher from "../ScenarioSwitcher";
import TokenomicsSection from "../TokenomicsSection";
import { PROJECTION_OUTPUTS, getNodeById } from "@/content";

// ---------------------------------------------------------------------------
// VAL-CROSS-006: Readable dependency labels on projection cards
// ---------------------------------------------------------------------------

describe("Projection dependency labels (VAL-CROSS-006)", () => {
  it("projection cards render 'Depends on:' labels", () => {
    render(<ScenarioSwitcher />);
    const projCards = screen.getAllByTestId("projection-card");
    const cardsWithDeps = projCards.filter((card) =>
      within(card).queryByText("Depends on:")
    );
    // Most projections should show dependency labels
    expect(cardsWithDeps.length).toBeGreaterThanOrEqual(1);
  });

  it("projection dependency text contains readable titles, not raw IDs", () => {
    render(<ScenarioSwitcher />);
    const projCards = screen.getAllByTestId("projection-card");
    for (const card of projCards) {
      const depLabel = within(card).queryByText("Depends on:");
      if (depLabel) {
        const parentText = depLabel.closest("[data-testid='projection-card']")!.textContent || "";
        // Should not contain raw roadmap IDs like "pe-terminal-open"
        expect(parentText).not.toMatch(/pe-[a-z]+-[a-z]+/);
        expect(parentText).not.toMatch(/re-[a-z]+-[a-z]+/);
        expect(parentText).not.toMatch(/ti-[a-z]+-[a-z]+/);
        expect(parentText).not.toMatch(/sa-[a-z]+-[a-z]+/);
      }
    }
  });

  it("each projection output has dependency labels resolved from roadmap node titles", () => {
    // Data-level check: each dependsOn entry resolves to a non-empty title
    for (const projection of PROJECTION_OUTPUTS) {
      for (const dep of projection.dependsOn) {
        const node = getNodeById(dep);
        expect(node).toBeDefined();
        expect(node!.title.length).toBeGreaterThan(0);
      }
    }
  });

  it("vault AUM projection shows 'Social Vaults' in its dependency text", () => {
    render(<ScenarioSwitcher />);
    const projCards = screen.getAllByTestId("projection-card");
    const vaultCard = projCards.find((card) =>
      within(card).queryByText("Total Vault AUM")
    );
    expect(vaultCard).toBeDefined();
    expect(vaultCard!.textContent).toContain("Social Vaults");
  });

  it("active agents projection shows 'Strategy Agents' in dependency text", () => {
    render(<ScenarioSwitcher />);
    const projCards = screen.getAllByTestId("projection-card");
    const agentCard = projCards.find((card) =>
      within(card).queryByText("Active Autonomous Agents")
    );
    expect(agentCard).toBeDefined();
    expect(agentCard!.textContent).toContain("Strategy Agents");
  });
});

// ---------------------------------------------------------------------------
// VAL-CROSS-007: Tokenomics section CTA honesty
// ---------------------------------------------------------------------------

describe("Tokenomics CTA honesty (VAL-CROSS-007)", () => {
  it("tokenomics section does not contain 'Buy Now' or misleading live CTAs", () => {
    render(<TokenomicsSection />);
    const section = screen.getByTestId("tokenomics-section");
    const text = section.textContent || "";
    // Should not contain purchase CTAs since this is an informational surface
    expect(text).not.toMatch(/Buy Now|Purchase|Trade Now|Sign Up/i);
  });

  it("scenario projections carry caveat framing (not presented as certainties)", () => {
    render(<ScenarioSwitcher />);
    expect(screen.getByTestId("caveat-frame")).toBeInTheDocument();
  });

  it("evidence hooks are present to distinguish source types", () => {
    render(<TokenomicsSection />);
    const hooks = screen.getAllByTestId("evidence-hook");
    expect(hooks.length).toBeGreaterThanOrEqual(10);
  });
});
