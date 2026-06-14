# DI Dreamlabs — Scrollytelling Parallax Atmosphere (Design Spec)

**Date:** 2026-06-15
**Status:** Approved (design), pending implementation plan
**Source brief:** `C:\Users\kevin\Downloads\DI-Dreamlabs-Scroll-Transitions-Brief.md` (reproduced intent below)
**Scope:** Scroll transitions across the first three homepage sections only — Hero → "Sound Familiar?" → "The Dreamlabs Method", with a faint lingering thread into the section after.

---

## 1. Goal

A continuous, dreamlike parallax scroll journey:

1. **Hero** (existing looping video, *untouched*) → user scrolls → **Rebecca Purple lofi clouds rise** with parallax depth, veiling (not covering) the hero's lower portion, carrying into…
2. **"Sound Familiar?"** — those same clouds become its living background, drifting as the user reads…
3. User scrolls → **Violet Ray lofi bubbles form and rise** with parallax, clouds cross-fade away, transitioning into…
4. **"The Dreamlabs Method"** — bubbles thin to low-opacity edge accents on the off-white surface, then a faint thread lingers into the next (navy) section before the atmosphere fades out entirely.

It must read as **one continuous dream**, not three bolted-together sections.

## 2. Codebase reconciliation (brief assumptions → reality)

