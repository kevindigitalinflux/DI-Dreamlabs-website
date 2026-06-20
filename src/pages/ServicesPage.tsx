import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
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
  { icon: AuditIcon, label: 'Free audit',    detail: 'A week or less, no cost'    },
  { icon: BuildIcon, label: 'Build & pilot', detail: '2–8 weeks on real work'     },
  { icon: OwnIcon,   label: 'Own & scale',   detail: 'Yours outright, forever'    },
] as const

/**
 * Three-step journey with a scroll-driven horizontal connector line —
 * exact same technique as the Method section's vertical line, rotated 90°:
 * scaleX from origin-left instead of scaleY from origin-top.
 */
const EngagementSection = () => {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <Section surface="dream">
      <Reveal>
        <SectionHeading
          eyebrow="The engagement"
          title="How an engagement actually runs"
          surface="dark"
        />
      </Reveal>

      <div ref={ref} className="relative mx-auto mt-10 max-w-3xl">
        {/* Faint track — same as the grey underlay in Method */}
        <div className="absolute inset-x-5 top-7 hidden h-px bg-offwhite/15 sm:block" aria-hidden />
        {/* Animated violet line — scaleX from origin-left, mirrors Method's scaleY from origin-top */}
        <motion.div
          className="absolute inset-x-5 top-7 hidden h-px origin-left bg-violet-ray sm:block"
          style={{ scaleX: reduceMotion ? 1 : scaleX }}
          aria-hidden
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, label, detail }, i) => (
            <Reveal key={label} delay={i * 80} className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-offwhite/10 text-cyan-strong ring-1 ring-offwhite/20">
                <Icon className="h-7 w-7" aria-hidden />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-offwhite">{label}</h3>
              <p className="mt-1 font-body text-sm text-offwhite/65">{detail}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mt-12 text-center">
        <Button variant="primary" href="/contact">
          Start with the free audit
        </Button>
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
      jsonLd={[breadcrumbs(['Services', '/services'])]}
    />
    <PageHero
      eyebrow="Services"
      title="Three ways to get your unfair advantage"
      lede="Whichever door you come in through, the result is the same: a working system, built for your business, owned by you outright."
      background={<BubblePitBackground />}
    />

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
            <h3 className="font-heading text-lg font-semibold text-navy-deep">
              A real example of the shape of it
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-navy-deep/80">
              A cleaning company kept losing evening enquiries to voicemail. We built an
              AI-powered assistant that answers every call, gives a quote from their own price
              list, and books the job straight into their schedule. The owner sees every booking
              on one screen, and owns the whole thing.
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy-deep/80">
              That is the pattern: one painful, expensive gap, closed by a product designed
              around how you already work.
            </p>
          </Card>
        </Reveal>
      </div>
      <Reveal className="mt-8">
        <div className="group relative mx-auto max-w-2xl overflow-hidden rounded-card border border-violet-ray/30 bg-white shadow-card transition-colors duration-300 hover:border-violet-ray/70">
          <div className="aspect-[4/3]">
            <img
              src="/images/industries/cleaning.png"
              alt="Cleaning business — the kind of operation our AI product engineering serves"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-violet-ray/10 to-transparent" />
        </div>
      </Reveal>
    </Section>

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
            <h3 className="font-heading text-lg font-semibold text-offwhite">
              A real example of the shape of it
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-offwhite/80">
              A maintenance firm's engineers wrote job sheets on paper; the office typed them up,
              invoiced from them, and chased the gaps. We replaced the loop with a simple app:
              engineers tap through the job on site, invoices generate themselves, and the office
              dashboard shows every job live.
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-offwhite/80">
              Eleven hours of typing a week, gone, and the system belongs to them, not to us.
            </p>
          </Card>
        </Reveal>
      </div>
      <Reveal className="mt-8">
        <div className="group relative mx-auto max-w-2xl overflow-hidden rounded-card border border-cyan-strong/30 bg-offwhite/95 shadow-card transition-colors duration-300 hover:border-cyan-strong/70">
          <div className="aspect-[4/3]">
            <img
              src="/images/industries/maintenance.png"
              alt="Maintenance firm — the kind of operation our automated systems serve"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-cyan-strong/10 to-transparent" />
        </div>
      </Reveal>
    </Section>

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
            <h3 className="font-heading text-lg font-semibold text-navy-deep">
              A real example of the shape of it
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-navy-deep/80">
              A trades training company had years of course content and no way to deliver it
              digitally. We ran discovery with their top customers, designed a learning platform
              around how people actually consume content on site, and built and deployed it in
              eight weeks. They now sell memberships, not day rates.
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy-deep/80">
              That is the pattern: a valuable idea, shaped by real user research, built into a
              product that earns from day one, and owned outright by the business.
            </p>
          </Card>
        </Reveal>
      </div>
      <Reveal className="mt-8">
        <div className="group relative mx-auto max-w-2xl overflow-hidden rounded-card border border-magenta-bloom/30 bg-white shadow-card transition-colors duration-300 hover:border-magenta-bloom/70">
          <div className="aspect-[4/3]">
            <img
              src="/images/industries/specialty-trades.png"
              alt="Trades business — the kind of operation our product development serves"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-magenta-bloom/10 to-transparent" />
        </div>
      </Reveal>
    </Section>

    <EngagementSection />
  </>
)

/** React Router lazy-route entry. */
export const Component = ServicesPage
