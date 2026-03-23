# BETTER Vision Site — Visual & UX Audit

**Date:** 2026-03-23  
**Verdict:** The site looks like a hackathon project wearing a Bloomberg Terminal costume. It is dramatically over-engineered visually, drowning real content in competing atmospheric layers, and has no clear visual hierarchy. Below is a brutally honest breakdown.

---

## Executive Summary

The site has **six simultaneous visual background layers**, **four competing badge color systems**, **three nested navigation/minimap systems**, and a graph UI that feels like a prototype wireframe. The overall impression is of a project that spent 80% of its visual budget on atmospheric "terminal vibes" and 20% on actual content readability and information design. It does not read as a $100M+ platform. It reads as an over-scoped technical demo.

---

## 1. VISUAL LAYER OVERLOAD — The #1 Problem

### What's Wrong
The site renders an **absurd number of competing visual layers** simultaneously:

**HeroVisualSystem** (`src/components/visual/HeroVisualSystem.tsx`):
1. CSS radiant fallback gradient (always rendered)
2. WebGL Radiant Fluid Amber shader canvas (desktop)
3. Hermes ASCII Canvas Renderer — multi-grid, 3-density-layer, 8fps animated canvas (desktop)
4. Legacy DOM ASCII Background — `<pre>` text grid with box-drawing characters (desktop, fallback)
5. CSS scanline overlay (all devices)
6. CSS vignette gradient (all devices)

**SiteAtmosphere** (`src/components/visual/SiteAtmosphere.tsx`):  
Then the ENTIRE site is wrapped in a **second copy** of the same layers:
1. CSS site-atmosphere gradient (always)
2. **Another** HeroShaderCanvas instance (reduced opacity)
3. **Another** AsciiCanvasRenderer instance (reduced opacity)
4. **Another** AsciiBackground instance
5. **Another** scanline overlay

**That's 11 visual layers running simultaneously on desktop.** Two WebGL shader instances. Two ASCII canvas renderers. Two DOM ASCII grids. Multiple gradient overlays. This is madness.

### Root Cause
Over-engineering driven by spec compliance (VAL-VISUAL-020 etc.) rather than visual judgment. Each `VAL-*` requirement was treated as additive — "add atmosphere everywhere" — rather than making hard choices about what serves the content.

### Impact
- **Performance**: Two WebGL contexts + two canvas animation loops + DOM ASCII grid updates = unnecessary GPU/CPU load
- **Visual noise**: Content floats on top of a busy, shimmering, multi-textured background. Nothing feels grounded.
- **No breathing room**: The atmospheric layers are *everywhere*, creating visual fatigue

### Files
- `src/components/visual/HeroVisualSystem.tsx` — 6 layers
- `src/components/visual/SiteAtmosphere.tsx` — 5 more layers (duplicated)
- `src/app/globals.css` lines 103-260 — extensive CSS for managing opacity of all these layers across states

---

## 2. ASCII LAYERS — Must Be Removed Entirely

### What's Wrong
The ASCII system is the single biggest contributor to the "looks whack" feeling.

**AsciiCanvasRenderer** (`src/components/visual/AsciiCanvasRenderer.tsx`):
- **624 lines** of code for a background decoration
- Renders 3 density layers (10px/14px/20px fonts) with characters like `░▒▓│─┌┐└┘├┤┬┴┼`, `⚡☿✦★⊕◊◆▲▼●■`, `.:;+=xX$#@█`
- Uses plasma/rings/tunnel value field generators, gamma tonemapping, HSV color conversion, glyph atlas caching, screen-blend compositing, feedback buffer with decay trails
- Runs at 8fps animation loop
- All of this to render a faint blue-tinted pattern of unicode box-drawing characters behind content

**AsciiBackground** (`src/components/visual/AsciiBackground.tsx`):
- **232 lines** of DOM-based fallback
- Generates a 100x32 character grid with box-drawing borders
- Animates at 4fps with 5% character mutation per cycle
- Creates a literal `<pre>` block of `░▒▓│─┌┐└┘├┤┬┴┼` characters

