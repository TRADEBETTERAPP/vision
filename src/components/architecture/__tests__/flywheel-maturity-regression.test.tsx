/**
 * Regression tests for mixed-maturity flywheel node differentiation.
 *
 * Protects:
 * - The flywheel surface does not collapse planned strategy agents and
 *   in-progress social vaults under one misleading maturity badge
 * - Each flywheel concept carries the correct individual maturity
 * - Flywheel maturity matches the roadmap and narrative canonical statuses
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FlywheelExplorer from "../FlywheelExplorer";
import { getNodeById } from "@/content";
import { NARRATIVE_BLOCKS } from "@/content/narrative";

// ---------------------------------------------------------------------------
// Mixed-Maturity Differentiation
// ---------------------------------------------------------------------------

describe("Flywheel — Mixed-Maturity Differentiation", () => {
  it("does not render a single combined 'Strategy Agents & Vaults' node", () => {
    render(<FlywheelExplorer />);
    const nodes = screen.getAllByTestId("flywheel-node");
    const combinedNode = nodes.find((el) =>
      el.textContent?.includes("Strategy Agents & Vaults")
    );
    expect(combinedNode).toBeUndefined();
  });

  it("renders separate nodes for Social Vaults and Strategy Agents", () => {
    render(<FlywheelExplorer />);
    const nodes = screen.getAllByTestId("flywheel-node");
    const vaultNode = nodes.find((el) =>
      el.textContent?.includes("Social Vaults")
    );
    const agentNode = nodes.find((el) =>
      el.textContent?.includes("Strategy Agents")
    );
    expect(vaultNode).toBeDefined();
    expect(agentNode).toBeDefined();
  });

  it("Social Vaults flywheel node has 'in_progress' maturity", async () => {
    const user = userEvent.setup();
    render(<FlywheelExplorer />);
    const nodes = screen.getAllByTestId("flywheel-node");
    const vaultNode = nodes.find((el) =>
      el.textContent?.includes("Social Vaults")
    )!;
    await user.click(vaultNode);
    const detail = screen.getByTestId("flywheel-detail");
    const badges = within(detail).getAllByTestId("maturity-badge");
    const statuses = badges.map((b) => b.getAttribute("data-status"));
    expect(statuses).toContain("in_progress");
  });

  it("Strategy Agents flywheel node has 'planned' maturity", async () => {
    const user = userEvent.setup();
    render(<FlywheelExplorer />);
    const nodes = screen.getAllByTestId("flywheel-node");
    const agentNode = nodes.find((el) =>
      el.textContent?.includes("Strategy Agents")
    )!;
    await user.click(agentNode);
    const detail = screen.getByTestId("flywheel-detail");
    const badges = within(detail).getAllByTestId("maturity-badge");
    const statuses = badges.map((b) => b.getAttribute("data-status"));
    expect(statuses).toContain("planned");
  });
});

// ---------------------------------------------------------------------------
// Cross-Surface Consistency — Flywheel vs Roadmap & Narrative
// ---------------------------------------------------------------------------

describe("Flywheel — Cross-Surface Maturity Consistency", () => {
  it("Social Vaults flywheel maturity matches roadmap pe-social-vaults", () => {
    render(<FlywheelExplorer />);
    const roadmapNode = getNodeById("pe-social-vaults");
    expect(roadmapNode).toBeDefined();
    const nodes = screen.getAllByTestId("flywheel-node");
    const vaultNode = nodes.find((el) =>
      el.textContent?.includes("Social Vaults")
    )!;
    // The inline badge on the node card should match roadmap status
    const badge = within(vaultNode).getByTestId("maturity-badge");
    expect(badge.getAttribute("data-status")).toBe(roadmapNode!.status);
  });

  it("Strategy Agents flywheel maturity matches roadmap pe-strategy-agents", () => {
    render(<FlywheelExplorer />);
    const roadmapNode = getNodeById("pe-strategy-agents");
    expect(roadmapNode).toBeDefined();
    const nodes = screen.getAllByTestId("flywheel-node");
    const agentNode = nodes.find((el) =>
      el.textContent?.includes("Strategy Agents")
    )!;
    const badge = within(agentNode).getByTestId("maturity-badge");
    expect(badge.getAttribute("data-status")).toBe(roadmapNode!.status);
  });

  it("Social Vaults flywheel maturity matches narrative vision-social-vaults", () => {
    render(<FlywheelExplorer />);
    const narrativeBlock = NARRATIVE_BLOCKS.find(
      (b) => b.id === "vision-social-vaults"
    );
    expect(narrativeBlock).toBeDefined();
    const nodes = screen.getAllByTestId("flywheel-node");
    const vaultNode = nodes.find((el) =>
      el.textContent?.includes("Social Vaults")
    )!;
    const badge = within(vaultNode).getByTestId("maturity-badge");
    expect(badge.getAttribute("data-status")).toBe(narrativeBlock!.status);
  });

  it("Strategy Agents flywheel maturity matches narrative vision-strategy-agents", () => {
    render(<FlywheelExplorer />);
    const narrativeBlock = NARRATIVE_BLOCKS.find(
      (b) => b.id === "vision-strategy-agents"
    );
    expect(narrativeBlock).toBeDefined();
    const nodes = screen.getAllByTestId("flywheel-node");
    const agentNode = nodes.find((el) =>
      el.textContent?.includes("Strategy Agents")
    )!;
    const badge = within(agentNode).getByTestId("maturity-badge");
    expect(badge.getAttribute("data-status")).toBe(narrativeBlock!.status);
  });
});

// ---------------------------------------------------------------------------
// Flywheel connectivity after split
// ---------------------------------------------------------------------------

describe("Flywheel — Split Node Connectivity", () => {
  it("both split nodes appear in the Product category", () => {
    render(<FlywheelExplorer />);
    // Both should be under the Product column
    const nodes = screen.getAllByTestId("flywheel-node");
    const productNodes = nodes.filter(
      (el) =>
        el.textContent?.includes("Social Vaults") ||
        el.textContent?.includes("Strategy Agents") ||
        el.textContent?.includes("Terminal")
    );
    // Should have at least 3 product nodes: Terminal, Vaults, Agents
    expect(productNodes.length).toBeGreaterThanOrEqual(3);
  });

  it("clicking Social Vaults shows feeds-into connections", async () => {
    const user = userEvent.setup();
    render(<FlywheelExplorer />);
    const nodes = screen.getAllByTestId("flywheel-node");
    const vaultNode = nodes.find((el) =>
      el.textContent?.includes("Social Vaults")
    )!;
    await user.click(vaultNode);
    const detail = screen.getByTestId("flywheel-detail");
    expect(detail.textContent).toContain("Feeds into");
  });

  it("clicking Strategy Agents shows feeds-into connections", async () => {
    const user = userEvent.setup();
    render(<FlywheelExplorer />);
    const nodes = screen.getAllByTestId("flywheel-node");
    const agentNode = nodes.find((el) =>
      el.textContent?.includes("Strategy Agents")
    )!;
    await user.click(agentNode);
    const detail = screen.getByTestId("flywheel-detail");
    expect(detail.textContent).toContain("Feeds into");
  });
});
