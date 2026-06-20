import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MethodBubbleBackground } from '@/components/interactive/atmosphere/MethodBubbleBackground'
import { AuditIcon, BuildIcon, GuaranteeIcon, OwnIcon, PilotIcon } from '@/components/icons'

const STEPS = [
  {
    icon: AuditIcon,
    title: '1. Free audit',
    body: 'We come to you, look at how the work actually flows, and show you exactly where time and money are leaking. No invoice, no obligation.',
  },
  {
    icon: BuildIcon,
    title: '2. Build',
    body: 'We design and build your system around your real jobs, your team, and the way you already work, not a template.',
  },
  {
    icon: PilotIcon,
    title: '3. Pilot',
    body: 'You run it on real work before any retainer. If we do not deliver what we agreed, you walk away with your money back.',
  },
  {
    icon: OwnIcon,
    title: '4. Own & scale',
    body: 'The system is yours outright: code, data, everything. We stay on only if you want us to help it grow.',
  },
] as const

/** Hand-drawn magenta underline that animates on scroll entry. */
const DrawnUnderline = () => (
  <motion.svg
    className="pointer-events-none absolute -bottom-1 left-0 h-[8px] w-full overflow-visible"
    viewBox="0 0 300 8"
    preserveAspectRatio="none"
    aria-hidden
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: '-60px' }}
  >
    <motion.path
      d="M 2,6 C 55,1 120,7 185,4 C 240,1 275,6 298,5"
      stroke="#F0386B"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
    />
  </motion.svg>
)

/** Section 2 — the low-risk path, with a scroll-drawn connecting line. */
export const Method = () => {
  const lineRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 75%', 'end 60%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <Section
      surface="workshop"
      elevateContent
      id="dreamlabs-method"
      background={<MethodBubbleBackground />}
    >
      {/* Frosted panel — light counterpart to the SF heading treatment, so
          the heading stays legible no matter which bubble drifts behind it. */}
      <Reveal>
        <div className="mx-auto max-w-2xl rounded-card border border-navy-deep/10 bg-white/70 px-6 py-8 backdrop-blur-md md:px-10 md:py-10">
          <SectionHeading
            eyebrow="The Dreamlabs method"
            title="A path with no leap of faith required"
            surface="light"
          />
          <p className="mt-4 text-center font-body text-base leading-relaxed text-navy-deep/75 md:text-lg">
            Four steps, and{' '}
            <span className="relative inline-block whitespace-nowrap">
              the risky ones are on us.
              <DrawnUnderline />
            </span>
          </p>
        </div>
      </Reveal>

      <div ref={lineRef} className="relative mx-auto mt-14 max-w-2xl">
        {/* Connecting line — echoes the hero's thread motif at small scale */}
        <div className="absolute bottom-5 left-[1.4rem] top-5 w-px bg-navy-deep/10" aria-hidden />
        <motion.div
          className="absolute bottom-5 left-[1.4rem] top-5 w-px origin-top bg-violet-ray"
          style={{ scaleY: reduceMotion ? 1 : scaleY }}
          aria-hidden
        />
        <ol className="space-y-10">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title}>
              <Reveal delay={i * 80} className="flex gap-6">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-deep text-cyan-strong shadow-card">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                {/* backdrop-blur is a live filter on whatever renders behind it, so it
                    keeps the title/body legible no matter how many bubbles drift behind
                    them — the icon and connecting line above stay uncovered, on purpose. */}
                <div className="rounded-card bg-white/85 px-3 py-2">
                  <h3 className="font-heading text-lg font-semibold text-navy-deep md:text-[1.375rem]">
                    {title}
                  </h3>
                  <p className="mt-2 font-body text-base leading-relaxed text-navy-deep/75">
                    {body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <Reveal className="mt-14">
        <div className="mx-auto flex max-w-2xl items-start gap-4 rounded-card border border-violet-ray/25 bg-white p-6 shadow-card">
          <GuaranteeIcon className="h-8 w-8 shrink-0 text-violet-ray" aria-hidden />
          <p className="font-body text-base leading-relaxed text-navy-deep">
            <strong className="font-medium">The promise in plain English:</strong> you pilot the
            system on real work before paying any retainer, you own everything we build outright,
            and if we do not deliver what we agreed, you always get your money back.
          </p>
        </div>
      </Reveal>
    </Section>
  )
}
