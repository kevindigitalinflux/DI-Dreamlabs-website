/**
 * Bottleneck/ROI calculator logic (Brief §10). A transparent lookup model —
 * deliberately simple and explainable: base hours lost per month for the
 * chosen bottleneck × team-size multiplier × current-process multiplier.
 * Money = hours × a blended £22/hr operational rate. v1 is client-side only.
 */

export const INDUSTRIES = [
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'construction', label: 'Construction' },
  { value: 'trades', label: 'Trades' },
  { value: 'logistics', label: 'Logistics' },
] as const

export const TEAM_SIZES = [
  { value: '1-5', label: '1–5 people', multiplier: 0.6 },
  { value: '6-15', label: '6–15 people', multiplier: 1 },
  { value: '16-40', label: '16–40 people', multiplier: 2 },
  { value: '41-80', label: '41–80 people', multiplier: 3.2 },
  { value: '80+', label: 'More than 80', multiplier: 4.5 },
] as const

export const BOTTLENECKS = [
  { value: 'missed-calls', label: 'Missed calls and lost leads', baseHours: 14 },
  { value: 'scheduling', label: 'Manual scheduling and rotas', baseHours: 16 },
  { value: 'job-visibility', label: 'No real-time job visibility', baseHours: 12 },
  { value: 'slow-quoting', label: 'Slow quoting and follow-up', baseHours: 13 },
  { value: 'paper-admin', label: 'Paper-based admin and double entry', baseHours: 18 },
  { value: 'stock-surprises', label: 'Stock and supplies surprises', baseHours: 8 },
] as const

export const PROCESSES = [
  { value: 'paper', label: 'Mostly paper and phone calls', multiplier: 1.3 },
  { value: 'spreadsheets', label: 'Spreadsheets and email', multiplier: 1.15 },
  { value: 'some-software', label: 'Some software, lots of gaps', multiplier: 1 },
  { value: 'mostly-automated', label: 'Mostly automated already', multiplier: 0.5 },
] as const

/** Blended hourly cost of operational/admin time for a UK service SME. */
export const HOURLY_RATE_GBP = 22

export type Industry = (typeof INDUSTRIES)[number]['value']
export type TeamSize = (typeof TEAM_SIZES)[number]['value']
export type Bottleneck = (typeof BOTTLENECKS)[number]['value']
export type Process = (typeof PROCESSES)[number]['value']

export type CalculatorAnswers = {
  industry: Industry
  teamSize: TeamSize
  bottleneck: Bottleneck
  process: Process
}

export type SavingsEstimate = {
  hoursPerMonth: number
  poundsPerMonth: number
  confidence: 'low' | 'typical' | 'high'
}

/** Estimates monthly hours and money recoverable from the chosen bottleneck. */
export const estimateSavings = (answers: CalculatorAnswers): SavingsEstimate => {
  const teamSize = TEAM_SIZES.find((t) => t.value === answers.teamSize)
  const bottleneck = BOTTLENECKS.find((b) => b.value === answers.bottleneck)
  const process = PROCESSES.find((p) => p.value === answers.process)
  if (!teamSize || !bottleneck || !process) {
    throw new Error('Invalid calculator answers')
  }

  const hoursPerMonth = Math.max(
    1,
    Math.round(bottleneck.baseHours * teamSize.multiplier * process.multiplier),
  )
  const poundsPerMonth = hoursPerMonth * HOURLY_RATE_GBP
  const confidence: SavingsEstimate['confidence'] =
    hoursPerMonth < 10 ? 'low' : hoursPerMonth > 45 ? 'high' : 'typical'

  return { hoursPerMonth, poundsPerMonth, confidence }
}
