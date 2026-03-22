/**
 * Evidence Surface consistency test.
 *
 * VAL-CROSS-005: Ensures the Evidence & Sources surface does not
 * present stale supply figures (e.g. 1B) as canonical examples.
 * The minted supply is 709,001,940 BETTER.
 */

import React from "react";
import { render } from "@testing-library/react";
import { EvidenceSurface } from "../EvidenceSurface";

describe("EvidenceSurface — supply figure consistency (VAL-CROSS-005)", () => {
  it("does not show 1,000,000,000 as the canonical supply example", () => {
    const { container } = render(<EvidenceSurface />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/1,000,000,000/);
  });

  it("canonical example references 709,001,940 as the minted supply", () => {
    const { container } = render(<EvidenceSurface />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/709,001,940/);
  });
});
