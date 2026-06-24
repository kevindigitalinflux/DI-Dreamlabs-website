import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MetricStat, type MetricEntry } from '@/components/ui/MetricStat'

type AccentKey = 'violet' | 'cyan' | 'magenta'

const ACCENTS: Record<AccentKey, {
  borderDefault: string; borderOpen: string; hoverBorder: string
  glowOpen: string; tag: string; chip: string; text: string
  divider: string; quoteBorder: string
}> = {
  violet: {
    borderDefault: 'border-violet-ray/30', borderOpen: 'border-violet-ray/70',
    hoverBorder: 'hover:border-violet-ray/60', glowOpen: 'shadow-glow-violet',
    tag: 'bg-violet-ray/15 text-violet-ray', chip: 'bg-violet-ray/10 text-violet-ray/80',
    text: 'text-violet-ray', divider: 'border-violet-ray/20', quoteBorder: 'border-violet-ray/50',
  },
  cyan: {
    borderDefault: 'border-cyan-strong/30', borderOpen: 'border-cyan-strong/70',
    hoverBorder: 'hover:border-cyan-strong/60', glowOpen: 'shadow-glow-cyan',
    tag: 'bg-cyan-strong/15 text-cyan-strong', chip: 'bg-cyan-strong/10 text-cyan-strong/80',
    text: 'text-cyan-strong', divider: 'border-cyan-strong/20', quoteBorder: 'border-cyan-strong/50',
  },
  magenta: {
    borderDefault: 'border-magenta-bloom/30', borderOpen: 'border-magenta-bloom/70',
    hoverBorder: 'hover:border-magenta-bloom/60', glowOpen: 'shadow-glow-magenta',
    tag: 'bg-magenta-bloom/15 text-magenta-bloom', chip: 'bg-magenta-bloom/10 text-magenta-bloom/80',
    text: 'text-magenta-bloom', divider: 'border-magenta-bloom/20', quoteBorder: 'border-magenta-bloom/50',
  },
}

type Client = {
  name: string; tag: string; location: string; services: string[]
  problem: string; deliverables: string[]; metrics: MetricEntry[]
  metricsNote?: string; cohortNote?: string
  quote: string | null; attribution: string | null
  accent: AccentKey
}

const CLIENTS: Client[] = [
  {
    name: 'Mr Brush & Co.',
    tag: 'Commercial Cleaning',
    location: 'United Kingdom',
    services: ['UX Research', 'Website', 'Field Ops App', 'Automation Suite', 'Retainer'],
    accent: 'violet',
    problem:
      'Primary UX research revealed the biggest risk wasn\'t operations, it was transparency. Building managers were cancelling contracts because they had no proof cleaning was happening. Supervisors were being reported for misconduct toward cleaners, triggering legal disputes and driving staff turnover. CRM and accountability were costing the business more than anything else.',
    deliverables: [
      'UX research identifying CRM and transparency as the core business risk',
      'Lead-generating marketing website',
      'Mobile-first field ops app with three portals for Cleaners, Supervisors, and Building Managers',
      'Zone-by-zone photo evidence with offline queue for low-signal sites',
      'Full automation suite: proof of cleaning, pay records, SLA alerts, payslips, weekly reports',
      'Ongoing retainer, continuing to build and scale the system',
    ],
    metrics: [
      { value: 45, prefix: '+', suffix: '%', label: 'Client retention rate', direction: 'up'   },
      { value: 35, prefix: '+', suffix: '%', label: 'Sales close rate',       direction: 'up'   },
      { value: 80, prefix: '-', suffix: '%', label: 'Proof disputes',         direction: 'down' },
      { value: 10, prefix: '-', suffix: 'h', label: 'Admin hours per week',   direction: 'down' },
    ],
    metricsNote: '* Figures reported since platform launch. Results may vary.',
    quote:
      'Working with Dreamlabs has genuinely transformed how we run the business. We have a website that wins us business, a system that gives our clients total transparency, and automations running in the background that used to take hours by hand. It feels like an unfair competitive advantage.',
    attribution: '[Name], Mr Brush & Co.',
  },
  {
    name: 'UX Tree',
    tag: 'EdTech · Product Strategy',
    location: 'Dublin, Ireland',
    services: ['UX Research', 'Curriculum Design', 'Course Content', 'AI Support Tools'],
    accent: 'cyan',
    problem:
      'The Product Strategy course hadn\'t been taught in a while and needed a complete redesign. The existing format used passive, lecture-style delivery that wasn\'t reaching its ideal audience: professionals who wanted real-world, portfolio-ready experience, not another upskilling certificate.',
    deliverables: [
      'UX research phase: found ~1 in 3 professionals have a learning difficulty (ADHD, dyslexia, or colour blindness)',
      'Full curriculum redesign and all course content, built to support multiple learning styles',
      'Inclusive session structure: 20 to 30 minute lessons with built-in breaks, matched to average professional attention span',
      'Virtual classroom design and all content slides',
      'AI-powered student support, trained chatbots and notebooks for outside lesson hours',
      'Hands-on activities simulating a real product strategy team; students leave with a real portfolio piece',
      'Live client pitch at the end of every cohort',
    ],
    metrics: [],
    cohortNote: 'First cohort currently in session, outcomes to follow',
    quote: null,
    attribution: null,
  },
  {
    name: 'JM Publicidad',
    tag: 'Advertising Studio',
    location: 'Spain · Markets across South America',
    services: ['Website', 'Bilingual EN/ES', 'SEO', 'Lead Gen', 'Automation'],
    accent: 'magenta',
    problem:
      'Despite having worked with major brands, JM Publicidad had no digital presence at all. Their portfolio was invisible. New business was entirely word-of-mouth, with no professional way for prospects across their South American markets to find them, assess their work, or make an enquiry.',
    deliverables: [
      'Their first-ever website: bilingual (EN/ES) lead generation and full services showcase',
      'Portfolio-forward design built to convert brand-level prospects, not just traffic',
      'Full SEO audit and technical foundation: schemas, sitemap, meta structure, crawlability',
      'Secure enquiry management with automated lead handling',
      'Set up to attract higher-quality clients and showcase the calibre of brands they already work with',
    ],
    metrics: [],
    quote: null,
    attribution: null,
  },
]

