import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import {
  DeliveryIcon,
  GuaranteeIcon,
  OwnIcon,
  PilotIcon,
  TeamIcon,
} from '@/components/icons'

const USPS = [
  {
    icon: OwnIcon,
    title: 'You own everything we build',
    body: 'Code, data, accounts, all yours outright. No licence fees, no lock-in, no hostage situations.',
  },
  {
    icon: GuaranteeIcon,
    title: 'Money-back guarantee',
    body: 'If the system does not deliver what we agreed, you get your money back. Simple as that.',
  },
  {
    icon: PilotIcon,
    title: 'Pilot before any retainer',
    body: 'Prove it on real work first. You only commit once you have seen it earn its keep.',
  },
  {
    icon: TeamIcon,
    title: 'Enterprise team, SME pricing',
    body: 'Our talent comes through the Digital Influx Academy pipeline, big-firm capability without big-firm overheads.',
  },
  {
    icon: DeliveryIcon,
    title: 'Delivered in 2–8 weeks',
    body: 'Working software in weeks, not a roadmap that ships next year.',
  },
] as const

/** Section 4 — trust builders (Brief §7). */
export const WhyDreamlabs = () => (
  <Section surface="workshop">
    <Reveal>
      <SectionHeading
        eyebrow="Why Dreamlabs"
        title="Built to be the safest decision you make this year"
        surface="light"
      />
    </Reveal>
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {USPS.map(({ icon: Icon, title, body }, i) => (
        <Reveal key={title} delay={i * 80}>
          <Card surface="light" className="h-full">
            <Icon className="h-8 w-8 text-violet-ray" aria-hidden />
            <h3 className="mt-4 font-heading text-lg font-semibold text-navy-deep">{title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/75">{body}</p>
          </Card>
        </Reveal>
      ))}
    </div>
  </Section>
)
