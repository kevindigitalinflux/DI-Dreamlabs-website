import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MetricStat, type MetricEntry } from '@/components/ui/MetricStat'
import { FlaskIcon, BuildIcon, LayersIcon } from '@/components/icons'

const AUTO_INTERVAL = 3500  // ms between auto-advances
const MANUAL_PAUSE  = 6000  // ms cooldown after user interaction

/* ─── Pillar definitions ─────────────────────────────────────────────────── */
const PILLARS = {
  ai:      { label: 'AI Product Engineering', Icon: FlaskIcon  },
  systems: { label: 'Automated Systems',       Icon: BuildIcon  },
  product: { label: 'End-to-End Product Dev',  Icon: LayersIcon },
} as const
type PillarKey = keyof typeof PILLARS

/* ─── Per-card beam colours ─────────────────────────────────────────────── */
type AccentKey = 'violet' | 'cyan' | 'magenta'

const BEAM = {
  violet:  'conic-gradient(from var(--gradient-angle), transparent 0%, #8B32FF 38%, #C088FF 50%, transparent 62%)',
  cyan:    'conic-gradient(from var(--gradient-angle), transparent 0%, #00DFDF 38%, #80FFFF 50%, transparent 62%)',
  magenta: 'conic-gradient(from var(--gradient-angle), transparent 0%, #F0386B 38%, #FF8FAD 50%, transparent 62%)',
}

const GLOW = {
  violet:  '0 0 48px 6px rgba(139, 50, 255, 0.22)',
  cyan:    '0 0 48px 6px rgba(0, 223, 223, 0.18)',
  magenta: '0 0 48px 6px rgba(240, 56, 107, 0.22)',
}

