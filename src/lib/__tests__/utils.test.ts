/**
 * Tests for the BETTER design system `cn` utility.
 */
import { cn } from "@/lib/utils";

describe("cn (class merge utility)", () => {
  it("merges multiple class strings", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("resolves Tailwind conflicts (later wins)", () => {
    const result = cn("px-4 py-2", "px-8");
    expect(result).toContain("px-8");
    expect(result).not.toContain("px-4");
    expect(result).toContain("py-2");
  });

  it("handles conditional classes via clsx syntax", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toBe("base extra");
  });

  it("handles undefined and null inputs gracefully", () => {
    expect(cn("base", undefined, null, "extra")).toBe("base extra");
  });

  it("deduplicates identical classes", () => {
    expect(cn("text-sm text-sm")).toBe("text-sm");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("handles array inputs via clsx", () => {
    expect(cn(["px-4", "py-2"])).toBe("px-4 py-2");
  });
});