- **Stack is Vite + React + `vite-react-ssg`**, not Astro. The atmosphere is a client-mounted React component (SSR renders the static SVG; animation attaches on mount).
- **Lenis + GSAP/ScrollTrigger are already installed and integrated** (`src/lib/lenis.ts` binds Lenis to GSAP's ticker and drives `ScrollTrigger.update`). No new smooth-scroll wiring needed.
- **Section name mapping:**
  - "Sound Familiar?" = `src/components/home/PainPoints.tsx` — `Section surface="dream"` (solid Deep Navy `#040F49`).
  - "The Dreamlabs Method" = `src/components/home/Method.tsx` — `Section surface="workshop"` (solid Off White `#F4F4F8`).
  - Section after Method = `src/components/home/Pillars.tsx` — `surface="dream"` (Deep Navy). The lingering Violet Ray bubbles fade out over this section.
- **Brand tokens already exact** in `tailwind.config.ts`: `rebecca #64378B`, `violet.ray #8B32FF`, `navy.deep #040F49`, `offwhite #F4F4F8`.

## 3. Architecture (chosen approach)

**Single fixed atmosphere rendered *between* each section's background and its content.**

- One `position: fixed; inset: 0; pointer-events: none` container at **`z-index: 40`** holds all cloud + bubble layers.
- Each participating section keeps its existing background color (normal flow, effectively below `z-40`), but its **content wrapper is lifted to `z-50`** (above the atmosphere).
- Resulting visual stack per section:
  - **Hero:** video (untouched, below) → clouds (`z-40`) → headline/CTA (`z-50`).
  - **"Sound Familiar?":** navy bg (below) → clouds (`z-40`, the living background) → cards (`z-50`).
  - **"Method":** off-white bg (below) → faint edge bubbles (`z-40`, in the margins behind the centered column) → content (`z-50`).
- Because the atmosphere is `pointer-events: none` and fades its container opacity to 0 once the thread ends, it never intercepts clicks or visually overlays later sections.

**Why not the alternatives:** a persistent fixed navy base (Approach B) fights the hero video and needs negative-z juggling; per-section scoped effects (Approach C) violate the brief's "one continuous system" requirement.

**Stacking-context caveat (must hold):** the content lift to `z-50` must be applied on a wrapper that is *not* itself trapped inside a transformed ancestor. `Reveal`/Framer-motion wrappers apply `transform` and create stacking contexts, so the `z-50` goes on the `Section` content wrapper that *contains* the Reveals (the `max-w-content` div), and on the hero text wrapper directly. `Section` is `relative overflow-hidden` (neither creates a stacking context), so this is safe.

## 4. Components (new)

All new files under `src/components/interactive/atmosphere/`:

- **`ScrollAtmosphere.tsx`** — orchestrator. Mounted once in `HomePage`. Owns:
  - the single master `ScrollTrigger` timeline (scrub),
  - a secondary trigger for the lingering-thread fade,
  - independent ambient-drift timelines,
  - `gsap.matchMedia` desktop/mobile branching,
  - the `prefers-reduced-motion` static branch.
  - Fixed, full-viewport, `pointer-events: none`, container opacity driven to 0 after the thread ends.
- **`CloudField.tsx`** — renders 3 cloud depth layers (back/mid/front), each containing N cloud SVGs from the shared shape set.
- **`BubbleField.tsx`** — renders 3 bubble depth layers (back/mid/front).
- **`cloudShapes.tsx`** — 3–5 distinct soft lofi cumulus SVGs: overlapping ellipses merged via an SVG `<filter>` gaussian-blur "goo" technique, soft top / flatter bottom silhouette, inner Rebecca→Violet gradient for depth, `fill #64378B`, gentle `blur(1–3px)`.
- **`bubbleShape.tsx`** — soft circle, radial gradient (bright `#8B32FF` core → translucent edge), small off-centre off-white highlight; sizes ~8–64px; smaller/farther bubbles blurred.
- **`atmosphere.ts`** — **pure, seeded** module: per-layer config (depth, parallax travel, target opacity, blur, shape counts) + deterministic shape distribution (positions/sizes). Unit-tested, mirroring the existing `particleEngine.ts` pattern.

## 5. Layer parameters

### Clouds (Rebecca Purple `#64378B`) — Transition 1
| Layer | Parallax travel | Cloud size | Target opacity | Blur | Desktop count | Mobile count |
|---|---|---|---|---|---|---|
| Back | ~60vh (slowest) | Largest | ~0.5 | 2–3px | up to 5 | ~half |
| Mid | ~90vh | Medium | ~0.7 | 1–2px | up to 5 | ~half |
| Front | ~120vh (fastest) | Smallest, detailed | ~0.9 | 0–1px | up to 5 | ~half |

Clouds cover at most the bottom ~60–70% of the hero with visible gaps (veil, not curtain). On mobile, biased toward the lower screen so they never rise behind the headline.

### Bubbles (Violet Ray `#8B32FF`) — Transition 2
| Layer | Parallax speed | Bubble sizes | Target opacity | Blur | Desktop count | Mobile count |
|---|---|---|---|---|---|---|
| Back | Slowest | Small, many | ~0.4 | 2px | up to 12 | ~half |
| Mid | Medium | Medium | ~0.65 | 1px | up to 12 | ~half |
| Front | Fastest | Large, few | ~0.9 | 0px | up to 12 | ~half |

## 6. Scroll choreography (one source)

A single master `ScrollTrigger` (`scrub: 0.5`) on the homepage range: `start` = hero `top top`, `end` = Method `top top`. Normalized progress 0→1:

- **0 → ~0.5 (Transition 1, rising clouds):** all three cloud layers `translateY` from below the fold (start `translateY(100%+)`) to resting position — front travels most, back least (parallax). Opacity 0 → target within the first ~30%, then hold. Hero stays partially visible behind. Clouds then persist (fixed) as the "Sound Familiar?" background.
- **~0.5 → 1 (Transition 2, forming bubbles):** clouds fade + drift away; three bubble layers rise (`translateY` from below) + scale-in + fade-in, staggered so they don't pop in together; front fastest. Cross-fade so clouds and bubbles never collide.
- **Lingering thread (secondary trigger, Method → Pillars):** bubbles settle to low opacity and drift to the edges/margins on the off-white Method surface, then thin further and the whole atmosphere container fades to 0 over Pillars (Deep Navy), keeping the dream thread alive briefly before ending.
- **Ambient drift (independent of scroll):** each layer gets a slow infinite loop — clouds ±~15px horizontal over 12–20s (per-layer phase); bubbles gentle vertical bob + horizontal drift — transform-only, so layers breathe when scrolling pauses.

## 7. Performance

- Animate **only `transform` and `opacity`** — never layout properties.
- `will-change: transform` on actively animating layers only.
- Node caps: ≤5 clouds/layer, ≤12 bubbles/layer (per brief).
- Bubble field lazy-initialised as the user approaches "Sound Familiar?" (not required in DOM at first paint).
- Use `scrub: 0.5` for a slight smoothing lag (dreamy feel).

## 8. Accessibility — `prefers-reduced-motion: reduce`

- Disable all scroll-scrubbed parallax and the infinite ambient loops.
- Render clouds and bubbles **static at their resting positions/opacities** (SSR SVG looks designed and on-brand with zero motion).
- Section boundaries are plain (no animated parallax).
- Must be verified by toggling the OS setting.
- Clouds/bubbles must never reduce section text contrast below **WCAG AA**; add a subtle Deep Navy gradient scrim behind text blocks only if a measurement requires it.

## 9. Mobile

- Same narrative, reduced cost: ~half the shapes per layer, ~60% parallax travel.
- Clouds biased low so the hero headline stays fully legible.
- Smooth (no jank) on a mid-range phone is the bar.

## 10. Integration touchpoints (existing files)

- `src/pages/HomePage.tsx` — mount `<ScrollAtmosphere/>`.
- `src/components/Section.tsx` — add opt-in `elevateContent?: boolean` prop → applies `relative z-50` to the content wrapper.
- `src/components/home/PainPoints.tsx` — pass `elevateContent`.
- `src/components/home/Method.tsx` — pass `elevateContent`.
- `src/components/interactive/hero/HeroAssembly.tsx` — bump hero text wrapper from `z-10` to `z-50`. **Hero video and its loop untouched.**

## 11. Build sequence (per approved cadence)

1. Build the cloud + bubble SVG shapes as standalone components; preview static on a scratch route to nail the lofi look against the hero video. **(commit)**
2. Wire Transition 1 (rising clouds) with ScrollTrigger + PainPoints background integration + ambient drift. **→ Kevin reviews on localhost.** **(commit)**
3. Wire Transition 2 (forming bubbles + cloud cross-fade + lingering thread into Pillars). **(commit)**
4. `prefers-reduced-motion` fallbacks. **(commit)**
5. Performance pass + mobile pass. **(commit)**

## 12. Definition of Done

- Scrolling from the top flows continuously: hero → clouds rise (hero still partly visible) → "Sound Familiar?" with living cloud background → bubbles form and rise → "The Dreamlabs Method" → faint thread fades over Pillars.
- Parallax depth clearly readable (layers move at visibly different speeds).
- All transition motion is scrubbed to scroll position (only ambient drift auto-plays).
- Exact brand hex values throughout.
- Smooth on a mid-range phone.
- `prefers-reduced-motion` fully honoured.
- Hero video loop untouched and still working.
- New pure logic in `atmosphere.ts` covered by unit tests; `npm run typecheck` and `npm test` clean.

## 13. Out of scope

- No changes to the hero video, its loop, or the trimmed `hero-bg.mp4`.
- No image/video assets for clouds or bubbles (CSS/SVG generated only).
- No changes to sections beyond Pillars; no unrelated refactors.
