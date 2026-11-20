# Design System — Sobat Dumpis

Global Source of Truth for the Swiss Editorial Community Site.

## Verified Design System (ui-ux-pro-max, "community editorial swiss style")

### Brand Colors

| Token | Value | Role |
|-------|-------|------|
| **Paper** | `#F5F3ED` | Main background, editorial surfaces |
| **Ink** | `#171717` | Main typography, navigation text |
| **Signal Red** | `#E44332` | Highlights, CTA, section indicators |
| **Stone** | `#D8D5CB` | Borders, dividers, secondary surfaces |
| **Olive** | `#A9B779` | Community indicators, accents |

### Typography

- **Space Grotesk** — primary headings and display typography (oversized, clamp()-scaled)
- **Inter** — body text and interface elements
- **DM Serif Display** — selected editorial statements and storytelling accents
- **IBM Plex Mono** — metadata, timestamps, section numbers, technical labels

### Style

- Swiss International Typographic Style: grid discipline, strong hierarchy, intentional whitespace
- Asymmetric compositions, editorial typography, fine borders, controlled accents

### Pattern

Hero + editorial community sections + article/people grids + footer.

### Anti-patterns to avoid

Generic repeating cards, gradients, random blobs, glassmorphism, floating elements, unnecessary shadows, AI-generated look.

## Architecture

```
src/components/{layout,navigation,footer,ui,editorial,sections}/
src/layouts/BaseLayout.astro
src/pages/{index,about,moments,join}.astro
src/pages/people/{index,[slug]}.astro
src/pages/stories/{index,[slug]}.astro
src/content/stories/*.md
src/data/{site,navigation,members,moments}.ts
src/styles/{global,typography,animations}.css
src/scripts/{animations,interactions}/
src/types/
```

## Pages

- `/` Home, `/about`, `/people` (+`[slug]`), `/stories` (+`[slug]`), `/moments`, `/join`

## Performance

Minimal JS: GSAP + ScrollTrigger, lazy images, semantic HTML, no scroll hijacking.
