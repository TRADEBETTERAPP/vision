# Architecture

Intended application architecture and implementation patterns for this mission.

**What belongs here:** App structure, rendering strategy, shared state patterns, visual-system guidance.
**What does NOT belong here:** Environment credentials, port commands, or raw research dumps.

---

- Build a Next.js + TypeScript app with a graph-first exploration shell and client-only immersive visual layers.
- Prefer App Router patterns unless the scaffold proves a different structure is materially better.
- Keep roadmap branches, token tiers, scenario assumptions, cost bands, and evidence cues in typed local data/content modules.
- Use one shared maturity taxonomy across the site: `Live`, `In progress`, `Planned`, `Speculative`.
- The redesign direction is tradebetter-led: the landing page should behave like a flagship poster/product surface first, and a roadmap document second.
- Treat the first viewport as one composition with BETTER as the loudest brand signal, one dominant visual plane, compressed supporting copy, and no hero cards unless the card itself is the interaction.
- Favor section-led layouts over repeated bordered cards. Each section should have one job: establish identity, prove the product, deepen the thesis, explain the roadmap, or convert.
- Keep immersive effects behind the DOM-first content. The single shader layer and film grain overlay should enrich atmosphere without becoming the only visual anchor.
- **`AsciiCanvasRenderer.tsx` and `AsciiBackground.tsx` are DELETED.** All ASCII canvas, ASCII video, Hermes-derived ASCII pipeline, and DOM `<pre>` text grids have been permanently removed from the codebase.
- The approved atmosphere architecture is now: static CSS fallback layer → **single Radiant Fluid Amber shader instance** (reduced opacity) → **tradebetter-exact film grain GIF overlay** (animated GIF, 5% opacity, `mix-blend-mode: lighten`) → readability overlays → content.
- Only ONE shader instance runs site-wide (not dual). The shader provides atmospheric depth at reduced opacity — it must not dominate.
- The film grain overlay is an animated GIF texture applied page-wide, replacing all prior scanline and ASCII texture approaches.
- **Liquid metal card CSS approach**: All content cards use nearly-transparent glass (`rgba(255,255,255,0.04)` background, `1px solid rgba(255,255,255,0.12)` border, `8px` radius) with a hover state of `rgba(255,255,255,0.08)`, a subtle inset glow (`inset 0 0 30px rgba(255,255,255,0.03)`), and a **cursor-tracking radial-gradient metallic sheen**. This is implemented via CSS custom properties (`--mouse-x`, `--mouse-y`) updated on `mousemove` — no WebGL, no canvas, no backdrop-blur. Pure CSS + JS event handler.
- Use actual proof surfaces near the top of the page: product/product-like imagery, workflow framing, evidence hooks, trust signals, or market proof should appear before heavy roadmap density.
- The shell should now be a full graph-first mindmap surface with clear focal-node selection, orientation recovery, and detail panels; ordinary vertical sections may support the experience, but they should not be the primary navigation model.
- Prefer a real graph workspace architecture (for example `@xyflow/react` / React Flow with deterministic layout, direct node traversal, and one lightweight orientation aid) over a long page that merely swaps large sections behind graph-like controls. Do not reintroduce stacked sticky inspectors, persistent minimaps, or other IDE-like chrome that the current visual direction has removed.
- Graph-shell surfaces are intentionally unmounted when unfocused, so any roadmap, tokenomics, or other cross-surface state that must survive shell handoffs needs to live above that boundary (for example in a shell-level persistence provider) instead of inside surface-local component state.
- Prefer one unified graph/content model that can represent hero identity, proof, roadmap, token policy, architecture, evidence, and risks as connected BETTER domains.
- The graph workspace should also support an investor-readable route through the same content: thesis, wedge, proof, moat, business model, roadmap gates, valuation logic, and appendix detail should be traversable without leaving the graph shell.
- Current quirk: flywheel node/status data still lives inline in `src/components/architecture/FlywheelExplorer.tsx`, so consistency tests must currently render the component instead of importing a shared typed flywheel content model.
- It is acceptable to introduce graph/layout/pan-zoom tooling if it materially supports the approved shell rewrite.
- The BETTER logotype asset should replace the current text wordmarks in the header, hero, and mobile-overlay surfaces.
- Extend the single Radiant shader + film grain overlay across the whole site so the experience reads as one continuous world, not a hero-only treatment.
- Optimize the atmosphere for **balanced live desktop only** performance: one single shader instance, one film grain GIF overlay, progressive enhancement on capable devices, cheaper fallbacks elsewhere, and no redundant always-on heavy layers competing for the same frame budget.
- The scenario engine should separate canonical current BETTER facts from future scenario assumptions and illustrative outputs.
- Token policy models should separate canonical contract facts (for example minted supply) from modeled whale-policy proposals, and user-facing surfaces must expose which values are canonical versus inferred.
- Execution-plan models should separate internal build work, external dependencies, proof gates, and realistic timing windows so the roadmap can explain how each stage gets delivered rather than only what the stage is called.
- Valuation models should be stage-gated and comparable-backed, presenting conservative value corridors tied to proof milestones rather than headline promises.
- Vault-capacity models should support stake-share estimation: given user stake, total staked BETTER, and vault-cap assumptions, the UI should estimate the user’s implied share of first-vault and modeled whale-vault initial deposit capacity.
- Heavy visuals must support reduced-motion mode and runtime fallback states without blocking content.

## Performance optimization guidance
- Use **aggressive code splitting** across all major route boundaries and feature modules.
- Use **dynamic imports** for the graph workspace and any heavy visualization tooling (e.g. `@xyflow/react`, ELK layout, shader/canvas layers) so they are not in the critical initial bundle.
- Next.js App Router caveat: `dynamic(() => import(...))` does **not** lazy-load a Server Component's own markup/data. If a below-fold section needs real deferral, put the lazy boundary on a Client Component entrypoint (or otherwise move the deferred work behind a client boundary) instead of dynamically importing a server-only component.
- **Lazy-load heavy components** such as scenario engines, detailed roadmap panels, vault calculators, and evidence deep-dives behind user interaction or viewport triggers.
- Implement **skeleton and progressive loading** patterns: show lightweight placeholder UI immediately while heavy graph/visual content streams in.
- The old standalone hero section must be **removed** and replaced with a **minimal brand band** integrated into the graph workspace — do not ship both a full hero section and a graph workspace hero node.
