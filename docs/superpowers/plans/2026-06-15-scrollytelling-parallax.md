# Scrollytelling Parallax Atmosphere Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a continuous, scroll-scrubbed parallax "dream atmosphere" (rising Rebecca-Purple clouds, then forming Violet-Ray bubbles) spanning Hero → "Sound Familiar?" → "The Dreamlabs Method", with a faint thread lingering into the next section.

**Architecture:** One fixed-position `ScrollAtmosphere` island (`z-40`, `pointer-events:none`) renders all cloud/bubble layers *between* each section's background and its `z-50`-lifted content. A single GSAP ScrollTrigger timeline (scrub) drives the rise/cross-fade; independent GSAP timelines drive ambient drift. All visual placement comes from a pure, seeded, unit-tested `atmosphere.ts` module (mirrors the existing `particleEngine.ts` pattern).

**Tech Stack:** React 18 + TS (strict), GSAP + ScrollTrigger + `@gsap/react` `useGSAP`, Lenis (already wired in `src/lib/lenis.ts`), Tailwind v3, Vitest, `vite-react-ssg`.

**Spec:** `docs/superpowers/specs/2026-06-15-scrollytelling-parallax-design.md`

---

## File Structure

**New files (all under `src/components/interactive/atmosphere/`):**
- `atmosphere.ts` — pure seeded config + shape placement (no DOM). Unit-tested.
- `atmosphere.test.ts` — Vitest unit tests for the above.
- `AtmosphereDefs.tsx` — shared SVG `<defs>` (blur filters + gradients), rendered once.
- `cloudShapes.tsx` — 4 lofi cumulus cloud SVG variants (Rebecca, inner gradient).
- `bubbleShape.tsx` — single soft bubble SVG (Violet radial gradient + highlight).
- `CloudField.tsx` — 3 cloud depth layers (back/mid/front), static render from config.
- `BubbleField.tsx` — 3 bubble depth layers, static render from config.
- `ScrollAtmosphere.tsx` — orchestrator: mounts fields, owns ScrollTriggers + ambient + matchMedia + reduced-motion.

**Modified files:**
- `src/components/Section.tsx` — add opt-in `elevateContent` prop.
- `src/components/home/PainPoints.tsx` — pass `elevateContent`.
- `src/components/home/Method.tsx` — pass `elevateContent`.
- `src/components/interactive/hero/HeroAssembly.tsx` — bump hero content `z-10` → `z-50`.
- `src/pages/HomePage.tsx` — mount `<ScrollAtmosphere/>`.
- `src/pages/AtmospherePreviewPage.tsx` (new) + `src/routes.tsx` — temporary scratch route `/atmosphere-preview` for static shape review (removed in Task 9).

**Conventions to follow (from codebase):** named exports only; JSDoc on exported fns; TS strict (no `any`); Tailwind utilities only (custom keyframes live in `src/styles/index.css` if needed); page modules also `export const Component = PageName` for lazy routes; deterministic PRNG via mulberry32 like `particleEngine.ts`.

---

## Task 1: Pure atmosphere config + placement logic (TDD)

**Files:**
- Create: `src/components/interactive/atmosphere/atmosphere.ts`
- Test: `src/components/interactive/atmosphere/atmosphere.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/components/interactive/atmosphere/atmosphere.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { buildAtmosphere } from './atmosphere'

describe('buildAtmosphere', () => {
  it('is deterministic for the same seed', () => {
    const a = buildAtmosphere({ seed: 7, mobile: false })
    const b = buildAtmosphere({ seed: 7, mobile: false })
    expect(a).toEqual(b)
  })

  it('returns three cloud layers and three bubble layers in back→front order', () => {
    const cfg = buildAtmosphere({ seed: 7, mobile: false })
    expect(cfg.clouds.map((l) => l.depth)).toEqual(['back', 'mid', 'front'])
    expect(cfg.bubbles.map((l) => l.depth)).toEqual(['back', 'mid', 'front'])
  })

  it('caps shape counts per layer (≤5 clouds, ≤12 bubbles)', () => {
    const cfg = buildAtmosphere({ seed: 7, mobile: false })
    cfg.clouds.forEach((l) => expect(l.placements.length).toBeLessThanOrEqual(5))
    cfg.bubbles.forEach((l) => expect(l.placements.length).toBeLessThanOrEqual(12))
  })

  it('increases parallax travel and opacity from back to front', () => {
    const { clouds, bubbles } = buildAtmosphere({ seed: 7, mobile: false })
    expect(clouds[0]!.travelVh).toBeLessThan(clouds[2]!.travelVh)
    expect(clouds[0]!.targetOpacity).toBeLessThan(clouds[2]!.targetOpacity)
    expect(bubbles[0]!.travelVh).toBeLessThan(bubbles[2]!.travelVh)
    expect(bubbles[0]!.targetOpacity).toBeLessThan(bubbles[2]!.targetOpacity)
  })

  it('reduces counts (~half) and travel (~60%) on mobile', () => {
    const desk = buildAtmosphere({ seed: 7, mobile: false })
    const mob = buildAtmosphere({ seed: 7, mobile: true })
    const deskClouds = desk.clouds.reduce((n, l) => n + l.placements.length, 0)
    const mobClouds = mob.clouds.reduce((n, l) => n + l.placements.length, 0)
    expect(mobClouds).toBeLessThan(deskClouds)
    expect(mob.clouds[2]!.travelVh).toBeLessThan(desk.clouds[2]!.travelVh)
  })

  it('keeps bubble sizes within 8–64px and normalised x within 0–1', () => {
    const { bubbles } = buildAtmosphere({ seed: 7, mobile: false })
    bubbles.forEach((l) =>
      l.placements.forEach((p) => {
        expect(p.size).toBeGreaterThanOrEqual(8)
        expect(p.size).toBeLessThanOrEqual(64)
        expect(p.x).toBeGreaterThanOrEqual(0)
        expect(p.x).toBeLessThanOrEqual(1)
      }),
    )
  })

  it('uses only the 4 available cloud variants', () => {
    const { clouds } = buildAtmosphere({ seed: 7, mobile: false })
    clouds.forEach((l) =>
      l.placements.forEach((p) => {
        expect(p.variant).toBeGreaterThanOrEqual(0)
        expect(p.variant).toBeLessThanOrEqual(3)
      }),
    )
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- atmosphere`
Expected: FAIL — "Failed to resolve import './atmosphere'" / `buildAtmosphere is not a function`.

