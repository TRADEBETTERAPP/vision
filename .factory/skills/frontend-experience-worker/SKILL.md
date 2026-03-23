---
name: frontend-experience-worker
description: Builds the interactive BETTER vision site, including navigation, roadmap graph, visuals, and release-facing polish.
---

# Frontend Experience Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use this skill for app scaffold work, navigation, roadmap and mindmap UI, immersive visuals, architecture storytelling, cross-surface state management, browser-first QA, and release/deployment features.

## Required Skills

- `agent-browser` — mandatory for every feature that changes a rendered user-facing flow.

## Work Procedure

1. Read `mission.md`, mission `AGENTS.md`, and the relevant `.factory/library/*.md` files before making changes.
2. Inspect the existing app structure, scripts, components, and content/data contracts. Reuse the established patterns instead of inventing parallel ones.
3. If the feature changes the landing page, hero, shell, or immersive visual system, review `.factory/library/design-system.md` and the reference screenshots in `.factory/research/screenshots/` before making changes. Treat them as hierarchy and atmosphere guardrails, not as assets to clone literally.
4. If the feature touches tradebetter-led theme parity, use the approved extraction workflow before implementation: `FetchUrl` for Framer HTML/CSS/theme tokens, `pinchtab` for live rendered screenshots/text, and `agent-browser` for runtime/computed-style verification when needed. If previously committed extraction artifacts are still current and the feature is only enforcing or extending them, reuse is allowed only if your handoff cites the exact committed artifact you relied on; if the feature contract requires explicit side-by-side parity evidence, capture fresh comparison evidence in this feature. Cite the extracted tokens or findings you actually used. If you skip a required extraction step, report `followedProcedure=false`.
5. If the feature touches the immersive layer, you must directly adapt concrete implementation resources from both `radiant-shaders.com` and `https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/ascii-video`; handoff notes must cite the exact URLs/files used and how BETTER adapted them.
6. The approved immersive implementation path is specific: use a vendored real Radiant background asset and a real-time Hermes-derived ASCII canvas renderer. Do not satisfy this requirement with a custom approximation shader plus a synthetic DOM text grid.
7. If the feature changes the shell or navigation model, build toward a graph-first explorable mindmap experience rather than another section-anchor scroll page. Orientation recovery, focus state, and node-first exploration are required concerns, not optional polish.
8. For the current BETTER follow-up, prefer a dedicated graph workspace architecture (for example React Flow/XYFlow with deterministic layout, minimap/orientation controls, and a sticky inspector) over simply swapping long-form sections inside the existing page shell.
9. If the feature touches BETTER branding, use the provided logotype asset in the required header, hero, and mobile-overlay surfaces instead of text-only placeholders. The BETTER logotype must be visible at the top of the graph-first workspace so investors see the brand immediately on load.
10. Write failing tests first for the changed component or behavior. Cover navigation, interaction, accessibility, state logic, and where relevant viewport visibility/performance behavior before implementation. In your handoff, cite at least one newly failing test expectation you wrote before the implementation change; if you cannot, report `followedProcedure=false`.
11. Implement the feature with the BETTER visual language in mind: tradebetter-led hierarchy, premium dark terminal feel, pure white primary text, restrained card use, honest CTAs, site-wide atmosphere, and resilient fallback states.
12. If the feature touches the hero, shell, or immersive visuals, keep the first viewport as one dominant composition with BETTER as the loudest signal and 2-3 intentional motions at most.
13. If the feature touches the landing page, ensure only one hero/brand surface exists. Do not allow a duplicate standalone hero section beneath the graph workspace; deduplicate by removing the redundant instance and confirming a single authoritative hero in the browser.
14. If the feature touches roadmap, shell, or visual surfaces, verify desktop, narrow/mobile layout, keyboard interaction, investor-path coherence, and reduced-motion or fallback behavior.
15. If the feature touches the background or motion system, optimize for balanced live-desktop-only performance: prefer one coordinated atmosphere stack, progressive enhancement, and cheaper constrained-device behavior over stacking multiple always-on heavy animation layers.
16. Use dynamic imports for heavy components (graph workspace, WebGL, ASCII canvas), implement skeleton screens for progressive loading, and verify first meaningful paint timing. Do not let heavy interactive surfaces block initial render.
17. Run focused tests during iteration, then run the manifest commands for `lint`, `typecheck`, `test`, and `build`.
18. Use `agent-browser` to exercise the changed flows at `http://127.0.0.1:3100`. Record exactly what you clicked, what changed, and what state labels or destinations you observed.
19. For browser validation, prefer one stable `agent-browser` session per flow: open the page, wait for the target surface, use explicit interactions for navigation/scroll/focus, and only fall back to eval-style helpers when normal interaction commands cannot reliably reach the intended state.
20. When a feature claims to replace section-anchor browsing with graph/node-first navigation, explicitly validate every primary hero CTA and shared-chrome CTA destination so no legacy anchor-scroll path remains in the main shell, and include destination evidence for those checks in the handoff rather than only a narrative claim.
21. When a feature claims related-node or graph-destination traversal retains visible graph context, validate the post-transition viewport explicitly. DOM presence alone is insufficient; capture evidence that the overview, minimap, or equivalent orientation frame remains visibly on-screen after the click.
22. For major visual or shell rewrites, include at least one check that explicitly evaluates hero composition, brand dominance, graph-first exploration feel, investor-path coherence, unmistakable moving shader/ascii background behavior across the full site, and whether the enhanced state is materially stronger than the constrained fallback. If the feature must prove enhanced-path runtime smoothness or active desktop motion, use a headed/GPU-capable browser session and record evidence that the enhanced state was actually active (for example `data-visual-state=enhanced` with motion layers present) before citing frame-rate, jank, or similar runtime observations. Also cite the screenshot paths or public source references you reviewed.
23. If the feature includes deployment or release work, validate the production-like output after build and use `gh` or `npx vercel` only when the feature explicitly requires it. Do not resume release/deployment work until the new investor-grade mindmap/performance milestone has passed validation.
24. Stop every process you started. In your handoff, include the exact browser checks, viewport/fallback checks, the cited screenshot/source evidence, and any remaining environment blocker.

