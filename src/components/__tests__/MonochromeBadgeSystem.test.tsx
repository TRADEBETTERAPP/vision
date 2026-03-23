import { render, screen } from "@testing-library/react";
import MaturityBadge from "../MaturityBadge";
import type { MaturityStatus } from "@/content";

/**
 * VAL-VISUAL-032: Monochrome + green-only status indicator system.
 *
 * Requirements:
 * - Live status = small green dot (8px) + white text
 * - In-progress/planned/speculative = monochrome text only (white/gray), no colored backgrounds
 * - No rainbow badge backgrounds (no orange, red, or blue-tinted fills)
 * - The badge system is restrained and professional
 */
describe("MonochromeBadgeSystem (VAL-VISUAL-032)", () => {
  describe("Live status renders with green dot + white text", () => {
    it("renders a green status dot for live status", () => {
      render(<MaturityBadge status="live" />);
      const badge = screen.getByTestId("maturity-badge");
      const dot = badge.querySelector("[data-testid='status-dot']");
      expect(dot).toBeInTheDocument();
    });

    it("the green dot is styled with #00ff00 (neon green)", () => {
      render(<MaturityBadge status="live" />);
      const dot = screen.getByTestId("status-dot");
      // The dot should have accent-green background
      expect(dot.className).toContain("bg-accent-green");
    });

    it("live badge text is white, not green", () => {
      render(<MaturityBadge status="live" />);
      const badge = screen.getByTestId("maturity-badge");
      // Should NOT have green text — text should be white/foreground
      expect(badge.className).not.toContain("text-accent-green");
      // Should have white text
      expect(badge.className).toMatch(/text-(white|foreground)/);
    });

    it("live badge has no colored background fill", () => {
      render(<MaturityBadge status="live" />);
      const badge = screen.getByTestId("maturity-badge");
      // No green, orange, red, or blue background
      expect(badge.className).not.toContain("bg-accent-green");
      expect(badge.className).not.toContain("bg-green");
      expect(badge.className).not.toContain("bg-orange");
      expect(badge.className).not.toContain("bg-red");
      expect(badge.className).not.toContain("bg-blue");
    });
  });

  describe("Non-live statuses render as monochrome text only", () => {
    const nonLiveStatuses: MaturityStatus[] = ["in_progress", "planned", "speculative"];

    it.each(nonLiveStatuses)("%s has no green dot", (status) => {
      render(<MaturityBadge status={status} />);
      const badge = screen.getByTestId("maturity-badge");
      const dot = badge.querySelector("[data-testid='status-dot']");
      expect(dot).not.toBeInTheDocument();
    });

    it.each(nonLiveStatuses)("%s has no colored background", (status) => {
      render(<MaturityBadge status={status} />);
      const badge = screen.getByTestId("maturity-badge");
      expect(badge.className).not.toContain("bg-accent-green");
      expect(badge.className).not.toContain("bg-green");
      expect(badge.className).not.toContain("bg-orange");
      expect(badge.className).not.toContain("bg-red");
      expect(badge.className).not.toContain("bg-blue");
    });

    it("in_progress renders with white text", () => {
      render(<MaturityBadge status="in_progress" />);
      const badge = screen.getByTestId("maturity-badge");
      expect(badge.className).toMatch(/text-(white|foreground|\[#ffffff\])/);
    });

    it("planned renders with gray text", () => {
      render(<MaturityBadge status="planned" />);
      const badge = screen.getByTestId("maturity-badge");
      expect(badge.className).toMatch(/text-\[#a0a0a0\]|text-secondary/);
    });

    it("speculative renders with dimmer gray text", () => {
      render(<MaturityBadge status="speculative" />);
      const badge = screen.getByTestId("maturity-badge");
      expect(badge.className).toMatch(/text-\[#707070\]|text-muted/);
    });
  });

  describe("Badge styling is restrained and professional", () => {
    const allStatuses: MaturityStatus[] = ["live", "in_progress", "planned", "speculative"];

    it.each(allStatuses)("%s badge has no rounded-full pill shape with colored fill", (status) => {
      render(<MaturityBadge status={status} />);
      const badge = screen.getByTestId("maturity-badge");
      // No colored background fills on the badge itself
      expect(badge.className).not.toContain("bg-accent-green/15");
    });

    it("renders proper labels for all statuses", () => {
      const { unmount } = render(<MaturityBadge status="live" />);
      expect(screen.getByText("Live")).toBeInTheDocument();
      unmount();

      const { unmount: u2 } = render(<MaturityBadge status="in_progress" />);
      expect(screen.getByText("In Progress")).toBeInTheDocument();
      u2();

      const { unmount: u3 } = render(<MaturityBadge status="planned" />);
      expect(screen.getByText("Planned")).toBeInTheDocument();
      u3();

      render(<MaturityBadge status="speculative" />);
      expect(screen.getByText("Speculative")).toBeInTheDocument();
    });
  });
});