- [ ] **Step 3: Write the minimal implementation**

Create `src/components/interactive/atmosphere/atmosphere.ts`:

```ts
/**
 * Pure, seeded layout engine for the scroll atmosphere (spec §4–§5). No DOM
 * access: given a seed and viewport class it returns deterministic per-layer
 * configuration and shape placements. The React fields render this verbatim,
 * so the visual is identical on every visit and fully unit-testable.
 */

export type LayerDepth = 'back' | 'mid' | 'front'

export type ShapePlacement = {
  /** Normalised horizontal position across the viewport (0–1). */
  x: number
  /** Scale multiplier applied to the base shape. */
  scale: number
  /** Cloud variant index (0–3); 0 for bubbles (single shape). */
  variant: number
  /** Rendered size in px (bubbles 8–64; clouds use width below). */
  size: number
  /** Base cloud width in px (ignored for bubbles). */
  width: number
  /** Resting vertical offset from the bottom of the viewport, in vh. */
  bottomVh: number
  /** Ambient-drift phase offset (0–1) so layers don't move in lockstep. */
  phase: number
}

export type LayerConfig = {
  depth: LayerDepth
  /** Vertical parallax travel (how far it rises during the transition), vh. */
  travelVh: number
  /** Opacity it settles to once risen. */
  targetOpacity: number
  /** Gaussian blur applied to the whole layer, px. */
  blurPx: number
  placements: ShapePlacement[]
}

export type AtmosphereConfig = {
  clouds: LayerConfig[]
  bubbles: LayerConfig[]
}

/** Mulberry32 — tiny deterministic PRNG (same as particleEngine). */
const mulberry32 = (seed: number) => {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type LayerSpec = {
  depth: LayerDepth
  travelVh: number
  targetOpacity: number
  blurPx: number
  count: number
  /** [min,max] base width (clouds) or size (bubbles), px. */
  sizeRange: [number, number]
  /** [min,max] resting bottom offset, vh. */
  bottomRange: [number, number]
}

// Cloud layers — back (furthest/largest/slowest) → front (closest/smallest/fastest).
const CLOUD_SPECS: LayerSpec[] = [
  { depth: 'back', travelVh: 60, targetOpacity: 0.5, blurPx: 3, count: 4, sizeRange: [520, 680], bottomRange: [-6, 10] },
  { depth: 'mid', travelVh: 90, targetOpacity: 0.7, blurPx: 1.5, count: 5, sizeRange: [380, 480], bottomRange: [-4, 4] },
  { depth: 'front', travelVh: 120, targetOpacity: 0.9, blurPx: 0.5, count: 5, sizeRange: [240, 340], bottomRange: [-12, -2] },
]

// Bubble layers — back (small/many/slow) → front (large/few/fast).
const BUBBLE_SPECS: LayerSpec[] = [
  { depth: 'back', travelVh: 55, targetOpacity: 0.4, blurPx: 2, count: 12, sizeRange: [8, 22], bottomRange: [-10, 40] },
  { depth: 'mid', travelVh: 85, targetOpacity: 0.65, blurPx: 1, count: 9, sizeRange: [20, 40], bottomRange: [-10, 30] },
  { depth: 'front', travelVh: 115, targetOpacity: 0.9, blurPx: 0, count: 6, sizeRange: [40, 64], bottomRange: [-12, 20] },
]

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const buildLayer = (
  spec: LayerSpec,
  kind: 'cloud' | 'bubble',
  rand: () => number,
  mobile: boolean,
): LayerConfig => {
  const count = mobile ? Math.ceil(spec.count / 2) : spec.count
  const travelVh = mobile ? spec.travelVh * 0.6 : spec.travelVh
  const placements: ShapePlacement[] = Array.from({ length: count }, (_, i) => {
    // Spread shapes across the width in jittered bands so they never tile.
    const band = (i + rand() * 0.8) / count
    const sizeOrWidth = lerp(spec.sizeRange[0], spec.sizeRange[1], rand())
    return {
      x: Math.min(1, Math.max(0, band)),
      scale: 0.85 + rand() * 0.3,
      variant: kind === 'cloud' ? Math.floor(rand() * 4) : 0,
      size: kind === 'bubble' ? sizeOrWidth : sizeOrWidth,
      width: kind === 'cloud' ? sizeOrWidth : sizeOrWidth,
      bottomVh: lerp(spec.bottomRange[0], spec.bottomRange[1], rand()),
      phase: rand(),
    }
  })
  return { depth: spec.depth, travelVh, targetOpacity: spec.targetOpacity, blurPx: spec.blurPx, placements }
}

/**
 * Builds the full atmosphere layout for a seed. `mobile` halves shape counts
 * and shortens parallax travel to ~60% (spec §9).
 */
export const buildAtmosphere = ({ seed, mobile }: { seed: number; mobile: boolean }): AtmosphereConfig => {
  const rand = mulberry32(seed)
  return {
    clouds: CLOUD_SPECS.map((s) => buildLayer(s, 'cloud', rand, mobile)),
    bubbles: BUBBLE_SPECS.map((s) => buildLayer(s, 'bubble', rand, mobile)),
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- atmosphere`
Expected: PASS (7 tests).

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/interactive/atmosphere/atmosphere.ts src/components/interactive/atmosphere/atmosphere.test.ts
git commit -m "feat: seeded atmosphere layout engine (TDD)"
```

---

## Task 2: SVG shapes — defs, clouds, bubble

**Files:**
- Create: `src/components/interactive/atmosphere/AtmosphereDefs.tsx`
- Create: `src/components/interactive/atmosphere/cloudShapes.tsx`
- Create: `src/components/interactive/atmosphere/bubbleShape.tsx`

- [ ] **Step 1: Create shared defs**

Create `src/components/interactive/atmosphere/AtmosphereDefs.tsx`:

```tsx
/**
 * Shared SVG filters + gradients for the atmosphere, rendered once. The "goo"
 * filter merges overlapping ellipses into one soft puffy blob (spec §3.1);
 * gradients give clouds inner depth and bubbles a glowing core (spec §3.2).
 * Exact brand hex: Rebecca #64378B, Violet Ray #8B32FF.
 */
