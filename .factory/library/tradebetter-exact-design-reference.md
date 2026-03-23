# tradebetter.app — Exact Design Reference (Authoritative)

> **Source**: https://tradebetter.app (Framer-built, published Mar 9, 2026)  
> **Extraction date**: 2026-03-23  
> **Extraction method**: FetchUrl (HTML/CSS/content), high-res screenshot analysis, existing design spec cross-reference  
> **Purpose**: Authoritative single-source reference for BETTER Vision site redesign — "just like its mother"

---

## TABLE OF CONTENTS

1. [Overall Aesthetic DNA](#1-overall-aesthetic-dna)
2. [Color Palette — Exact Values](#2-color-palette--exact-values)
3. [Typography — Exact Stacks & Scale](#3-typography--exact-stacks--scale)
4. [Card Treatments — Exact CSS](#4-card-treatments--exact-css)
5. [Section Layout & Flow](#5-section-layout--flow)
6. [Shader / Visual Background / Atmosphere](#6-shader--visual-background--atmosphere)
7. [Button / CTA Styles — Exact CSS](#7-button--cta-styles--exact-css)
8. [Status Indicators & Live Signals](#8-status-indicators--live-signals)
9. [Data Presentation — Numbers, Metrics, Confidence](#9-data-presentation--numbers-metrics-confidence)
10. [Full Page Flow — Section Order](#10-full-page-flow--section-order)
11. [Image / Screenshot Treatment](#11-image--screenshot-treatment)
12. [Navigation System](#12-navigation-system)
13. [Divider / Section Separator Treatment](#13-divider--section-separator-treatment)
14. [Animation & Motion](#14-animation--motion)
15. [Signature Text Treatments](#15-signature-text-treatments)
16. [Complete Token Map (CSS Custom Properties)](#16-complete-token-map-css-custom-properties)
17. [Do's and Don'ts — Design Guardrails](#17-dos-and-donts--design-guardrails)

---

## 1. Overall Aesthetic DNA

**Style**: Dark brutalist-minimalist with terminal/hacker DNA. Bloomberg terminal reimagined for crypto-native audiences — institutional-grade information density in a sleek dark UI with surgical neon green accents.

**Atmosphere keywords**: Austere, commanding, clinical, elite, sparse, monospaced, dark-mode-only, cinematic.

**Core identity signals**:
- Film grain overlay across entire page (analog warmth on digital darkness)
- Terminal cursor prefixes (`>_`, `>`, `//`) on headings
- Monospace as the primary body font (IBM Plex Mono)
- ALL-CAPS headings with extreme negative tracking
- Only 2 accent colors used on the entire page: neon green + electric blue
- Dark-only — no light mode, no light surfaces, no white backgrounds (except CTAs)
- Vertical single-column storytelling — one focal point per viewport

**What tradebetter does NOT do** (equally important):
- No badge clutter or gamification elements
- No competing visual layers
- No gradients on text
- No rounded-corner pill shapes on content cards
- No multi-color rainbow palette
- No decorative illustrations or icons
- No light mode
- No dense grids or sidebar layouts on marketing page
- No social proof with faces/photos (handles only: @PolyDegenX)
- No complex animation — just subtle fade-in on scroll and shimmer effects

---

## 2. Color Palette — Exact Values

### Core Colors (extracted from Framer CSS)

| Token | RGB | Hex | Usage |
|---|---|---|---|
| **Primary Background** | `rgb(16, 16, 16)` | `#101010` | Page background, main canvas |
| **Secondary Background** | `rgb(25, 26, 29)` | `#191a1d` | Card backgrounds, section panels |
| **White** | `rgb(255, 255, 255)` | `#ffffff` | Headings, primary text, borders |
| **Muted Text** | `rgb(160, 160, 160)` | `#a0a0a0` | **OVERRIDDEN — DO NOT USE FOR TEXT**. User directive: ALL text is white (#ffffff). Grey text is forbidden. Use font-size/weight/opacity for hierarchy. |
| **Dark Gray** | `rgb(64, 64, 64)` | `#404040` | Subdued text, inactive states |
| **Mid Gray** | `rgb(112, 112, 112)` | `#707070` | Borders, dividers |
| **Light Gray** | `rgb(230, 230, 230)` | `#e6e6e6` | Emphasized text, bright labels |
| **Neon Green** | `rgb(0, 255, 0)` | `#00ff00` | Primary accent — status dots, highlights, glow |
| **Signal Green (deep)** | `rgb(2, 108, 6)` | `#026c06` | Deep green backgrounds |
| **Forest Green** | `rgb(45, 139, 45)` | `#2d8b2d` | Button/badge backgrounds |
| **Electric Blue** | `rgb(69, 94, 255)` | `#455eff` | Secondary accent — gradient overlays, atmospheric glow |
| **Darker Blue** | `rgb(0, 39, 255)` | `#0027ff` | Blue variant |
| **Sky Blue** | `rgb(0, 153, 255)` | `#0099ff` | Link or data accent |

### Surface / Overlay Colors

| Value | Usage |
|---|---|
| `rgba(255, 255, 255, 0.04)` | Card surfaces (nearly-transparent glass base — VAL-VISUAL-035) |
| `rgba(255, 255, 255, 0.08)` | Card hover states (VAL-VISUAL-035) |
| `rgba(255, 255, 255, 0.12)` | Border color on cards (subtle edge — VAL-VISUAL-035) |
| `rgba(255, 255, 255, 0.30)` / `#ffffff4d` | Emphasized glass surfaces |
| `rgba(255, 255, 255, 0.50)` | Active/focused element borders |
| `#fff6` (white 40%) | Default outlined element borders |
| `rgba(0, 0, 0, 0.65)` / `#000000a6` | Dark overlay gradients on images |

### Gradient Definitions

```css
/* Blue corner glow — atmospheric, used on section backgrounds */
linear-gradient(228deg, #455eff00 63%, #455eff)
linear-gradient(228deg, #455eff00 74%, #455eff)
linear-gradient(233deg, #455eff ...)

/* Dark overlay on hero/images */
linear-gradient(#0000 0%, #000000a6 100%)
```

### Shadow Definitions

```css
/* Green glow (on neon green elements) */
box-shadow: 0px 0px 12px 0px rgba(0, 255, 0, 0.5);

/* White glow (on primary CTA — signature effect) */
box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.75);
```

### Color Usage Philosophy

- **Accent frequency**: Neon Green `#0f0` appears ~43 times; Electric Blue `#455eff` ~26 times
- **Restraint principle**: Only 2 accent colors total. Everything else is grayscale `#101010` → `#ffffff`
- **Green = action/signal**: Status dots, confidence scores, "BUY" labels, live indicators
- **Blue = atmospheric**: Background gradient glows only — never on text or CTAs
- **White = hierarchy anchor**: All headings are pure white. White is the loudest "color"
- **5-level gray scale** (`#404040` → `#575757` → `#707070` → `#a0a0a0` → `#bfbfbf` → `#e6e6e6`): Subtle text hierarchy

---

## 3. Typography — Exact Stacks & Scale

### Font Stack

| Font | Type | Usage |
|---|---|---|
| **Helvetica Neue Medium** | Sans-serif, weight 500 | Headings (H1–H4) — the "display" font |
| **IBM Plex Mono** | Monospace | Body text, labels, data, descriptions — the "terminal" font |
| **Inter** | Sans-serif | Fallback/bold variants within body text |

### Type Scale (Desktop)

| Element | Font | Size | Weight | Line Height | Letter Spacing | Transform |
|---|---|---|---|---|---|---|
| **H1 (Hero)** | Helvetica Neue Medium | `64px` | 500 | `64px` (1.0) | `-0.06em` | UPPERCASE |
| **H1 (Responsive)** | Helvetica Neue Medium | `58px` | 500 | `64px` (1.1) | `-0.06em` | UPPERCASE |
| **H2 (Section)** | Helvetica Neue Medium | `48px` | 500 | `56px` (1.17) | `-0.06em` | UPPERCASE |
| **H3 (Subsection)** | Helvetica Neue Medium | `40px` | 500 | `44px` (1.1) | `-0.04em` | UPPERCASE |
| **H3 (Smaller)** | Helvetica Neue Medium | `38px` | 500 | `44px` (1.16) | `-0.04em` | UPPERCASE |
| **H4** | Helvetica Neue Medium | `32px` | 500 | `36px` (1.125) | `-0.04em` | UPPERCASE |
| **H6 (Label)** | Helvetica Neue Medium | `32px` | 500 | `36px` (1.125) | `-0.06em` | UPPERCASE |
| **Body Large** | IBM Plex Mono | `20px` | 400 | `28px` (1.4) | `-0.04em` | none |
| **Body** | IBM Plex Mono | `16px` | 400 | `24px` (1.5) | `-0.06em` | none |
| **Label/Tag** | IBM Plex Mono | `14px` | 500 | `20px` (1.43) | `-0.08em` | UPPERCASE |
| **Caption** | IBM Plex Mono | `14px` | 400 | `20px` (1.43) | `-0.08em` | none |
| **Overline/Tag** | IBM Plex Mono | `20px` | 400 | `20px` (1.0) | `-0.06em` | UPPERCASE |
| **Small Data** | IBM Plex Mono | `12px` | — | `16px` (1.33) | — | — |

### Typography Principles

1. **ALL headings are UPPERCASE** — no exceptions; this is a defining characteristic
2. **Tight letter-spacing everywhere**: `-0.04em` to `-0.08em` — compressed, dense, technical feel
3. **Monospace is the primary body font** — IBM Plex Mono signals "terminal" / "code" / "data"
4. **ALL text white (#fff)** — text hierarchy from font size, weight, and opacity only. No grey text.
5. **Tight line heights**: Headings at 1.0–1.17, body at 1.4–1.5
6. **No decorative fonts** — only 2 functional fonts used

---

## 4. Card Treatments — Exact CSS

### Signal Cards (primary interactive element)

```css
/* Structure */
padding: 24px; /* or 32px on larger variants */
gap: 12px-16px; /* internal spacing */
border-radius: 8px;

/* Surface — nearly-transparent glass (VAL-VISUAL-035) */
background-color: rgba(255, 255, 255, 0.04);
/* OR solid variant: */
background-color: #191a1d;

/* Border — subtle edge (VAL-VISUAL-035) */
border: 1px solid rgba(255, 255, 255, 0.12);
/* OR: */
border-color: #fff6; /* white 40% */
border-style: solid;

/* Hover state */
background-color: rgba(255, 255, 255, 0.15);

/* No box-shadow by default — flat design */
```

**Signal card anatomy** (from the live site):
- Small category icon (top-left)
- Category label (e.g., "Fed Rates", "Iran Conflict")
- Wallet avatar image
- Wallet handle name (e.g., "debased", "ImJustKen")
- Market question text
- `>info` link
- WALLET address (truncated)
- ACTION: "BUY" label
- Direction: "on yes" / "on no"
- Dollar amount
- CONFIDENCE SCORE with percentage (e.g., "92.0%")

### Feature / Benefit Cards ("Shimmer Cards")

```css
padding: 32px;
gap: 56px; /* between icon and text */
width: 368px;
border-radius: 8px;
border: 1px solid #707070; /* mid-gray border */
background: transparent; /* or #191a1d */
/* Shimmer overlay effect on hover */
```

### Roadmap Cards

```css
/* Grid-based, separated by 1px white borders */
border-left: 1px solid #ffffff;
border-top: 1px solid #ffffff;
padding: 24px;
/* No border-radius — hard rectangular cells */
```

### Card Design Principles

1. **Borders over shadows**: Cards defined by thin 1px borders, not drop shadows
2. **Glass-morphism lite**: `rgba(255,255,255,0.1)` backgrounds for subtle layering
3. **8px border-radius**: The only radius for content cards
4. **1000px (pill) radius**: Used only on small buttons, dots, and pill tags
5. **No card elevation**: Depth from opacity/color layers, not shadows
6. **Left-aligned content within cards**: Top-down vertical flow
7. **No backdrop-blur** on the marketing page cards (glass effect is opacity-based only)

---

## 5. Section Layout & Flow

### Page Architecture (Desktop)

```
┌──────────────────────────────────────────────────┐
│ FIXED LEFT SIDEBAR NAV (~60px rail)              │
│ ┌────────────────────────────────────────────────┐
│ │ HERO (full-viewport, centered text)            │
│ │   - Video/image background with grain          │
│ │   - Status ticker strip (top-right)            │
│ │   - Tagline: TRADE // LIVE // EARN // $BETTER  │
│ │   - Promise text (centered)                    │
│ │   - Giant terminal-prefix headline stack        │
│ │   - CTA buttons row                             │
│ ├────────────────────────────────────────────────┤
│ │ ═══ FULL-WIDTH DIVIDER IMAGE ═══               │
│ ├────────────────────────────────────────────────┤
│ │ DESCRIPTION SECTION                            │
│ │   "Powered by Paranoia. Built for Everyone."   │
│ │   Long-form mono text block                    │
│ ├────────────────────────────────────────────────┤
│ │ ═══ FULL-WIDTH DIVIDER IMAGE ═══               │
│ ├────────────────────────────────────────────────┤
│ │ TERMINAL SECTION                               │
│ │   "Unlock Signals" header                      │
│ │   ">_THE TERMINAL: GOD MODE." headline         │
│ │   Feature description text                     │
│ │   Signal Cards (3-up horizontal scroll)        │
│ ├────────────────────────────────────────────────┤
│ │ FEATURE TILES (3 image+text blocks)            │
│ │   /01 - FASTEST ON EARTH                       │
│ ├────────────────────────────────────────────────┤
│ │ ═══ FULL-WIDTH DIVIDER IMAGE ═══               │
│ ├────────────────────────────────────────────────┤
│ │ VAULT SECTION                                  │
│ │   "THE VAULT: QUANTITATIVE YIELD."             │
│ │   RL agent description                         │
│ │   3 Shimmer/benefit cards                      │
│ │     - SAVE DAYS OF RESEARCH                    │
│ │     - HFT IS IN OUR DNA                        │
│ │     - BASE TO POLYMARKET ABSTRACTION           │
│ ├────────────────────────────────────────────────┤
│ │ PARTNERS/LOGOS STRIP                           │
│ │   (Polymarket, OpenServ, etc. logos)            │
│ ├────────────────────────────────────────────────┤
│ │ VOLUME / STATS SECTION                         │
│ │   "$45 BILLION IN HISTORIC VOLUME."            │
│ │   CTA + backtest link                          │
│ ├────────────────────────────────────────────────┤
│ │ ═══ FULL-WIDTH DIVIDER IMAGE ═══               │
│ ├────────────────────────────────────────────────┤
│ │ ROADMAP (4-column timeline)                    │
│ │   Q1 → Q2 → Q3 → Q4 2026                      │
│ │   "ROADMAP // REVENUE // REALISED"             │
│ │   + Liquid Alpha expansion card                │
│ ├────────────────────────────────────────────────┤
│ │ POWERED BY logos                               │
│ ├────────────────────────────────────────────────┤
│ │ TESTIMONIALS (auto-scrolling horizontal)       │
│ │   Quotes from @handles                         │
│ ├────────────────────────────────────────────────┤
│ │ ═══ FULL-WIDTH DIVIDER IMAGE ═══               │
│ ├────────────────────────────────────────────────┤
│ │ FINAL CTA                                      │
│ │   ">_THE WINDOW IS CLOSING"                    │
│ │   "Enter the Vault" button                     │
│ ├────────────────────────────────────────────────┤
│ │ ═══ FULL-WIDTH DIVIDER IMAGE ═══               │
│ ├────────────────────────────────────────────────┤
│ │ FOOTER                                         │
│ │   Quick links + legal + copyright              │
│ └────────────────────────────────────────────────┘
└──────────────────────────────────────────────────┘
```

### Breakpoints

| Name | Media Query |
|---|---|
| Desktop | `min-width: 1200px` |
| Tablet | `min-width: 810px` and `max-width: 1199.98px` |
| Mobile | `max-width: 809.98px` |

### Spacing System

| Property | Values |
|---|---|
| **Between major sections** | `100px`, `104px`, `112px`, `124px`, `136px` |
| **Section padding** | `80px` top, `164px 0 64px`, `200px 0`, `180px 0` |
| **Content padding** | `24px`, `32px`, `16px 32px` |
| **Card internal padding** | `24px`, `32px`, `16px` |
| **Card grid gaps** | `20px`, `24px`, `28px` |
| **Content stack gaps** | `12px`, `16px`, `20px`, `24px` |
| **Side gutters (mobile)** | `16px` |
| **Side gutters (tablet)** | `32px` |

### Layout Philosophy

- **Generous vertical breathing room**: 100–136px between sections
- **Full-width divider images** between every major section (signature element)
- **Content max-width constrained** but dividers/images bleed full-width
- **Hero is full-viewport** with centered content
- **Vertical storytelling**: Single column scroll — no multi-column magazine layouts
- **Content width**: Main content area is constrained (~1200px max) with ample side margins

---

## 6. Shader / Visual Background / Atmosphere

### Film Grain Overlay

The **entire page** has a film grain texture overlay as the first named element ("Grain Overlay"). This creates a subtle analog/cinematic quality over the digital dark background.

**Implementation**: For BETTER's approved adaptation, treat this as a low-opacity **vendored animated GIF** film-grain texture layer repeated across the viewport. Do **not** interpret the texture as permission to ship a separate scanline layer or substitute a non-GIF procedural texture.

### Background Composition (Hero)

The hero uses a layered background stack:

1. **Base**: Near-black `#101010` solid color
2. **Background image/video**: A dark, abstract, industrial-looking visual (visible in screenshot — appears to be a darkened photograph with high contrast, showing abstract architectural/mechanical forms)
3. **Electric blue gradient glow**: `linear-gradient(228deg, #455eff00 63%, #455eff)` — creates a blue atmospheric corner glow bleeding from the left side
4. **Dark overlay gradient**: `linear-gradient(#0000 0%, #000000a6 100%)` — darkens the bottom of the hero for text readability
5. **Film grain overlay**: Subtle texture on top of everything

For the approved BETTER implementation, treat this atmospheric texture as **film grain only**. Do **not** ship a separate scanline layer; the current mission guidance explicitly replaces prior scanline/ASCII texture treatments with the film grain overlay.

### Blue Atmospheric Glow

The signature atmospheric blue is created by directional gradient overlays using `#455eff`:
- Applied at ~228° angle
- Transitions from fully transparent (`#455eff00`) to solid electric blue
- Creates a "light leak" or "neon wash" effect from the left/bottom edge
- This is the single most impactful atmospheric element

### Section Background Shifts

Different sections use different background images/panels:
- Some sections have large dark product screenshots as full-bleed backgrounds
- The blue gradient glow reappears at section transitions
- Background darkness varies slightly between `#101010` and `#191a1d`

### What Creates the Atmosphere (Summary)

| Layer | Effect | Opacity | Role |
|---|---|---|---|
| Film grain GIF / texture | Analog texture | Very subtle | Cinematic warmth |
| Electric blue gradient | Directional color wash | Variable (20-100%) | Depth and atmosphere |
| Dark overlays | Darkening gradients | 65% on images | Text readability |
| Near-black base | Solid `#101010` | 100% | Foundation |

For the current BETTER mission, the approved atmosphere is exactly **one shader + film grain texture**. Separate scanline layers are out of scope.

---

## 7. Button / CTA Styles — Exact CSS

### Primary CTA (Solid White — "BUY $BETTER")

```css
display: inline-flex;
align-items: center;
justify-content: center;
padding: 16px 32px;
background-color: #ffffff;
color: #101010;  /* dark text on white bg */
font-family: "IBM Plex Mono", monospace;
font-size: 14px;
font-weight: 500;
letter-spacing: -0.08em;
text-transform: uppercase;
border-radius: 0px;  /* SQUARE — no rounding. Brutalist. */
border: none;
box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.75);  /* white glow aura */
cursor: pointer;
text-decoration: none;
```

**Key detail**: The white glow shadow (`rgba(255,255,255,0.75)`) creates a luminous "power" aura around the button. This is a signature element.

### Secondary CTA (Outline — "VAULT ARCHITECTURE")

```css
display: inline-flex;
align-items: center;
justify-content: center;
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
cursor: pointer;
text-decoration: none;
```

### CTA with Green Dot ("LAUNCH TERMINAL" in sidebar nav)

```css
/* Same base as outline CTA but with a green dot indicator */
/* The green dot is an inline element before the text */
/* Dot: 8px × 8px circle, background #00ff00, border-radius 1000px */
```

### Green CTA Variant ("GRAB $BETTER ACCESS NOW")

```css
/* Uses forest green background */
background-color: #2d8b2d;
color: #ffffff;
border-radius: 0px; /* still square */
padding: 16px 32px;
font-family: "IBM Plex Mono", monospace;
text-transform: uppercase;
```

### Button Principles

1. **SQUARE corners on ALL CTAs** — `border-radius: 0px`. Brutalist, intentional.
2. **White glow on primary CTA** — `box-shadow: 0 0 16px rgba(255,255,255,0.75)`
3. **Monospace text** on all buttons — maintains terminal aesthetic
4. **UPPERCASE text** — consistent with heading treatment
5. **Tight letter-spacing** (`-0.08em`) even on buttons
6. **No transition/hover animation explicitly defined** — Framer handles hover states
7. **Green dot prefix** on some CTAs for live-status indication

---

## 8. Status Indicators & Live Signals

### Green Status Dot

```css
/* Used for "live" / active status throughout */
width: 8px;
height: 8px;
border-radius: 1000px; /* perfect circle */
background-color: #00ff00; /* neon green */
/* Sometimes with subtle glow: */
box-shadow: 0px 0px 12px 0px rgba(0, 255, 0, 0.5);
```

### Status Indicator Usage

- **Navigation**: Small dots next to section numbers in the left sidebar (active = filled green/white, inactive = outline only)
- **CTA buttons**: Green dot before "LAUNCH TERMINAL" and "BUY $BETTER" text
- **Signal cards**: Green elements indicate positive/bullish signals
- **Hero ticker**: Green dot before "TRADE // LIVE // EARN // $BETTER" label

### "Live" Status Communication

tradebetter communicates liveness through:
1. **Neon green dots** (8px circles) next to actionable elements
2. **Timestamp display**: `EXP:120825 · 09 20 PM` — monospace, right-aligned
3. **Counter stats**: "10 MILLION+ SIGNALS PRE-BETA" / "400K+ SIGNALS IN PRIVATE BETA"
4. **Green color** on any text representing active/live state
5. **No pulsing animation** — the dots are static (the green color alone signals liveness)

---

## 9. Data Presentation — Numbers, Metrics, Confidence

### Confidence Score Display

```
CONFIDENCE SCORE
92.0%
```

- Label "CONFIDENCE SCORE" in IBM Plex Mono, uppercase, small (12-14px), muted gray
- Percentage value in larger text, white or neon green
- Often paired with a visual fill bar (green gradient fill)

### Metric/Stat Display

```
10 MILLION+ SIGNALS PRE-BETA
400K+ SIGNALS IN PRIVATE BETA
```

- IBM Plex Mono, uppercase
- Right-aligned in the hero area
- Small size (~14px)
- Muted gray or light gray color
- Stacked vertically

### Signal Card Data Layout

Each signal card presents data in a structured vertical stack:
```
[Category Icon] [Category Label]
[Avatar] [Handle Name]
[Market Question Text]
>info link
WALLET: [truncated address]
ACTION: BUY
on: yes
$0
CONFIDENCE SCORE: 92.0%
```

- All labels are uppercase, monospace, small
- Values are larger/brighter than labels
- "BUY" is highlighted (green context)
- "yes"/"no" in lowercase, differentiated

### Volume/Stats Section

```
$45 BILLION IN HISTORIC VOLUME.
THE TRUTH WAITS FOR NO ONE.
```

- Display-size heading (48px), Helvetica Neue Medium, uppercase
- Pure white text
- Full-width, centered
- Supporting CTA below

---

## 10. Full Page Flow — Section Order

The page is structured for **quick glances and progressive depth**:

| # | Section | Job | Key Content |
|---|---|---|---|
| 1 | **Hero** | Identity + promise | BETTER logo, tagline ("TRADE // LIVE // EARN // $BETTER"), value prop ("HOLDING $BETTER PROVIDES MICROSECOND ACCESS TO THE BEST POLYMARKET TRADERS ON EARTH"), giant terminal headlines (`>TRADE WITH INSIDERS >CONQUER PREDICTION MARKETS >EARN AS YOU SLEEP`), 2 CTAs |
| 2 | **Divider** | Visual break | Full-width decorative line image |
| 3 | **Description** | Credibility + philosophy | "Powered by Paranoia. Built for Everyone. Quant Grade Alpha: Democratised." — Long-form explanation of the BETTER terminal |
| 4 | **Divider** | Visual break | — |
| 5 | **Terminal** | Product showcase | "Unlock Signals" header, ">_THE TERMINAL: GOD MODE." headline, Rust infrastructure description, 3 interactive signal cards |
| 6 | **Feature tiles** | Speed/edge proof | /01 "FASTEST ON EARTH" — co-located Rust execution |
| 7 | **Divider** | Visual break | — |
| 8 | **Vault** | Yield product | "THE VAULT: QUANTITATIVE YIELD." — RL agents, Z-Score system, 3 benefit shimmer cards |
| 9 | **Partners** | Social proof | Polymarket, OpenServ, Base logos |
| 10 | **Volume stats** | Market context | "$45 BILLION IN HISTORIC VOLUME." + CTA |
| 11 | **Divider** | Visual break | — |
| 12 | **Roadmap** | Future vision | Q1-Q4 2026 timeline: Tokenised Vault Shares → Arbitrage Flywheel → Expansion → End Game (HIP-3) + "Liquid Alpha" expansion |
| 13 | **Powered by** | Partnership credibility | Large logo strip |
| 14 | **Testimonials** | Social proof | Auto-scrolling horizontal carousel of @handle testimonials |
| 15 | **Divider** | Visual break | — |
| 16 | **Final CTA** | Conversion | ">_THE WINDOW IS CLOSING" + "Enter the Vault" button |
| 17 | **Divider** | Visual break | — |
| 18 | **Footer** | Links + legal | Quick links, legal disclaimer, copyright |

### Information Flow Philosophy

- **First viewport**: Who we are (BETTER), what we do (microsecond access to best traders), urgency (THE ERA OF TRUTH)
- **Second viewport**: Why (paranoia-driven, quant-grade alpha democratised)
- **Third viewport**: How (the terminal — God Mode)
- **Fourth viewport**: What you earn (the vault — automated yield)
- **Fifth viewport**: Proof (volume, partners, testimonials)
- **Sixth viewport**: Future (roadmap)
- **Final viewport**: Close (urgency, conversion CTA)

---

## 11. Image / Screenshot Treatment

### Product Screenshots

- **Phone mockups**: Product screenshots shown within device frames
- **Full-bleed dark screenshots**: Large product images used as section backgrounds
- **Dark overlay**: `linear-gradient(#0000 0%, #000000a6 100%)` applied on top
- **No borders or shadows** on screenshots themselves — they blend into the dark background
- **No drop shadows** — the images are flat against the dark canvas

### Decorative Images

- Abstract geometric patterns (crosshairs, grid textures) visible in hero background
- These are darkened/muted to not compete with text
- Industrial/mechanical abstract photography visible in hero (high contrast, desaturated)

### Image Framing Philosophy

1. **No visible frames or borders** around product images
2. **Dark overlay gradients** ensure images never get brighter than the text
3. **Images serve as texture**, not focal elements — the text/data is always primary
4. **Full-width bleed** for atmospheric images; constrained width for product detail
5. **Desaturated/darkened** — all imagery trends toward the dark end

### Signature Divider Images

Full-width horizontal decorative images appear between sections:
- Hosted on `framerusercontent.com`
- Appear to be subtle glowing horizontal line images with gradient effects
- Typical dimensions: `2382 × 758px` (wide, thin)
- Create a clear visual rhythm between content blocks
- These are NOT CSS borders — they're actual images with gradient/glow effects

---

## 12. Navigation System

### Sidebar Navigation (Desktop)

```css
/* Fixed vertical rail — left side */
position: fixed;
width: ~60px;
height: 100vh;
/* Contains: */
/*   - Logo at top */
/*   - Numbered section markers: "01", "02" etc. */
/*   - Dot indicators per section */
/*   - Active: filled dot (white or green) */
/*   - Inactive: empty outline dot */
```

- **Section numbers**: "01 WELCOME" format — number + label, monospace
- **Dot indicators**: 8px circles, active=filled, inactive=outline
- **The sidebar acts as a scroll position indicator** — shows where you are in the page
- **Minimal text** — numbers and dots only, no full section names

### "LAUNCH TERMINAL" Button

```css
/* Positioned in top-right area / accessible from nav */
/* Uses the outline CTA style with green dot */
padding: 16px 32px;
border: 1px solid #ffffff;
border-radius: 0px;
font-family: "IBM Plex Mono", monospace;
font-size: 14px;
text-transform: uppercase;
/* Green dot: 8px circle before text */
```

### Mobile Navigation

- Sidebar collapses to hidden
- Mobile overlay menu replaces the rail
- Simplified structure — no section dot indicators on mobile

---

## 13. Divider / Section Separator Treatment

### Primary Dividers

tradebetter uses **full-width image dividers** between every major section — this is one of the most distinctive design elements.

- **Asset type**: PNG images hosted on framerusercontent.com
- **Typical size**: `2382 × 758px` (very wide, relatively thin)
- **Visual**: Subtle glowing horizontal line with gradient effects — looks like a thin neon/white line with soft glow falloff
- **Full bleed**: These span the entire viewport width, edge to edge
- **Rhythm**: Placed between every 1-2 content sections

### Secondary Dividers

- **Roadmap grid**: 1px solid white borders between cells (`border-left: 1px solid #fff; border-top: 1px solid #fff`)
- **Section internal**: No visible dividers within sections — spacing alone separates content blocks

### Why Image Dividers Matter

The image dividers are NOT decorative afterthoughts — they're structural:
1. They create a strong vertical rhythm
2. They signal section boundaries clearly (unlike gradient fades)
3. The glow effect adds subtle atmosphere at transition points
4. They're full-width even when content is constrained — this creates a "bleed" effect that makes the page feel larger

---

## 14. Animation & Motion

### Scroll Entrance Animations (from Framer appear data)

```javascript
// Primary: Fade-up on scroll
initial: { opacity: 0.001, y: 32 }
animate: { opacity: 1, y: 0 }
transition: { type: "spring", stiffness: 200, damping: 30 }

// Scale-in (for cards/images)
initial: { opacity: 1, scale: 0.8 }
animate: { opacity: 1, scale: 1 }
transition: { type: "spring", stiffness: 400, damping: 100 }
```

### Interaction Patterns

| Element | Interaction | Effect |
|---|---|---|
| Cards | Hover | Background opacity shifts 0.10 → 0.15 |
| Shimmer cards | Hover | Shimmer/shine overlay effect |
| Testimonials | Auto | Horizontal auto-scrolling carousel |
| Sections | Scroll | Fade-up entrance (spring-based) |
| Sticky elements | Scroll | Sticky position within scroll sections |

### Motion Philosophy

- **Minimal, intentional** — no constant ambient animation
- **Scroll-triggered only** — elements appear as you scroll
- **Spring-based**: Natural spring physics (stiffness 200-400, damping 30-100)
- **No parallax** — elements move in a single plane
- **No page transitions** — straightforward vertical scroll
- **No hover animations on text** — only on interactive elements (cards, buttons)

---

## 15. Signature Text Treatments

### Terminal Cursor Prefix `>_`

```
>_THE TERMINAL: GOD MODE.
>_THE WINDOW IS CLOSING
```

- Used on major section headlines
- Creates the "command line" feeling
- The `>_` is part of the heading text, same font/size/color

### Double-Slash Separator `//`

```
TRADE // LIVE // EARN // $BETTER
ROADMAP // REVENUE // REALISED
```

- Used in taglines and section titles
- Spaces around the slashes: ` // `
- Creates a data-feed / ticker feel

### Greater-Than Prefix `>`

```
>CUT THROUGH THE NOISE
>TRADE WITH INSIDERS
>CONQUER PREDICTION MARKETS
>EARN AS YOU SLEEP
>info
```

- Used on sub-headlines and labels
- Creates a command-line prompt feel
- Sometimes combined with the hero headline stack

### Text Formatting Patterns

- **Ticker-style data**: `EXP:120825 · 09 20 PM` — monospace, dot-separated
- **All-caps everywhere**: Every heading, every label, every CTA
- **No sentence case**: Even body text in some sections uses all-caps or compressed formatting
- **Run-together text**: Some Framer-exported text lacks spaces (`>CUTTHROUGHTHENOISE`) — this is intentional typographic compression in specific headline contexts

---

## 16. Complete Token Map (CSS Custom Properties)

```css
:root {
  /* ====== BACKGROUNDS ====== */
  --bg-primary: #101010;                    /* rgb(16, 16, 16) — page canvas */
  --bg-secondary: #191a1d;                  /* rgb(25, 26, 29) — card/panel backgrounds */
  --bg-card: rgba(255, 255, 255, 0.04);     /* nearly-transparent glass surface (VAL-VISUAL-035) */
  --bg-card-hover: rgba(255, 255, 255, 0.08); /* card hover state (VAL-VISUAL-035) */
  --bg-card-emphasis: rgba(255, 255, 255, 0.30); /* emphasized glass surface */
  --bg-overlay-dark: rgba(0, 0, 0, 0.65);  /* image darkening overlay */

  /* ====== TEXT ====== */
  --text-primary: #ffffff;                  /* headings — pure white */
  --text-secondary: #ffffff;               /* OVERRIDDEN: all text white per user directive */
  --text-muted: #707070;                   /* borders/dividers only — never for text */
  --text-subtle: #404040;                  /* very subtle */
  --text-bright: #e6e6e6;                  /* emphasized body */
  --text-disabled: #575757;                /* disabled/inactive */

  /* ====== ACCENTS ====== */
  --accent-green: #00ff00;                 /* neon green — status, signals, live */
  --accent-green-deep: #026c06;            /* dark green background */
  --accent-green-mid: #2d8b2d;             /* button/badge green */
  --accent-blue: #455eff;                  /* electric blue — atmospheric, gradients */
  --accent-blue-dark: #0027ff;             /* darker blue variant */
  --accent-sky: #0099ff;                   /* sky blue — links, data accent */

  /* ====== BORDERS ====== */
  --border-card: rgba(255, 255, 255, 0.12); /* subtle card borders */
  --border-emphasis: rgba(255, 255, 255, 0.50); /* active/focused borders */
  --border-default: #fff6;                 /* white 40% — outlined elements */
  --border-gray: #707070;                  /* mid-gray borders */
  --border-white: #ffffff;                 /* full white — roadmap grid */

  /* ====== SHADOWS ====== */
  --glow-white: 0px 0px 16px 0px rgba(255, 255, 255, 0.75); /* primary CTA glow */
  /* NOTE: BETTER's approved adaptation does NOT carry over a green glow token.
     #00ff00 is reserved for status dots/signals only. */

  /* ====== GRADIENTS ====== */
  --gradient-blue-glow: linear-gradient(228deg, #455eff00 63%, #455eff);
  --gradient-dark-overlay: linear-gradient(#0000 0%, #000000a6 100%);

  /* ====== TYPOGRAPHY ====== */
  --font-display: "Helvetica Neue Medium", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  --font-body: "Inter", sans-serif;

  /* ====== SPACING ====== */
  --space-xs: 4px;
  --space-sm: 10px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 56px;
  --space-section: 100px;
  --space-section-lg: 136px;

  /* ====== BORDER RADIUS ====== */
  --radius-none: 0px;            /* CTAs, most elements — SQUARE */
  --radius-card: 8px;            /* content cards */
  --radius-pill: 1000px;         /* dots, pill tags */
}
```

---

## 17. Do's and Don'ts — Design Guardrails

### DO (what makes tradebetter premium)

| # | Principle | Exact Implementation |
|---|---|---|
| 1 | Ruthless color restraint | Black + white + 1 neon accent (green `#0f0`) + 1 atmospheric accent (blue `#455eff`) |
| 2 | Monospace as primary body font | IBM Plex Mono for all non-heading text |
| 3 | ALL-CAPS headings with tight tracking | Helvetica Neue Medium, `-0.04em` to `-0.06em` |
| 4 | Generous section spacing | 100–136px between sections |
| 5 | Full-width dividers | Image-based horizontal line dividers between sections |
| 6 | Glass-morphism cards | `rgba(255,255,255,0.1)` bg + 1px `rgba(255,255,255,0.2)` border |
| 7 | Square CTA buttons with glow | `border-radius: 0px` + `box-shadow: 0 0 16px rgba(255,255,255,0.75)` |
| 8 | Film grain overlay | Subtle texture across entire page |
| 9 | Terminal-style text prefixes | `>_`, `//`, `>` in headings |
| 10 | Vertical single-column storytelling | One focus per viewport, cinematic scroll |
| 11 | Green dots for status | 8px circles, `#00ff00`, no animation |
| 12 | Data in monospace | All numbers, metrics, scores in IBM Plex Mono |

### DON'T (what tradebetter avoids)

| # | Anti-Pattern | Why |
|---|---|---|
| 1 | Rounded-corner pill CTAs | Brutalist square corners are the identity |
| 2 | Multi-color palettes | Only 2 accent colors — green and blue |
| 3 | Badge/tag clutter | Clean, sparse data presentation |
| 4 | Complex multi-column grids | Vertical storytelling only |
| 5 | Decorative illustrations | Imagery is screenshots or abstract geometric |
| 6 | User photos / avatars | Testimonials use @handles only |
| 7 | Light mode / white sections | Dark-only, dark-always |
| 8 | Heavy parallax / animation | Minimal scroll-triggered entrance only |
| 9 | Sidebar content widgets | Left rail is nav only, narrow |
| 10 | Competing visual hierarchy | One focal point per viewport |
| 11 | Drop shadows on cards | Depth from opacity layers, not shadows |
| 12 | Backdrop-blur | Glass effect is opacity-only, no blur |

---

## APPENDIX: Content Copy Reference

### Hero Section
```
TRADE // LIVE // EARN // $BETTER
THE ERA OF TRUTH

HOLDING $BETTER PROVIDES MICROSECOND ACCESS TO THE
BEST POLYMARKET TRADERS ON EARTH

EXP:120825 · 09 20 PM
10 MILLION+ SIGNALS PRE-BETA
400K+ SIGNALS IN PRIVATE BETA

>TRADE WITH INSIDERS
>CONQUER PREDICTION MARKETS
>EARN AS YOU SLEEP

[BUY $BETTER]  [VAULT ARCHITECTURE]
```

### Description Section
```
Powered by Paranoia.
Built for Everyone
Quant Grade Alpha: Democratised

>CUT THROUGH THE NOISE

Prediction markets are too noisy. The BETTER terminal is forged to value
brutalist simplicity. Filter alpha signals that update each millisecond
across a pool of elite wallets with 35-70x returns of normal market
participants (average Sharpe 40+).

Quant parameterised agents by OpenServ filter 40-100,000 verified insider
trades across Polymarket each day. The best trades are cherry-picked in
our signature vault architecture. Earn while you sleep, so you can live
life BETTER.
```

### Terminal Section
```
Unlock Signals
Filter the noise. Track the whales. Execute instantly.

>_THE TERMINAL: GOD MODE.

Our Rust-based infrastructure is co-located with the Polymarket CLOB,
reading the mempool in sub-milliseconds to beat the retail algo losses.
• Filter by Whale Size, Confidence Score, and Up/Down Directional flows
on 15-minute markets for BTC, ETH, XRP, and SOL. Spot insider
accumulation before the candle prints. It's the raw power of a Wall
Street HFT rig, democratized.
```

### Vault Section
```
First Polymarket ETF:
THE VAULT: QUANTITATIVE YIELD. AUTOMATED. AGENTIC. ELITE.

We deploy Reinforcement Learning agents powered by OpenServ's BRAID
protocol to filter a dynamic pool of the most profitable traders on
Earth. Our proprietary Z-Score system strictly ranks every wallet to
separate true edge from dumb luck. The transaction is simple: Stake
$BETTER = Unlock Unlimited Yield Access. Deploy your capital alongside
the machine.
```

### Volume Section
```
$45 BILLION IN HISTORIC VOLUME.
THE TRUTH WAITS FOR NO ONE.

The structural rotation is here. Capital is fleeing the rigged casino of
perp DEXs for the verifiable truth of prediction markets.
```

### Final CTA
```
Enter the Era of Truth
>_THE WINDOW IS CLOSING

You can stay in the casino fighting algorithms with your bare hands,
or you can join the machine.

[Enter the Vault]
```

---

*End of authoritative design reference. This document supersedes any previous partial extractions.*
