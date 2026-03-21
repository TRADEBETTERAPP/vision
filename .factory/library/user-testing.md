# User Testing

Validation surfaces, tools, and resource guidance for this mission.

## Validation Surface

Primary validation surface: **browser**

Required tool: **agent-browser**

Core flows to validate:
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
- Stay inside the assigned assertion scope and treat the running local Next.js app as shared infrastructure; do not restart it unless the parent validator explicitly asks.
- Use a non-default browser session name and close it before finishing.
- Capture concrete evidence for every assertion you evaluate: visible copy, destination behavior, and any console/runtime issues.
- For this mission, run only one browser validator at a time because the visual layer can increase runtime cost.
- Do not modify application code or mission state files from a flow validator; write only the assigned flow report and evidence artifacts.