export const AtmosphereDefs = () => (
  <svg aria-hidden width="0" height="0" className="absolute" style={{ position: 'absolute' }}>
    <defs>
      <filter id="atmos-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
          result="goo"
        />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
      <linearGradient id="atmos-cloud-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7A45A8" />
        <stop offset="60%" stopColor="#64378B" />
        <stop offset="100%" stopColor="#4F2B70" />
      </linearGradient>
      <radialGradient id="atmos-bubble-fill" cx="38%" cy="34%" r="68%">
        <stop offset="0%" stopColor="#A866FF" />
        <stop offset="45%" stopColor="#8B32FF" />
        <stop offset="100%" stopColor="rgba(139,50,255,0)" />
      </radialGradient>
    </defs>
  </svg>
)
```

- [ ] **Step 2: Create cloud shapes**

Create `src/components/interactive/atmosphere/cloudShapes.tsx`:

```tsx
/**
 * Four lofi cumulus cloud variants (spec §3.1): overlapping ellipses merged by
 * the shared #atmos-goo filter into one soft blob with a puffy top and flatter
 * bottom, filled with the inner Rebecca→Violet gradient. ViewBox is 200×100;
 * callers size via width and keep aspect with height auto.
 */
type CloudProps = { variant: number; className?: string; style?: React.CSSProperties }

/** Ellipse cluster per variant — [cx, cy, rx, ry] in the 200×100 viewBox. */
const VARIANTS: ReadonlyArray<ReadonlyArray<readonly [number, number, number, number]>> = [
  [
    [60, 62, 42, 30],
    [100, 50, 50, 38],
    [140, 64, 40, 28],
    [100, 78, 78, 22],
  ],
  [
    [55, 60, 34, 26],
    [92, 54, 40, 32],
    [128, 58, 36, 28],
    [158, 66, 28, 22],
    [100, 80, 82, 20],
  ],
  [
    [70, 58, 46, 34],
    [120, 64, 42, 30],
    [100, 80, 70, 20],
  ],
  [
    [50, 64, 30, 24],
    [82, 56, 36, 30],
    [116, 52, 40, 34],
    [150, 62, 34, 26],
    [100, 80, 84, 20],
  ],
]

