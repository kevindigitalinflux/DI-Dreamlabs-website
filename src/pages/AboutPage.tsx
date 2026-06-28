import { useRef, Fragment, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import {
  POSITIONING_LINE,
  FOUNDER_NAME,
  FOUNDER_TITLE,
  FOUNDER_LINKEDIN,
  SITE_URL,
} from '@/lib/config'
import { BubblePitBackground } from '@/components/interactive/atmosphere/BubblePitBackground'
import { Seo, breadcrumbs } from '@/lib/Seo'

const PILLARS = [
  {
    num: '01',
    name: 'Transformative',
    detail:
      'We turn bottlenecks into breakthroughs. Every engagement starts with a real problem and ends with a measurable result.',
  },
  {
    num: '02',
    name: 'Accessible',
    detail:
      'Enterprise-grade capability at a human-scale price. We built the model specifically so pricing never has to be the barrier.',
  },
  {
    num: '03',
    name: 'Inventive',
    detail:
      'We build for your specific problem, not a generic one. Every system is designed from the ground up.',
  },
] as const

interface TalentPartner {
  id: string
  name: string
  hq: string
  logo: string
  tagline: string
  countries: readonly string[]
  beamSpeed: number
}

const TALENT_PARTNERS: TalentPartner[] = [
  {
    id: 'dii',
    name: 'Digital Influx International',
    hq: 'London, UK',
    logo: '/images/about/digital-influx-logo.svg',
    tagline: 'Producing AI Product Designers who are job-ready builders from day one.',
    countries: ['UK', 'US', 'Australia', 'Hong Kong', 'Nigeria'],
    beamSpeed: 3,
  },
  {
    id: 'uxt',
    name: 'UX Tree',
    hq: 'Dublin, Ireland',
    logo: '/images/about/ux-tree-logo.png',
    tagline: 'Producing experienced UX Designers and AI Product Strategists ready to deliver.',
    countries: ['Ireland', 'Europe'],
    beamSpeed: 2.2,
  },
]

const BEAM_BG =
  'conic-gradient(from var(--gradient-angle), transparent 0%, #8B32FF 38%, #C088FF 50%, transparent 62%)'

/**
 * Card with the same rotating beam border as the LightBeamButton CTA.
 * Border is 2.5 px thick; a violet ambient glow reinforces the beam visually.
 * Speed prop lets each card rotate at a slightly different pace.
 */
const BeamCard = ({
  children,
  className = '',
  speed = 2.5,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) => (
  <div
    className={`relative overflow-hidden rounded-card transition-all duration-300 hover:-translate-y-2 hover:shadow-glow-violet ${className}`}
    style={{ boxShadow: '0 4px 24px -6px rgba(139,50,255,0.22), 0 1px 3px rgba(0,0,0,0.06)' }}
  >
    {/* Rotating conic-gradient fills the full card area */}
    <div
      aria-hidden
      className="absolute inset-0"
      style={{ background: BEAM_BG, animation: `border-spin ${speed}s linear infinite` }}
    />
    {/* Off-white inner fill reveals only the 2.5 px beam edge */}
    <div className="absolute inset-[2.5px] rounded-card bg-gradient-to-br from-white via-white to-offwhite" />
    {/* Content */}
    <div className="relative z-10 h-full p-7">{children}</div>
  </div>
)

/** Interactive 3D-tilt partner institution card with hover-reveal country reach. */
const TalentPartnerCard = ({ name, hq, logo, tagline, countries, beamSpeed }: TalentPartner) => {
  const [hovered, setHovered] = useState(false)
  const reduceMotion = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], reduceMotion ? [0, 0] : [6, -6])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], reduceMotion ? [0, 0] : [-6, 6])

  const track = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width - 0.5)
    mouseY.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }

  return (
    <div
      style={{ perspective: '900px' }}
      onMouseMove={track}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      className="cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        animate={{
          boxShadow: hovered
            ? '0 12px 48px -4px rgba(139,50,255,0.5), 0 4px 12px rgba(0,0,0,0.10)'
            : '0 4px 24px -6px rgba(139,50,255,0.22), 0 1px 3px rgba(0,0,0,0.06)',
        }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-card"
      >
        {/* Rotating beam border */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: BEAM_BG, animation: `border-spin ${beamSpeed}s linear infinite` }}
        />
        {/* White inner fill */}
        <div className="absolute inset-[2.5px] rounded-card bg-gradient-to-br from-white via-white to-offwhite" />
        {/* Content */}
        <div className="relative z-10 p-7">
          <div className="mb-5 flex h-12 items-center">
            <img src={logo} alt={`${name} logo`} className="max-h-full max-w-[140px] object-contain" />
          </div>
          <h3 className="font-heading text-xl font-bold text-navy-deep">{name}</h3>
          <p className="mt-0.5 font-body text-xs text-navy-deep/50">{hq}</p>
          <div className="mt-3 h-px w-10 bg-violet-ray/60" />
          <p className="mt-3 font-body text-sm leading-relaxed text-navy-deep/70">{tagline}</p>
          {/* Global reach — always visible (hover-only fails on touch screens) */}
          <div className="mt-4">
            <p className="mb-2 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-ray">
              Global reach
            </p>
            <div className="flex flex-wrap gap-1.5">
              {countries.map((country, i) => (
                <motion.span
                  key={country}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.2 }}
                  className="rounded-full border border-violet-ray/25 bg-violet-ray/10 px-3 py-0.5 font-body text-xs text-navy-deep"
                >
                  {country}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

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

        {/* Apex card */}
        <motion.div style={{ y: y0, scale: scale0, opacity }} className="w-full max-w-sm">
          <BeamCard speed={3.5}>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-3 select-none font-heading text-7xl font-extrabold leading-none text-navy-deep/[0.06]"
            >
              {PILLARS[0].num}
            </span>
            <h3 className="font-heading text-xl font-bold text-navy-deep">{PILLARS[0].name}</h3>
            <div className="mt-2 h-px w-10 bg-violet-ray/60" />
            <p className="mt-3 font-body text-sm leading-relaxed text-navy-deep/70">
              {PILLARS[0].detail}
            </p>
          </BeamCard>
        </motion.div>

        {/* Base row */}
        <div className="flex w-full gap-6">
          <motion.div style={{ x: x1, y: y1, scale: scale1, opacity }} className="flex-1">
            <BeamCard className="h-full" speed={2.5}>
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-3 select-none font-heading text-7xl font-extrabold leading-none text-navy-deep/[0.06]"
              >
                {PILLARS[1].num}
              </span>
              <h3 className="font-heading text-lg font-bold text-navy-deep">{PILLARS[1].name}</h3>
              <div className="mt-2 h-px w-10 bg-violet-ray/60" />
              <p className="mt-3 font-body text-sm leading-relaxed text-navy-deep/70">
                {PILLARS[1].detail}
              </p>
            </BeamCard>
          </motion.div>
          <motion.div style={{ x: x2, y: y2, scale: scale2, opacity }} className="flex-1">
            <BeamCard className="h-full" speed={2}>
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-3 select-none font-heading text-7xl font-extrabold leading-none text-navy-deep/[0.06]"
              >
                {PILLARS[2].num}
              </span>
              <h3 className="font-heading text-lg font-bold text-navy-deep">{PILLARS[2].name}</h3>
              <div className="mt-2 h-px w-10 bg-violet-ray/60" />
              <p className="mt-3 font-body text-sm leading-relaxed text-navy-deep/70">
                {PILLARS[2].detail}
              </p>
            </BeamCard>
          </motion.div>
        </div>

      </div>
    </div>
  )
}

