/**
 * Flywheel status consistency test.
 *
 * VAL-CROSS-004: Flywheel node statuses must not conflict with the
 * canonical product-family revenue models and roadmap nodes.
 *
 * The flywheel data is defined inline in FlywheelExplorer, so this
 * test renders the component and checks the rendered maturity badges.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import FlywheelExplorer from "../FlywheelExplorer";

describe("FlywheelExplorer — maturity status consistency (VAL-CROSS-004)", () => {
  it("renders without error", () => {
    const { container } = render(<FlywheelExplorer />);
    expect(container.querySelector('[data-testid="flywheel-explorer"]')).toBeTruthy();
  });

  it("whale & pro revenue node does not claim in_progress when whale premiums are planned", () => {
    // The whale premium product line is 'planned', so the flywheel revenue
    // node covering whale revenue should not claim 'in_progress' unless the
    // dominant activity (e.g., whale-tier trading fee advantages) is actually
    // in progress. The current node conflates planned premium products with
    // the broader whale activity. It should be 'planned' to match the
    // canonical product-family revenue model.
    render(<FlywheelExplorer />);
    const nodes = screen.getAllByTestId("flywheel-node");
    const whaleNode = nodes.find(
      (n) => n.textContent?.includes("Whale & Pro Revenue")
    );
    expect(whaleNode).toBeDefined();
    // The whale revenue node's maturity badge should say "Planned"
    const badge = whaleNode!.querySelector('[data-testid="maturity-badge"]');
    expect(badge).toBeDefined();
    expect(badge!.getAttribute("data-status")).toBe("planned");
  });
});
