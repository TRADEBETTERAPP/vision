import fs from "fs";
import path from "path";

function readSurface(relativePath: string) {
  return fs.readFileSync(path.resolve(__dirname, relativePath), "utf-8");
}

describe("content-depth surface card contract", () => {
  it.each([
    "../MacroThesisSurface.tsx",
    "../HftEdgeSurface.tsx",
    "../LlmProductSurface.tsx",
    "../TruthPerpFlywheelSurface.tsx",
  ])("%s uses shadcn Card primitives directly", (relativePath) => {
    const source = readSurface(relativePath);

    expect(source).toMatch(/from ["']@\/components\/ui\/card["']/);
    expect(source).toMatch(/<Card/);
    expect(source).not.toMatch(/BetterCard/);
    expect(source).toMatch(/MaturityBadge/);
  });
});