const ACCENT = {
  violet:  { tag: 'bg-violet-ray/15 text-violet-ray',       text: 'text-violet-ray',       divider: 'border-violet-ray/20',    quoteBorder: 'border-violet-ray/50',    dotBg: 'bg-violet-ray'    },
  cyan:    { tag: 'bg-cyan-strong/15 text-cyan-strong',      text: 'text-cyan-strong',      divider: 'border-cyan-strong/20',   quoteBorder: 'border-cyan-strong/50',   dotBg: 'bg-cyan-strong'   },
  magenta: { tag: 'bg-magenta-bloom/15 text-magenta-bloom',  text: 'text-magenta-bloom',    divider: 'border-magenta-bloom/20', quoteBorder: 'border-magenta-bloom/50', dotBg: 'bg-magenta-bloom' },
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

const Chevron = ({ open }: { open: boolean }) => (
  <motion.svg
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden
  >
    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
)

const NavArrow = ({ dir, onClick, disabled }: { dir: 'left' | 'right'; onClick: () => void; disabled: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === 'left' ? 'Previous client' : 'Next client'}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-deep/15 bg-navy-deep/5 text-navy-deep/40 transition-all hover:border-navy-deep/30 hover:text-navy-deep disabled:pointer-events-none disabled:opacity-20"
  >
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M11 13.5L6.5 9L11 4.5' : 'M7 13.5L11.5 9L7 4.5'}
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  </button>
)

type ProofCardProps = {
  client: Client
  open: boolean
  onToggle: () => void
}

const ProofCard = ({ client, open, onToggle }: ProofCardProps) => {
  const a = ACCENT[client.accent]

  return (
    <article
      className="relative overflow-hidden rounded-card"
      style={{
        background: BEAM[client.accent],
        animation: 'border-spin 3.5s linear infinite',
        boxShadow: open ? GLOW[client.accent] : '0 0 0 0 transparent',
        transition: 'box-shadow 0.5s ease',
      }}
    >
      {/* Navy interior fill — 1.5 px gap creates the visible beam border */}
      <div aria-hidden className="absolute inset-[1.5px] rounded-[10.5px] bg-navy-deep/95" />

      {/* Content */}
      <div className="relative z-10">
        <button
          onClick={onToggle}
          className="w-full cursor-pointer p-6 text-left sm:p-8"
          aria-expanded={open}
        >
          {/* Logo placeholder */}
          <div className="mb-6 flex h-16 w-44 items-center justify-center rounded-lg border border-dashed border-offwhite/20 bg-offwhite/[0.04]">
            {/* TODO: replace with <img src={client.logo} alt={client.name} className="h-10 w-auto object-contain" /> */}
            <span className="font-body text-[10px] uppercase tracking-widest text-offwhite/25">Logo</span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-heading text-xl font-bold text-offwhite">{client.name}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${a.tag}`}>{client.tag}</span>
                <span className="font-body text-xs text-offwhite/40">{client.location}</span>
              </div>
            </div>
            <span className={`mt-0.5 shrink-0 ${a.text}`}><Chevron open={open} /></span>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {client.pillars.map(key => {
              const { label, Icon } = PILLARS[key]
              return (
                <span key={key} className="flex items-center gap-2 font-body text-sm text-offwhite/60">
                  <Icon className="h-4 w-4 shrink-0 text-offwhite/40" aria-hidden />
                  {label}
                </span>
              )
            })}
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
              <div className={`mx-6 border-t pb-6 pt-5 sm:mx-8 sm:pb-8 ${a.divider}`}>
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
                    {client.metricsNote && (
                      <p className="mt-3 font-body text-xs italic text-offwhite/30">{client.metricsNote}</p>
                    )}
                  </div>
                )}

                {client.cohortNote && (
                  <div className={`mt-5 rounded-card border bg-white/5 px-4 py-3 ${a.divider}`}>
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
      </div>
    </article>
  )
}

/* ─── Carousel ──────────────────────────────────────────────────────────── */
const ProofCarousel = () => {
  const [active, setActive]               = useState(0)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const touchStartX  = useRef<number | null>(null)
  const pauseUntilRef = useRef(0)
  const dirRef        = useRef(1)
  const count         = CLIENTS.length

  /** Navigate to card i, collapsing any open card and setting a manual-pause cooldown. */
  const go = (i: number) => {
    setActive(Math.max(0, Math.min(count - 1, i)))
    setExpandedIndex(null)
    pauseUntilRef.current = Date.now() + MANUAL_PAUSE
  }

  /** Auto-advance: ping-pong (0→1→2→1→0→…). Pauses when a card is open. */
  useEffect(() => {
    if (expandedIndex !== null) return

    const id = setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return
      setActive(prev => {
        const next = prev + dirRef.current
        if (next >= count) { dirRef.current = -1; return count - 2 }
        if (next < 0)      { dirRef.current = 1;  return 1 }
        return next
      })
    }, AUTO_INTERVAL)

    return () => clearInterval(id)
  }, [expandedIndex, count])

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0]!.clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0]!.clientX
    if (Math.abs(delta) > 48) go(active + (delta > 0 ? 1 : -1))
    touchStartX.current = null
  }

  return (
    <div>
      {/* Card track */}
      <div
        className="overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <motion.div
          className="flex"
          style={{ width: `${count * 100}%` }}
          animate={{ x: `${(-active / count) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 32, mass: 0.8 }}
        >
          {CLIENTS.map((client, i) => (
            <div key={client.name} style={{ width: `${100 / count}%` }}>
              <ProofCard
                client={client}
                open={expandedIndex === i}
                onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation: ← dots → */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <NavArrow dir="left" onClick={() => go(active - 1)} disabled={active === 0} />

        <div className="flex items-center gap-2.5">
          {CLIENTS.map((client, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`View ${client.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? `w-8 ${ACCENT[client.accent].dotBg}`
                  : 'w-1.5 bg-navy-deep/15 hover:bg-navy-deep/30'
              }`}
            />
          ))}
        </div>

        <NavArrow dir="right" onClick={() => go(active + 1)} disabled={active === count - 1} />
      </div>
    </div>
  )
}

/** Section 7 — Testimonials. Gated by SHOW_PROOF in src/lib/config.ts. */
export const Proof = () => (
  <Section surface="workshop">
    <Reveal>
      <SectionHeading
        eyebrow="Testimonials"
        title="SMEs who got real results, real impact"
        lede="Real work. Real outcomes. No promises we haven't already kept."
        surface="light"
      />
    </Reveal>
    <Reveal delay={100}>
      <div className="mx-auto mt-12 max-w-[640px]">
        <ProofCarousel />
      </div>
    </Reveal>
  </Section>
)