### Why It's Amateur
- The "terminal aesthetic" doesn't match a prediction market platform. Bloomberg Terminal doesn't have ASCII art backgrounds.
- It's **decoration cosplaying as engineering**. 850+ lines of code for a background texture that could be replaced by a subtle CSS gradient or nothing at all.
- The box-drawing characters (└┘┴─│) and Unicode symbols (⚡☿✦★) look like a 90s BBS/MUD terminal, not a financial platform.
- Running at 8fps with temporal feedback buffers and screen-blend compositing for a *background* is absurdly over-engineered.

### Recommendation
**Delete completely.** Remove all files:
- `src/components/visual/AsciiCanvasRenderer.tsx` — delete
- `src/components/visual/AsciiBackground.tsx` — delete
- All ASCII-related CSS in `globals.css` (lines ~103-170, ~195-260) — delete
- All ASCII references in `HeroVisualSystem.tsx` — remove imports and JSX
- All ASCII references in `SiteAtmosphere.tsx` — remove imports and JSX

---

## 3. COLOR SYSTEM — Too Many Competing Accents

### What's Wrong
The site uses **four competing accent colors** in badges and UI elements:

| Color | Usage | CSS Variable |
|-------|-------|-------------|
| Green (`#00ff88`) | "Live" badges, proof cards | `--accent-green` |
| Blue (`#455eff`) | Primary accent, links, CTA buttons | `--accent-primary` |
| Orange/Amber (`#ff9900`) | "Planned" badges, caveat warnings | `--accent-warn` |
| Red/Pink (`#ff3366`) | "Speculative" badges, danger states | `--accent-danger` |

### Where It Gets Noisy
**MaturityBadge** (`src/components/MaturityBadge.tsx`):
```
live:        bg-accent-green/15 text-accent-green border-accent-green/30
in_progress: bg-accent/15 text-accent border-accent/30
planned:     bg-accent-warn/15 text-accent-warn border-accent-warn/30
speculative: bg-accent-danger/15 text-accent-danger border-accent-danger/30
```

Each badge has a **colored background + colored text + colored border** — 3 color signals per badge. When you have "Live" + "Planned" badges side by side in the hero (`CompactBrandBand.tsx` lines 52-77), plus EvidenceHook pills next to them, the status bar becomes a rainbow of green/orange/blue noise.

**HeroSurface** (`src/components/graph/surfaces/HeroSurface.tsx`):
- Live card: `border-accent-green/20 bg-accent-green/5` (green-tinted)
- Vision card: `border-accent-warn/20 bg-accent-warn/5` (orange-tinted)
- Side by side — competing colored backgrounds within the same surface

**CaveatFrame** (`src/components/CaveatFrame.tsx`):
- `border-accent-warn/20 bg-accent-warn/5 text-accent-warn` — more orange

**ProofModule** (`src/components/ProofModule.tsx`):
- Proof cards: `border-accent-green/20 bg-accent-green/5` — green cards everywhere

### Root Cause
The maturity badge system (live/in_progress/planned/speculative) uses semantically overloaded traffic-light colors. Every card surface has a colored border and background matching its maturity status, causing color pollution across the entire site.

### Recommendation
- Reduce to **2 accent colors max**: primary blue + a single supporting color
- Maturity badges should be **monochrome** (e.g., text labels with subtle grey/white differentiation) rather than multi-color rainbow pills
- Stop tinting entire card backgrounds by maturity status

---

## 4. GRAPH WORKSPACE — Feels Like a Prototype

### What's Wrong
**GraphShell** (`src/components/graph/GraphShell.tsx` — **850+ lines**):

The graph is the *entire site content model*, but it looks like a wireframe:

1. **Graph Node Map** (lines ~540-600): A plain `grid sm:grid-cols-2 lg:grid-cols-4` of buttons. Each button has:
   - An icon (Unicode symbol like ◆, ✓, ●, ⊕, ◈, ⬡, △, ◇, ⚠)
   - A label
   - A description (truncated to 2 lines)
   - A MaturityBadge (colored pill)
   - A connection count badge (absolute positioned, top-right)
   
   That's **5 pieces of metadata** per card in a 4-column grid. It's dense and reads as a developer debug view, not a user-facing navigation.

