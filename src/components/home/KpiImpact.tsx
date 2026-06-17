import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { TypingText } from '@/components/ui/TypingText'
import { DrawUnderline } from '@/components/ui/DrawUnderline'
import { KpiMetric } from '@/components/home/KpiMetric'
import type { KpiMetricData } from '@/components/home/KpiMetric'

const DOWN_METRICS: KpiMetricData[] = [
  {
    label: 'Churn & drop-off rates',
    sublabel: 'Clients stay longer when they know what is happening',
    value: 34,
    suffix: '%',
    direction: 'down',
  },
  {
    label: 'Customer acquisition cost',
    sublabel: 'Faster quoting and follow-up wins more work for less effort',
    value: 28,
    suffix: '%',
    direction: 'down',
  },
  {
    label: 'Operational friction',
    sublabel: 'DSO · TTQ · quote-to-order drop-off',
    value: 41,
    suffix: '%',
    direction: 'down',
  },
  {
    label: 'Labour & admin overhead',
    sublabel: 'The unbillable hours costing your team time and money',
    value: 18,
    suffix: ' hrs/wk',
    direction: 'down',
  },
  {
    label: 'Resource waste',
    sublabel: 'Training costs · schedule variance · unnecessary spend',
    value: 31,
    suffix: '%',
    direction: 'down',
  },
]

const UP_METRICS: KpiMetricData[] = [
  {
    label: 'Sales & revenue',
    sublabel: 'First-time fix rates · average order value · team effectiveness',
    value: 37,
    suffix: '%',
    direction: 'up',
  },
  {
    label: 'Leads & conversions',
    sublabel: 'More qualified work booked with less chasing',
    value: 2.4,
    suffix: '×',
    direction: 'up',
  },
  {
    label: 'Customer lifetime value & retention',
    sublabel: 'Clients come back, refer others, and stay longer',
    value: 43,
    suffix: '%',
    direction: 'up',
  },
  {
    label: 'Return on investment',
    sublabel: 'Average return across our client base in year one',
    value: 3.8,
    suffix: '×',
    direction: 'up',
  },
  {
    label: 'Your free time',
    sublabel: 'A scalable business should let you live your life, not just run it',
    value: 8,
    suffix: ' hrs/wk',
    direction: 'up',
  },
]

/**
 * Section 4 — KPI impact split.
 *
 * Uses a flat 4-cell CSS grid (2 cols × 2 rows) so headings share a row and
 * both metric lists always start at the same vertical position.
 *
 * useInView is on the container div (which has real dimensions) and passed as
 * a trigger to TypingText — the headings are initially empty spans so their
 * own bounding boxes are zero-size, making IntersectionObserver unreliable.
 */
export const KpiImpact = () => {
  const gridRef = useRef<HTMLDivElement>(null)
  const inView = useInView(gridRef, { once: true, margin: '-5%' })

  return (
    <Section surface="dream">
      <div ref={gridRef} className="grid gap-x-20 gap-y-8 lg:grid-cols-2">
        {/* Row 1 — headings */}
        <h3 className="font-heading text-2xl font-bold text-offwhite md:text-[1.75rem] leading-snug">
          <TypingText
            text="In simple terms, we make these go down"
            trigger={inView}
          />
        </h3>

        <h3 className="font-heading text-2xl font-bold text-offwhite md:text-[1.75rem] leading-snug">
          <TypingText
            text="And we make these go up"
            trigger={inView}
            charDelay={60}
          />
        </h3>

        {/* Row 2 — metric lists, always aligned to the same row */}
        <div className="divide-y divide-offwhite/10">
          {DOWN_METRICS.map((m) => (
            <KpiMetric key={m.label} {...m} />
          ))}
        </div>

        <div className="divide-y divide-offwhite/10">
          {UP_METRICS.map((m) => (
            <KpiMetric key={m.label} {...m} />
          ))}
        </div>
      </div>

      {/* Closing statement */}
      <Reveal className="mt-16 text-center">
        <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-offwhite/80 md:text-xl">
          All of which lead to{' '}
          <DrawUnderline className="font-semibold text-offwhite">
            increasing your revenue
          </DrawUnderline>{' '}
          and help you scale, whilst making your life easier and giving you back your time.
        </p>
      </Reveal>
    </Section>
  )
}
