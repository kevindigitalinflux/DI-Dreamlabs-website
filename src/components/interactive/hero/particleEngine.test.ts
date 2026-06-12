import { describe, expect, it } from 'vitest'
import { ICON_MARK_EDGES, ICON_MARK_NODES } from './iconMarkGraph'
import { createParticleEngine } from './particleEngine'

const CONFIG = { count: 80, seed: 42, aspect: 16 / 9 }

describe('particleEngine', () => {
  it('is deterministic for the same seed', () => {
    const a = createParticleEngine(CONFIG).sampleFrame(0.37)
    const b = createParticleEngine(CONFIG).sampleFrame(0.37)
    expect(a).toEqual(b)
  })

  it('scatters particles away from their constellation targets at progress 0', () => {
    const engine = createParticleEngine(CONFIG)
    const start = engine.sampleFrame(0)
    const end = engine.sampleFrame(1)
    const nodeCount = Math.min(CONFIG.count, ICON_MARK_NODES.length)
    let totalDistance = 0
    for (let i = 0; i < nodeCount; i++) {
      const s = start.particles[i]!
      const e = end.particles[i]!
      totalDistance += Math.hypot(s.x - e.x, s.y - e.y)
    }
    expect(totalDistance / nodeCount).toBeGreaterThan(0.1)
  })

  it('locks every constellation node into place at progress 1', () => {
    const frame = createParticleEngine(CONFIG).sampleFrame(1)
    const nodeCount = Math.min(CONFIG.count, ICON_MARK_NODES.length)
    const occupied = new Set<number>()
    for (let i = 0; i < nodeCount; i++) {
      const p = frame.particles[i]!
      expect(p.opacity).toBeGreaterThan(0.85)
      // Each node-bound particle sits exactly on some node's projected target.
      const match = frame.targets.findIndex(
        (t) => Math.abs(t.x - p.x) < 1e-9 && Math.abs(t.y - p.y) < 1e-9,
      )
      expect(match).toBeGreaterThanOrEqual(0)
      occupied.add(match)
    }
    expect(occupied.size).toBe(nodeCount)
  })

  it('fades surplus particles out by the lock-in', () => {
    const engine = createParticleEngine({ ...CONFIG, count: ICON_MARK_NODES.length + 20 })
    const frame = engine.sampleFrame(1)
    for (let i = ICON_MARK_NODES.length; i < frame.particles.length; i++) {
      expect(frame.particles[i]!.opacity).toBeLessThan(0.05)
    }
  })

  it('keeps cyan particles to at most 15 percent', () => {
    const frame = createParticleEngine(CONFIG).sampleFrame(0.5)
    const cyan = frame.particles.filter((p) => p.hue === 'cyan').length
    expect(cyan / frame.particles.length).toBeLessThanOrEqual(0.15)
  })

  it('hides threads early and shows all of them at lock-in', () => {
    const engine = createParticleEngine(CONFIG)
    const early = engine.sampleFrame(0.3)
    expect(early.threads.every((t) => t.opacity === 0)).toBe(true)
    const locked = engine.sampleFrame(1)
    expect(locked.threads.length).toBe(ICON_MARK_EDGES.length)
    expect(locked.threads.every((t) => t.opacity > 0.85)).toBe(true)
  })

  it('grows thread visibility monotonically through the convergence window', () => {
    const engine = createParticleEngine(CONFIG)
    let previousVisible = -1
    for (const p of [0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
      const visible = engine.sampleFrame(p).threads.filter((t) => t.opacity > 0).length
      expect(visible).toBeGreaterThanOrEqual(previousVisible)
      previousVisible = visible
    }
  })

  it('pulses the magenta spark once near activation and lets it fade', () => {
    const engine = createParticleEngine(CONFIG)
    expect(engine.sampleFrame(0.84).sparkOpacity).toBe(0)
    expect(engine.sampleFrame(0.9).sparkOpacity).toBeGreaterThan(0.7)
    expect(engine.sampleFrame(1).sparkOpacity).toBeLessThan(0.2)
  })
})
