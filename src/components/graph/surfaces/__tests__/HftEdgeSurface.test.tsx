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

describe("HftEdgeSurface", () => {
  it("opens from the graph and renders the exact moat figures, attribution, badges, and shadcn cards", async () => {
    const user = userEvent.setup();
    render(<GraphExplorer />);

    await user.click(getNodeButton(/hft edge/i));

    const focusedSurface = await screen.findByTestId("graph-focused-surface");

    expect(focusedSurface).toHaveTextContent("HFT Edge");
    expect(focusedSurface).toHaveTextContent("Rust");
    expect(focusedSurface).toHaveTextContent("same AWS rack");
    expect(focusedSurface).toHaveTextContent("0.11ms");
    expect(focusedSurface).toHaveTextContent("8ms");
    expect(focusedSurface).toHaveTextContent("Z-Score");
    expect(focusedSurface).toHaveTextContent("35-70x");
    expect(focusedSurface).toHaveTextContent("Sharpe >40");
    expect(focusedSurface).toHaveTextContent("FAST15M");
    expect(focusedSurface).toHaveTextContent("LONG");
    expect(focusedSurface).toHaveTextContent("Kelly sizing");
    expect(focusedSurface).toHaveTextContent("~60x");
    expect(focusedSurface).toHaveTextContent("gas-sponsored");
    expect(focusedSurface).toHaveTextContent("UDA");
    expect(focusedSurface).toHaveTextContent("one-click copy trading");
    expect(focusedSurface).toHaveTextContent("88%");
    expect(focusedSurface).toHaveTextContent("100%");
    expect(focusedSurface).toHaveTextContent("@tradebetterapp");

    expect(within(focusedSurface).getAllByTestId("maturity-badge").length).toBeGreaterThanOrEqual(4);
    expect(within(focusedSurface).getAllByTestId("evidence-hook").length).toBeGreaterThanOrEqual(4);
    expect(focusedSurface.querySelectorAll('[data-slot="card"]').length).toBeGreaterThanOrEqual(5);
  });
});