const Chevron = ({ open }: { open: boolean }) => (
  <motion.svg
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden
  >
    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
)

const ProofCard = ({ client }: { client: Client }) => {
  const [open, setOpen] = useState(false)
  const a = ACCENTS[client.accent]

  return (
    <article
      className={`rounded-card border bg-white/[0.05] transition-all duration-300 ${a.hoverBorder} ${
        open ? `${a.borderOpen} ${a.glowOpen}` : a.borderDefault
      }`}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full cursor-pointer p-6 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {/* TODO: replace with <img> once Kevin supplies logo files */}
            <p className="font-heading text-base font-bold text-offwhite">{client.name}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${a.tag}`}>
                {client.tag}
              </span>
              <span className="font-body text-xs text-offwhite/40">{client.location}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {client.services.map(s => (
                <span key={s} className={`rounded-full px-2.5 py-0.5 font-body text-xs ${a.chip}`}>{s}</span>
              ))}
            </div>
          </div>
          <span className={`mt-0.5 shrink-0 ${a.text}`}>
            <Chevron open={open} />
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: 'hidden' }}
          >
            <div className={`mx-6 border-t pb-6 pt-5 ${a.divider}`}>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-offwhite/40">The problem</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-offwhite/70">{client.problem}</p>

              <p className="mt-5 font-body text-xs font-semibold uppercase tracking-widest text-offwhite/40">What we built</p>
              <ul className="mt-2 space-y-1.5">
                {client.deliverables.map(d => (
                  <li key={d} className="flex gap-2 font-body text-sm leading-snug text-offwhite/70">
                    <span className={`mt-px shrink-0 ${a.text}`} aria-hidden>›</span>
                    {d}
                  </li>
                ))}
              </ul>

              {client.metrics.length > 0 && (
                <div className={`mt-5 border-t pt-4 ${a.divider}`}>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {client.metrics.map(m => <MetricStat key={m.label} {...m} surface="dark" />)}
                  </div>
                  {client.metricsNote && (
                    <p className="mt-3 font-body text-xs italic text-offwhite/30">{client.metricsNote}</p>
                  )}
                </div>
              )}

              {client.cohortNote && (
                <div className={`mt-5 rounded-card border bg-white/5 px-4 py-3 ${a.borderDefault}`}>
                  <p className={`font-body text-xs font-medium ${a.text}`}>{client.cohortNote}</p>
                </div>
              )}

              {client.quote && (
                <blockquote className={`mt-5 border-l-2 pl-4 ${a.quoteBorder}`}>
                  <p className="font-body text-sm italic leading-relaxed text-offwhite/70">"{client.quote}"</p>
                  {client.attribution && (
                    <footer className="mt-2 font-body text-xs font-semibold text-offwhite/40">
                      — {client.attribution}
                    </footer>
                  )}
                </blockquote>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}

/** Section 7 — Selected Work. Gated by SHOW_PROOF in src/lib/config.ts. */
export const Proof = () => (
  <Section surface="dream">
    <Reveal>
      <SectionHeading
        eyebrow="Selected Work"
        title="Trusted by SMEs who needed more than promises"
        lede="Three businesses that came to us with real problems. Here is what we built, and what happened next."
        surface="dark"
      />
    </Reveal>
    <div className="mt-12 grid gap-4 lg:gap-5">
      {CLIENTS.map(client => (
        <Reveal key={client.name}>
          <ProofCard client={client} />
        </Reveal>
      ))}
    </div>
  </Section>
)
