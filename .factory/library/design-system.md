# Design System Direction

Authoritative visual direction for the BETTER redesign follow-up.

**What belongs here:** visual thesis, hierarchy rules, token direction, motion language, approved references, and anti-patterns.
**What does NOT belong here:** raw screenshots, long implementation diffs, or validator reports.

---

## Visual Thesis

BETTER should feel like a premium terminal-native market weapon: darker, sharper, more cinematic, and more singular than a generic roadmap or SaaS explainer.

The experience should now read as a **dynamic graph workspace with an investor-readable story spine**, not as a long-form deck or a set of oversized sections hidden behind graph buttons.

## Approved Reference Anchors

- `tradebetter.app` — primary landing-page composition, brand presence, terminal voice, and urgency
- `radiant-shaders.com` — supporting shader language and premium full-canvas effect strategy
- `https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video` — atmospheric ASCII/video system concepts and production-safe pipeline ideas
- OpenAI delightful frontends guidance — one-composition hero, brand first, fewer cards, one job per section, 2-3 intentional motions

## Approved Extraction Workflow

For the live `tradebetter.app` Framer site, use this exact Droid-side tool stack when workers need source-of-truth style parity:
- `FetchUrl` — first pass for Framer HTML/CSS/theme tokens, breakpoints, asset URLs, and text structure
- `pinchtab` — rendered screenshots/text capture of the live surface
- `agent-browser` — final runtime/computed-style and interaction verification when `pinchtab` cannot inspect the hydrated DOM deeply enough

`FetchUrl` alone is not sufficient for exact Framer parity because it does not prove final computed styles, spacing, motion timing, or responsive runtime behavior.

## Hard Source Requirement

- The redesign is not acceptable unless the shipped implementation uses concrete resources adapted from **both** Radiant and the Hermes ASCII-video skill.
- Workers must cite the exact URLs/files they adapted in their handoff.
- “Inspired by” is not enough; the delivered site must contain identifiable implementation material from both sources.
- The approved next-pass implementation is specific: use a **vendored real Radiant background asset** and a **real-time ASCII canvas renderer** derived from Hermes pipeline concepts. Do not ship another custom shader + synthetic DOM grid approximation.

## First-Viewport Rules

- BETTER branding must be unmistakable in the first screen.
- The hero must read as one composition, not a dashboard.
- No hero cards unless the card itself is the primary interaction.
- Keep the text payload tight: brand, one dominant promise, one short supporting sentence, one CTA group, one dominant visual plane.
- Use real atmosphere and proof; decorative gradients alone are not enough.

## Section Strategy

Recommended section jobs:
1. Hero / identity / promise
2. Proof / product edge / credibility
3. Workflow or product-depth section
4. Roadmap / future-system explanation
5. Whale-first token power and value flow
6. Final conversion / next action

## Motion Language

- Use 2-3 intentional motions only
- Prefer entrance, scroll-linked depth, and tactile hover/reveal over constant ambient noise
- All motion must remain usable on mobile and degrade cleanly under reduced motion
- Prefer cheaper transform/opacity motion and graph-camera transitions over expensive always-on ambient simulation
- Smoothness matters more than spectacle: the goal is confident, low-latency motion, not maximal animation density

## Token Direction

- Primary accent: BETTER blue
- Backgrounds: near-black with stronger tonal layering than the current build
- Typography: terminal/mono identity with one restrained supporting sans at most
- Surfaces: reduce bordered-card repetition; favor layout, spacing, dividers, and large modules
- Primary copy should read as **pure white**, not grey-white; reserve grey tokens for secondary/supporting text only

## Tradebetter Theme Signals — Extracted and Shipped

Extracted live guardrails from `tradebetter.app` via FetchUrl (Framer HTML/CSS):
- Background base: near-black (`#101010` family) → shipped as `--bg-primary: #0a0a0c`
- Primary accent: tradebetter electric blue (`#455eff` family) → shipped as `--accent-primary: #455eff`
- Primary UI/body typography: `IBM Plex Mono` → shipped via `next/font/google` + `--font-ibm-plex-mono`
- Restrained display typography: `Helvetica Neue Medium` → shipped as Geist Sans via `--font-display`
- Surface language: hard edges, thin borders, large modules, sparse white CTA planes, mono labels, and left-rail orientation cues

These are now the shipped theme tokens. The tradebetter electric-blue replaces the old `#00aaff` cyan across globals.css, Radiant shader palette, and ASCII canvas renderer hue.

## Global Shell Direction

- The site should now read as one explorable BETTER environment rather than a hero plus stacked sections.
- The immersive Radiant/Hermes atmosphere must remain visible across the full site, not just the hero.
- The shell should feel graph-first and mindmap-led: users should navigate through focal nodes, detail states, and orientation aids rather than reading a normal section-anchor document.
- Use the BETTER logotype asset in the header, hero, and mobile-overlay brand surfaces.
- The **BETTER logotype must be prominent at the top of the graph workspace** — it is the primary brand signal in the graph-first layout, not only in the old standalone hero.
- **Hero deduplication requirement:** do not ship both a standalone hero section and a separate graph workspace hero/identity node. The graph workspace brand band is the single hero surface; the old standalone hero section must be removed to avoid visual and content duplication.
- Use a sticky inspector / detail dock and clear orientation controls so the graph stays intelligible while still functioning as a pitch.
- The graph must support a coherent investor path through thesis, product, proof, moat, business model, roadmap gates, valuation logic, and appendix detail.

## Tooling Direction

- Core implementation candidates: `@xyflow/react` or equivalent graph workspace tooling, deterministic layout tooling such as ELK, `motion`, `ogl`, `class-variance-authority`, `tailwind-merge`
- Visual verification: `agent-browser` plus Playwright screenshots when useful for reference comparison
- Optional workflow additions if needed: Storybook, design-token tooling, Figma/MCP-based review
- External source inputs that must be concretely represented in the shipped visual system:
  - `https://radiant-shaders.com`
  - `https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video`

## Approved Motion Background Path

- Radiant: vendor a real Radiant shader asset/file into the hero/background stack
- Hermes: implement moving ASCII with a canvas renderer rooted in multi-grid composition, glyph mapping, tonemap, feedback, and visible temporal motion
- The enhanced state must look materially stronger than the static fallback state in headed browser testing
- Keep the same atmospheric family active beyond the hero so the whole site stays inside the same visual world
- Optimize for **balanced live desktop only**: use progressive enhancement, lighter update loops, and lower-cost fallbacks on constrained devices or hosting tiers
- Prefer pre-rendered or mostly static layered art under the live atmosphere when that preserves the feel with materially better runtime performance

## Anti-Patterns

- Generic SaaS card mosaics
- Dense explanatory copy in the hero
- Barely visible shader/ascii treatments that do not materially change the feel of the page
- Multiple competing accent colors
- Decorative motion that reduces readability or trust
- Copying reference sites literally instead of translating their principles into BETTER-specific execution
