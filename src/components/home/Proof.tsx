import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MetricStat, type MetricEntry } from '@/components/ui/MetricStat'

type Client = {
  name: string
  tag: string
  location: string
  problem: string
  deliverables: string[]
  metrics: MetricEntry[]
  metricsNote?: string
  cohortNote?: string
  quote: string | null
  attribution: string | null
}

const CLIENTS: Client[] = [
  {
    name: 'Mr Brush & Co.',
    tag: 'Commercial Cleaning',
    location: 'United Kingdom',
    problem:
      'Primary UX research revealed the biggest risk wasn\'t operations — it was transparency. Building managers were cancelling contracts because they had no proof cleaning was happening. Supervisors were being reported for misconduct toward cleaners, triggering legal disputes and driving staff turnover. CRM and accountability were costing the business more than anything else.',
    deliverables: [
      'UX research identifying CRM and transparency as the core business risk',
      'Lead-generating marketing website',
      'Mobile-first field ops app — three portals for Cleaners, Supervisors, and Building Managers',
      'Zone-by-zone photo evidence with offline queue for low-signal sites',
      'Full automation suite: proof of cleaning, pay records, SLA alerts, payslips, weekly reports',
      'Ongoing retainer — we continue to build and scale the system',
    ],
    metrics: [
      { value: 45, prefix: '+', suffix: '%', label: 'Client retention rate',  direction: 'up'   },
      { value: 35, prefix: '+', suffix: '%', label: 'Sales close rate',        direction: 'up'   },
      { value: 80, prefix: '-', suffix: '%', label: 'Proof disputes',          direction: 'down' },
      { value: 10, prefix: '-', suffix: 'h', label: 'Admin hours per week',    direction: 'down' },
    ],
    metricsNote: '* Figures reported since platform launch. Results may vary.',
    quote:
      'Working with Dreamlabs has genuinely transformed how we run the business. We have a website that wins us business, a system that gives our clients total transparency, and automations running in the background that used to take hours by hand. It feels like an unfair advantage over every competitor we go up against.',
    attribution: '[Name], Mr Brush & Co.',
  },
  {
    name: 'UX Tree',
    tag: 'EdTech · Product Strategy',
    location: 'Dublin, Ireland',
    problem:
      'The Product Strategy course hadn\'t been taught in a while and needed a complete redesign. The existing format used passive, lecture-style delivery that wasn\'t reaching its ideal audience — professionals who wanted real-world, portfolio-ready experience, not another upskilling certificate.',
    deliverables: [
      'UX research phase — found ~1 in 3 professionals have a learning difficulty (ADHD, dyslexia, or colour blindness)',
      'Full curriculum redesign and all course content, built for multiple learning styles',
      'Inclusive structure: 20–30 minute sessions with built-in breaks, matched to average professional attention span',
      'Virtual classroom design and all content slides',
      'AI-powered student support — trained chatbots and notebooks for outside lesson hours',
      'Hands-on activities simulating a real product strategy team — students leave with actual experience',
      'Live client pitch at the end of every cohort',
    ],
    metrics: [],
    cohortNote: 'First cohort currently in session — outcomes to follow',
    quote: null,
    attribution: null,
  },
  {
    name: 'JM Publicidad',
    tag: 'Advertising Studio',
    location: 'Spain · Serving markets across South America',
    problem:
      'Despite having worked with major brands, JM Publicidad had no digital presence at all. Their portfolio was invisible. New business was entirely word-of-mouth — there was no professional way for prospects across their South American markets to find them, assess their work, or make an enquiry.',
    deliverables: [
      'Their first-ever website: bilingual (EN/ES) lead generation and full services showcase',
      'Portfolio-forward design built to convert brand-level prospects, not just traffic',
      'Full SEO audit and technical foundation — schemas, sitemap, meta structure, crawlability',
      'Secure enquiry management with automated lead handling',
      'Set up to attract higher-quality clients and showcase the calibre of brands they already work with',
    ],
    metrics: [],
    quote: null,
    attribution: null,
  },
]

const LogoSlot = ({ name }: { name: string }) => (
  <div className="mb-4 flex h-8 items-center">
    {/* TODO: swap for <img> once Kevin supplies logo files */}
    <span className="font-heading text-base font-bold text-navy-deep">{name}</span>
  </div>
)

/** Individual case study card — problem → what we built → metrics → quote. */
const CaseStudyCard = ({ client, index }: { client: Client; index: number }) => (
  <Reveal delay={index * 100}>
    <article className="flex h-full flex-col rounded-card border border-[#D0CFCA] bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <LogoSlot name={client.name} />
        <span className="shrink-0 rounded-full bg-violet-ray/10 px-2.5 py-1 font-body text-xs font-semibold text-violet-ray">
          {client.tag}
        </span>
      </div>
      <p className="font-body text-xs text-navy-deep/40">{client.location}</p>

      <div className="mt-5 border-t border-navy-deep/10 pt-4">
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-navy-deep/40">The problem</p>
        <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/70">{client.problem}</p>
      </div>

      <div className="mt-4">
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-navy-deep/40">What we built</p>
        <ul className="mt-2 space-y-1.5">
          {client.deliverables.map(item => (
            <li key={item} className="flex gap-2 font-body text-sm leading-snug text-navy-deep/70">
              <span className="mt-px shrink-0 text-violet-ray" aria-hidden>›</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {client.metrics.length > 0 && (
        <div className="mt-5 border-t border-navy-deep/10 pt-4">
          <div className="grid grid-cols-2 gap-4">
            {client.metrics.map(m => <MetricStat key={m.label} {...m} surface="light" />)}
          </div>
          {client.metricsNote && (
            <p className="mt-3 font-body text-xs italic text-navy-deep/35">{client.metricsNote}</p>
          )}
        </div>
      )}

      {client.cohortNote && (
        <div className="mt-5 rounded-card border border-violet-ray/20 bg-violet-ray/5 px-4 py-3">
          <p className="font-body text-xs font-medium text-violet-ray">{client.cohortNote}</p>
        </div>
      )}

      {client.quote && (
        <blockquote className="mt-5 flex-1 border-l-2 border-violet-ray pl-4">
          <p className="font-body text-sm italic leading-relaxed text-navy-deep/70">"{client.quote}"</p>
          {client.attribution && (
            <footer className="mt-2 font-body text-xs font-semibold text-navy-deep/45">
              — {client.attribution}
            </footer>
          )}
        </blockquote>
      )}
    </article>
  </Reveal>
)

/** Section 7 — Selected Work. Activated when SHOW_PROOF = true in src/lib/config.ts. */
export const Proof = () => (
  <Section surface="workshop">
    <Reveal>
      <SectionHeading
        eyebrow="Selected Work"
        title="Trusted by SMEs who needed more than promises"
        lede="Three businesses that came to us with real problems. Here is what we built, and what happened next."
        surface="light"
      />
    </Reveal>
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {CLIENTS.map((client, i) => (
        <CaseStudyCard key={client.name} client={client} index={i} />
      ))}
    </div>
  </Section>
)