2. **Triple Navigation Redundancy**:
   - `PersistentMinimap` — always-visible bar below the grid
   - `GraphContextMinimap` — inline bar inside focused surfaces
   - `InvestorPathProgress` — another navigation bar when pitch path is active
   - Plus the top header nav
   - Plus breadcrumbs
   
   That's potentially **5 navigation mechanisms** visible simultaneously.

3. **Focused Surface Chrome**: When a node is selected, the content panel has:
   - A sticky inspector bar (top)
   - An investor path progress bar (if pitch active)
   - A focus header with back button + icon + label + maturity badge
   - Related nodes bar
   - A graph context minimap bar
   - Pitch navigation controls (prev/next)
   - Finally, the actual content
   
   That's **up to 6 chrome bars** before content. The content is buried under navigation and metadata.

4. **"Investor Pitch Path"**: The pitch path adds MORE UI: a progress bar with numbered gates, prev/next buttons, "Resume" affordance, gate labels. It feels like bolted-on functionality, not integrated design.

### Root Cause
Feature-driven design without restraint. Every VAL-* requirement was implemented as additive UI — more bars, more minimaps, more badges. Nobody stepped back and asked "is this too much?"

### Files
- `src/components/graph/GraphShell.tsx` — the entire 850-line monster
- `src/content/graph-nodes.ts` — 9 graph nodes, each with Unicode icon, description, related links

---

## 5. COMPACT BRAND BAND / HERO — Generic SaaS Landing

### What's Wrong (`src/components/graph/CompactBrandBand.tsx`):

The above-the-fold experience is:
1. Logotype image (`h-16 sm:h-20 lg:h-24`)
2. Tagline: "Prediction-market intelligence, automated."
3. Plain-language definition paragraph
4. Status framing bar (Live badge + text | divider | Planned badge + text + evidence hooks)
5. Caveat frame (orange warning box)
6. Two CTA buttons ("See What's Live" + "Explore the Atlas")

### What Makes It Look Amateur
- **Too many elements above the fold.** Logotype → tagline → definition → status bar → caveat → CTAs = 6 vertical blocks before the graph even starts. That's not "compact."
- **Status bar is noisy**: Green "Live" pill + "Terminal & copy-trading in closed beta" + evidence hook badge + divider + Orange "Planned" pill + "Vaults, agents & HyperEVM ahead" + another evidence hook. That's a lot of metadata crammed into a "compact" band.
- **Caveat warning box** (`CaveatFrame`) immediately visible = defensive and undermines confidence. A "$100M+ platform" doesn't put caveats in the hero.
- **The evidence hooks** (little bordered pills with source type icons like `✓`, `◆`, `◇` and labels) add visual noise without adding confidence at this stage.
- **Two CTAs side by side** ("See What's Live" vs "Explore the Atlas") create decision paralysis rather than a clear primary action.

### Root Cause
Over-compliance with narrative requirements (VAL-NARR-001, 002, 009, 010, 012). Every requirement was made visible in the hero instead of being distributed across the experience.

---

## 6. TYPOGRAPHY — Over-Indexed on "Terminal" Aesthetic

### What's Wrong (`src/app/globals.css`, `src/app/layout.tsx`):

- **Three font families loaded**: Geist Sans, Geist Mono, IBM Plex Mono
- IBM Plex Mono loaded at **4 weights** (400, 500, 600, 700) — that's a lot of font data
- `.font-terminal` class used *everywhere*: nav items, breadcrumbs, minimap labels, badge text, section headers, CTAs, graph labels, evidence hooks, status text, "Map" label, "Atlas" label, "BETTER Atlas" label, gate indicators...
- The monospace font at tiny sizes (text-[9px], text-[10px], text-[11px], text-xs) creates a "developer console" feel rather than a professional financial platform

### Specific Issues
- `text-[9px]` in PersistentMinimap "Map" label — nearly unreadable
- `text-[10px]` used extensively in minimap nodes, gate indicators, investor path counter, maturity badges, connection count badges
- `text-[11px]` in context minimap nodes
- Uppercase tracking-widest monospace everywhere: "BETTER Atlas", "Live & Proven", "Interactive Roadmap Atlas", "Understanding Maturity Labels" — the shouting CAPS + wide tracking reads as trying too hard

