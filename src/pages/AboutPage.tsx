import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { POSITIONING_LINE } from '@/lib/config'
import { Seo, breadcrumbs } from '@/lib/Seo'

const PILLARS = [
  {
    name: 'Transformative',
    detail:
      'We turn bottlenecks into breakthroughs. Every engagement starts with a real problem and ends with a measurable result.',
  },
  {
    name: 'Accessible',
    detail:
      'Enterprise-grade capability at a human-scale price. We built the model specifically so pricing never has to be the barrier.',
  },
  {
    name: 'Inventive',
    detail:
      'We build for your specific problem, not a generic one. Every system is designed from the ground up.',
  },
] as const

/** Brand story, Academy pipeline, why Dreamlabs exists (Brief §5). */
export const AboutPage = () => (
  <>
    <Seo
      title="About: Why Dreamlabs Exists"
      description="Digital Influx Dreamlabs Ltd: an AI agency built for SMEs, powered by the Digital Influx Academy talent pipeline. Enterprise capability, human-scale pricing."
      path="/about"
      jsonLd={[breadcrumbs(['About', '/about'])]}
    />
    <PageHero
      eyebrow="About"
      title='"Dreamlabs" is not just a name. It is a promise.'
      lede="Our purpose is to make the dreams of SMEs and startups achievable, giving you access to the kind of technology that used to be reserved for companies ten times your size."
    />

    <Section surface="workshop">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow="The story" title="Why we exist" surface="light" align="left" />
        </Reveal>
        <Reveal>
          <div className="mt-6 space-y-5 font-body text-base leading-relaxed text-navy-deep/80 md:text-lg">
            <p>
              Most AI agencies serve enterprise clients with enterprise budgets. Meanwhile, the
              businesses that actually build and run the world — cleaners, contractors, logistics
              operators, marketing agencies, recruitment firms, finance teams — get left with
              off-the-shelf software that almost fits and agencies that never call back.
            </p>
            <p>
              Digital Influx Dreamlabs Ltd was built to close that gap. We bring the same
              capability as the big firms, at a price that makes sense for real businesses, and
              we hand over the keys instead of renting them to you.
            </p>
            <p className="font-heading text-lg font-semibold text-navy-deep md:text-xl">
              {POSITIONING_LINE}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>

    <Section surface="dream">
      <Reveal>
        <SectionHeading
          eyebrow="The talent engine"
          title="How we keep enterprise quality at SME pricing"
          lede="Dreamlabs is the sister company of Digital Influx Academy, our in-house talent pipeline. We do not source expensive external contractors; we develop our own engineers, designers and builders. That model is the whole trick: big-firm capability without big-firm overheads, and no compromise on quality to get there."
          surface="dark"
        />
      </Reveal>
    </Section>

    <Section surface="workshop">
      <Reveal>
        <SectionHeading eyebrow="What we stand on" title="Three pillars" surface="light" />
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PILLARS.map(({ name, detail }, i) => (
          <Reveal key={name} delay={i * 80}>
            <Card surface="light" className="h-full">
              <h3 className="font-heading text-lg font-semibold text-navy-deep">{name}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/75">{detail}</p>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-12 text-center">
        <Button variant="primary" href="/contact">
          Talk to us, the audit is free
        </Button>
      </Reveal>
    </Section>
  </>
)

/** React Router lazy-route entry. */
export const Component = AboutPage
