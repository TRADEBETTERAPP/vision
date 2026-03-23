# Environment

Environment variables, external dependencies, and setup notes.

**What belongs here:** Required tooling, deployment constraints, external account/setup facts.
**What does NOT belong here:** Service ports/commands (use `.factory/services.yaml`).

---

- Repo root: `/Users/test/vision`
- Runtime: `node v24.14.0`, `npm 11.9.0`
- `pnpm` is not available and should not be introduced
- Reserved mission ports: `3100-3104` with `3100` as the primary app port
- No databases, queues, or containerized services are part of this mission
- `gh` is authenticated and may be used for repository creation/push
- Global `vercel` CLI is not installed; use `npx vercel` if deployment requires it
- Playwright CLI is available via `npx playwright` and has already been used to capture redesign reference screenshots
- `pinchtab` and Chrome are available locally for live public-page scraping/screenshot capture
- `agent-browser` is the required browser validator and may also be used for runtime/computed-style inspection when public reference parity requires more than screenshots
- The production target still includes Vercel basic-tier hosting constraints, so heavy always-on background systems should be treated as progressive enhancement rather than assumed baseline runtime budget
- Required external design-source inputs for the redesign:
  - `https://radiant-shaders.com`
  - `https://tradebetter.app`
- Environment note for the current visual stack: the ASCII/Hermes layer has been removed; the approved immersive path is one Radiant-derived shader plus a vendored film-grain GIF overlay.
- **Dune CLI** is installed and the Dune API key is configured; Dune queries can be used for on-chain data verification and token allocation analysis.
- **Basescan** is available as an on-chain data source for verifying Base contract state, token allocations, and transaction history.
- BETTER reference sources are read-only:
  - `/Users/test/tradebetter-docs`
  - `/Users/test/better`
- Public redesign references already captured to `/Users/test/vision/.factory/research/screenshots/`:
  - `vision-current-hero.png`
  - `tradebetter-hero.png`
  - `radiant-hero.png`
- User-provided favicon source asset (read-only, import into repo as needed):
  - `/Users/test/Downloads/Better_Design/Logo/Better_Isotype_Light.svg`
- User-provided BETTER logotype source asset (read-only, import into repo as needed):
  - `/Users/test/Downloads/Better_Design/Logo/Better_Logotype_Light.svg`
