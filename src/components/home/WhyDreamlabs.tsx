import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
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

/**
 * Flowing S-curve in normalised 0–1 space.
 * preserveAspectRatio="none" stretches it to fill the container,
 * vectorEffect="non-scaling-stroke" keeps the stroke width in screen pixels.
 */
const PATH =
  'M 0.5,0 C 0.5,0.08 0.88,0.16 0.88,0.26 C 0.88,0.36 0.12,0.44 0.12,0.54 C 0.12,0.64 0.88,0.72 0.88,0.82 C 0.88,0.92 0.5,1 0.5,1'

/** Section 4 — trust builders with scroll-driven SVG journey line. */
export const WhyDreamlabs = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Slight spring follow so the line feels organic rather than mechanical
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  return (
    <Section surface="workshop">
      <Reveal>
        <SectionHeading
          eyebrow="Why Dreamlabs"
          title="Built to be the safest decision you make this year"
          surface="light"
        />
      </Reveal>

      <div ref={containerRef} className="relative mt-12">
        {/* Journey line — sits behind cards, hidden for reduced-motion */}
        <svg
          className="motion-safe:block pointer-events-none absolute inset-0 hidden h-full w-full motion-reduce:hidden"
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          aria-hidden
        >
          {/* Ghost route — full path at low opacity */}
          <path
            d={PATH}
            fill="none"
            stroke="#8B32FF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.12"
            vectorEffect="non-scaling-stroke"
          />
          {/* Drawn line — animates with scroll */}
          <motion.path
            d={PATH}
            fill="none"
            stroke="#8B32FF"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength }}
          />
        </svg>

        {/* Cards sit on top of the line */}
        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </Section>
  )
}
