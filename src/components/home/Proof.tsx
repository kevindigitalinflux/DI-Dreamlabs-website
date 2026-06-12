import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'

/*
 * PLACEHOLDER: real case studies TBD. This section ships fully built but is
 * gated behind SHOW_PROOF in src/lib/config.ts — flip the flag once real
 * client results exist (spec §4). Structure per card: client type, problem →
 * result one-liner, headline metric.
 */
const CASE_STUDIES = [
  {
    clientType: 'Commercial cleaning company',
    summary: 'Missed-call chaos became a 24/7 booking assistant.',
    metric: '£0 jobs lost to voicemail in the pilot month',
  },
  {
    clientType: 'Regional maintenance firm',
    summary: 'Paper job sheets became a live operations dashboard.',
    metric: '11 admin hours back, every week',
  },
  {
    clientType: 'Logistics operator',
    summary: 'Manual stock checks became automated alerts.',
    metric: 'Zero out-of-stock surprises in 90 days',
  },
] as const

/** Section 7 — social proof. Hidden until real case studies exist. */
export const Proof = () => (
  <Section surface="workshop">
    <Reveal>
      <SectionHeading
        eyebrow="Results"
        title="What this looks like in the real world"
        surface="light"
      />
    </Reveal>
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {CASE_STUDIES.map(({ clientType, summary, metric }, i) => (
        <Reveal key={clientType} delay={i * 80}>
          <Card surface="light" className="h-full">
            <p className="font-heading text-sm font-semibold uppercase tracking-wider text-rebecca">
              {clientType}
            </p>
            <p className="mt-3 font-body text-base leading-relaxed text-navy-deep">{summary}</p>
            <p className="mt-4 font-heading text-lg font-bold text-navy-deep">{metric}</p>
          </Card>
        </Reveal>
      ))}
    </div>
  </Section>
)