export const CloudShape = ({ variant, className = '', style }: CloudProps) => {
  const ellipses = VARIANTS[variant % VARIANTS.length]!
  return (
    <svg viewBox="0 0 200 100" className={className} style={style} aria-hidden preserveAspectRatio="xMidYMax meet">
      <g filter="url(#atmos-goo)" fill="url(#atmos-cloud-fill)">
        {ellipses.map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} />
        ))}
      </g>
    </svg>
  )
}
```

- [ ] **Step 3: Create bubble shape**

Create `src/components/interactive/atmosphere/bubbleShape.tsx`:

```tsx
/**
 * Soft lofi bubble (spec §3.2): Violet-Ray radial-gradient core fading to a
 * translucent edge, with a small off-centre off-white highlight — echoing the
 * flask bubbles in the hero video. ViewBox 100×100; caller sizes via width/height.
 */
type BubbleProps = { className?: string; style?: React.CSSProperties }

export const BubbleShape = ({ className = '', style }: BubbleProps) => (
  <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
    <circle cx="50" cy="50" r="48" fill="url(#atmos-bubble-fill)" />
    <circle cx="37" cy="34" r="8" fill="#F4F4F8" opacity="0.5" />
  </svg>
)
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/interactive/atmosphere/AtmosphereDefs.tsx src/components/interactive/atmosphere/cloudShapes.tsx src/components/interactive/atmosphere/bubbleShape.tsx
git commit -m "feat: lofi cloud + bubble SVG shapes for atmosphere"
```

---

## Task 3: Field components (static render)

**Files:**
- Create: `src/components/interactive/atmosphere/CloudField.tsx`
- Create: `src/components/interactive/atmosphere/BubbleField.tsx`

Each layer is two nested divs: `.atmos-layer-scroll` (GSAP writes scroll-parallax `translateY` here) wrapping `.atmos-layer-drift` (GSAP writes ambient `translateX/Y` here). Nesting keeps the two transforms from clobbering each other. Shapes are absolutely positioned inside the drift wrapper. A `data-*` attribute carries the layer's travel/opacity so the orchestrator (Task 5) can read it.

- [ ] **Step 1: Create CloudField**

Create `src/components/interactive/atmosphere/CloudField.tsx`:

```tsx
import type { LayerConfig } from './atmosphere'
import { CloudShape } from './cloudShapes'

type CloudFieldProps = { layers: LayerConfig[] }

/**
 * Renders the three Rebecca-Purple cloud depth layers (spec §5). Layers start
 * below the fold (translateY 110%) and are raised by the orchestrator. Inner
 * `.atmos-layer-drift` wrapper is reserved for the ambient horizontal drift.
 */
