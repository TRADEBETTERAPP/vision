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
- Keep immersive effects behind the DOM-first content. Shader and ASCII layers should enrich atmosphere, motion, and material feel without becoming the only visual anchor.
- The immersive layer must directly adapt concrete source material from both Radiant and the Hermes ASCII-video skill; do not satisfy this requirement with purely original-but-similar effects.
- The approved architecture is now: static CSS fallback layer -> vendored Radiant background asset -> Hermes-derived moving ASCII canvas layer -> readability overlays -> hero content.
- The ASCII layer should be canvas-based and visibly animated via glyph-mapped frames, not a DOM `<pre>` grid with sparse random mutations.
- Use actual proof surfaces near the top of the page: product/product-like imagery, workflow framing, evidence hooks, trust signals, or market proof should appear before heavy roadmap density.
- The shell should now be a full graph-first mindmap surface with clear focal-node selection, orientation recovery, and detail panels; ordinary vertical sections may support the experience, but they should not be the primary navigation model.
- Prefer a real graph workspace architecture (for example `@xyflow/react` / React Flow with deterministic layout, sticky inspector, minimap, and explicit camera/orientation state) over a long page that merely swaps large sections behind graph-like controls.
- Graph-shell surfaces are intentionally unmounted when unfocused, so any roadmap, tokenomics, or other cross-surface state that must survive shell handoffs needs to live above that boundary (for example in a shell-level persistence provider) instead of inside surface-local component state.
- Prefer one unified graph/content model that can represent hero identity, proof, roadmap, token policy, architecture, evidence, and risks as connected BETTER domains.
- The graph workspace should also support an investor-readable route through the same content: thesis, wedge, proof, moat, business model, roadmap gates, valuation logic, and appendix detail should be traversable without leaving the graph shell.
- Current quirk: flywheel node/status data still lives inline in `src/components/architecture/FlywheelExplorer.tsx`, so consistency tests must currently render the component instead of importing a shared typed flywheel content model.
- It is acceptable to introduce graph/layout/pan-zoom tooling if it materially supports the approved shell rewrite.
- The BETTER logotype asset should replace the current text wordmarks in the header, hero, and mobile-overlay surfaces.
- Extend the Radiant/Hermes atmospheric stack across the whole site so the experience reads as one continuous world, not a hero-only treatment.
- Optimize the atmosphere for **balanced live desktop only** performance: one coordinated live background system, progressive enhancement on capable devices, cheaper fallbacks elsewhere, and no redundant always-on heavy layers competing for the same frame budget.
- The scenario engine should separate canonical current BETTER facts from future scenario assumptions and illustrative outputs.
- Token policy models should separate canonical contract facts (for example minted supply) from modeled whale-policy proposals, and user-facing surfaces must expose which values are canonical versus inferred.
- Execution-plan models should separate internal build work, external dependencies, proof gates, and realistic timing windows so the roadmap can explain how each stage gets delivered rather than only what the stage is called.
- Valuation models should be stage-gated and comparable-backed, presenting conservative value corridors tied to proof milestones rather than headline promises.
- Vault-capacity models should support stake-share estimation: given user stake, total staked BETTER, and vault-cap assumptions, the UI should estimate the user’s implied share of first-vault and modeled whale-vault initial deposit capacity.
- Heavy visuals must support reduced-motion mode and runtime fallback states without blocking content.

## Performance optimization guidance
- Use **aggressive code splitting** across all major route boundaries and feature modules.
- Use **dynamic imports** for the graph workspace and any heavy visualization tooling (e.g. `@xyflow/react`, ELK layout, shader/canvas layers) so they are not in the critical initial bundle.
- **Lazy-load heavy components** such as scenario engines, detailed roadmap panels, vault calculators, and evidence deep-dives behind user interaction or viewport triggers.
- Implement **skeleton and progressive loading** patterns: show lightweight placeholder UI immediately while heavy graph/visual content streams in.
- The old standalone hero section must be **removed** and replaced with a **minimal brand band** integrated into the graph workspace — do not ship both a full hero section and a graph workspace hero node.
