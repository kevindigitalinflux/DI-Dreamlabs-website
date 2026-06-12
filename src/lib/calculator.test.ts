import { describe, expect, it } from 'vitest'
import {
  BOTTLENECKS,
  INDUSTRIES,
  PROCESSES,
  TEAM_SIZES,
  estimateSavings,
} from './calculator'

describe('estimateSavings', () => {
  it('returns a known estimate for a reference case', () => {
    const result = estimateSavings({
      industry: 'cleaning',
      teamSize: '16-40',
      bottleneck: 'paper-admin',
      process: 'paper',
    })
    // base 18h x team 2.0 x process 1.3 = 46.8 → rounded
    expect(result.hoursPerMonth).toBe(47)
    expect(result.poundsPerMonth).toBe(47 * 22)
  })

  it('grows monotonically with team size', () => {
    let previous = 0
    for (const teamSize of TEAM_SIZES.map((t) => t.value)) {
      const { hoursPerMonth } = estimateSavings({
        industry: 'construction',
        teamSize,
        bottleneck: 'slow-quoting',
        process: 'spreadsheets',
      })
      expect(hoursPerMonth).toBeGreaterThan(previous)
      previous = hoursPerMonth
    }
  })

  it('returns finite positive numbers for every combination', () => {
    for (const industry of INDUSTRIES.map((i) => i.value)) {
      for (const teamSize of TEAM_SIZES.map((t) => t.value)) {
        for (const bottleneck of BOTTLENECKS.map((b) => b.value)) {
          for (const process of PROCESSES.map((p) => p.value)) {
            const r = estimateSavings({ industry, teamSize, bottleneck, process })
            expect(Number.isFinite(r.hoursPerMonth)).toBe(true)
            expect(r.hoursPerMonth).toBeGreaterThan(0)
            expect(r.poundsPerMonth).toBeGreaterThan(0)
          }
        }
      }
    }
  })

  it('estimates least savings for already mostly-automated processes', () => {
    const base = { industry: 'trades', teamSize: '6-15', bottleneck: 'missed-calls' } as const
    const automated = estimateSavings({ ...base, process: 'mostly-automated' })
    for (const process of ['paper', 'spreadsheets', 'some-software'] as const) {
      expect(estimateSavings({ ...base, process }).hoursPerMonth).toBeGreaterThan(
        automated.hoursPerMonth,
      )
    }
  })

  it('labels confidence by estimate size', () => {
    const small = estimateSavings({
      industry: 'cleaning',
      teamSize: '1-5',
      bottleneck: 'stock-surprises',
      process: 'mostly-automated',
    })
    const large = estimateSavings({
      industry: 'logistics',
      teamSize: '80+',
      bottleneck: 'paper-admin',
      process: 'paper',
    })
    expect(small.confidence).toBe('low')
    expect(large.confidence).toBe('high')
  })
})
