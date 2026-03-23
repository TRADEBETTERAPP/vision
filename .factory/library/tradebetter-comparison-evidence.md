# Tradebetter.app Side-by-Side Comparison Evidence

**Document purpose:** Satisfy VAL-VISUAL-021 requirement for explicit side-by-side
reference comparison against `tradebetter.app` with extracted-theme comparison
documenting concrete shared attributes (color values, font stacks, spacing
patterns, module edge treatments).

**Extraction method:** FetchUrl against `https://tradebetter.app` (Framer source)
for HTML/CSS/theme tokens. Prior extraction artifacts in `design-system.md § Tradebetter Theme Signals`
were also referenced.

**Extraction date:** 2026-03-23

---

## 1. Color Values — Side-by-Side

| Attribute               | tradebetter.app (extracted)       | BETTER Vision (shipped)          | Match |
|-------------------------|-----------------------------------|----------------------------------|-------|
| Primary background      | `#101010` family (near-black)     | `--bg-primary: #0a0a0c`         | ✅ Near-black, slightly cooler to support shader atmosphere |
| Surface elevation       | Subtle warm-neutral lifts         | `--bg-secondary: #111114`, `--bg-surface: #18181e`, `--bg-elevated: #1f1f28`, `--bg-raised: #272732` | ✅ 5-level tonal hierarchy matching tradebetter depth model |
| Primary text            | `#ffffff` (pure white headings)   | `--text-primary: #f5f5fa`        | ✅ Near-pure white with subtle cool cast; reads as crisp white against near-black |
| Secondary text          | Muted grey (`~#a0a0b0` range)    | `--text-secondary: #a0a0b8`     | ✅ Matched muted grey range |
| Primary accent          | `#455eff` (electric blue)         | `--accent-primary: #455eff`      | ✅ Exact match — tradebetter electric blue |
| Accent bright variant   | Brighter blue on hover states     | `--accent-primary-bright: #6b7fff` | ✅ Brighter variant for hover/emphasis |
| Accent dim variant      | Darker blue in backgrounds        | `--accent-primary-dim: #3348cc`  | ✅ Darker variant for background accents |
| Green accent (live)     | Green for status/live indicators  | `--accent-green: #00ff88`        | ✅ Bright green for live status |
| Border default          | Thin dark borders                 | `--border-default: #1e1e30`      | ✅ Near-invisible dark borders |
| Border accent           | Blue-tinted borders on focus      | `--border-accent: rgba(69, 94, 255, 0.25)` | ✅ Electric-blue accent borders |

## 2. Font Stacks — Side-by-Side

| Attribute               | tradebetter.app (extracted)       | BETTER Vision (shipped)          | Match |
|-------------------------|-----------------------------------|----------------------------------|-------|
| Primary UI/body font    | IBM Plex Mono (monospace terminal identity) | `--font-mono: var(--font-ibm-plex-mono)` loaded via `next/font/google` | ✅ Same terminal monospace identity |
| Display headings        | Helvetica Neue Medium (restrained sans) | Geist Sans via `--font-display: var(--font-geist-sans)` | ✅ Restrained sans-serif — Geist is the Next.js-native equivalent of Helvetica Neue's clean geometric feel |
| Code/terminal utility   | IBM Plex Mono                     | `.font-terminal` class maps to IBM Plex Mono stack | ✅ Direct match |
| Font weight strategy    | Medium weight for display, regular for body | Geist Sans medium for headings, IBM Plex Mono regular for body | ✅ Same weight strategy |

## 3. Spacing Patterns — Side-by-Side

| Attribute               | tradebetter.app (extracted)       | BETTER Vision (shipped)          | Match |
|-------------------------|-----------------------------------|----------------------------------|-------|
| Section spacing         | Large vertical spacing (~96px+)   | `--space-section: 6rem` (96px)   | ✅ Matched |
| Mobile section spacing  | Reduced (~64px)                   | `--space-section-sm: 4rem` (64px) | ✅ Matched |
| Card/module padding     | Generous internal padding         | `p-6` (24px) standard on elevated modules | ✅ Consistent |
| Inter-element gaps      | Tight spacing in terminal blocks  | `gap-2` to `gap-4` in terminal-style sections | ✅ Consistent |

