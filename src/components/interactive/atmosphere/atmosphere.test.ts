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

  it('caps shape counts per layer (≤14 clouds, ≤18 bubbles)', () => {
    const cfg = buildAtmosphere({ seed: 7, mobile: false })
    cfg.clouds.forEach((l) => expect(l.placements.length).toBeLessThanOrEqual(14))
    cfg.bubbles.forEach((l) => expect(l.placements.length).toBeLessThanOrEqual(18))
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
        expect(p.sizePx).toBeGreaterThanOrEqual(8)
        expect(p.sizePx).toBeLessThanOrEqual(64)
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

  it('produces different layouts for different seeds', () => {
    const a = buildAtmosphere({ seed: 1, mobile: false })
    const b = buildAtmosphere({ seed: 2, mobile: false })
    expect(a).not.toEqual(b)
  })

  it('shortens mobile parallax travel to ~60% of desktop', () => {
    const desk = buildAtmosphere({ seed: 7, mobile: false })
    const mob = buildAtmosphere({ seed: 7, mobile: true })
    expect(mob.clouds[2]!.travelVh).toBeCloseTo(desk.clouds[2]!.travelVh * 0.6, 5)
  })
})
