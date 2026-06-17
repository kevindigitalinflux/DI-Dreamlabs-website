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
]

/** Section 4 — KPI impact split: what we make go down vs up (Brief §7). */
export const KpiImpact = () => (
  <Section surface="dream">
    <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
      {/* Going down */}
      <div>
        <h3 className="relative font-heading text-2xl font-bold text-offwhite md:text-[1.75rem] leading-snug">
          {/* Invisible placeholder reserves height so layout doesn't jump during typing */}
          <span className="invisible select-none" aria-hidden>
            In simple terms, we make these go down
          </span>
          <span className="absolute inset-0">
            <TypingText text="In simple terms, we make these go down" />
          </span>
        </h3>
        <div className="mt-6 divide-y divide-offwhite/10">
          {DOWN_METRICS.map((m) => (
            <KpiMetric key={m.label} {...m} />
          ))}
        </div>
      </div>

      {/* Going up */}
      <div>
        <h3 className="relative font-heading text-2xl font-bold text-offwhite md:text-[1.75rem] leading-snug">
          <span className="invisible select-none" aria-hidden>
            And we make these go up
          </span>
          <span className="absolute inset-0">
            <TypingText text="And we make these go up" charDelay={60} />
          </span>
        </h3>
        <div className="mt-6 divide-y divide-offwhite/10">
          {UP_METRICS.map((m) => (
            <KpiMetric key={m.label} {...m} />
          ))}
        </div>
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
