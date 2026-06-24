import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MetricStat, type MetricEntry } from '@/components/ui/MetricStat'
import { AuditIcon, BuildIcon, FlaskIcon, LayersIcon, OwnIcon } from '@/components/icons'
import { BubblePitBackground } from '@/components/interactive/atmosphere/BubblePitBackground'
import { Seo, breadcrumbs } from '@/lib/Seo'

const ENGINEERING_DELIVERABLES = [
  'A free audit that maps where AI genuinely earns its keep in your business',
  'Product design built around your team, not a template',
  'End-to-end engineering and deployment, we ship it, not a spec for it',
  'Training and handover so your team runs it with confidence',
] as const

const AUTOMATION_DELIVERABLES = [
  'The bottleneck costing you the most, identified and measured',
  'A custom automated system that removes it',
  'A bespoke app to run or monitor the system, clear enough for anyone on the team',
  'Connections to the software you already use, so nothing gets ripped out',
] as const

const PRODUCT_DEV_DELIVERABLES = [
  'Discovery and UX research to define exactly what to build and for whom',
  'Wireframes and prototypes tested with real users before a line of code is written',
  'Full product design: every screen, interaction, and edge case considered',
  'Full-stack engineering and deployment, we ship the product, not a spec for it',
  'Handover with documentation so your team can run and extend it independently',
] as const

const STEPS = [
  { icon: AuditIcon, label: 'Free audit',    detail: 'A week or less, no cost'  },
  { icon: BuildIcon, label: 'Build & pilot', detail: '2–8 weeks on real work'   },
  { icon: OwnIcon,   label: 'Own & scale',   detail: 'Yours outright, forever'  },
] as const

const P1_METRICS: MetricEntry[] = [
  { value: 3,  suffix: '×',               label: 'Bookings captured',  direction: 'up'   },
  { value: 94, prefix: '-', suffix: '%',  label: 'Missed enquiries',   direction: 'down' },
  { value: 28, prefix: '+', suffix: '%',  label: 'Monthly revenue',    direction: 'up'   },
  { value: 7,  prefix: '-', suffix: 'h',  label: 'Admin per week',     direction: 'down' },
]

const P2_METRICS: MetricEntry[] = [
  { value: 100, prefix: '+', suffix: '%', label: 'Same-day invoicing',   direction: 'up'   },
  { value: 11,  prefix: '-', suffix: 'h', label: 'Admin hours per week', direction: 'down' },
  { value: 3,   prefix: '+', suffix: '×', label: 'Cash flow speed',      direction: 'up'   },
  { value: 98,  prefix: '-', suffix: '%', label: 'Invoice errors',        direction: 'down' },
]

const P3_METRICS: MetricEntry[] = [
  { value: 220, prefix: '+', suffix: '%', label: 'Monthly revenue',    direction: 'up'   },
  { value: 78,  prefix: '-', suffix: '%', label: 'Delivery cost',      direction: 'down' },
  { value: 15,  suffix: '×',              label: 'Student reach',       direction: 'up'   },
  { value: 100, prefix: '-', suffix: '%', label: 'Day rate reliance',   direction: 'down' },
]

const METRICS_NOTE = '* Based on general industry research. Figures are illustrative and not a guarantee of results.'

/** Scroll-parallax image frame with the Industries-section violet colour grade. */
const PillarImage = ({ src, alt, borderClass, hoverBorderClass }: {
  src: string
  alt: string
  borderClass: string
  hoverBorderClass: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <Reveal className="mt-8">
      <div
        ref={ref}
        className={`group relative mx-auto max-w-2xl overflow-hidden rounded-card border ${borderClass} shadow-card transition-colors duration-300 ${hoverBorderClass}`}
      >
        <div className="aspect-[4/3] overflow-hidden">
          <motion.img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            style={{ scale: 1.15, y: reduceMotion ? 0 : y }}
          />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-navy-deep/90 via-navy-deep/60 to-violet-ray/50 mix-blend-multiply" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-navy-deep via-transparent to-transparent" />
      </div>
    </Reveal>
  )
}

/**
 * Three-step journey with a scroll-driven horizontal connector line,
 * exact same technique as the Method section vertical line, rotated 90°:
 * scaleX from origin-left instead of scaleY from origin-top.
 */
