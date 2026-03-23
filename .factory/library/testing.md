# Testing

Project test tooling facts for this repo:

- `npm run test` runs Jest.
- `jest.config.ts` uses `preset: "ts-jest"` with `testEnvironment: "jsdom"`.
- The `@/` alias is mapped in Jest through `moduleNameMapper`.
- DOM assertions come from `jest.setup.ts`, which is loaded via `setupFilesAfterEnv`.
- Test files currently live under `src/**/__tests__`.
- Next App Router `RootLayout` renders `<html>/<body>`, so page-only component tests do not validate shared layout chrome; layout regression coverage needs a document-level render/helper strategy or an integration-style check that explicitly includes the layout.
- Viewport-first claims (for example "the default visible surface is the graph workspace") need browser/visual verification or a layout-aware test strategy; DOM order assertions alone are not enough to prove what is actually above the fold.
- If a page-level render path imports client components that rely on `IntersectionObserver` or `scrollIntoView` (for example the roadmap atlas), add global jsdom mocks in `jest.setup.ts` so existing page/layout tests do not fail when those components enter the shared render tree.
