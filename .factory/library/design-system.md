# Design System — tradebetter-exact

Authoritative visual direction for the BETTER Vision site, aligned to the tradebetter-exact redesign.

**What belongs here:** color tokens, typography, card treatments, button styles, badge/status system, spacing, motion, and anti-patterns.
**What does NOT belong here:** raw screenshots, implementation diffs, or validator reports.
**Canonical reference:** `/Users/test/vision/.factory/library/tradebetter-exact-design-reference.md`

---

## Visual Thesis

BETTER should feel like a dark brutalist-minimalist terminal flagship: Bloomberg terminal reimagined for crypto-native audiences. Austere, commanding, clinical, cinematic. One focal point per viewport, vertical storytelling, monospace as identity.

The experience reads as a **dynamic graph workspace with an investor-readable story spine**, not a long-form deck or generic SaaS page.

---

## Color Tokens (tradebetter-exact)

### Core Backgrounds

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#101010` | Page background / main canvas |
| `--bg-secondary` | `#191a1d` | Card backgrounds, section panels |
| `--bg-card` | `rgba(255, 255, 255, 0.10)` | Glass-morphism card surface |
| `--bg-card-hover` | `rgba(255, 255, 255, 0.15)` | Card hover state |
| `--bg-card-emphasis` | `rgba(255, 255, 255, 0.30)` | Emphasized glass surface |
| `--bg-overlay-dark` | `rgba(0, 0, 0, 0.65)` | Image darkening overlay |

### Text Colors

| Token | Value | Usage |
|---|---|---|
| `--text-primary` | `#ffffff` | Headings — pure white |
| `--text-secondary` | `#a0a0a0` | Body text — muted gray |
| `--text-muted` | `#707070` | Deemphasized |
| `--text-subtle` | `#404040` | Very subtle |
| `--text-bright` | `#e6e6e6` | Emphasized body |
| `--text-disabled` | `#575757` | Disabled/inactive |

### Accent Colors (TWO ONLY)

| Token | Value | Usage Rule |
|---|---|---|
| `--accent-green` | `#00ff00` | **Status indicators ONLY** — live dots, confidence scores, active signals. Never on backgrounds, headings, or atmospheric elements. |
| `--accent-green-deep` | `#026c06` | Dark green backgrounds (rare) |
| `--accent-green-mid` | `#2d8b2d` | Button/badge green (rare) |
| `--accent-blue` | `#455eff` | **Atmospheric gradients ONLY** — directional background glows. Never on text, buttons, or status indicators. |
| `--accent-blue-dark` | `#0027ff` | Darker blue variant |
| `--accent-sky` | `#0099ff` | Link or data accent |

### Borders

| Token | Value | Usage |
|---|---|---|
| `--border-card` | `rgba(255, 255, 255, 0.20)` | Card borders |
| `--border-emphasis` | `rgba(255, 255, 255, 0.50)` | Active/focused borders |
| `--border-default` | `#fff6` | White 40% — outlined elements |
| `--border-gray` | `#707070` | Mid-gray borders |
| `--border-white` | `#ffffff` | Full white — roadmap grid |

### Shadows

| Token | Value | Usage |
|---|---|---|
| `--glow-white` | `0px 0px 16px 0px rgba(255, 255, 255, 0.75)` | Primary CTA hover glow |

Green glow utilities are **not** part of the approved BETTER adaptation. `#00ff00`
is reserved for static status dots/signals only.

### Gradients

| Token | Value | Usage |
|---|---|---|
| `--gradient-blue-glow` | `linear-gradient(228deg, #455eff00 63%, #455eff)` | Atmospheric corner glow |
| `--gradient-dark-overlay` | `linear-gradient(#0000 0%, #000000a6 100%)` | Image/hero darkening |

### Color Philosophy

- **Restraint principle**: Only 2 accent colors total. Everything else is grayscale `#101010` → `#ffffff`.
- **Green = status/signal only**: Live dots and similarly minimal signal marks. No green fills or glow utilities.
- **Blue = atmospheric**: Background gradient glows only — never on text or CTAs.
- **White = hierarchy anchor**: All headings pure white. White is the loudest "color".
- **5-level gray scale** for subtle text hierarchy: `#404040` → `#575757` → `#707070` → `#a0a0a0` → `#e6e6e6`

