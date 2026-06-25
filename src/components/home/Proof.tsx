import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MetricStat, type MetricEntry } from '@/components/ui/MetricStat'
import { FlaskIcon, BuildIcon, LayersIcon } from '@/components/icons'

/* ─── Pillar definitions (maps to the three "What We Do" services) ─────── */
const PILLARS = {
  ai:      { label: 'AI Product Engineering',      Icon: FlaskIcon   },
  systems: { label: 'Automated Systems',            Icon: BuildIcon   },
  product: { label: 'End-to-End Product Dev',       Icon: LayersIcon  },
} as const
type PillarKey = keyof typeof PILLARS

/* ─── Per-card accent colour tokens ────────────────────────────────────── */
type AccentKey = 'violet' | 'cyan' | 'magenta'
const ACCENTS: Record<AccentKey, { corner: string; border: string; hoverBorder: string; glowOpen: string; tag: string; text: string; divider: string; quoteBorder: string }> = {
  violet:  { corner: 'bg-violet-ray/60',      border: 'border-violet-ray/20',      hoverBorder: 'hover:border-violet-ray/50',      glowOpen: 'shadow-glow-violet',   tag: 'bg-violet-ray/15 text-violet-ray',      text: 'text-violet-ray',      divider: 'border-violet-ray/20',      quoteBorder: 'border-violet-ray/50'      },
  cyan:    { corner: 'bg-cyan-strong/60',      border: 'border-cyan-strong/20',     hoverBorder: 'hover:border-cyan-strong/50',     glowOpen: 'shadow-glow-cyan',     tag: 'bg-cyan-strong/15 text-cyan-strong',    text: 'text-cyan-strong',     divider: 'border-cyan-strong/20',     quoteBorder: 'border-cyan-strong/50'     },
  magenta: { corner: 'bg-magenta-bloom/60',    border: 'border-magenta-bloom/20',   hoverBorder: 'hover:border-magenta-bloom/50',   glowOpen: 'shadow-glow-magenta',  tag: 'bg-magenta-bloom/15 text-magenta-bloom', text: 'text-magenta-bloom', divider: 'border-magenta-bloom/20',   quoteBorder: 'border-magenta-bloom/50'   },
}

/* ─── Data ──────────────────────────────────────────────────────────────── */
type Client = {
  name: string; tag: string; location: string
  pillars: PillarKey[]; accent: AccentKey
  problem: string; deliverables: string[]; metrics: MetricEntry[]
  metricsNote?: string; cohortNote?: string
  quote: string | null; attribution: string | null
}

