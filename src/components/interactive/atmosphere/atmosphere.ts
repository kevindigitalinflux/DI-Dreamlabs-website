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
  /** Rendered size in px — cloud width or bubble diameter. */
  sizePx: number
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
// Counts and vertical spread build a dense bank filling the lower ~half of the
// viewport (it is the "Sound Familiar?" background, so it reads near-opaque).
const CLOUD_SPECS: LayerSpec[] = [
  { depth: 'back', travelVh: 80, targetOpacity: 0.8, blurPx: 2.5, count: 6, sizeRange: [440, 620], bottomRange: [34, 74] },
  { depth: 'mid', travelVh: 110, targetOpacity: 0.92, blurPx: 1, count: 8, sizeRange: [360, 520], bottomRange: [10, 46] },
  { depth: 'front', travelVh: 140, targetOpacity: 1, blurPx: 0, count: 9, sizeRange: [250, 410], bottomRange: [-16, 18] },
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
      sizePx: sizeOrWidth,
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
