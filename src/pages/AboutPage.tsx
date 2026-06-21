import { useRef, Fragment, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
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

const BEAM_BG =
  'conic-gradient(from var(--gradient-angle), transparent 0%, #8B32FF 38%, #C088FF 50%, transparent 62%)'

/** Card with the same rotating beam border as the LightBeamButton CTA. */
const BeamCard = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${className}`}
  >
    <div
      aria-hidden
      className="absolute inset-0"
      style={{ background: BEAM_BG, animation: 'border-spin 2.5s linear infinite' }}
    />
    <div className="absolute inset-[1.5px] rounded-card bg-white" />
    <div className="relative z-10 h-full p-6">{children}</div>
  </div>
)

/**
 * Per-letter fade-in, slide-up, blur-to-clear animation on scroll entry.
 * Characters are grouped by word (white-space: nowrap) so the browser can only
 * break lines at spaces — never mid-word.
 */
const LetterBlur = ({ text }: { text: string }) => {
  const reduceMotion = useReducedMotion()
  const words = text.split(' ')
  let pos = 0
  return (
    <div>
      <p className="sr-only">{text}</p>
      <p aria-hidden className="font-heading text-lg font-semibold text-navy-deep md:text-xl">
        {words.map((word, wi) => {
          const wordStart = pos
          pos += word.length + 1
          return (
            <Fragment key={wi}>
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                {word.split('').map((char, ci) => (
                  <motion.span
                    key={ci}
                    initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-5%' }}
                    transition={{ duration: 0.5, delay: (wordStart + ci) * 0.018, ease: 'easeOut' }}
                    style={{ display: 'inline-block' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              {wi < words.length - 1 && ' '}
            </Fragment>
          )
        })}
      </p>
    </div>
  )
}

/** Parallax image frame for the story section. */
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
            src="/images/about/story.png"
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
 * Scroll-driven pyramid formation: all three cards start clustered at the centre,
 * then spread — apex card rises and grows, base cards fan out left and right.
 */
const PillarsPyramid = () => {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'center 55%'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 18 })

  const y0     = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [130,  0])
  const scale0 = useTransform(smooth, [0, 1], reduceMotion ? [1, 1] : [0.8,  1])
  const x1     = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [120,  0])
  const y1     = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [-80,  0])
  const scale1 = useTransform(smooth, [0, 1], reduceMotion ? [1, 1] : [0.9,  1])
  const x2     = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [-120, 0])
  const y2     = useTransform(smooth, [0, 1], reduceMotion ? [0, 0] : [-80,  0])
  const scale2 = useTransform(smooth, [0, 1], reduceMotion ? [1, 1] : [0.9,  1])
  const opacity = useTransform(smooth, [0, 0.3], [0, 1])

  return (
    <div ref={ref} className="overflow-x-hidden">
      <div className="flex flex-col items-center gap-6">
        <motion.div style={{ y: y0, scale: scale0, opacity }} className="w-full max-w-sm">
          <BeamCard>
            <h3 className="font-heading text-xl font-semibold text-navy-deep">
              {PILLARS[0].name}
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/75">
              {PILLARS[0].detail}
            </p>
          </BeamCard>
        </motion.div>

        <div className="flex w-full gap-6">
          <motion.div style={{ x: x1, y: y1, scale: scale1, opacity }} className="flex-1">
            <BeamCard className="h-full">
              <h3 className="font-heading text-lg font-semibold text-navy-deep">
                {PILLARS[1].name}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/75">
                {PILLARS[1].detail}
              </p>
            </BeamCard>
          </motion.div>
          <motion.div style={{ x: x2, y: y2, scale: scale2, opacity }} className="flex-1">
            <BeamCard className="h-full">
              <h3 className="font-heading text-lg font-semibold text-navy-deep">
                {PILLARS[2].name}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/75">
                {PILLARS[2].detail}
              </p>
            </BeamCard>
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
        <SectionHeading eyebrow="What we stand on" title="Our three-pillar vision" surface="light" />
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
