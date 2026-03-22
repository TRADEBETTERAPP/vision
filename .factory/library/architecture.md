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
- Prefer one unified graph/content model that can represent hero identity, proof, roadmap, token policy, architecture, evidence, and risks as connected BETTER domains.
- Current quirk: flywheel node/status data still lives inline in `src/components/architecture/FlywheelExplorer.tsx`, so consistency tests must currently render the component instead of importing a shared typed flywheel content model.
- It is acceptable to introduce graph/layout/pan-zoom tooling if it materially supports the approved shell rewrite.
- The BETTER logotype asset should replace the current text wordmarks in the header, hero, and mobile-overlay surfaces.
- Extend the Radiant/Hermes atmospheric stack across the whole site so the experience reads as one continuous world, not a hero-only treatment.
- The scenario engine should separate canonical current BETTER facts from future scenario assumptions and illustrative outputs.
- Token policy models should separate canonical contract facts (for example minted supply) from modeled whale-policy proposals, and user-facing surfaces must expose which values are canonical versus inferred.
- Heavy visuals must support reduced-motion mode and runtime fallback states without blocking content.
