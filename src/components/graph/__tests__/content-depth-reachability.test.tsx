import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GraphShell } from "../GraphShell";

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

function getRelatedLink(name: RegExp) {
  const relatedLinks = screen.getAllByTestId("graph-related-link");
  const match = relatedLinks.find((element) => element.textContent?.match(name));

  if (!match) {
    throw new Error(`No related graph link matching ${name}`);
  }

  return match;
}

describe("content-depth graph reachability", () => {
  it.each([
    {
      startNode: /what is better/i,
      destination: /macro thesis/i,
      expectedHash: "#graph-macro-thesis",
    },
    {
      startNode: /architecture/i,
      destination: /hft edge/i,
      expectedHash: "#graph-hft-edge",
    },
    {
      startNode: /tokenomics/i,
      destination: /llm product/i,
      expectedHash: "#graph-llm-product",
    },
    {
      startNode: /tokenomics/i,
      destination: /truth-perp/i,
      expectedHash: "#graph-truth-perp-flywheel",
    },
  ])(
    "reaches $destination from $startNode in two graph interactions",
    async ({ startNode, destination, expectedHash }) => {
      const user = userEvent.setup();
      render(<GraphShell />);

      await user.click(getNodeButton(startNode));
      await user.click(getRelatedLink(destination));

      expect(screen.getByTestId("graph-focused-surface")).toBeInTheDocument();
      expect(screen.getByTestId("graph-breadcrumb").textContent).toMatch(destination);
      expect(window.location.hash).toBe(expectedHash);
    }
  );
});
