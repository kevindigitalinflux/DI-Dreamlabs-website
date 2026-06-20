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
    // base 18h × team 2.0 × process 1.3 = 46.8 → 47
    expect(result.hoursPerMonth).toBe(47)
    expect(result.poundsPerMonth).toBe(47 * 22)
    // hoursPerWeek = round(47 / 4) = 12
    expect(result.hoursPerWeek).toBe(12)
  })

  it('returns positive revenue estimates for all combinations', () => {
    for (const industry of INDUSTRIES.map((i) => i.value)) {
      for (const teamSize of TEAM_SIZES.map((t) => t.value)) {
        for (const bottleneck of BOTTLENECKS.map((b) => b.value)) {
          for (const process of PROCESSES.map((p) => p.value)) {
            const r = estimateSavings({ industry, teamSize, bottleneck, process })
            expect(Number.isFinite(r.hoursPerMonth)).toBe(true)
            expect(r.hoursPerMonth).toBeGreaterThan(0)
            expect(r.poundsPerMonth).toBeGreaterThan(0)
            expect(r.revenuePerMonth).toBeGreaterThan(0)
            expect(r.revenuePerYear).toBe(r.revenuePerMonth * 12)
            expect(r.hoursPerWeek).toBeGreaterThan(0)
          }
        }
      }
    }
  })

  it('grows monotonically with team size', () => {
    let previousHours = 0
    let previousRevenue = 0
    for (const teamSize of TEAM_SIZES.map((t) => t.value)) {
      const r = estimateSavings({
        industry: 'construction',
        teamSize,
        bottleneck: 'slow-quoting',
        process: 'spreadsheets',
      })
      expect(r.hoursPerMonth).toBeGreaterThan(previousHours)
      expect(r.revenuePerMonth).toBeGreaterThan(previousRevenue)
      previousHours = r.hoursPerMonth
      previousRevenue = r.revenuePerMonth
    }
  })

  it('estimates least savings for already mostly-automated processes', () => {
    const base = { industry: 'specialty-trades', teamSize: '6-15', bottleneck: 'missed-calls' } as const
    const automated = estimateSavings({ ...base, process: 'mostly-automated' })
    for (const process of ['paper', 'spreadsheets', 'some-software'] as const) {
      const r = estimateSavings({ ...base, process })
      expect(r.hoursPerMonth).toBeGreaterThan(automated.hoursPerMonth)
      expect(r.revenuePerMonth).toBeGreaterThan(automated.revenuePerMonth)
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

  it('covers all 16 industries including service SMEs', () => {
    const serviceIndustries = ['marketing', 'legal', 'finance', 'hr', 'ecommerce', 'customer-support', 'recruitment', 'sales'] as const
    for (const industry of serviceIndustries) {
      const r = estimateSavings({ industry, teamSize: '6-15', bottleneck: 'slow-quoting', process: 'spreadsheets' })
      expect(r.revenuePerYear).toBeGreaterThan(0)
    }
  })

  it('revenue estimate is higher for higher-value industries', () => {
    const legal = estimateSavings({ industry: 'legal', teamSize: '6-15', bottleneck: 'slow-quoting', process: 'paper' })
    const cleaning = estimateSavings({ industry: 'cleaning', teamSize: '6-15', bottleneck: 'slow-quoting', process: 'paper' })
    expect(legal.revenuePerYear).toBeGreaterThan(cleaning.revenuePerYear)
  })
})
