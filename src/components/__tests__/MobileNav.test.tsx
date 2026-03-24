import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileNav, { MOBILE_NAV_ITEMS, NAV_ITEMS } from "../MobileNav";

describe("MobileNav", () => {
  it("renders the mobile menu button", () => {
    render(<MobileNav />);
    expect(screen.getByTestId("mobile-menu-button")).toBeInTheDocument();
  });

  it("does not show overlay initially", () => {
    render(<MobileNav />);
    expect(screen.queryByTestId("mobile-nav-overlay")).not.toBeInTheDocument();
  });

  it("opens the overlay when button is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);
    await user.click(screen.getByTestId("mobile-menu-button"));
    expect(screen.getByTestId("mobile-nav-overlay")).toBeInTheDocument();
  });

  it("renders all required navigation destinations when open", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);
    await user.click(screen.getByTestId("mobile-menu-button"));
    const links = screen.getAllByTestId("mobile-nav-link");
    expect(links.length).toBe(MOBILE_NAV_ITEMS.length);
    for (const item of MOBILE_NAV_ITEMS) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    }
  });

  it("closes the overlay when a link is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);
    await user.click(screen.getByTestId("mobile-menu-button"));
    expect(screen.getByTestId("mobile-nav-overlay")).toBeInTheDocument();
    await user.click(screen.getAllByTestId("mobile-nav-link")[0]);
    expect(screen.queryByTestId("mobile-nav-overlay")).not.toBeInTheDocument();
  });

  it("has correct href for each nav item", async () => {
    const user = userEvent.setup();
    render(<MobileNav />);
    await user.click(screen.getByTestId("mobile-menu-button"));
    const links = screen.getAllByTestId("mobile-nav-link");
    MOBILE_NAV_ITEMS.forEach((item, i) => {
      expect(links[i]).toHaveAttribute("href", item.href);
    });
  });

  it("exposes required navigation destinations", () => {
    // Verify all VAL-NARR-004 required destinations are in NAV_ITEMS
    const labels = NAV_ITEMS.map((item) => item.label.toLowerCase());
    expect(labels.some((l) => l.includes("better"))).toBe(true);
    expect(labels.some((l) => l.includes("live"))).toBe(true);
    expect(labels.some((l) => l.includes("roadmap"))).toBe(true);
    expect(labels.some((l) => l.includes("tokenomics"))).toBe(true);
    expect(labels.some((l) => l.includes("evidence"))).toBe(true);
    expect(labels.some((l) => l.includes("risk"))).toBe(true);
  });

  it("navigation labels are understandable without insider context", () => {
    // VAL-NARR-005: no insider jargon in nav labels
    const jargon = ["FDV", "vBETTER", "HyperEVM", "BRAID", "OpenServ"];
    for (const item of NAV_ITEMS) {
      for (const term of jargon) {
        expect(item.label).not.toContain(term);
      }
    }
  });

  it("adds the four new content-depth nodes to the mobile overlay", () => {
    const labels = MOBILE_NAV_ITEMS.map((item) => item.label);

    expect(labels).toEqual(
      expect.arrayContaining([
        "Macro Thesis",
        "HFT Edge",
        "LLM Product",
        "TRUTH-PERP & Flywheel",
      ])
    );
  });
});