### Root Cause
Aesthetic cargo-culting of "terminal/HFT" vibes. Real Bloomberg/Refinitiv terminals use proportional fonts for most UI with monospace only for data tables. This site uses monospace for *everything*, including navigation, labels, and headings.

---

## 7. SPACING & LAYOUT — Cramped Where It Matters

### What's Wrong

- **Graph node cards** (`GraphNodeMap`): `gap-2 p-3` — very tight. The 4-column grid with 2px gap and 12px padding means cards are packed close together. Each card has icon + label + description + badge + connection count — all squeezed into a small button.
- **Focused surface header**: `p-4` with icon + label + maturity badge + related nodes bar — dense.
- **CompactBrandBand**: `mb-2`, `mb-3`, `mb-4` — incremental micro-spacing. Elements are close together but don't form clear groups.
- **Proof section** (`ProofModule.tsx`): `py-20` section padding is fine, but `mt-12 grid gap-6` for proof cards could use more air.
- **Minimap bars**: `px-3 py-1.5`, `px-4 py-2` — functional but cramped rows of tiny buttons.

### What's Missing
- No clear spatial hierarchy between the brand band, graph overview, and focused content
- The graph overview and minimap bars are stacked with `space-y-6` but there's no clear visual separation between "navigation" and "content"
- The page feels like a continuous vertical stream of boxes, bars, and buttons without visual chapters

---

## 8. NAVIGATION — Way Too Many Navigation Affordances

### What's Wrong

Simultaneously visible navigation surfaces:

1. **Header nav** (`layout.tsx`): 7 items — "What is BETTER", "Live Now", "Roadmap", "Tokenomics", "Architecture", "Evidence & Sources", "Risks & Caveats"
2. **Graph node map**: 9 clickable cards (same destinations as nav, plus Proof and Valuation)
3. **PersistentMinimap**: Bar with 9 icon+label buttons (same nodes again)
4. **Investor pitch path affordance**: "▶ Investor Pitch Path" button + gate description
5. **Sticky inspector**: Another navigation surface when focused
6. **GraphContextMinimap**: ANOTHER minimap inside focused surfaces
7. **Related nodes**: ANOTHER set of clickable node buttons in the focus header
8. **Investor path prev/next**: YET ANOTHER navigation mechanism

**A user viewing a focused surface sees**: Header nav (7 items) + sticky inspector + graph context minimap (9 items) + related nodes (2-3 items) + investor path controls + breadcrumb. That's 20+ clickable navigation elements visible simultaneously, not counting the actual content.

### Root Cause
Every VAL-ROADMAP-* requirement added another navigation layer. No consolidation pass happened.

---

## 9. THE SHADER — What to Keep and Fix

### What's Good
**HeroShaderCanvas** (`src/components/visual/HeroShaderCanvas.tsx`) — the Radiant Fluid Amber WebGL shader is the ONE visual element worth keeping. It provides a premium animated background that looks genuinely high-end.

### What's Wrong With It Currently
- It runs at **0.85 opacity** (`style={{ opacity: 0.85 }}` line ~167) — too strong, competes with content
- It's rendered **twice** — once in HeroVisualSystem, once in SiteAtmosphere
- The color has been remapped from amber to BETTER blue but is fighting with all the other blue accent elements

### Recommendation
- Keep the shader but reduce opacity significantly (0.3-0.4 range)
- Render it **once**, in a fixed position behind all content (like SiteAtmosphere does, but without duplication)
- Remove the second instance in HeroVisualSystem — let the site-wide atmosphere handle it

---

## 10. OVERALL ASSESSMENT — Hackathon Project vs $100M Platform

### What $100M+ Platforms Look Like
- **Stripe**: Clean white space, one accent color, generous padding, minimal chrome
- **Linear**: Dark mode done right — sparse UI, clear hierarchy, content-first
- **Notion**: Calm, restrained, lets content breathe
- **dYdX**: Crypto/DeFi but clean — dark bg, minimal decoration, professional data display

### What This Site Looks Like
- A technical demo of "cool things I can render in a browser"
- A developer's portfolio piece showing off ASCII art + WebGL + canvas skills
- A hackathon project where every feature got bolted on without design review
- An over-speced enterprise dashboard that tried to also be a landing page