export const CloudField = ({ layers }: CloudFieldProps) => (
  <div className="absolute inset-0">
    {layers.map((layer) => (
      <div
        key={layer.depth}
        className="atmos-layer-scroll atmos-cloud-layer absolute inset-0 will-change-transform"
        data-depth={layer.depth}
        data-travel={layer.travelVh}
        data-opacity={layer.targetOpacity}
        style={{ transform: 'translateY(110%)', opacity: 0, filter: `blur(${layer.blurPx}px)` }}
      >
        <div className="atmos-layer-drift absolute inset-0 will-change-transform">
          {layer.placements.map((p, i) => (
            <CloudShape
              key={i}
              variant={p.variant}
              className="absolute h-auto"
              style={{
                left: `${p.x * 100}%`,
                bottom: `${p.bottomVh}vh`,
                width: `${p.width}px`,
                transform: `translateX(-50%) scale(${p.scale})`,
              }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
)
```

- [ ] **Step 2: Create BubbleField**

Create `src/components/interactive/atmosphere/BubbleField.tsx`:

```tsx
import type { LayerConfig } from './atmosphere'
import { BubbleShape } from './bubbleShape'

type BubbleFieldProps = { layers: LayerConfig[] }

/**
 * Renders the three Violet-Ray bubble depth layers (spec §5). Bubbles start
 * below the fold, small and transparent; the orchestrator raises + scales +
 * fades them in. Inner `.atmos-layer-drift` wrapper carries the ambient bob.
 */
export const BubbleField = ({ layers }: BubbleFieldProps) => (
  <div className="absolute inset-0">
    {layers.map((layer) => (
      <div
        key={layer.depth}
        className="atmos-layer-scroll atmos-bubble-layer absolute inset-0 will-change-transform"
        data-depth={layer.depth}
        data-travel={layer.travelVh}
        data-opacity={layer.targetOpacity}
        style={{ transform: 'translateY(110%)', opacity: 0, filter: `blur(${layer.blurPx}px)` }}
      >
        <div className="atmos-layer-drift absolute inset-0 will-change-transform">
          {layer.placements.map((p, i) => (
            <BubbleShape
              key={i}
              className="absolute"
              style={{
                left: `${p.x * 100}%`,
                bottom: `${p.bottomVh}vh`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                transform: `translateX(-50%) scale(${p.scale})`,
              }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
)
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/interactive/atmosphere/CloudField.tsx src/components/interactive/atmosphere/BubbleField.tsx
git commit -m "feat: cloud + bubble field layer components"
```

---

## Task 4: Scratch preview route (verify the lofi look)

This is build-sequence step 1 — preview the static shapes before any scroll logic. Temporary; removed in Task 9.

**Files:**
- Create: `src/pages/AtmospherePreviewPage.tsx`
- Modify: `src/routes.tsx`

- [ ] **Step 1: Create the preview page**

Create `src/pages/AtmospherePreviewPage.tsx`:

```tsx
import { buildAtmosphere } from '@/components/interactive/atmosphere/atmosphere'
import { AtmosphereDefs } from '@/components/interactive/atmosphere/AtmosphereDefs'
import { CloudShape } from '@/components/interactive/atmosphere/cloudShapes'
import { BubbleShape } from '@/components/interactive/atmosphere/bubbleShape'
import { Seo } from '@/lib/Seo'

/** Internal scratch page to review atmosphere shapes statically. Not linked. */
export const AtmospherePreviewPage = () => {
  const cfg = buildAtmosphere({ seed: 7, mobile: false })
  return (
    <div className="min-h-screen bg-navy-deep px-6 py-24">
      <Seo title="Atmosphere Preview" description="Internal scratch page." path="/atmosphere-preview" noIndex />
      <AtmosphereDefs />
      <h1 className="font-heading text-2xl font-bold text-offwhite">Clouds (Rebecca Purple)</h1>
      <div className="mt-6 flex flex-wrap items-end gap-6">
        {[0, 1, 2, 3].map((v) => (
          <CloudShape key={v} variant={v} className="h-auto w-64" />
        ))}
      </div>
      <h2 className="mt-16 font-heading text-2xl font-bold text-offwhite">Bubbles (Violet Ray)</h2>
      <div className="mt-6 flex flex-wrap items-end gap-6">
        {[16, 28, 44, 64].map((s) => (
          <BubbleShape key={s} style={{ width: s, height: s }} />
        ))}
      </div>
      <h2 className="mt-16 font-heading text-2xl font-bold text-offwhite">
        Layer counts: clouds {cfg.clouds.map((l) => l.placements.length).join('/')} · bubbles{' '}
        {cfg.bubbles.map((l) => l.placements.length).join('/')}
      </h2>
    </div>
  )
}

export const Component = AtmospherePreviewPage
```

- [ ] **Step 2: Register the route**

In `src/routes.tsx`, add this line immediately after the `style-guide` route (line 28):

```tsx
      { path: 'atmosphere-preview', lazy: () => import('@/pages/AtmospherePreviewPage') },
```

- [ ] **Step 3: Run the dev server and review**

Run: `npm run dev`
Open: `http://localhost:5173/atmosphere-preview` (or the printed port).
Expected: 4 soft puffy Rebecca-purple clouds with gradient depth and soft edges; 4 glowing violet bubbles with highlight dots. Confirm the lofi aesthetic against the hero video. Iterate on `cloudShapes.tsx` / gradients in `AtmosphereDefs.tsx` if needed before continuing.

- [ ] **Step 4: Commit**

```bash
git add src/pages/AtmospherePreviewPage.tsx src/routes.tsx
git commit -m "chore: scratch route to preview atmosphere shapes"
```

---

## Task 5: ScrollAtmosphere orchestrator — Transition 1 (rising clouds) + ambient + integration

This is build-sequence step 2 → **Kevin reviews on localhost after this task.**

**Files:**
- Create: `src/components/interactive/atmosphere/ScrollAtmosphere.tsx`
- Modify: `src/components/Section.tsx`
- Modify: `src/components/home/PainPoints.tsx`
- Modify: `src/components/interactive/hero/HeroAssembly.tsx`
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Add `elevateContent` to Section**

In `src/components/Section.tsx`, replace the props type and the content wrapper.

Change the `SectionProps` type to add the flag:

```tsx
type SectionProps = {
  /** 'dream' = Deep Navy with grain + glow; 'workshop' = Off White. */
  surface: 'dream' | 'workshop'
  children: ReactNode
  /** Adds ambient glow orbs on dream sections. */
  orbs?: boolean
  className?: string
  id?: string
  /** Lifts content above the fixed scroll atmosphere (z-50). Spec §3. */
  elevateContent?: boolean
}
```

Update the component signature and the inner wrapper `div`:

```tsx
export const Section = ({ surface, children, orbs = false, className = '', id, elevateContent = false }: SectionProps) => (
  <section
    id={id}
    className={`relative overflow-hidden px-6 py-20 md:py-28 ${
      surface === 'dream' ? 'bg-navy-deep' : 'bg-offwhite'
    } ${className}`}
  >
    {surface === 'dream' && <div className="hero-grain absolute inset-0" aria-hidden />}
    {surface === 'dream' && orbs && (
      <>
        <GlowOrb colour="violet" className="-right-32 top-0 h-96 w-96" />
        <GlowOrb colour="rebecca" className="-left-24 bottom-0 h-80 w-80" />
      </>
    )}
    <div className={`relative mx-auto max-w-content ${elevateContent ? 'z-50' : ''}`}>{children}</div>
  </section>
)
```

- [ ] **Step 2: Lift PainPoints content**

In `src/components/home/PainPoints.tsx`, change the opening `<Section ...>` tag (line 49) to add `elevateContent`:

```tsx
  <Section surface="dream" orbs elevateContent>
```

- [ ] **Step 3: Lift the hero content above the atmosphere**

In `src/components/interactive/hero/HeroAssembly.tsx`, find the hero content wrapper (currently `className="hero-content relative z-10 max-w-2xl"`) and change `z-10` to `z-50`:

```tsx
        <div className="hero-content relative z-50 max-w-2xl">
```

Also bump the scroll cue so it stays above the clouds — change the cue wrapper class from `... z-?`/none to include `z-50`:

```tsx
        <div className="hero-cue absolute bottom-6 left-1/2 z-50 -translate-x-1/2 text-offwhite/60 motion-safe:animate-bounce">
```

(Do **not** touch the `<video>` element or its attributes.)

- [ ] **Step 4: Create the orchestrator (clouds only for now)**

Create `src/components/interactive/atmosphere/ScrollAtmosphere.tsx`:

```tsx
import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { buildAtmosphere } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { CloudField } from './CloudField'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Fixed-position dream atmosphere spanning Hero → "Sound Familiar?" → "The
 * Dreamlabs Method" (spec §3, §6). Sits at z-40 between each section's
 * background and its z-50 content. One scrubbed ScrollTrigger raises the cloud
 * layers with parallax depth; independent timelines add ambient drift. Under
 * prefers-reduced-motion everything renders static at rest.
 */
export const ScrollAtmosphere = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const cfg = buildAtmosphere({ seed: 7, mobile })

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const cloudLayers = gsap.utils.toArray<HTMLElement>('.atmos-cloud-layer', root)
      const driftWraps = gsap.utils.toArray<HTMLElement>('.atmos-layer-drift', root)
      const hero = document.querySelector('#main section') as HTMLElement | null
      const painPoints = document.querySelector('#sound-familiar') as HTMLElement | null

      // Reduced motion: park clouds at rest, no scroll/ambient (spec §8).
      if (reduced) {
        cloudLayers.forEach((el) => {
          gsap.set(el, { y: 0, opacity: Number(el.dataset.opacity ?? 0.7) })
        })
        return
      }

      // Resting position per layer = 0; start below the fold via translateY(110%).
      cloudLayers.forEach((el) => {
        gsap.set(el, { yPercent: 110, opacity: 0 })
      })

      // Transition 1: raise clouds with parallax depth, scrubbed to scroll.
      if (hero && painPoints) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            endTrigger: painPoints,
            end: 'top top',
            scrub: 0.5,
          },
        })
        cloudLayers.forEach((el) => {
          const travel = Number(el.dataset.travel ?? 90)
          const target = Number(el.dataset.opacity ?? 0.7)
          // Front (larger travel) rises further/faster -> parallax depth.
          tl.to(el, { yPercent: 110 - travel, ease: 'none' }, 0)
          tl.to(el, { opacity: target, ease: 'none', duration: 0.3 }, 0)
        })
      }

      // Ambient horizontal drift, independent of scroll (spec §6).
      driftWraps.forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 === 0 ? 15 : -15,
          duration: 12 + i * 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    },
    { scope: rootRef, dependencies: [reduced, mobile] },
  )

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      <AtmosphereDefs />
      <CloudField layers={cfg.clouds} />
    </div>
  )
}
```

- [ ] **Step 5: Give PainPoints a scroll anchor id**

In `src/components/home/PainPoints.tsx`, add `id="sound-familiar"` to the `<Section>` so the orchestrator can target it. The tag becomes:

```tsx
  <Section surface="dream" orbs elevateContent id="sound-familiar">
```

- [ ] **Step 6: Mount the atmosphere on the homepage**

In `src/pages/HomePage.tsx`, add the import and render it as the first child inside the fragment (it is fixed-position, so order only affects DOM, not layout):

Add import after the existing component imports:

```tsx
import { ScrollAtmosphere } from '@/components/interactive/atmosphere/ScrollAtmosphere'
```

Add `<ScrollAtmosphere />` right after the opening `<>` and before `<Seo .../>`:

```tsx
  <>
    <ScrollAtmosphere />
    <Seo
```

- [ ] **Step 7: Typecheck + tests**

Run: `npm run typecheck && npm test -- atmosphere`
Expected: typecheck clean; atmosphere tests still PASS.

- [ ] **Step 8: Dev review**

Run: `npm run dev`. Open `http://localhost:5173/`. Scroll slowly from the top.
Expected: clouds rise from below over the hero's lower portion as you scroll, hero video still visible between/behind them, headline stays on top; clouds settle as the "Sound Familiar?" background and drift gently. **Pause here for Kevin's review.**

- [ ] **Step 9: Commit**

```bash
git add src/components/interactive/atmosphere/ScrollAtmosphere.tsx src/components/Section.tsx src/components/home/PainPoints.tsx src/components/interactive/hero/HeroAssembly.tsx src/pages/HomePage.tsx
git commit -m "feat: rising-cloud scroll transition (hero -> sound familiar)"
```

---

## Task 6: Transition 2 — forming bubbles + cloud cross-fade + lingering thread

**Files:**
- Modify: `src/components/interactive/atmosphere/ScrollAtmosphere.tsx`
- Modify: `src/components/home/Method.tsx`

- [ ] **Step 1: Anchor Method and lift its content**

In `src/components/home/Method.tsx`, change the `<Section surface="workshop">` (line 42) to add the id and content lift:

```tsx
    <Section surface="workshop" elevateContent id="dreamlabs-method">
```

- [ ] **Step 2: Render the BubbleField in the orchestrator**

In `src/components/interactive/atmosphere/ScrollAtmosphere.tsx`, add the import near the other field import:

```tsx
import { BubbleField } from './BubbleField'
```

Render it after `<CloudField .../>` in the returned JSX:

```tsx
      <CloudField layers={cfg.clouds} />
      <BubbleField layers={cfg.bubbles} />
```

- [ ] **Step 3: Add bubble rise + cloud cross-fade + lingering fade to the GSAP setup**

In `ScrollAtmosphere.tsx`, inside the `useGSAP` callback, extend the selectors and logic.

After the `cloudLayers`/`driftWraps` selectors, add bubble selectors and the Method/Pillars elements:

```tsx
      const bubbleLayers = gsap.utils.toArray<HTMLElement>('.atmos-bubble-layer', root)
      const method = document.querySelector('#dreamlabs-method') as HTMLElement | null
```

In the `reduced` branch, also park bubbles at rest before returning:

```tsx
      if (reduced) {
        cloudLayers.forEach((el) => gsap.set(el, { y: 0, opacity: Number(el.dataset.opacity ?? 0.7) }))
        bubbleLayers.forEach((el) =>
          gsap.set(el, { y: 0, opacity: Number(el.dataset.opacity ?? 0.6) * 0.4 }),
        )
        return
      }
```

After the existing cloud `gsap.set(... yPercent:110 ...)`, also park bubbles below the fold and small:

```tsx
      bubbleLayers.forEach((el) => {
        gsap.set(el, { yPercent: 120, opacity: 0, scale: 0.6, transformOrigin: '50% 100%' })
      })
```

Then, after the Transition 1 timeline block, add Transition 2 (clouds fade out, bubbles form) running across "Sound Familiar?" → "The Dreamlabs Method":

```tsx
      // Transition 2: as we leave "Sound Familiar?", clouds drift away and
      // bubbles rise + scale + fade in (forming), parallax by layer (spec §6).
      if (painPoints && method) {
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: painPoints,
            start: 'bottom bottom',
            endTrigger: method,
            end: 'top top',
            scrub: 0.5,
          },
        })
        cloudLayers.forEach((el) => {
          tl2.to(el, { opacity: 0, yPercent: 60, ease: 'none' }, 0)
        })
        bubbleLayers.forEach((el, i) => {
          const travel = Number(el.dataset.travel ?? 85)
          const target = Number(el.dataset.opacity ?? 0.6)
          // Stagger so bubbles don't all appear at once.
          tl2.to(el, { yPercent: 120 - travel, ease: 'none' }, 0.05 * i)
          tl2.to(el, { opacity: target, scale: 1, ease: 'none', duration: 0.5 }, 0.05 * i)
        })
      }

      // Lingering thread: over "The Dreamlabs Method" (off-white), bubbles thin
      // to faint edge accents, then the whole atmosphere fades out (spec §6).
      if (method) {
        gsap.to(root, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: method,
            start: 'center center',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
        // While Method is in view, drop bubble layers to a faint accent level.
        bubbleLayers.forEach((el) => {
          const target = Number(el.dataset.opacity ?? 0.6)
          gsap.to(el, {
            opacity: target * 0.35,
            ease: 'none',
            scrollTrigger: {
              trigger: method,
              start: 'top center',
              end: 'center center',
              scrub: 0.5,
            },
          })
        })
      }
```

- [ ] **Step 4: Typecheck + tests**

Run: `npm run typecheck && npm test -- atmosphere`
Expected: typecheck clean; atmosphere tests PASS.

- [ ] **Step 5: Dev review**

Run: `npm run dev`. Scroll the full hero → Method range.
Expected: clouds rise → become "Sound Familiar?" background → on scrolling down, clouds drift/fade away while violet bubbles rise and form → bubbles thin to faint edge accents on the off-white "Method" section → atmosphere fades out before later sections. Later sections (Pillars onward) show no atmosphere and remain clickable.

- [ ] **Step 6: Commit**

```bash
git add src/components/interactive/atmosphere/ScrollAtmosphere.tsx src/components/home/Method.tsx
git commit -m "feat: forming-bubble transition + cloud cross-fade + lingering thread"
```

---

## Task 7: Reduced-motion + mobile verification

The code already branches on `reduced` and `mobile` (Tasks 5–6). This task verifies both and fixes any gaps.

**Files:**
- Modify (only if a fix is needed): `src/components/interactive/atmosphere/ScrollAtmosphere.tsx`

- [ ] **Step 1: Verify reduced motion**

Emulate reduced motion and capture a screenshot at the hero and at "Sound Familiar?":

Run:
```bash
node scripts/screenshot.mjs http://localhost:5173/ /tmp/atmos-reduced-hero.png 1280 900 0 reduce
node scripts/screenshot.mjs http://localhost:5173/ /tmp/atmos-reduced-sf.png 1280 900 1200 reduce
```
Expected: clouds and bubbles appear **static at rest** (no off-screen parking, no animation), sections look designed and on-brand. If clouds are missing (parked off-screen) under reduced motion, ensure the `reduced` branch sets `yPercent: 0` not `y: 0` — fix:

```tsx
      if (reduced) {
        cloudLayers.forEach((el) => gsap.set(el, { yPercent: 0, opacity: Number(el.dataset.opacity ?? 0.7) }))
        bubbleLayers.forEach((el) =>
          gsap.set(el, { yPercent: 0, scale: 1, opacity: Number(el.dataset.opacity ?? 0.6) * 0.4 }),
        )
        return
      }
```

- [ ] **Step 2: Verify mobile**

Run:
```bash
node scripts/screenshot.mjs http://localhost:5173/ /tmp/atmos-mobile-hero.png 390 844 0
node scripts/screenshot.mjs http://localhost:5173/ /tmp/atmos-mobile-sf.png 390 844 700
```
Expected: fewer clouds/bubbles, shorter rise, hero headline fully legible (clouds biased low). Confirm no horizontal overflow/scrollbar.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: clean.

- [ ] **Step 4: Commit (only if fixes were made)**

```bash
git add src/components/interactive/atmosphere/ScrollAtmosphere.tsx
git commit -m "fix: reduced-motion resting state for atmosphere"
```

---

## Task 8: Contrast + performance pass

**Files:**
- Modify (only if needed): `src/components/home/PainPoints.tsx`, `src/components/interactive/atmosphere/atmosphere.ts`

- [ ] **Step 1: Check text contrast over clouds**

Run `npm run dev`, open `/`, scroll to "Sound Familiar?". Confirm card text and the section heading remain clearly legible over the drifting clouds. The cards use `Card surface="dark"` (solid) so card text is safe; verify the section **heading/lede** (directly over clouds) still meets contrast. If it looks marginal, add a subtle navy scrim behind the heading only — in `PainPoints.tsx` wrap the `SectionHeading`'s `Reveal` with a scrim, e.g. add `className="rounded-card bg-navy-deep/40 px-4 py-2"` to that `Reveal`. (Apply only if needed.)

- [ ] **Step 2: Sanity-check animated node count**

Confirm total animated layers are small: 3 cloud + 3 bubble layers (6 scroll-driven elements) + 6 drift wrappers. Shapes themselves are static within layers. This is well within budget — no change expected. If FPS is poor on a throttled CPU, reduce desktop counts in `atmosphere.ts` `*_SPECS` `count` fields.

- [ ] **Step 3: Full test + typecheck**

Run: `npm test && npm run typecheck`
Expected: all tests PASS, typecheck clean.

- [ ] **Step 4: Commit (only if changes were made)**

```bash
git add -A
git commit -m "fix: atmosphere contrast/perf pass"
```

---

## Task 9: Remove scratch route + final verification

**Files:**
- Delete: `src/pages/AtmospherePreviewPage.tsx`
- Modify: `src/routes.tsx`

- [ ] **Step 1: Remove the preview page and route**

Delete `src/pages/AtmospherePreviewPage.tsx`. In `src/routes.tsx`, remove the `atmosphere-preview` route line added in Task 4.

- [ ] **Step 2: Production build smoke test**

Run: `npm run build`
Expected: build succeeds (SSG pre-renders all routes, no `atmosphere-preview`, no SSR errors — the atmosphere reads `window` only inside `useEffect`/`useGSAP`, so SSR is safe).

- [ ] **Step 3: Final full verification**

Run: `npm test && npm run typecheck`
Expected: all PASS, clean.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove atmosphere scratch route"
```

---

## Self-Review Notes (author)

- **Spec coverage:** §3 architecture → Tasks 5 (Section/z-lift, hero z, mount); §3.1/§3.2 shapes → Task 2; §4 rising clouds → Task 5; §5 forming bubbles + cross-fade + linger → Task 6; §6 one-source choreography → Tasks 5–6 (scrubbed ScrollTriggers); §6 ambient drift → Task 5; §7 perf (transform/opacity, will-change, caps) → Tasks 3/8 + `atmosphere.ts` caps test; §8 reduced motion → Tasks 5–7; §9 mobile → `atmosphere.ts` + Task 7; §10 integration touchpoints → Tasks 5–6; §11 build order → task order; §12 DoD → Task 9; hero video untouched → enforced (only z-index on text changed).
- **Placeholder scan:** none — every code step has full code; "only if needed" steps include the exact fix code.
- **Type consistency:** `LayerConfig`/`ShapePlacement`/`AtmosphereConfig` defined in Task 1 and consumed unchanged in Tasks 3–6; `buildAtmosphere({ seed, mobile })` signature consistent everywhere; data attributes (`data-travel`, `data-opacity`, `data-depth`) written in Task 3 and read in Tasks 5–6.
- **Known tuning risk:** exact `travelVh`/opacity/`yPercent` values are best-guess and meant to be tuned during the Task 5/6 localhost reviews; the structure (not the magic numbers) is what matters.
