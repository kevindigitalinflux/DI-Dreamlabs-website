import { useState } from 'react'
import type { FormEvent } from 'react'
import type { CalculatorAnswers, SavingsEstimate } from '@/lib/calculator'
import { HOURLY_RATE_GBP } from '@/lib/calculator'
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
 * Result stage: teaser (hours) → name+email gate → full breakdown (£ + how we
 * estimate). While an error is showing, the cyan counters are swapped out so
 * Magenta and Cyan never sit together (Brief §2.2).
 */
export const CalculatorResult = ({ answers, estimate, onRestart }: CalculatorResultProps) => {
  const [unlocked, setUnlocked] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const result = await submitLead({
      name,
      email,
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
      {!error && (
        <div className="text-center">
          <p className="font-body text-base text-navy-deep/75">
            Businesses like yours typically lose around
          </p>
          <div className="mt-2">
            <StatCounter value={estimate.hoursPerMonth} suffix=" hours" />
          </div>
          <p className="mt-1 font-body text-base text-navy-deep/75">
            every month to this bottleneck.
          </p>
        </div>
      )}

      {!unlocked ? (
        <form onSubmit={handleUnlock} className="mx-auto mt-8 max-w-md" noValidate>
          <p className="text-center font-body text-base font-medium text-navy-deep">
            See the full breakdown: what that costs in pounds, and how we'd claw it back.
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
            {submitting ? 'Unlocking…' : 'Unlock my full breakdown'}
          </Button>
          <p className="mt-3 text-center font-body text-xs font-light text-navy-deep/60">
            No spam, no sales calls you didn't ask for. Just your numbers.
          </p>
        </form>
      ) : (
        <div className="mt-8 text-center">
          <p className="font-body text-base text-navy-deep/75">That's roughly</p>
          <div className="mt-2">
            <StatCounter value={estimate.poundsPerMonth} prefix="£" suffix=" / month" />
          </div>
          <p className="mx-auto mt-4 max-w-md font-body text-base leading-relaxed text-navy-deep/80">
            {estimate.confidence === 'high'
              ? 'A bottleneck this size usually pays for its own fix several times over in year one.'
              : estimate.confidence === 'low'
                ? 'A modest leak, but modest leaks compound. Worth a look while it is cheap to fix.'
                : 'Squarely in the range where an automated system pays for itself within months.'}
          </p>
          <details className="mx-auto mt-6 max-w-md rounded-card bg-white p-4 text-left shadow-card">
            <summary className="cursor-pointer font-body text-sm font-medium text-navy-deep">
              How we estimate this
            </summary>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/75">
              Typical hours lost to your chosen bottleneck, scaled by team size and how manual
              your current process is, priced at a blended £{HOURLY_RATE_GBP}/hour operational
              rate. The free audit replaces this estimate with your real numbers.
            </p>
          </details>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
