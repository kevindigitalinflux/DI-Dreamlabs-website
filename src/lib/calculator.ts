/**
 * Bottleneck/ROI calculator logic (Brief §10). A transparent lookup model —
 * deliberately simple and explainable.
 *
 * Time estimate:  base hours lost/month × team-size multiplier × process multiplier.
 * Revenue estimate: industry revenue-per-employee × team midpoint × bottleneck revenue
 *   risk % × process multiplier. Both are broad averages; the free audit replaces them
 *   with the client's real numbers.
 */

export const INDUSTRIES = [
  // Physical-world SMEs
  { value: 'cleaning',            label: 'Cleaning',            revenuePerEmployee: 25000 },
  { value: 'facilities',          label: 'Facilities',          revenuePerEmployee: 35000 },
  { value: 'maintenance',         label: 'Maintenance',         revenuePerEmployee: 30000 },
  { value: 'construction',        label: 'Construction',        revenuePerEmployee: 45000 },
  { value: 'specialty-trades',    label: 'Specialty Trades',    revenuePerEmployee: 40000 },
  { value: 'logistics',           label: 'Logistics',           revenuePerEmployee: 30000 },
  { value: 'field-services',      label: 'Field Services',      revenuePerEmployee: 35000 },
  { value: 'general-contracting', label: 'General Contracting', revenuePerEmployee: 50000 },
  // Service SMEs
  { value: 'marketing',           label: 'Marketing',           revenuePerEmployee: 50000 },
  { value: 'legal',               label: 'Legal',               revenuePerEmployee: 80000 },
  { value: 'finance',             label: 'Finance',             revenuePerEmployee: 70000 },
  { value: 'hr',                  label: 'HR',                  revenuePerEmployee: 45000 },
  { value: 'ecommerce',           label: 'E-commerce',          revenuePerEmployee: 35000 },
  { value: 'customer-support',    label: 'Customer Support',    revenuePerEmployee: 25000 },
  { value: 'recruitment',         label: 'Recruitment',         revenuePerEmployee: 55000 },
  { value: 'sales',               label: 'Sales',               revenuePerEmployee: 60000 },
] as const

export const TEAM_SIZES = [
  { value: '1-5',   label: '1–5 people',    multiplier: 0.6, midpoint: 3   },
  { value: '6-15',  label: '6–15 people',   multiplier: 1,   midpoint: 10  },
  { value: '16-40', label: '16–40 people',  multiplier: 2,   midpoint: 25  },
  { value: '41-80', label: '41–80 people',  multiplier: 3.2, midpoint: 55  },
  { value: '80+',   label: 'More than 80',  multiplier: 4.5, midpoint: 100 },
] as const

export const BOTTLENECKS = [
  { value: 'missed-calls',    label: 'Missed calls and lost leads',        baseHours: 14, revenueRiskPct: 0.15 },
  { value: 'scheduling',      label: 'Scheduling chaos and no-shows',      baseHours: 16, revenueRiskPct: 0.12 },
  { value: 'job-visibility',  label: 'No real-time project visibility',    baseHours: 12, revenueRiskPct: 0.10 },
  { value: 'slow-quoting',    label: 'Slow proposals and follow-up',       baseHours: 13, revenueRiskPct: 0.18 },
  { value: 'paper-admin',     label: 'Paper-based admin and double entry', baseHours: 18, revenueRiskPct: 0.08 },
  { value: 'stock-surprises', label: 'Capacity and resource gaps',         baseHours: 8,  revenueRiskPct: 0.06 },
] as const

export const PROCESSES = [
  { value: 'paper',            label: 'Mostly paper and phone calls',    multiplier: 1.3  },
  { value: 'spreadsheets',     label: 'Spreadsheets and email',          multiplier: 1.15 },
  { value: 'some-software',    label: 'Some software, lots of gaps',     multiplier: 1    },
  { value: 'mostly-automated', label: 'Mostly automated already',        multiplier: 0.5  },
] as const

/** Blended hourly cost of operational/admin time for a UK service SME. */
export const HOURLY_RATE_GBP = 22

export type Industry   = (typeof INDUSTRIES)[number]['value']
export type TeamSize   = (typeof TEAM_SIZES)[number]['value']
export type Bottleneck = (typeof BOTTLENECKS)[number]['value']
export type Process    = (typeof PROCESSES)[number]['value']

export type CalculatorAnswers = {
  industry:   Industry
  teamSize:   TeamSize
  bottleneck: Bottleneck
  process:    Process
}

export type SavingsEstimate = {
  hoursPerMonth:    number
  hoursPerWeek:     number
  poundsPerMonth:   number  // cost of operational time lost
  revenuePerMonth:  number  // revenue at risk from this bottleneck
  revenuePerYear:   number
  confidence: 'low' | 'typical' | 'high'
}

/**
 * Estimates the monthly productivity loss and revenue at risk for the given
 * bottleneck. Both figures are broad averages derived from published SME data;
 * the free audit replaces them with the client's real numbers.
 */
export const estimateSavings = (answers: CalculatorAnswers): SavingsEstimate => {
  const industry  = INDUSTRIES.find((i) => i.value === answers.industry)
  const teamSize  = TEAM_SIZES.find((t) => t.value === answers.teamSize)
  const bottleneck = BOTTLENECKS.find((b) => b.value === answers.bottleneck)
  const process   = PROCESSES.find((p) => p.value === answers.process)

  if (!industry || !teamSize || !bottleneck || !process) {
    throw new Error('Invalid calculator answers')
  }

  const hoursPerMonth = Math.max(
    1,
    Math.round(bottleneck.baseHours * teamSize.multiplier * process.multiplier),
  )
  const hoursPerWeek    = Math.max(1, Math.round(hoursPerMonth / 4))
  const poundsPerMonth  = hoursPerMonth * HOURLY_RATE_GBP

  const annualRevenue   = industry.revenuePerEmployee * teamSize.midpoint
  const revenuePerMonth = Math.round((annualRevenue * bottleneck.revenueRiskPct * process.multiplier) / 12)
  const revenuePerYear  = revenuePerMonth * 12

  const confidence: SavingsEstimate['confidence'] =
    hoursPerMonth < 10 ? 'low' : hoursPerMonth > 45 ? 'high' : 'typical'

  return { hoursPerMonth, hoursPerWeek, poundsPerMonth, revenuePerMonth, revenuePerYear, confidence }
}