## Example Handoff

```json
{
  "salientSummary": "Implemented the scroll-linked roadmap atlas and detail panels, then verified expand/collapse, deep links, keyboard access, and mobile layout in the browser. All validators passed, and the app still builds cleanly.",
  "whatWasImplemented": "Built the interactive roadmap shell with a synchronized narrative section, explorable graph states, node detail panels, and status-tagged branch families for product, token utility, revenue, technical infrastructure, and social/agent expansion. Added accessibility states and shared URL handling for roadmap details.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      {
        "command": "npm run test",
        "exitCode": 0,
        "observation": "Roadmap interaction and state-management tests passed."
      },
      {
        "command": "npm run lint",
        "exitCode": 0,
        "observation": "No lint issues."
      },
      {
        "command": "npx tsc --noEmit",
        "exitCode": 0,
        "observation": "Typecheck passed."
      },
      {
        "command": "npm run build",
        "exitCode": 0,
        "observation": "Production build completed successfully."
      }
    ],
    "interactiveChecks": [
      {
        "action": "Opened the roadmap section, expanded a branch, selected a node, refreshed the deep-linked URL, and used browser back/forward.",
        "observed": "The active node, detail panel, and history state restored correctly without resetting to defaults."
      },
      {
        "action": "Repeated the roadmap flow on a narrow viewport and navigated with keyboard controls.",
        "observed": "Touch targets remained usable, labels stayed visible, and keyboard focus moved through the roadmap controls correctly."
      }
    ]
  },
  "tests": {
    "added": [
      {
        "file": "src/components/roadmap/RoadmapAtlas.test.tsx",
        "cases": [
          {
            "name": "deep-linked node state restores after refresh",
            "verifies": "The same roadmap detail remains active when the page reloads."
          },
          {
            "name": "branch toggles expose the correct expanded state",
            "verifies": "Accessible expansion state matches the visible branch state."
          }
        ]
      }
    ]
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- The feature requires a new service, dependency, or boundary change not already approved
- Browser validation cannot be completed because the app will not start or a required tool is unavailable
- GitHub or Vercel release steps require external authentication or account action you cannot complete autonomously
