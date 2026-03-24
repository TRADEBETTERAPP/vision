import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphExplorer } from "../../GraphExplorer";

beforeEach(() => {
  window.location.hash = "";
  history.replaceState(null, "", window.location.pathname);
  Element.prototype.scrollIntoView = jest.fn();
});

function getNodeButton(name: RegExp) {
  const nodeButtons = screen.getAllByTestId("graph-node-button");
  const match = nodeButtons.find((element) =>
    element.getAttribute("aria-label")?.match(name)
  );

  if (!match) {
    throw new Error(`No graph node button matching ${name}`);
  }

  return match;
}

describe("TruthPerpFlywheelSurface", () => {
  it("opens from the graph and renders the moat, index, arbitrage loop, phases, badges, and shadcn cards", async () => {
    const user = userEvent.setup();
    render(<GraphExplorer />);

    await user.click(getNodeButton(/truth-perp/i));

    const focusedSurface = await screen.findByTestId("graph-focused-surface");

    expect(focusedSurface).toHaveTextContent("TRUTH-PERP & Flywheel");
    expect(focusedSurface).toHaveTextContent("HIP-3");
    expect(focusedSurface).toHaveTextContent("Hyperliquid");
    expect(focusedSurface).toHaveTextContent("500k HYPE");
    expect(focusedSurface).toHaveTextContent("$11M");
    expect(focusedSurface).toHaveTextContent("Nasdaq of Truth");
    expect(focusedSurface).toHaveTextContent("vBETTER");
    expect(focusedSurface).toHaveTextContent("enzyme.finance");
    expect(focusedSurface).toHaveTextContent("ETF premium capture");
    expect(focusedSurface).toHaveTextContent("30%");
    expect(focusedSurface).toHaveTextContent("buy & burn");
    expect(focusedSurface).toHaveTextContent("Phase 1");
    expect(focusedSurface).toHaveTextContent("Q1 2026");
    expect(focusedSurface).toHaveTextContent("Phase 2");
    expect(focusedSurface).toHaveTextContent("Q2 2026");
    expect(focusedSurface).toHaveTextContent("Phase 3");
    expect(focusedSurface).toHaveTextContent("Q4 2026");
    expect(focusedSurface).toHaveTextContent("@tradebetterapp");

    expect(within(focusedSurface).getAllByTestId("maturity-badge").length).toBeGreaterThanOrEqual(5);
    expect(within(focusedSurface).getAllByTestId("evidence-hook").length).toBeGreaterThanOrEqual(5);
    expect(focusedSurface.querySelectorAll('[data-slot="card"]').length).toBeGreaterThanOrEqual(6);
  });
});
