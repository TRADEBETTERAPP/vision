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
3. Write failing tests first for the changed component or behavior. Cover navigation, interaction, accessibility, and state logic before implementation.
4. Implement the feature with the BETTER visual language in mind: premium dark terminal feel, clear maturity labels, honest CTAs, and resilient fallback states.
5. If the feature touches roadmap or visual surfaces, verify desktop, narrow/mobile layout, keyboard interaction, and reduced-motion or fallback behavior.
6. Run focused tests during iteration, then run the manifest commands for `lint`, `typecheck`, `test`, and `build`.
7. Use `agent-browser` to exercise the changed flows at `http://127.0.0.1:3100`. Record exactly what you clicked, what changed, and what state labels or destinations you observed.
8. For browser validation, prefer one stable `agent-browser` session per flow: open the page, wait for the target surface, use explicit interactions for navigation/scroll/focus, and only fall back to eval-style helpers when normal interaction commands cannot reliably reach the intended state.
9. If the feature includes deployment or release work, validate the production-like output after build and use `gh` or `npx vercel` only when the feature explicitly requires it.
10. Stop every process you started. In your handoff, include the exact browser checks, viewport/fallback checks, and any remaining environment blocker.

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