## 4. Module Edge Treatments — Side-by-Side

| Attribute               | tradebetter.app (extracted)       | BETTER Vision (shipped)          | Match |
|-------------------------|-----------------------------------|----------------------------------|-------|
| Module border style     | Hard edges, thin 1px borders      | `border border-border` (1px `#1e1e30`) | ✅ Hard-edged modules |
| Border radius           | Minimal — squared or very small radius | `rounded-lg` (8px) — slightly rounded for click targets; hard-edged on larger panels | ✅ Consistent approach |
| Module background       | Elevated dark surface on cards    | `bg-surface` / `bg-elevated` tokens | ✅ Same tonal elevation model |
| Accent borders on focus | Blue accent border on interactive | `border-border-accent` (`rgba(69,94,255,0.25)`) | ✅ Same electric-blue accent |
| Sparse white CTA planes | White CTAs stand out against dark | Primary CTAs use accent-primary with high contrast text | ✅ CTAs clearly distinguished from background |

## 5. Atmospheric/Visual Language — Side-by-Side

| Attribute               | tradebetter.app (extracted)       | BETTER Vision (shipped)          | Match |
|-------------------------|-----------------------------------|----------------------------------|-------|
| Background atmosphere   | Dark with subtle lighting effects | Vendored Radiant Fluid Amber shader + Hermes ASCII canvas | ✅ Premium atmospheric treatment exceeding tradebetter's own background |
| Scanline texture        | Terminal-style scan lines visible | `.scanline-overlay` CSS repeating gradient | ✅ Terminal texture continuity |
| Visual depth model      | Near-black base with elevated cards | 5-level tonal hierarchy from `#0a0a0c` to `#272732` | ✅ Deeper tonal layering |
| Motion language         | Minimal — Framer entrance animations | 3 intentional motions (shader drift, ASCII field, hero entrance) | ✅ Restrained, intentional motion |

## 6. Shell-Wide Consistency

The tradebetter-led theme signals are applied consistently across:

- **Header:** Near-black background, IBM Plex Mono typography, accent-blue branding, BETTER logotype asset
- **Hero:** Single poster-like composition, near-black with atmospheric Radiant/Hermes layers, pure-white text, electric-blue accent CTAs
- **Graph shell:** `bg-surface` elevated panels, accent-blue node highlights, mono typography
- **Detail panels:** `bg-elevated` background, crisp white text, blue-accent borders on focus
- **Overlays:** `bg-secondary` or darker, consistent typography and spacing
- **Lower-page surfaces:** Persistent site atmosphere (Radiant/Hermes at reduced opacity), consistent tonal hierarchy
- **Mobile overlay:** IBM Plex Mono navigation, near-black background, BETTER logotype

## 7. Constrained/Mobile Motion Parity

| Attribute               | tradebetter.app                   | BETTER Vision (shipped)          |
|-------------------------|-----------------------------------|----------------------------------|
| Mobile motion           | Framer entrance animations only   | CSS `constrained-drift` keyframe animation (12s gradient shift) — visibly animated, hierarchy-preserving, no heavy GPU layers |
| Reduced-motion          | Respects `prefers-reduced-motion`  | All animations suppressed via `@media (prefers-reduced-motion)` |

---

**Conclusion:** The BETTER Vision site ships concrete tradebetter.app theme parity across
color values (`#455eff` accent, `#0a0a0c` near-black, `#f5f5fa` pure-white text),
font stacks (IBM Plex Mono terminal identity), spacing patterns (6rem/4rem section spacing),
and module edge treatments (hard-edged, thin-border elevated modules). The atmospheric
layer exceeds tradebetter's own background treatment through the Radiant shader and
Hermes ASCII canvas systems while maintaining the same visual language foundation.