### The Core Issue
**The site has no visual hierarchy.** Everything is equally loud:
- The background is loud (shader + ASCII + scanlines + gradients + vignettes)
- The navigation is loud (7+ nav mechanisms)
- The status system is loud (4 colors × badges × tinted cards)
- The metadata is loud (evidence hooks, caveat frames, connection counts, gate indicators)
- The chrome is loud (minimaps, inspectors, progress bars, breadcrumbs)

When everything is loud, nothing is loud. The user's eye has nowhere to land.

---

## PRIORITIZED FIX LIST

### P0 — Critical (Do First)
1. **Delete all ASCII layers** — `AsciiCanvasRenderer.tsx`, `AsciiBackground.tsx`, all ASCII CSS, all ASCII imports in HeroVisualSystem + SiteAtmosphere
2. **Reduce to single shader instance** — Remove the duplicate in HeroVisualSystem, keep only SiteAtmosphere's instance, reduce opacity to ~0.3
3. **Remove scanline overlay** — It adds noise, not sophistication
4. **Remove caveat frame from hero** — Move caveats to a dedicated section, not above-the-fold

### P1 — High Priority
5. **Consolidate navigation** — Kill PersistentMinimap, GraphContextMinimap, and the investor path progress bar. Keep: header nav + graph node map + related nodes in focus view. That's enough.
6. **Monochrome badges** — Replace the 4-color maturity system with monochrome labels. Use text weight/opacity differences instead of green/orange/red/blue backgrounds.
7. **Simplify graph node cards** — Remove connection count badges, reduce to icon + label + single subtle status indicator. Increase card padding and gap.
8. **Reduce focused surface chrome** — Kill the sticky inspector (redundant with focus header). Reduce to: back button + title + maturity label, then content. That's it.

### P2 — Important
9. **Simplify CompactBrandBand** — Logotype → tagline → ONE CTA. Remove status framing bar, evidence hooks, definition paragraph, and caveat from the hero.
10. **Typography cleanup** — Stop using monospace for navigation/labels/badges. Reserve it for data tables and code-like content. Use Geist Sans for UI. Drop IBM Plex Mono to 2 weights.
11. **Increase spacing** — Graph node grid: `gap-4 p-4` minimum. Section spacing: more breathing room between nav and content areas. Add clear visual breaks.
12. **Color simplification** — Primary blue accent only. Maturity status communicated through text labels, not colored backgrounds.

### P3 — Polish
13. **Evidence hooks** — Remove from hero and graph overview. Show only inside focused surface content, and make them less visually prominent (text link, not a bordered pill).
14. **Mobile experience** — Already simplified by capability gating (no shader/ASCII on mobile). Focus on content readability.
15. **Footer** — Fine as-is, but the legal copy is generic.

---

## FILE REFERENCE INDEX

| File | Lines | Issue |
|------|-------|-------|
| `src/components/visual/AsciiCanvasRenderer.tsx` | 624 | **DELETE** — ASCII canvas system |
| `src/components/visual/AsciiBackground.tsx` | 232 | **DELETE** — ASCII DOM fallback |
| `src/components/visual/HeroVisualSystem.tsx` | ~190 | Remove ASCII imports + JSX, remove scanline overlay |
| `src/components/visual/SiteAtmosphere.tsx` | ~130 | Remove ASCII imports + JSX, remove scanline overlay |
| `src/app/globals.css` | ~340 | Remove ~150 lines of ASCII CSS, scanline CSS, visual state ASCII rules |
| `src/components/graph/GraphShell.tsx` | 850+ | Massive simplification needed — kill minimaps, reduce chrome |
| `src/components/graph/CompactBrandBand.tsx` | ~105 | Simplify to logotype + tagline + single CTA |
| `src/components/MaturityBadge.tsx` | ~30 | Move to monochrome design |
| `src/components/EvidenceHook.tsx` | ~50 | Make less visually prominent |
| `src/components/CaveatFrame.tsx` | ~30 | Remove from hero, use only in dedicated sections |
| `src/components/nav-items.ts` | ~15 | 7 nav items — consider reducing |
| `src/content/graph-nodes.ts` | ~130 | 9 nodes — fine conceptually, but presentation is the problem |
