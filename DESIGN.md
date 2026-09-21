# Bose design system

> Extracted by [Inspo](https://github.com/Nutlope/inspo) (open source, MIT, powered by Together AI). Reference material for *intentional* design decisions: adapt, don't copy.

- **Source:** https://bose.com
- **Captured:** 2026-05-18
- **Mode:** dark
- **Macrostructure:** Marquee Hero

## Tone

Full-screen imagery and minimal text establish a sophisticated, tech-forward mood. Dark background with subtle purple lighting emphasizes sleek product design.

## Colors

| Hex | Role (heuristic) |
|---|---|
| `#9e42bc` | support |
| `#542364` | support |
| `#cc9cdc` | accent |
| `#747474` | support |
| `#5f2771` | support |

Color words: *muted*, *monochrome*, *cool*

Core tokens: `--brand-primary: #131317` (bg), `#fff` (text), greys `#222 #444 #747474 #999 #ccc #eee #f9f9f9`.

## Typography

Detected typefaces: **Bose Headline**, **Bose Text** → adapted to **DM Sans** for all text (per project direction).

| Role | Family | Size | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| h1 | Headline | 96px | 900 | 0.88 | 1.44px |
| h2 | Headline | 60px | 900 | 0.88 | 1.2px |
| h3 | Headline | 36px | 700 | 0.89 | 1.8px |
| body | Text | 16px | 400 | 1.5 | 0 |
| button | Text | 12px | 400 | 1 | 0 |

## Spacing scale

`4px` · `8px` · `12px` · `24px` · `25px` · `32px` · `48px` · `56px` · `64px` · `120px`

Base step: **4px**.

## Border radius

`0px` · `2px` · `3px` · `20px` · `50px`

## Container

Max content width: **1440px** (`--inner-rail`); editorial column ~696px.

## Components present

- hero fullbleed
- logo cloud
- hero with cta

## Adaptation notes for Namdev Textile

- Dark `#131317` canvas, purple glow accents (`#9e42bc`/`#cc9cdc`), white type.
- Marquee hero: full-viewport typographic hero + infinite marquee band of print traditions (Sanganeri · Jaipuri · Ajrakh · Bagru · Hand Block).
- Scroll animations: Lenis smooth scroll + GSAP ScrollTrigger reveals, parallax, counters, marquee.