---

## Typography

### Font Stack

| Font | Role | Usage |
|---|---|---|
| Helvetica Neue Medium (shipped as Geist Sans) | Display | Headings H1–H4 |
| IBM Plex Mono | Terminal/body | Body text, labels, data, descriptions, buttons |
| Inter | Fallback | Bold variants within body text |

### UPPERCASE Heading Rule (MANDATORY)

**ALL headings are UPPERCASE** — no exceptions. This is a defining characteristic of the tradebetter aesthetic.

### Letter-Spacing

**Tight letter-spacing everywhere**: `-0.04em` to `-0.08em`. Compressed, dense, technical feel.

| Element | Letter-Spacing |
|---|---|
| H1–H2 | `-0.06em` |
| H3–H4 | `-0.04em` |
| Body/labels | `-0.04em` to `-0.08em` |
| Buttons | `-0.08em` |

### Type Scale (Desktop)

| Element | Font | Size | Weight | Line Height | Transform |
|---|---|---|---|---|---|
| H1 (Hero) | Display | `64px` | 500 | 1.0 | UPPERCASE |
| H2 (Section) | Display | `48px` | 500 | 1.17 | UPPERCASE |
| H3 (Subsection) | Display | `40px` | 500 | 1.1 | UPPERCASE |
| H4 | Display | `32px` | 500 | 1.125 | UPPERCASE |
| Body Large | IBM Plex Mono | `20px` | 400 | 1.4 | none |
| Body | IBM Plex Mono | `16px` | 400 | 1.5 | none |
| Label/Tag | IBM Plex Mono | `14px` | 500 | 1.43 | UPPERCASE |
| Caption | IBM Plex Mono | `14px` | 400 | 1.43 | none |

### Hierarchy

- White headings (`#ffffff`), gray body text (`#a0a0a0`) — strong 2-level hierarchy.
- Primary copy must read as **crisp pure white**, not grey-white.
- Reserve grey tokens for secondary/supporting text only.

---

## Liquid Metal Card Treatment

The signature card system uses a **liquid metal** approach — glass-morphism with cursor-tracking metallic sheen.

### Base Card CSS

```css
padding: 24px; /* or 32px on larger variants */
border-radius: 8px;
background-color: rgba(255, 255, 255, 0.10);
border: 1px solid rgba(255, 255, 255, 0.20);
```

### Hover / Interaction

```css
/* Hover state */
background-color: rgba(255, 255, 255, 0.15);

/* Cursor-tracking radial-gradient metallic sheen */
/* Implemented via CSS custom properties updated on mousemove */
background-image: radial-gradient(
  circle at var(--mouse-x) var(--mouse-y),
  rgba(255, 255, 255, 0.15) 0%,
  transparent 60%
);
```

### Card Principles

1. **Borders over shadows**: Cards defined by thin 1px borders, not drop shadows.
2. **Glass-morphism lite**: `rgba(255,255,255,0.1)` backgrounds for subtle layering.
3. **8px border-radius**: The only radius for content cards.
4. **No card elevation**: Depth from opacity/color layers, not shadows.
5. **No backdrop-blur**: Glass effect is opacity-based only.
6. **No WebGL**: Cursor-tracking metallic sheen is pure CSS (radial-gradient + mousemove event).
7. **Left-aligned content** within cards: top-down vertical flow.

---

## Badge & Status System (Simplified)

### Color Rule

Badges are **monochrome + green only**. No rainbow colors. No multi-color palette.

### Status Indicators

| Status | Visual Treatment |
|---|---|
| `Live` | Green dot: 8px circle, `#00ff00`, `border-radius: 1000px`. Optional glow: `box-shadow: 0px 0px 12px 0px rgba(0, 255, 0, 0.5)` |
| `In progress` | White or light gray text label. No colored dot. |
| `Planned` | Gray text label (`#a0a0a0`). No colored dot. |
| `Speculative` | Subtle gray text label (`#707070`). No colored dot. |

### Status Dot Behavior

- Static — no pulsing animations. The green color alone signals liveness.
- 8px diameter, perfectly circular (`border-radius: 1000px`).

### What NOT to do with badges

- No rainbow/multi-color status badges
- No badge clutter or gamification
- No colored backgrounds on status pills (except green for Live)
- No complex badge hierarchies