const CLIENTS: Client[] = [
  {
    name: 'Mr Brush & Co.',
    tag: 'Commercial Cleaning',
    location: 'United Kingdom',
    pillars: ['ai', 'systems', 'product'],
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
    quote: 'Working with Dreamlabs has genuinely transformed how we run the business. We have a website that wins us business, a system that gives our clients total transparency, and automations running in the background that used to take hours by hand. It feels like an unfair competitive advantage.',
    attribution: '[Name], Mr Brush & Co.',
  },
  {
    name: 'UX Tree',
    tag: 'EdTech · Product Strategy',
    location: 'Dublin, Ireland',
    pillars: ['product'],
    accent: 'cyan',
    problem:
      'The Product Strategy course hadn\'t been taught in a while and needed a complete redesign. The existing format used passive, lecture-style delivery that wasn\'t reaching its ideal audience: professionals who wanted real-world, portfolio-ready experience, not another upskilling certificate.',
    deliverables: [
      'UX research: found ~1 in 3 professionals have a learning difficulty (ADHD, dyslexia, or colour blindness)',
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
    pillars: ['product', 'systems'],
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

/* ─── Sub-components ────────────────────────────────────────────────────── */

/** Four L-shaped corner accents — tracks card height on expand. */
const Corners = ({ color }: { color: string }) => (
  <>
    <span aria-hidden className={`absolute left-0 top-0 h-px w-7 ${color}`} />
    <span aria-hidden className={`absolute left-0 top-0 h-7 w-px ${color}`} />
    <span aria-hidden className={`absolute right-0 top-0 h-px w-7 ${color}`} />
    <span aria-hidden className={`absolute right-0 top-0 h-7 w-px ${color}`} />
    <span aria-hidden className={`absolute bottom-0 left-0 h-px w-7 ${color}`} />
    <span aria-hidden className={`absolute bottom-0 left-0 h-7 w-px ${color}`} />
    <span aria-hidden className={`absolute bottom-0 right-0 h-px w-7 ${color}`} />
    <span aria-hidden className={`absolute bottom-0 right-0 h-7 w-px ${color}`} />
  </>
)

const Chevron = ({ open }: { open: boolean }) => (
  <motion.svg animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
    width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
)

const STAGGER_Y = [0, 48, 96] // px offsets per column on desktop

const ProofCard = ({ client, index }: { client: Client; index: number }) => {
  const [open, setOpen] = useState(false)
  const a = ACCENTS[client.accent]

  return (
    <article
      className={`relative rounded-card border bg-white/[0.05] transition-all duration-300 ${a.hoverBorder} ${a.border} ${open ? a.glowOpen : ''}`}
      style={{ '--stagger-y': `${STAGGER_Y[index] ?? 0}px` } as React.CSSProperties}
    >
      <Corners color={a.corner} />

      {/* Compact header — always visible */}
      <button onClick={() => setOpen(o => !o)} className="w-full cursor-pointer p-6 text-left" aria-expanded={open}>
        {/* Logo placeholder */}
        <div className="mb-5 flex h-10 w-28 items-center justify-center rounded border border-dashed border-offwhite/20 bg-offwhite/[0.04]">
          {/* TODO: replace with <img src={client.logo} alt={client.name} /> once logos supplied */}
          <span className="font-body text-[10px] uppercase tracking-widest text-offwhite/25">Logo</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-heading text-base font-bold text-offwhite">{client.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${a.tag}`}>{client.tag}</span>
              <span className="font-body text-xs text-offwhite/40">{client.location}</span>
            </div>
          </div>
          <span className={`mt-0.5 shrink-0 ${a.text}`}><Chevron open={open} /></span>
        </div>

        {/* Service pillars */}
        <div className="mt-4 flex flex-col gap-1.5">
          {client.pillars.map(key => {
            const { label, Icon } = PILLARS[key]
            return (
              <span key={key} className="flex items-center gap-2 font-body text-xs text-offwhite/60">
                <Icon className="h-3.5 w-3.5 shrink-0 text-offwhite/40" aria-hidden />
                {label}
              </span>
            )
          })}
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
            style={{ overflow: 'hidden' }}
          >
            <div className={`mx-6 border-t pb-6 pt-5 ${a.divider}`}>
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-offwhite/40">The problem</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-offwhite/70">{client.problem}</p>

              <p className="mt-5 font-body text-xs font-semibold uppercase tracking-widest text-offwhite/40">What we built</p>
              <ul className="mt-2 space-y-1.5">
                {client.deliverables.map(d => (
                  <li key={d} className="flex gap-2 font-body text-sm leading-snug text-offwhite/70">
                    <span className={`mt-px shrink-0 ${a.text}`} aria-hidden>›</span>{d}
                  </li>
                ))}
              </ul>

              {client.metrics.length > 0 && (
                <div className={`mt-5 border-t pt-4 ${a.divider}`}>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {client.metrics.map(m => <MetricStat key={m.label} {...m} surface="dark" />)}
                  </div>
                  {client.metricsNote && <p className="mt-3 font-body text-xs italic text-offwhite/30">{client.metricsNote}</p>}
                </div>
              )}

              {client.cohortNote && (
                <div className={`mt-5 rounded-card border bg-white/5 px-4 py-3 ${a.border}`}>
                  <p className={`font-body text-xs font-medium ${a.text}`}>{client.cohortNote}</p>
                </div>
              )}

              {client.quote && (
                <blockquote className={`mt-5 border-l-2 pl-4 ${a.quoteBorder}`}>
                  <p className="font-body text-sm italic leading-relaxed text-offwhite/70">"{client.quote}"</p>
                  {client.attribution && (
                    <footer className="mt-2 font-body text-xs font-semibold text-offwhite/40">— {client.attribution}</footer>
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

/** Section 7 — Testimonials. Gated by SHOW_PROOF in src/lib/config.ts. */
export const Proof = () => (
  <Section surface="dream">
    <Reveal>
      <SectionHeading
        eyebrow="Testimonials"
        title="SMEs who got real results, real impact"
        lede="Real work. Real outcomes. No promises we haven't already kept."
        surface="dark"
      />
    </Reveal>
    <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-start md:pb-24">
      {CLIENTS.map((client, i) => (
        <Reveal key={client.name} delay={i * 80}
          className={i === 1 ? 'md:translate-y-12' : i === 2 ? 'md:translate-y-24' : ''}>
          <ProofCard client={client} index={i} />
        </Reveal>
      ))}
    </div>
  </Section>
)
