# User Testing

Validation surfaces, tools, and resource guidance for this mission.

## Validation Surface

Primary validation surface: **browser**

Required tool: **agent-browser**

Core flows to validate:
- redesign hero hierarchy, brand dominance, proof visibility, and CTA focus
- direct use of both Radiant and Hermes ASCII-video source material in the shipped visual system
- visibly moving Radiant background motion and visibly moving ASCII structure in the enhanced state
- hero comprehension and live-vs-vision framing
- desktop and mobile navigation destinations
- roadmap exploration, detail panels, deep links, and history restoration
- tokenomics tier clarity, whale-first utilities, and scenario switching
- architecture and cost-band storytelling
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
- The current `agent-browser` CLI uses `open` to start a session against a URL; `launch` is not a supported subcommand in this environment.
- If a visual-authenticity pass reports `webglSupport=false` in headless mode, rerun the same isolated session in headed mode before failing shader assertions; this environment can hide the shipped WebGL canvas in headless browser runs.
- For redesign work, use the captured public reference screenshots in `.factory/research/screenshots/` as visual guardrails when evaluating composition, hierarchy, and atmosphere.
- Stay inside the assigned assertion scope and treat the running local Next.js app as shared infrastructure; do not restart it unless the parent validator explicitly asks.
- Use a non-default browser session name and close it before finishing.
- Capture concrete evidence for every assertion you evaluate: visible copy, destination behavior, and any console/runtime issues.
- Explicitly note whether the first viewport reads as one composition, whether BETTER branding is unmistakable, and whether shader/ascii layers improve the surface without obscuring readability.
- When validating the immersive system, record which concrete Radiant and Hermes ASCII-video source resources are present in the shipped implementation and how they show up on the page.
- Capture evidence that the enhanced state is materially different from the static fallback state; a faint or barely changing background should fail.
- When an immersive feature exposes both `fallback` and `reduced-motion` visual states, validate them separately; reduced motion is not sufficient evidence for failure-fallback behavior.
- For this mission, run only one browser validator at a time because the visual layer can increase runtime cost.
- Do not modify application code or mission state files from a flow validator; write only the assigned flow report and evidence artifacts.
