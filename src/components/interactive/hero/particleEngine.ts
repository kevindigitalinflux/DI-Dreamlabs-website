import { ICON_MARK_EDGES, ICON_MARK_NODES, SPARK_NODE_INDEX } from './iconMarkGraph'

/**
 * Pure scroll-driven particle engine for the hero "Dream Assembly" sequence
 * (Brief §6). No DOM access — given a scroll progress (0–1) it returns the
 * full frame state: particle positions/sizes/opacities, connecting-thread
 * segments, and the activation-spark opacity. Deterministic per seed so the
 * sequence is identical on every visit and fully testable.
 */

export type ParticleHue = 'white' | 'violet' | 'cyan'

export type ParticleState = {
  x: number
  y: number
  size: number
  opacity: number
  hue: ParticleHue
}

export type ThreadSegment = { x1: number; y1: number; x2: number; y2: number; opacity: number }

export type Frame = {
  particles: ParticleState[]
  threads: ThreadSegment[]
  /** Projected constellation node targets (normalised canvas space). */
  targets: ReadonlyArray<{ x: number; y: number }>
  /** Magenta Bloom activation pulse at the flask core, 0–1. */
  sparkOpacity: number
  /** Position of the spark in normalised canvas space. */
  spark: { x: number; y: number }
}

export type EngineConfig = {
  /** Total particle count (>= node count for a complete constellation). */
  count: number
  seed: number
  /** Canvas width / height — keeps the icon mark square on any viewport. */
  aspect: number
}

/** Mulberry32 — tiny deterministic PRNG. */
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

const smoothstep = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Phase windows from the choreography table (Brief §6.2). */
const MOVE_START = 0.15
const MOVE_END = 0.85
const THREAD_START = 0.4
const THREAD_END = 0.85
const SPARK_START = 0.85
const SPARK_PEAK = 0.9
const SPARK_END = 1.0

/** Creates the engine: precomputes per-particle start/end states, exposes sampleFrame. */
export const createParticleEngine = ({ count, seed, aspect }: EngineConfig) => {
  const rand = mulberry32(seed)
  const nodeCount = Math.min(count, ICON_MARK_NODES.length)

  // Project the normalised icon-mark square into canvas space, centred,
  // occupying ~58% of the viewport height regardless of aspect ratio.
  const scale = 0.58
  const project = (n: { x: number; y: number }) => ({
    x: 0.5 + ((n.x - 0.5) * scale) / aspect,
    y: 0.5 + (n.y - 0.5) * scale,
  })
  const targets = ICON_MARK_NODES.map(project)

  type Precomputed = {
    startX: number
    startY: number
    endX: number
    endY: number
    startSize: number
    endSize: number
    hue: ParticleHue
    /** Per-particle stagger inside the movement window. */
    delay: number
    /** Index into targets, or -1 for surplus particles that dissolve. */
    targetIndex: number
    driftSpeed: number
  }

  const particles: Precomputed[] = Array.from({ length: count }, (_, i) => {
    // Start scattered around the edges and lower half — the "dream" field.
    const edgeBias = rand()
    const startX = edgeBias < 0.5 ? rand() * 0.25 + (rand() < 0.5 ? 0 : 0.75) : rand()
    const startY = 0.15 + rand() * 0.95
    const targetIndex = i < nodeCount ? i : -1
    const target = targetIndex >= 0 ? targets[targetIndex]! : { x: 0.5, y: 0.45 }
    const hueRoll = rand()
    const hue: ParticleHue = hueRoll < 0.12 ? 'cyan' : hueRoll < 0.5 ? 'violet' : 'white'
    return {
      startX,
      startY,
      endX: target.x,
      endY: target.y,
      startSize: 4 + rand() * 36, // px at 1x DPR (Brief: 4–40px)
      endSize: 5 + rand() * 3,
      hue,
      delay: rand() * 0.25,
      targetIndex,
      driftSpeed: 0.1 + rand() * 0.15,
    }
  })

  // Stable per-edge reveal offsets for the convergence window.
  const edgeOffsets = ICON_MARK_EDGES.map(() => rand() * 0.8)

  const sparkTarget = project(ICON_MARK_NODES[SPARK_NODE_INDEX] ?? { x: 0.5, y: 0.7 })

  const sampleFrame = (progress: number): Frame => {
    const p = clamp01(progress)

    const particleStates: ParticleState[] = particles.map((pt) => {
      // Movement eases through the window, staggered per particle.
      const windowSpan = MOVE_END - MOVE_START
      const local = clamp01((p - MOVE_START - pt.delay * windowSpan) / (windowSpan * (1 - pt.delay)))
      const eased = smoothstep(local)
      // Gentle upward drift before/while converging — the bubble motif.
      const drift = (1 - eased) * p * pt.driftSpeed
      const x = pt.startX + (pt.endX - pt.startX) * eased
      const y = pt.startY + (pt.endY - pt.startY) * eased - drift

      // Fade in over the first stir, surplus particles dissolve in convergence.
      const fadeIn = clamp01(p / 0.18)
      const surplusFade = pt.targetIndex === -1 ? 1 - clamp01((p - 0.55) / 0.25) : 1
      const opacity = fadeIn * surplusFade * (pt.targetIndex === -1 ? 0.85 : 0.6 + 0.4 * eased)

      // Snap node-bound particles exactly onto their targets once fully eased.
      const locked = pt.targetIndex >= 0 && local >= 1
      return {
        x: locked ? pt.endX : x,
        y: locked ? pt.endY : y,
        size: pt.startSize + (pt.endSize - pt.startSize) * eased,
        opacity,
        hue: pt.hue,
      }
    })

    const threads: ThreadSegment[] = ICON_MARK_EDGES.map(([a, b], i) => {
      const offset = edgeOffsets[i] ?? 0
      const revealSpan = THREAD_END - THREAD_START
      const local = clamp01((p - THREAD_START - offset * revealSpan) / (revealSpan * 0.35))
      const pa = a < particleStates.length ? particleStates[a]! : { x: targets[a]!.x, y: targets[a]!.y }
      const pb = b < particleStates.length ? particleStates[b]! : { x: targets[b]!.x, y: targets[b]!.y }
      return { x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y, opacity: smoothstep(local) }
    })

    // Single magenta pulse: rise into SPARK_PEAK, fade to a faint ember by SPARK_END.
    let sparkOpacity = 0
    if (p > SPARK_START && p <= SPARK_PEAK) {
      sparkOpacity = smoothstep((p - SPARK_START) / (SPARK_PEAK - SPARK_START))
    } else if (p > SPARK_PEAK) {
      sparkOpacity = 1 - smoothstep((p - SPARK_PEAK) / (SPARK_END - SPARK_PEAK)) * 0.9
    }

    return { particles: particleStates, threads, targets, sparkOpacity, spark: sparkTarget }
  }

  return { sampleFrame, targets }
}
