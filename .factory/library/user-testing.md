# User Testing

Validation surfaces, tools, and resource guidance for this mission.

## Validation Surface

Primary validation surface: **browser**

Required tool: **agent-browser**

Core flows to validate:
- BETTER logotype asset rendering in the header, hero, and mobile overlay
- graph-first mindmap shell entry, node selection, orientation recovery, and non-scroll-first navigation feel
- guided investor path through the graph so the story reads coherently as a pitch, not a disconnected atlas
- redesign hero hierarchy, brand dominance, proof visibility, and CTA focus
- approved visual stack usage: one Radiant-derived shader plus the vendored film-grain GIF overlay
- visibly moving Radiant background motion and visible film-grain atmosphere in the enhanced state
- site-wide persistence of the immersive background treatment beyond the hero
- tradebetter-faithful color/tone treatment with crisp pure white primary text
- hero comprehension and live-vs-vision framing
- desktop and mobile navigation destinations
- roadmap exploration, detail panels, deep links, and history restoration
- tokenomics tier clarity, minted-supply presentation, first-vault qualification/cap math, statistically rigorous stake-to-vault-share modeling, whale-first utilities, referral incentives, revenue-return modeling, valuations, realistic timeframes, and scenario switching
- architecture and cost-band storytelling
- smooth low-cost motion and balanced live-desktop-only background behavior
- reduced-motion behavior and runtime visual fallbacks
- CTA honesty and official external exits
- production refresh and direct-route behavior

## Validation Concurrency

- Machine profile observed during dry run: 8 CPU cores, ~34 GB RAM
- Browser validation for this mission is **medium-to-high cost** because the site will combine shader/background effects with interactive roadmap surfaces
- **Max concurrent browser validators: 1**
- Non-browser validators such as lint, typecheck, test, or build may run alongside one browser session when needed
- Use `http://127.0.0.1:3100` as the primary validation target

## Flow Validator Guidance: browser

- Use `agent-browser` for all browser validation against `http://127.0.0.1:3100`.
- In this environment, the raw `next dev` path has served the custom not-found shell at `/`; use the manifest's production-backed `web` service on port `3100` instead of starting a separate dev server.
- The current `agent-browser` CLI uses `open` to start a session against a URL; `launch` is not a supported subcommand in this environment.
- If a visual-authenticity pass reports `webglSupport=false` in headless mode, rerun the same isolated session in headed mode before failing shader assertions; this environment can hide the shipped WebGL canvas in headless browser runs.
- For the `visual-source-overhaul` fallback comparison, the reliable browser-only way to force the static degraded state is to relaunch the validation session before page load with WebGL disabled (for example `--disable-gpu,--disable-webgl`); toggling WebGL after the page is already mounted does not flip the live hero into fallback mode.
- For redesign work, use the captured public reference screenshots in `.factory/research/screenshots/` as visual guardrails when evaluating composition, hierarchy, and atmosphere.
- Stay inside the assigned assertion scope and treat the running local Next.js app as shared infrastructure; do not restart it unless the parent validator explicitly asks.
- Use a non-default browser session name and close it before finishing.
- Capture concrete evidence for every assertion you evaluate: visible copy, destination behavior, and any console/runtime issues.
- Explicitly note whether the first viewport reads as one composition, whether BETTER branding is unmistakable, and whether the shader-plus-film-grain stack improves the surface without obscuring readability.
- For the graph-first overhaul, explicitly note whether the experience feels like an explorable mindmap rather than a standard stacked scroll page, and capture the orientation-recovery method the user can rely on.
- Explicitly note whether the graph also functions as an investor-readable pitch path without forcing the user to hunt across disconnected nodes.
- For `VAL-ROADMAP-016`, do not stop at the summary Roadmap Gates cards; expand the `Interactive Roadmap Atlas` branch families and click the stage/node controls to inspect the dedicated per-stage execution-plan panels where workstreams, external dependencies, proof gates, and bounded timing windows are rendered.
- When validating the immersive system, record which concrete Radiant-derived source resource and vendored film-grain asset are present in the shipped implementation and how they show up on the page.
- Validate that the global atmospheric layer remains visibly present after the hero and across major graph/detail states.
- Validate that primary text appears as crisp pure white against the dark shell and that secondary text, not the main body copy, carries the grey tone.
- Validate that token supply is presented as the minted `709,001,940 BETTER` figure from the new Base contract, and that first-vault examples clearly show the `100,000 BETTER` minimum plus the baseline `$25,000` cap.
- Validate that higher-tier whale-product gates, referral incentives, per-product revenue-return modeling, execution-plan detail, realistic timing windows, conservative valuation corridors, and stake-to-vault-share estimation are visibly explained and clearly framed as canonical versus modeled where applicable.
- Validate that desktop retains the balanced live atmosphere while constrained/mobile conditions shed motion cost gracefully without losing the premium feel.
- Capture evidence that the enhanced state is materially different from the static fallback state; a faint or barely changing background should fail.
- When an immersive feature exposes both `fallback` and `reduced-motion` visual states, validate them separately; reduced motion is not sufficient evidence for failure-fallback behavior.
- For this mission, run only one browser validator at a time because the visual layer can increase runtime cost.
- Do not modify application code or mission state files from a flow validator; write only the assigned flow report and evidence artifacts.

## Flow Validator Guidance: release-cli

- Use `Execute`, `Read`, and `Grep` for release-verification assertions that depend on git state, build output, bundle/lazy-load inspection, or other non-browser evidence.
- Treat the production-backed local web service on `http://127.0.0.1:3100` as shared infrastructure; do not restart or stop it from a release-cli flow unless the parent validator explicitly assigns that responsibility.
- Prefer read-only git validation such as `git status -sb`, `git rev-list --left-right --count origin/main...HEAD`, and `git log -1 --oneline` instead of mutating git commands. Do not commit or push from a flow validator.
- For lazy-load assertions, capture both source evidence (for example `next/dynamic` usage or equivalent deferred import patterns) and build-output evidence (chunk listing, route size changes, or trace output) in the flow report.
- For build-quality assertions, record exact commands, exit codes, and whether the command output showed warnings in addition to success.
- Stay inside the assigned assertion scope and do not edit application code or mission state files; write only the assigned flow report and any evidence files.
