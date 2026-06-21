import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { POSITIONING_LINE } from '@/lib/config'
import { BubblePitBackground } from '@/components/interactive/atmosphere/BubblePitBackground'
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

/**
 * Per-letter fade-in, slide-up, and blur-to-clear animation triggered on scroll.
 * Screen readers see the full text via the sr-only sibling; the visual letters are aria-hidden.
 */
const LetterBlur = ({ text }: { text: string }) => {
  const reduceMotion = useReducedMotion()
  return (
    <div>
      <p className="sr-only">{text}</p>
      <p
        aria-hidden
        className="font-heading text-lg font-semibold text-navy-deep md:text-xl"
      >
        {text.split('').map((char, i) =>
          char === ' ' ? (
            <span key={i}>{' '}</span>
          ) : (
            <motion.span
              key={i}
              initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.5, delay: i * 0.018, ease: 'easeOut' }}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          )
        )}
      </p>
    </div>
  )
}

/** Parallax image frame — same scroll-driven technique as ServicesPage pillar images. */
const StoryImage = () => {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <Reveal>
      <div
        ref={ref}
        className="relative overflow-hidden rounded-card border border-violet-ray/30 shadow-card"
      >
        <div className="aspect-[3/4] overflow-hidden">
          <motion.img
            src="/images/services/end-to-end-product.jpg"
            alt="The Dreamlabs team at work"
            className="h-full w-full object-cover"
            style={{ scale: 1.15, y: reduceMotion ? 0 : y }}
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-navy-deep/80 via-navy-deep/50 to-violet-ray/40 mix-blend-multiply"
        />
      </div>
    </Reveal>
  )
}

/**
 * Scroll-driven pyramid formation.
 * All three cards start clustered at the centre of the layout, then spread:
 * the top card rises and grows, the two bottom cards fan out left and right.
 */
const PillarsPyramid = () => {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 35%'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18 })

  // Card 0 (top centre): rises up from the shared cluster below
  const y0     = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [130, 0])
  const scale0 = useTransform(smooth, [0, 1], reduceMotion ? [1, 1] : [0.8,  1])

  // Card 1 (bottom left): comes in from the right and above
  const x1     = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [120, 0])
  const y1     = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [-80,  0])
  const scale1 = useTransform(smooth, [0, 1], reduceMotion ? [1, 1] : [0.9,  1])

  // Card 2 (bottom right): mirror of Card 1
  const x2     = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [-120, 0])
  const y2     = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [-80,  0])
  const scale2 = useTransform(smooth, [0, 1], reduceMotion ? [1, 1] : [0.9,  1])

  const opacity = useTransform(smooth, [0, 0.3], [0, 1])

  return (
    <div ref={ref} className="overflow-x-hidden">
      <div className="flex flex-col items-center gap-6">
        {/* Apex card — grows and rises into place */}
        <motion.div
          style={{ y: y0, scale: scale0, opacity }}
          className="w-full max-w-sm"
        >
          <Card surface="light" className="ring-1 ring-violet-ray/40 shadow-card">
            <h3 className="font-heading text-xl font-semibold text-navy-deep">
              {PILLARS[0].name}
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/75">
              {PILLARS[0].detail}
            </p>
          </Card>
        </motion.div>

        {/* Base row — fan out from centre */}
        <div className="flex w-full gap-6">
          <motion.div style={{ x: x1, y: y1, scale: scale1, opacity }} className="flex-1">
            <Card surface="light" className="h-full">
              <h3 className="font-heading text-lg font-semibold text-navy-deep">
                {PILLARS[1].name}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/75">
                {PILLARS[1].detail}
              </p>
            </Card>
          </motion.div>
          <motion.div style={{ x: x2, y: y2, scale: scale2, opacity }} className="flex-1">
            <Card surface="light" className="h-full">
              <h3 className="font-heading text-lg font-semibold text-navy-deep">
                {PILLARS[2].name}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/75">
                {PILLARS[2].detail}
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

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
      background={<BubblePitBackground />}
    />

    <Section surface="workshop">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow="The story" title="Why we exist" surface="light" align="left" />
        </Reveal>
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <Reveal>
              <div className="space-y-5 font-body text-base leading-relaxed text-navy-deep/80 md:text-lg">
                <p>
                  Most AI agencies serve enterprise clients with enterprise budgets. Meanwhile, the
                  businesses that actually build and run the world, including cleaners, contractors,
                  logistics operators, marketing agencies, recruitment firms, and finance teams, get
                  left with off-the-shelf software that almost fits and agencies that never call back.
                </p>
                <p>
                  Digital Influx Dreamlabs Ltd was built to close that gap. We bring the same
                  capability as the big firms, at a price that makes sense for real businesses, and
                  we hand over the keys instead of renting them to you.
                </p>
              </div>
            </Reveal>
            <div className="mt-5">
              <LetterBlur text={POSITIONING_LINE} />
            </div>
          </div>
          <StoryImage />
        </div>
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
      <div className="mt-10">
        <PillarsPyramid />
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
