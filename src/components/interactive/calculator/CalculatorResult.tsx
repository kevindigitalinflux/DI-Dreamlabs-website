import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CalculatorAnswers, SavingsEstimate } from '@/lib/calculator'
import { HOURLY_RATE_GBP, INDUSTRIES } from '@/lib/calculator'
import { submitLead } from '@/lib/leads'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'
import { StatCounter } from '@/components/ui/StatCounter'

type CalculatorResultProps = {
  answers: CalculatorAnswers
  estimate: SavingsEstimate
  onRestart: () => void
}

/**
 * Result stage: teaser (hours/month) → name+email gate → full breakdown
 * (staff-time cost + revenue at risk, with broad-estimate disclaimer).
 * While an error is showing, cyan counters are hidden so Magenta and
 * Cyan never sit together (Brief §2.2).
 */
export const CalculatorResult = ({ answers, estimate, onRestart }: CalculatorResultProps) => {
  const [unlocked, setUnlocked] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const industryLabel = INDUSTRIES.find((i) => i.value === answers.industry)?.label ?? answers.industry

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (phone.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid phone number.')
      return
    }
    setSubmitting(true)
    const result = await submitLead({
      name,
      email,
      phone,
      industry: answers.industry,
      source: 'calculator',
      payload: { ...answers, ...estimate },
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setUnlocked(true)
  }

  return (
    <div aria-live="polite">
      {/* Teaser — always visible, shows hours to create urgency */}
      {!error && (
        <div className="text-center">
          <p className="font-body text-base text-navy-deep/75">
            {industryLabel} businesses your size typically lose around
          </p>
          <div className="mt-2">
            <StatCounter value={estimate.hoursPerMonth} suffix=" hrs/month" />
          </div>
          <p className="mt-1 font-body text-base text-navy-deep/75">
            to this bottleneck — that's roughly <strong>{estimate.hoursPerWeek} hrs every week.</strong>
          </p>
          <p className="mt-3 font-body text-sm font-medium text-navy-deep/60">
            Unlock your full revenue and cost breakdown below.
          </p>
        </div>
      )}

      {/* Gate form */}
      {!unlocked ? (
        <form onSubmit={handleUnlock} className="mx-auto mt-8 max-w-md" noValidate>
          <p className="text-center font-body text-base font-medium text-navy-deep">
            See what it's costing you in revenue and staff time — and how we'd fix it.
          </p>
          <div className="mt-5 grid gap-4">
            <Input
              label="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
            <Input
              label="Work email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              label="Phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              error={error ?? undefined}
              required
            />
            {/* Honeypot — hidden from humans, bots fill it */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />
          </div>
          <Button type="submit" variant="primary" disabled={submitting} className="mt-6 w-full">
            {submitting ? 'Unlocking…' : 'Show me the numbers'}
          </Button>
          <p className="mt-3 text-center font-body text-xs font-light text-navy-deep/60">
            No spam. No sales calls you didn't ask for. Just your numbers.
          </p>
        </form>
      ) : (
        <div className="mt-8 space-y-6">

          {/* Staff time cost */}
          <div className="rounded-card border border-navy-deep/10 bg-white p-5 text-center shadow-card">
            <p className="font-body text-sm font-semibold uppercase tracking-wider text-navy-deep/50">
              Staff time lost
            </p>
            <div className="mt-2 flex items-end justify-center gap-4">
              <div>
                <StatCounter value={estimate.hoursPerMonth} suffix=" hrs" />
                <p className="mt-0.5 font-body text-xs text-navy-deep/55">per month</p>
              </div>
              <div className="mb-1 h-8 w-px bg-navy-deep/10" aria-hidden />
              <div>
                <StatCounter value={estimate.poundsPerMonth} prefix="£" />
                <p className="mt-0.5 font-body text-xs text-navy-deep/55">in staff time / month</p>
              </div>
            </div>
          </div>

          {/* Revenue at risk — the bigger, more motivating number */}
          <div className="rounded-card border border-violet-ray/30 bg-navy-deep p-5 text-center shadow-glow-violet">
            <p className="font-body text-sm font-semibold uppercase tracking-wider text-offwhite/50">
              Revenue at risk
            </p>
            <div className="mt-2">
              <StatCounter value={estimate.revenuePerMonth} prefix="£" suffix="/month" />
            </div>
            <p className="mt-1 font-body text-base font-semibold text-offwhite">
              That's £{estimate.revenuePerYear.toLocaleString('en-GB')} per year
            </p>
            <p className="mx-auto mt-3 max-w-sm font-body text-sm leading-relaxed text-offwhite/65">
              {estimate.confidence === 'high'
                ? 'A bottleneck this size typically pays for its own fix several times over in year one.'
                : estimate.confidence === 'low'
                  ? 'A modest leak — but modest leaks compound quietly. Worth fixing while it is still cheap.'
                  : 'Squarely in the range where an automated fix pays for itself within a few months.'}
            </p>
          </div>

          {/* Broad-estimate disclaimer */}
          <p className="text-center font-body text-xs leading-relaxed text-navy-deep/50">
            These are broad estimates based on average revenue-per-employee for{' '}
            <strong className="font-medium text-navy-deep/70">{industryLabel}</strong>{' '}
            businesses your size, scaled for your bottleneck and how your processes run today.
            Your free audit replaces these averages with your real numbers.
          </p>

          {/* How we estimate — expandable */}
          <details className="mx-auto max-w-md rounded-card bg-white p-4 text-left shadow-card">
            <summary className="cursor-pointer font-body text-sm font-medium text-navy-deep">
              How we calculate this
            </summary>
            <div className="mt-3 space-y-2 font-body text-sm leading-relaxed text-navy-deep/75">
              <p>
                <strong className="font-medium">Time cost:</strong> a base hours-per-month figure for
                your bottleneck type, scaled by your team size and how manual your current process
                is, priced at a blended £{HOURLY_RATE_GBP}/hr operational rate.
              </p>
              <p>
                <strong className="font-medium">Revenue at risk:</strong> typical annual revenue for
                a {industryLabel.toLowerCase()} business your size, multiplied by the percentage of
                revenue that this particular bottleneck tends to suppress when left unfixed, adjusted
                for how automated your processes already are.
              </p>
              <p className="text-navy-deep/55">
                Both figures are broad averages drawn from published SME benchmarks. They are
                directionally correct, not precise forecasts. The free audit is where we get precise.
              </p>
            </div>
          </details>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button variant="primary" href="/contact">
              Book your free audit
            </Button>
            <button
              type="button"
              onClick={onRestart}
              className="font-body text-sm font-medium text-rebecca underline-offset-2 hover:underline"
            >
              Start again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
