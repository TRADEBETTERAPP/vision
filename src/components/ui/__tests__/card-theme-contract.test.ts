import fs from "fs";
import path from "path";

describe("shadcn card theme contract", () => {
  const globalsCss = fs.readFileSync(
    path.resolve(__dirname, "../../../app/globals.css"),
    "utf-8"
  );
  const cardSource = fs.readFileSync(
    path.resolve(__dirname, "../card.tsx"),
    "utf-8"
  );

  it("maps the dark shadcn tokens to the BETTER card contract", () => {
    const darkBlock = globalsCss.match(/\.dark\s*\{([\s\S]*?)\n\}/);
    expect(darkBlock?.[1]).toContain("--background: #101010");
    expect(darkBlock?.[1]).toContain("--foreground: #ffffff");
    expect(darkBlock?.[1]).toContain("--card: rgba(255, 255, 255, 0.04)");
    expect(darkBlock?.[1]).toContain("--card-foreground: #ffffff");
    expect(darkBlock?.[1]).toContain("--border: rgba(255, 255, 255, 0.12)");
  });

  it("keeps the base shadcn canvas tokens dark for first paint", () => {
    const rootBlock = globalsCss.match(/:root\s*\{([\s\S]*?)\n\}/);
    expect(rootBlock?.[1]).toContain("--background: #101010");
    expect(rootBlock?.[1]).toContain("--foreground: #ffffff");
  });

  it("keeps dark popover tokens on the same BETTER canvas contract", () => {
    const darkBlock = globalsCss.match(/\.dark\s*\{([\s\S]*?)\n\}/);
    expect(darkBlock?.[1]).toContain("--popover: #101010");
    expect(darkBlock?.[1]).toContain("--popover-foreground: #ffffff");
  });

  it("uses an 8px shared radius token for the shadcn card family", () => {
    expect(globalsCss).toContain("--radius: 0.5rem");
  });

  it("uses rounded-lg across the shadcn card primitive instead of rounded-xl", () => {
    expect(cardSource).toContain("rounded-lg");
    expect(cardSource).toContain("rounded-t-lg");
    expect(cardSource).toContain("rounded-b-lg");
    expect(cardSource).not.toContain("rounded-xl");
  });
});