const EngagementSection = () => {
  const lineRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ['start 75%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <Section surface="dream">
      <Reveal>
        <SectionHeading eyebrow="The engagement" title="How an engagement actually runs" surface="dark" />
      </Reveal>
      <div ref={lineRef} className="relative mx-auto mt-14 max-w-2xl">
        {/* Vertical connecting line — same animation as The Dreamlabs Method */}
        <div className="absolute bottom-5 left-[1.4rem] top-5 w-px bg-offwhite/10" aria-hidden />
        <motion.div
          className="absolute bottom-5 left-[1.4rem] top-5 w-px origin-top bg-violet-ray"
          style={{ scaleY: reduceMotion ? 1 : scaleY }}
          aria-hidden
        />
        <ol className="space-y-10">
          {STEPS.map(({ icon: Icon, label, detail }, i) => (
            <li key={label}>
              <Reveal delay={i * 80} className="flex gap-6">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-deep text-cyan-strong ring-1 ring-offwhite/20 shadow-card">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="pt-1">
                  <h3 className="font-heading text-lg font-semibold text-offwhite md:text-[1.375rem]">{label}</h3>
                  <p className="mt-1.5 font-body text-base leading-relaxed text-offwhite/65">{detail}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      <Reveal className="mt-14 text-center">
        <Button variant="primary" href="/contact">Start with the free audit</Button>
      </Reveal>
    </Section>
  )
}

/** Deep dive on the three service pillars (Brief §5). */
export const ServicesPage = () => (
  <>
    <Seo
      title="Services: AI Product Engineering, Automated Systems & Product Development"
      description="Three service pillars: AI product engineering, custom automated systems, and end-to-end product development. Built for blue-collar and service SMEs across the UK, free audit, you own everything we build."
      path="/services"
      jsonLd={[
        breadcrumbs(['Services', '/services']),
        {
          '@type': 'Service',
          name: 'AI Product Engineering',
          description:
            'End-to-end AI product design and engineering for blue-collar and service SMEs. Free audit, 2–8 week build, client owns all code and accounts from day one.',
          provider: { '@type': 'Organization', name: 'Digital Influx Dreamlabs Ltd', url: 'https://didreamlabs.com' },
          areaServed: 'GB',
          url: 'https://didreamlabs.com/services#ai-engineering',
        },
        {
          '@type': 'Service',
          name: 'Automated Systems',
          description:
            'Custom automation that removes the single operational bottleneck costing an SME the most — invoicing, scheduling, reporting, or comms — connected to existing tools.',
          provider: { '@type': 'Organization', name: 'Digital Influx Dreamlabs Ltd', url: 'https://didreamlabs.com' },
          areaServed: 'GB',
          url: 'https://didreamlabs.com/services#automated-systems',
        },
        {
          '@type': 'Service',
          name: 'Product Development',
          description:
            'Full-cycle digital product development: discovery, UX research, design, full-stack engineering, and handover. For SMEs launching a product or internal tool.',
          provider: { '@type': 'Organization', name: 'Digital Influx Dreamlabs Ltd', url: 'https://didreamlabs.com' },
          areaServed: 'GB',
          url: 'https://didreamlabs.com/services#product-development',
        },
      ]}
    />
    <PageHero
      eyebrow="Services"
      title="Three ways to get your unfair advantage"
      lede="Whichever door you come in through, the result is the same: a working system, built for your business, owned by you outright."
      background={<BubblePitBackground />}
    />

    {/* Pillar 1 — AI Product Engineering */}
    <Section surface="workshop">
      <Reveal>
        <SectionHeading
          eyebrow="Pillar one"
          title="AI Product Engineering"
          lede="For when you know there's a better way to run your business, you just need someone to build it."
          surface="light"
          align="left"
        />
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Reveal>
          <Card surface="light" className="h-full">
            <FlaskIcon className="h-8 w-8 text-violet-ray" aria-hidden />
            <h3 className="mt-4 font-heading text-lg font-semibold text-navy-deep">What you get</h3>
            <ul className="mt-3 space-y-2">
              {ENGINEERING_DELIVERABLES.map((item) => (
                <li key={item} className="flex gap-2 font-body text-sm leading-relaxed text-navy-deep/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-ray" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
        <Reveal delay={100}>
          <Card surface="light" className="h-full">
            <h3 className="font-heading text-lg font-semibold text-navy-deep">What this looks like in practice</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-navy-deep/80">
              Imagine a cleaning company losing evening enquiries to voicemail. An AI-powered
              assistant could answer every call, give a quote from the business's own price list,
              and book the job straight into their schedule. The owner sees every booking on one
              screen, and owns the whole thing outright.
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy-deep/80">
              That is the pattern: one painful, expensive gap, closed by a product designed
              around how you already work.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-navy-deep/10 pt-4">
              {P1_METRICS.map((m) => <MetricStat key={m.label} {...m} surface="light" />)}
            </div>
            <p className="mt-3 font-body text-xs italic text-navy-deep/40">{METRICS_NOTE}</p>
          </Card>
        </Reveal>
      </div>
      <PillarImage
        src="/images/services/automated-booking-system.png"
        alt="AI-powered booking system, the kind of product our AI engineering builds"
        borderClass="border-violet-ray/30"
        hoverBorderClass="hover:border-violet-ray/70"
      />
    </Section>

    {/* Pillar 2 — Automated Systems */}
    <Section surface="dream">
      <Reveal>
        <SectionHeading
          eyebrow="Pillar two"
          title="Automated Systems"
          lede="For when the work gets done, but the admin around it eats your week."
          surface="dark"
          align="left"
        />
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Reveal>
          <Card surface="dark" className="h-full">
            <BuildIcon className="h-8 w-8 text-cyan-strong" aria-hidden />
            <h3 className="mt-4 font-heading text-lg font-semibold text-offwhite">What you get</h3>
            <ul className="mt-3 space-y-2">
              {AUTOMATION_DELIVERABLES.map((item) => (
                <li key={item} className="flex gap-2 font-body text-sm leading-relaxed text-offwhite/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-strong" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
        <Reveal delay={100}>
          <Card surface="dark" className="h-full">
            <h3 className="font-heading text-lg font-semibold text-offwhite">What this looks like in practice</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-offwhite/80">
              Picture a maintenance firm where engineers write job sheets on paper, the office
              types them up, invoices from them, and chases the gaps. A custom app changes all
              of that: engineers tap through the job on site, invoices generate themselves, and
              the office dashboard shows every job live.
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-offwhite/80">
              Eleven hours of typing a week, gone, and the system belongs to the business,
              not to the agency.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-offwhite/10 pt-4">
              {P2_METRICS.map((m) => <MetricStat key={m.label} {...m} surface="dark" />)}
            </div>
            <p className="mt-3 font-body text-xs italic text-offwhite/35">{METRICS_NOTE}</p>
          </Card>
        </Reveal>
      </div>
      <PillarImage
        src="/images/services/invoice-automation.png"
        alt="Invoice automation system, the kind of automated system we build"
        borderClass="border-cyan-strong/30"
        hoverBorderClass="hover:border-cyan-strong/70"
      />
    </Section>

    {/* Pillar 3 — End-to-End Product Development */}
    <Section surface="workshop">
      <Reveal>
        <SectionHeading
          eyebrow="Pillar three"
          title="End-to-End Product Development"
          lede="For when you have an idea, a vision, or a gap in the market, and need a team to take it from concept to a product your customers actually use."
          surface="light"
          align="left"
        />
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Reveal>
          <Card surface="light" className="h-full">
            <LayersIcon className="h-8 w-8 text-magenta-bloom" aria-hidden />
            <h3 className="mt-4 font-heading text-lg font-semibold text-navy-deep">What you get</h3>
            <ul className="mt-3 space-y-2">
              {PRODUCT_DEV_DELIVERABLES.map((item) => (
                <li key={item} className="flex gap-2 font-body text-sm leading-relaxed text-navy-deep/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-magenta-bloom" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
        <Reveal delay={100}>
          <Card surface="light" className="h-full">
            <h3 className="font-heading text-lg font-semibold text-navy-deep">What this looks like in practice</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-navy-deep/80">
              Think of a trades training company with years of course content and no way to
              deliver it digitally. Discovery with their top customers shapes a learning platform
              around how people actually consume content on site, built and deployed in eight
              weeks. They sell memberships, not day rates.
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy-deep/80">
              That is the pattern: a valuable idea, shaped by real user research, built into a
              product that earns from day one, owned outright by the business.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-navy-deep/10 pt-4">
              {P3_METRICS.map((m) => <MetricStat key={m.label} {...m} surface="light" />)}
            </div>
            <p className="mt-3 font-body text-xs italic text-navy-deep/40">{METRICS_NOTE}</p>
          </Card>
        </Reveal>
      </div>
      <PillarImage
        src="/images/services/learning-platform.png"
        alt="Learning platform, the kind of product our end-to-end development builds"
        borderClass="border-magenta-bloom/30"
        hoverBorderClass="hover:border-magenta-bloom/70"
      />
    </Section>

    <EngagementSection />
  </>
)

/** React Router lazy-route entry. */
export const Component = ServicesPage