---

## Square CTA Buttons

### Primary CTA (Solid White)

```css
display: inline-flex;
align-items: center;
justify-content: center;
padding: 16px 32px;
background-color: #ffffff;
color: #101010;
font-family: "IBM Plex Mono", monospace;
font-size: 14px;
font-weight: 500;
letter-spacing: -0.08em;
text-transform: uppercase;
border-radius: 0px;  /* SQUARE — brutalist, mandatory */
border: none;
box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.75);  /* white glow */
```

### Secondary CTA (Outline)

```css
padding: 16px 32px;
background-color: transparent;
color: #ffffff;
font-family: "IBM Plex Mono", monospace;
font-size: 14px;
font-weight: 500;
letter-spacing: -0.08em;
text-transform: uppercase;
border: 1px solid #ffffff;
border-radius: 0px;  /* SQUARE */
box-shadow: none;
```

### Button Rules

1. **`border-radius: 0px` on ALL CTAs** — no rounded corners, no pills. Brutalist identity.
2. **White glow on primary CTA** — signature luminous aura effect.
3. **Monospace text** on all buttons — terminal aesthetic.
4. **UPPERCASE text** — consistent with heading treatment.
5. **Tight letter-spacing** (`-0.08em`).

---

## Spacing System

### Section Spacing

| Property | Values |
|---|---|
| Between major sections | `100px`, `104px`, `112px`, `124px`, `136px` |
| Section padding | `80px` top, `164px 0 64px`, `200px 0` |
| Content padding | `24px`, `32px` |
| Card internal padding | `24px`, `32px` |
| Card grid gaps | `20px`, `24px`, `28px` |
| Content stack gaps | `12px`, `16px`, `20px`, `24px` |

### CSS Custom Properties

```css
--space-xs: 4px;
--space-sm: 10px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 56px;
--space-section: 100px;
--space-section-lg: 136px;
```

### Spacing Philosophy

- **Generous vertical breathing room**: 100–136px between major sections.
- **Full-width bleed** for atmospheric/divider elements; content max-width constrained.
- **Vertical single-column storytelling**: One focus per viewport, cinematic scroll.

---

## Atmosphere & Background

### Layer Stack (top to bottom)

1. **Film grain GIF overlay**: Animated GIF texture, `5% opacity`, `mix-blend-mode: lighten`. Covers entire page. Creates analog/cinematic warmth.
2. **Readability overlays**: Dark gradient overlays for text contrast.
3. **Single Radiant Fluid Amber shader**: ONE instance, reduced opacity. Atmospheric depth, not dominant.
4. **Electric blue atmospheric glow**: `linear-gradient(228deg, #455eff00 63%, #455eff)` — directional corner glow.
5. **Base**: Solid `#101010` near-black.

### What Was Removed

- ~~AsciiCanvasRenderer~~ — DELETED
- ~~AsciiBackground~~ — DELETED
- ~~Hermes ASCII-video pipeline~~ — DELETED
- ~~Dual shader instances~~ — reduced to single
- ~~DOM `<pre>` text grids~~ — DELETED
- ~~Scanline CSS textures~~ — replaced by film grain GIF

---

## Motion Language

- Use 2-3 intentional motions only.
- Prefer scroll-triggered entrance (spring-based: stiffness 200–400, damping 30–100) and tactile hover/reveal.
- No constant ambient animation noise.
- Smoothness matters more than spectacle.
- All motion must degrade cleanly under `prefers-reduced-motion`.
- Cursor-tracking metallic sheen on cards is the primary interactive motion.

---

## Anti-Patterns

- Generic SaaS card mosaics
- Dense explanatory copy in the hero
- Multiple competing accent colors (only green + blue allowed)
- Decorative motion that reduces readability
- Rainbow/multi-color badges or status indicators
- Rounded-corner pill CTAs (must be SQUARE)
- Backdrop-blur on cards
- Drop shadows on cards
- Light mode / white backgrounds (except CTA buttons)
- Heavy parallax or complex animation
- ASCII rendering of any kind
- Dual or multiple shader instances

---

*This design system is derived from the tradebetter-exact-design-reference.md. See that document for exhaustive CSS values, content copy, and section-by-section layout reference.*