const LinkedInIcon = ({ className = '' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

/**
 * Named founder bio for Google E-E-A-T signals.
 * Drop a headshot at public/images/about/kevin.jpg to activate the photo frame.
 */
const FounderBio = () => (
  <div className="mx-auto max-w-3xl md:max-w-5xl">
    <Reveal>
      <SectionHeading eyebrow="The founder" title="Behind the mission" surface="light" align="left" />
    </Reveal>
    <Reveal className="mt-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
        <div className="shrink-0 md:w-52">
          <div className="relative overflow-hidden rounded-card border border-violet-ray/30 shadow-card">
            <div className="aspect-[3/4]">
              <img
                src="/images/about/kevin.png"
                alt="Kevin Zamora Saenz, Founder and Director of DI Dreamlabs"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-navy-deep/60 via-navy-deep/20 to-violet-ray/30 mix-blend-multiply"
            />
          </div>
        </div>
        <div className="flex-1 pt-1">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-violet-text">
            {FOUNDER_TITLE}
          </p>
          <h2 className="mt-1 font-heading text-3xl font-bold text-navy-deep md:text-4xl">
            {FOUNDER_NAME}
          </h2>
          <div className="mt-3 h-px w-10 bg-violet-ray/60" />
          <p className="mt-4 font-body text-base leading-relaxed text-navy-deep/75">
            Kevin founded Digital Influx Dreamlabs Ltd with one conviction: the businesses that
            build and service the world deserve the same technology advantages as the largest
            enterprises — at a price that actually makes sense. As Founder and Director, Kevin
            leads every client engagement from the initial free audit through to delivery,
            ensuring the work gets done rather than delegated.
          </p>
          <a
            href={FOUNDER_LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-card border border-violet-ray/30 bg-violet-ray/[0.06] px-4 py-2.5 font-body text-sm font-semibold text-navy-deep transition-all hover:border-violet-ray/60 hover:bg-violet-ray/[0.12]"
          >
            <LinkedInIcon className="h-4 w-4 text-violet-text" />
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </Reveal>
  </div>
)

/** Brand story, Academy pipeline, why Dreamlabs exists (Brief §5). */
export const AboutPage = () => (
  <>
    <Seo
      title="About: Why Dreamlabs Exists"
      description="Digital Influx Dreamlabs Ltd: an AI agency built for SMEs, powered by the Digital Influx International talent pipeline. Enterprise capability, human-scale pricing."
      path="/about"
      jsonLd={[
        breadcrumbs(['About', '/about']),
        {
          '@type': 'Person',
          '@id': `${SITE_URL}/#founder`,
          name: FOUNDER_NAME,
          jobTitle: FOUNDER_TITLE,
          url: `${SITE_URL}/about`,
          image: `${SITE_URL}/images/about/kevin.png`,
          description: 'Founder and Director of Digital Influx Dreamlabs Ltd. Leads AI product engineering and automation projects for SMEs across the UK.',
          sameAs: [FOUNDER_LINKEDIN],
          worksFor: {
            '@type': 'Organization',
            '@id': `${SITE_URL}/#organization`,
            name: 'Digital Influx Dreamlabs Ltd',
            url: SITE_URL,
          },
        },
      ]}
    />
    <PageHero
      eyebrow="About"
      title='"Dreamlabs" is not just a name. It is a promise.'
      lede="Our purpose is to make the dreams of SMEs and startups achievable, giving you access to the kind of technology that used to be reserved for companies ten times your size."
      background={<BubblePitBackground />}
    />

    <Section surface="workshop">
      <div className="mx-auto max-w-3xl md:max-w-5xl">
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

    <Section surface="workshop">
      <FounderBio />
    </Section>

    <Section surface="dream">
      <Reveal>
        <SectionHeading
          eyebrow="The talent engine"
          title="How we keep enterprise quality at SME pricing"
          lede="Dreamlabs is a partner company to Digital Influx International, based in London, and UX Tree, based in Dublin, two internationally established EdTech institutions that serve as our in-house talent pipeline. Together, they draw from communities spanning Ireland, the UK, the US, Australia, Hong Kong, Nigeria, and beyond. We do not source expensive external contractors; we draw from a pipeline of engineers, designers and builders developed by institutions with that kind of global reach. Big-firm capability, human-scale pricing, no compromise on quality."
          surface="dark"
        />
      </Reveal>
      <Reveal className="mt-10">
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2 md:max-w-4xl">
          {TALENT_PARTNERS.map((p) => (
            <TalentPartnerCard key={p.id} {...p} />
          ))}
        </div>
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
