import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  BOTTLENECKS,
  INDUSTRIES,
  PROCESSES,
  TEAM_SIZES,
  estimateSavings,
} from '@/lib/calculator'
import type { CalculatorAnswers, Industry } from '@/lib/calculator'
import { CalculatorOptions } from './CalculatorOptions'
import { CalculatorResult } from './CalculatorResult'

type Draft = Partial<CalculatorAnswers>

const STEPS = [
  { key: 'industry', legend: 'What kind of business are you?', options: INDUSTRIES },
  { key: 'teamSize', legend: 'How big is the team?', options: TEAM_SIZES },
  { key: 'bottleneck', legend: 'What slows you down the most?', options: BOTTLENECKS },
  { key: 'process', legend: 'How does that job get done today?', options: PROCESSES },
] as const

type BottleneckCalculatorProps = {
  /** Pre-selects the industry (e.g. from /tools/bottleneck-check?industry=). */
  initialIndustry?: Industry
}

/** The Bottleneck Check wizard — 4 questions to an instant estimate (Brief §10). */
export const BottleneckCalculator = ({ initialIndustry }: BottleneckCalculatorProps) => {
  const [draft, setDraft] = useState<Draft>(initialIndustry ? { industry: initialIndustry } : {})
  const [stepIndex, setStepIndex] = useState(initialIndustry ? 1 : 0)
  const reduceMotion = useReducedMotion()

  const complete =
    draft.industry && draft.teamSize && draft.bottleneck && draft.process ? (draft as CalculatorAnswers) : null
  const estimate = useMemo(() => (complete ? estimateSavings(complete) : null), [complete])

  const step = STEPS[stepIndex]

  const select = (key: (typeof STEPS)[number]['key'], value: string) => {
    setDraft((d) => ({ ...d, [key]: value }))
    setStepIndex((i) => Math.min(i + 1, STEPS.length))
  }

  const restart = () => {
    setDraft({})
    setStepIndex(0)
  }

  return (
    <div className="rounded-card bg-offwhite p-6 shadow-card md:p-10">
      {/* Progress dots */}
      <div className="mb-8 flex items-center justify-center gap-2" aria-hidden>
        {STEPS.map((s, i) => (
          <span
            key={s.key}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < stepIndex ? 'w-2 bg-violet-ray' : i === stepIndex ? 'w-6 bg-violet-ray' : 'w-2 bg-navy-deep/15'
            }`}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {complete ? 'Your estimate is ready.' : `Question ${stepIndex + 1} of ${STEPS.length}`}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {step && !complete ? (
          <motion.div
            key={step.key}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <CalculatorOptions
              legend={step.legend}
              options={step.options}
              selected={(draft[step.key] as string | undefined) ?? null}
              onSelect={(value) => select(step.key, value)}
            />
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                className="mt-6 font-body text-sm font-medium text-rebecca underline-offset-2 hover:underline"
              >
                ← Back
              </button>
            )}
          </motion.div>
        ) : complete && estimate ? (
          <motion.div
            key="result"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <CalculatorResult answers={complete} estimate={estimate} onRestart={restart} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
