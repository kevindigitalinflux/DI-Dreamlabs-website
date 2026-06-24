import { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/Button'
import { MetricStat, type MetricEntry } from '@/components/ui/MetricStat'
import {
  ArrowRightIcon,
  CleaningIcon, ConstructionIcon, EcommerceIcon, FacilitiesIcon,
  FieldServicesIcon, FinanceIcon, GeneralContractingIcon, HRIcon,
  LegalIcon, LogisticsIcon, MaintenanceIcon, MarketingIcon,
  RecruitmentIcon, SalesIcon, SupportIcon, TradesIcon,
} from '@/components/icons'
import { BubblePitBackground } from '@/components/interactive/atmosphere/BubblePitBackground'
import { Seo, breadcrumbs } from '@/lib/Seo'

gsap.registerPlugin(ScrollTrigger)

type IconFn = (props: { className?: string; 'aria-hidden'?: boolean }) => JSX.Element
type IndustryBlock = {
  icon: IconFn; slug: string; name: string; image: string
  pain: string; fix: string; metrics: MetricEntry[]
}

const METRICS_NOTE = '* Based on general industry research. Figures are illustrative examples and should be taken as indicative only, not a guarantee of results.'

const PHYSICAL_BLOCKS: IndustryBlock[] = [
  {
    icon: CleaningIcon, slug: 'cleaning', name: 'Cleaning',
    image: '/images/industries/cleaning.jpg',
    pain: 'Disputed work, no-shows discovered too late, and clients asking "did anyone actually come?"',
    fix: 'Photo-verified proof of work, live shift visibility, and automated client updates, disputes end before they start.',
    metrics: [
      { value: 62, prefix: '+', suffix: '%', label: 'Client retention',      direction: 'up'   },
      { value: 89, prefix: '-', suffix: '%', label: 'Proof disputes',         direction: 'down' },
      { value: 3,  suffix: '×',              label: 'Dispute resolution',     direction: 'up'   },
      { value: 5,  prefix: '-', suffix: 'h', label: 'Admin per week',         direction: 'down' },
    ],
  },
  {
    icon: FacilitiesIcon, slug: 'facilities', name: 'Facilities',
    image: '/images/industries/facilities.jpg',
    pain: 'Dozens of sites, hundreds of emails, and no single view of what is happening where.',
    fix: 'One dashboard across every site and contractor, with issues raised, assigned, and tracked automatically.',
    metrics: [
      { value: 74,  prefix: '+', suffix: '%', label: 'Issue resolution rate',  direction: 'up'   },
      { value: 60,  prefix: '-', suffix: '%', label: 'Unnecessary emails',      direction: 'down' },
      { value: 100, prefix: '+', suffix: '%', label: 'Site visibility',          direction: 'up'   },
      { value: 6,   prefix: '-', suffix: 'h', label: 'Reporting time per week', direction: 'down' },
    ],
  },
  {
    icon: MaintenanceIcon, slug: 'maintenance', name: 'Maintenance',
    image: '/images/industries/maintenance.jpg',
    pain: 'Everything is reactive: the phone rings, someone drives, the paperwork catches up days later.',
    fix: 'Scheduled preventive work, jobs dispatched to the nearest engineer, and job sheets that write themselves.',
    metrics: [
      { value: 55, prefix: '+', suffix: '%', label: 'Preventive job ratio',  direction: 'up'   },
      { value: 48, prefix: '-', suffix: '%', label: 'Emergency callouts',     direction: 'down' },
      { value: 35, prefix: '+', suffix: '%', label: 'Engineer utilisation',   direction: 'up'   },
      { value: 2,  prefix: '-', suffix: 'h', label: 'Paperwork per job',      direction: 'down' },
    ],
  },
  {
    icon: ConstructionIcon, slug: 'construction', name: 'Construction',
    image: '/images/industries/construction.jpg',
    pain: 'Site and office live in different worlds, and progress, variations, and delays travel by phone call.',
    fix: 'Site updates captured in seconds on a phone, flowing straight into programmes, valuations, and client reports.',
    metrics: [
      { value: 45, prefix: '+', suffix: '%', label: 'On-time delivery rate',  direction: 'up'   },
      { value: 60, prefix: '-', suffix: '%', label: 'Variation errors',        direction: 'down' },
      { value: 3,  suffix: '×',              label: 'Site update speed',       direction: 'up'   },
      { value: 7,  prefix: '-', suffix: 'h', label: 'Admin per week',          direction: 'down' },
    ],
  },
  {
    icon: TradesIcon, slug: 'specialty-trades', name: 'Specialty Trades',
    image: '/images/industries/specialty-trades.png',
    pain: 'Quotes go out days after the visit, and half the leads have gone cold or hired someone else by then.',
    fix: 'Same-day quoting from your own price book, automatic follow-ups, and a pipeline you can see at a glance.',
    metrics: [
      { value: 165, prefix: '+', suffix: '%', label: 'Quote conversion rate', direction: 'up'   },
      { value: 82,  prefix: '-', suffix: '%', label: 'Lead drop-off rate',     direction: 'down' },
      { value: 70,  prefix: '+', suffix: '%', label: 'Same-day quotes sent',   direction: 'up'   },
      { value: 3,   prefix: '-', suffix: 'd', label: 'Days saved quoting',     direction: 'down' },
    ],
  },
  {
    icon: LogisticsIcon, slug: 'logistics', name: 'Logistics',
    image: '/images/industries/logistics.jpg',
    pain: "Stock counts drift, job statuses live in drivers' heads, and the depot phone never stops ringing.",
    fix: 'Live stock and job tracking with automatic alerts before things run out, not after.',
    metrics: [
      { value: 90, prefix: '+', suffix: '%', label: 'Stock accuracy',       direction: 'up'   },
      { value: 75, prefix: '-', suffix: '%', label: 'Depot phone calls',     direction: 'down' },
      { value: 55, prefix: '+', suffix: '%', label: 'On-time delivery rate', direction: 'up'   },
      { value: 40, prefix: '-', suffix: '%', label: 'Stockouts per month',   direction: 'down' },
    ],
  },
  {
    icon: FieldServicesIcon, slug: 'field-services', name: 'Field Services',
    image: '/images/industries/field-services.png',
    pain: 'Emergency callouts get dispatched by text, job sheets get done at midnight, and half the paperwork never gets finished.',
    fix: 'Calls automatically logged, the nearest engineer dispatched in seconds, job sheets generated on site and invoiced before they leave.',
    metrics: [
      { value: 3,  suffix: '×',               label: 'Job throughput',          direction: 'up'   },
      { value: 65, prefix: '-', suffix: '%',  label: 'Dispatch time',            direction: 'down' },
      { value: 88, prefix: '+', suffix: '%',  label: 'Same-day invoicing',       direction: 'up'   },
      { value: 6,  prefix: '-', suffix: 'h',  label: 'Engineer admin per week',  direction: 'down' },
    ],
  },
  {
    icon: GeneralContractingIcon, slug: 'general-contracting', name: 'General Contracting',
    image: '/images/industries/general-contracting.png',
    pain: 'Sub-contractors, RFIs, variations, and sign-offs all travel by email and phone call. Nothing is in one place.',
    fix: 'One project hub where every trade sees their tasks, variations are approved digitally, and the programme updates itself in real time.',
    metrics: [
      { value: 50, prefix: '+', suffix: '%', label: 'On-time sign-offs',       direction: 'up'   },
      { value: 55, prefix: '-', suffix: '%', label: 'RFI resolution time',      direction: 'down' },
      { value: 80, prefix: '+', suffix: '%', label: 'Subcontractor visibility', direction: 'up'   },
      { value: 8,  prefix: '-', suffix: 'h', label: 'PM admin per week',        direction: 'down' },
    ],
  },
]

const SERVICE_BLOCKS: IndustryBlock[] = [
  {
    icon: MarketingIcon, slug: 'marketing', name: 'Marketing',
    image: '/images/industries/marketing.png',
    pain: 'Campaign results live in five different platforms and a spreadsheet, and no one can say whether the budget is working.',
    fix: 'A single live dashboard pulling every platform, with automated reporting sent to clients before they have to ask.',
    metrics: [
      { value: 95, prefix: '+', suffix: '%', label: 'Reporting speed',           direction: 'up'   },
      { value: 70, prefix: '-', suffix: '%', label: 'Manual reporting time',      direction: 'down' },
      { value: 40, prefix: '+', suffix: '%', label: 'Campaign ROI visibility',    direction: 'up'   },
      { value: 5,  prefix: '-', suffix: 'h', label: 'Report prep per client/wk', direction: 'down' },
    ],
  },
  {
    icon: LegalIcon, slug: 'legal', name: 'Legal',
    image: '/images/industries/legal.png',
    pain: 'Billable hours leak between meetings, calls, and admin. By Friday, no one can fully account for where the week went.',
    fix: 'Automatic time capture against every matter, with draft bills generated directly from calendar and file activity.',
    metrics: [
      { value: 28, prefix: '+', suffix: '%', label: 'Billable hours recovered', direction: 'up'   },
      { value: 65, prefix: '-', suffix: '%', label: 'Billing admin time',        direction: 'down' },
      { value: 85, prefix: '+', suffix: '%', label: 'Time entry accuracy',       direction: 'up'   },
      { value: 40, prefix: '-', suffix: '%', label: 'Fee write-offs',             direction: 'down' },
    ],
  },
  {
    icon: FinanceIcon, slug: 'finance', name: 'Finance',
    image: '/images/industries/finance.png',
    pain: 'Month-end is a manual sprint to reconcile accounts across systems that were never designed to talk to each other.',
    fix: 'Automated reconciliation that flags discrepancies in real time, turning month-end from a crisis into a review.',
    metrics: [
      { value: 70, prefix: '+', suffix: '%', label: 'Reconciliation speed',   direction: 'up'   },
      { value: 60, prefix: '-', suffix: '%', label: 'Month-end close time',    direction: 'down' },
      { value: 95, prefix: '+', suffix: '%', label: 'Error detection rate',    direction: 'up'   },
      { value: 80, prefix: '-', suffix: '%', label: 'Manual data entries',     direction: 'down' },
    ],
  },
  {
    icon: HRIcon, slug: 'hr', name: 'HR',
    image: '/images/industries/hr.png',
    pain: 'Onboarding a new hire means chasing signatures, IT tickets, and induction bookings across half a dozen tools.',
    fix: 'A single triggered workflow on day one: contracts out, access set up, training scheduled, no coordinator chasing anyone.',
    metrics: [
      { value: 85, prefix: '+', suffix: '%', label: 'Onboarding completion',  direction: 'up'   },
      { value: 75, prefix: '-', suffix: '%', label: 'Admin per new hire',      direction: 'down' },
      { value: 60, prefix: '+', suffix: '%', label: 'Speed to productivity',   direction: 'up'   },
      { value: 90, prefix: '-', suffix: '%', label: 'Missed induction steps',  direction: 'down' },
    ],
  },
  {
    icon: EcommerceIcon, slug: 'ecommerce', name: 'E-commerce',
    image: '/images/industries/ecommerce.png',
    pain: 'Orders, returns, and fulfilment run across separate systems. Overselling, shipping errors, and refund delays are a regular occurrence.',
    fix: 'Unified order management with live inventory sync, automated fulfilment triggers, and returns handled without manual input.',
    metrics: [
      { value: 95, prefix: '+', suffix: '%', label: 'Inventory accuracy',    direction: 'up'   },
      { value: 70, prefix: '-', suffix: '%', label: 'Overselling incidents',  direction: 'down' },
      { value: 40, prefix: '+', suffix: '%', label: 'Fulfilment speed',       direction: 'up'   },
      { value: 55, prefix: '-', suffix: '%', label: 'Manual input per order', direction: 'down' },
    ],
  },
  {
    icon: SupportIcon, slug: 'customer-support', name: 'Customer Support',
    image: '/images/industries/customer-support.png',
    pain: 'Tickets arrive from email, chat, and social. Agents triage manually, and customers wait too long for answers to simple questions.',
    fix: 'Intelligent triage routes tickets automatically, handles tier-one queries instantly, and keeps agents on the issues that need them.',
    metrics: [
      { value: 65, prefix: '+', suffix: '%', label: 'First-contact resolution', direction: 'up'   },
      { value: 50, prefix: '-', suffix: '%', label: 'Average response time',     direction: 'down' },
      { value: 3,  suffix: '×',              label: 'Ticket handling speed',     direction: 'up'   },
      { value: 45, prefix: '-', suffix: '%', label: 'Escalation rate',           direction: 'down' },
    ],
  },
  {
    icon: RecruitmentIcon, slug: 'recruitment', name: 'Recruitment',
    image: '/images/industries/recruitment.png',
    pain: 'CVs arrive by email, shortlisting is manual, and interview scheduling takes days of back-and-forth with every candidate.',
    fix: 'Automated screening, calendar-linked scheduling, and a live pipeline that keeps consultants closing deals, not chasing admin.',
    metrics: [
      { value: 180, prefix: '+', suffix: '%', label: 'Applications screened/wk', direction: 'up'   },
      { value: 70,  prefix: '-', suffix: '%', label: 'Admin per placement',       direction: 'down' },
      { value: 60,  prefix: '+', suffix: '%', label: 'Placement speed',           direction: 'up'   },
      { value: 4,   prefix: '-', suffix: 'd', label: 'Days per hire',             direction: 'down' },
    ],
  },
  {
    icon: SalesIcon, slug: 'sales', name: 'Sales',
    image: '/images/industries/sales.png',
    pain: 'Proposals take an afternoon to build. Follow-ups fall through the cracks. Pipeline data is whatever people bothered to update last.',
    fix: 'Proposals generated from a brief in minutes, automatic follow-up sequences, and a CRM that updates itself from real activity.',
    metrics: [
      { value: 220, prefix: '+', suffix: '%', label: 'Proposal output',        direction: 'up'   },
      { value: 75,  prefix: '-', suffix: '%', label: 'Proposal build time',     direction: 'down' },
      { value: 35,  prefix: '+', suffix: '%', label: 'Close rate',              direction: 'up'   },
      { value: 60,  prefix: '-', suffix: '%', label: 'Follow-up failures',      direction: 'down' },
    ],
  },
]

/**
 * Pinned horizontal gallery for desktop: vertical scroll locks while panels slide
 * sideways. First panel is a title slide; remaining panels are industry detail screens.
 *
 * GSAP init runs inside setTimeout(150ms) inside useLayoutEffect so the browser
 * has completed its layout pass and container.offsetWidth is accurate before
 * ScrollTrigger calculates pin geometry.
 *
 * Mobile: compact 2-column image-card grid linking to the bottleneck checker.
 */
const HorizontalGallery = ({
  blocks, eyebrow, title, lede, surface,
}: {
  blocks: IndustryBlock[]
  eyebrow: string
  title: string
  lede: string
  surface: 'workshop' | 'dream'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const totalPanels = blocks.length + 1  // +1 for title slide
  const isDark = surface === 'dream'

  useLayoutEffect(() => {
    let ctx: gsap.Context | undefined

    // 150ms safety delay: ensures DOM is fully painted and widths are accurate
    // before ScrollTrigger measures the container for pin geometry.
    const timer = setTimeout(() => {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: () => -(window.innerWidth * (totalPanels - 1)),
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${window.innerWidth * (totalPanels - 1)}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                Math.round(self.progress * (totalPanels - 1)),
                totalPanels - 1,
              )
              dotRefs.current.forEach((dot, i) => {
                if (!dot) return
                dot.style.width = i === idx ? '2rem' : '0.5rem'
                dot.style.opacity = i === idx ? '1' : '0.4'
              })
            },
          },
        })
      }, container)
    }, 150)

    return () => {
      clearTimeout(timer)
      ctx?.revert()
    }
  }, [totalPanels])

  return (
    <>
      {/* ── Desktop: GSAP-pinned horizontal gallery ── */}
      <div
        ref={containerRef}
        className="relative hidden overflow-hidden md:block"
        style={{ height: '100vh' }}
        aria-label={`${eyebrow} gallery`}
      >
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ width: `${totalPanels * 100}vw`, willChange: 'transform' }}
        >
          {/* Panel 0 — title slide */}
          <div
            className={`relative flex h-full w-screen flex-shrink-0 items-center justify-center px-12 ${isDark ? 'bg-navy-deep' : 'bg-offwhite'}`}
          >
            <div className="max-w-2xl text-center">
              <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-violet-ray">
                {eyebrow}
              </span>
              <h2 className={`mt-3 font-heading text-4xl font-bold leading-tight lg:text-5xl ${isDark ? 'text-offwhite' : 'text-navy-deep'}`}>
                {title}
              </h2>
              <p className={`mt-5 font-body text-lg leading-relaxed ${isDark ? 'text-offwhite/70' : 'text-navy-deep/70'}`}>
                {lede}
              </p>
              <p
                className={`mt-10 font-body text-sm ${isDark ? 'text-offwhite/35' : 'text-navy-deep/35'}`}
                aria-hidden
              >
                Scroll to explore →
              </p>
            </div>
          </div>

          {/* Panels 1–N — industry detail panels */}
          {blocks.map((block, i) => {
            const BIcon = block.icon
            return (
              <div
                key={block.slug}
                className="relative flex h-full w-screen flex-shrink-0 items-center"
              >
                <img
                  src={block.image}
                  alt={`${block.name} industry`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  width={1200}
                  height={900}
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/35" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent" />

                <div className="relative z-10 max-w-xl px-12 lg:px-20">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-ray text-offwhite">
                      <BIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="font-body text-xs font-semibold uppercase tracking-widest text-offwhite/50">
                      {i + 1} of {blocks.length}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-offwhite lg:text-4xl">{block.name}</h2>
                  <p className="mt-5 font-body text-sm leading-relaxed text-offwhite/80 lg:text-base">
                    <span className="font-semibold text-offwhite">Common bottleneck: </span>
                    {block.pain}
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed text-offwhite/80 lg:text-base">
                    <span className="font-semibold text-offwhite">What we build: </span>
                    {block.fix}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-offwhite/15 pt-5">
                    {block.metrics.map(m => (
                      <MetricStat key={m.label} {...m} surface="dark" />
                    ))}
                  </div>
                  <p className="mt-2 font-body text-xs italic text-offwhite/30">{METRICS_NOTE}</p>
                  <Link
                    to={`/tools/bottleneck-check?industry=${block.slug}`}
                    className="mt-5 inline-flex items-center gap-2 font-body text-sm font-bold text-cyan-strong hover:underline"
                  >
                    Check your {block.name.toLowerCase()} bottleneck
                    <ArrowRightIcon className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress dots — updated via DOM refs in onUpdate, no re-renders on scroll */}
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2"
          aria-hidden
        >
          {Array.from({ length: totalPanels }, (_, i) => (
            <div
              key={i}
              ref={el => { dotRefs.current[i] = el }}
              className="h-1.5 rounded-full bg-violet-ray transition-all duration-300"
              style={{ width: i === 0 ? '2rem' : '0.5rem', opacity: i === 0 ? '1' : '0.4' }}
            />
          ))}
        </div>
      </div>

      {/* ── Mobile: full industry content stack — same layout as before ── */}
      <div className={`md:hidden ${isDark ? 'bg-navy-deep' : 'bg-offwhite'}`}>
        <div className="px-6 pb-8 pt-16">
          <Reveal>
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-violet-ray">
              {eyebrow}
            </span>
            <h2 className={`mt-3 font-heading text-2xl font-bold leading-snug ${isDark ? 'text-offwhite' : 'text-navy-deep'}`}>
              {title}
            </h2>
            <p className={`mt-4 font-body text-base leading-relaxed ${isDark ? 'text-offwhite/75' : 'text-navy-deep/75'}`}>
              {lede}
            </p>
          </Reveal>
        </div>
        <div className="space-y-10 px-6 pb-16">
          {blocks.map((block) => {
            const BIcon = block.icon
            const textBase = isDark ? 'text-offwhite' : 'text-navy-deep'
            const textMuted = isDark ? 'text-offwhite/75' : 'text-navy-deep/75'
            const dividerCls = isDark ? 'border-offwhite/10' : 'border-navy-deep/10'
            const noteCls = isDark ? 'text-offwhite/35' : 'text-navy-deep/35'
            const linkCls = isDark ? 'text-cyan-strong' : 'text-violet-ray'
            return (
              <div key={block.slug}>
                {/* Full industry content */}
                <div className="mb-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-ray text-offwhite">
                      <BIcon className="h-4 w-4" aria-hidden />
                    </span>
                    <h3 className={`font-heading text-xl font-semibold ${textBase}`}>{block.name}</h3>
                  </div>
                  <p className={`mt-3 font-body text-sm leading-relaxed ${textMuted}`}>
                    <strong className="font-medium">An example of a common bottleneck:</strong>{' '}{block.pain}
                  </p>
                  <p className={`mt-2 font-body text-sm leading-relaxed ${textMuted}`}>
                    <strong className="font-medium">What we build:</strong>{' '}{block.fix}
                  </p>
                  <div className={`mt-4 grid grid-cols-2 gap-3 border-t ${dividerCls} pt-4`}>
                    {block.metrics.map(m => (
                      <MetricStat key={m.label} {...m} surface={isDark ? 'dark' : 'light'} />
                    ))}
                  </div>
                  <p className={`mt-2 font-body text-xs italic ${noteCls}`}>{METRICS_NOTE}</p>
                  <Link
                    to={`/tools/bottleneck-check?industry=${block.slug}`}
                    className={`mt-4 inline-flex items-center gap-2 font-body text-xs font-bold hover:underline ${linkCls}`}
                  >
                    Check your {block.name.toLowerCase()} bottleneck
                    <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </div>
                {/* Industry image */}
                <div className="relative overflow-hidden rounded-card">
                  <img
                    src={block.image}
                    alt={`${block.name} industry`}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-navy-deep/90 via-navy-deep/50 to-violet-ray/50 mix-blend-multiply" />
                  <span className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-violet-ray text-offwhite">
                    <BIcon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="absolute bottom-[18px] left-[60px] font-heading text-base font-semibold text-offwhite">
                    {block.name}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

/** Blue-collar and service SME verticals as GSAP-pinned horizontal scroll galleries. */
export const IndustriesPage = () => (
  <>
    <Seo
      title="Who We Serve: Blue-Collar & Service SMEs — Cleaning, Legal, Finance, HR and More"
      description="AI automation for blue-collar and service SMEs: cleaning, construction, legal, finance, HR, e-commerce and more. Find your field and see examples of common bottlenecks we fix."
      path="/industries"
      jsonLd={[breadcrumbs(['Who We Serve', '/industries'])]}
    />
    <PageHero
      eyebrow="Who We Serve"
      title="Your industry's bottlenecks, not generic ones"
      lede="We build for blue-collar and service SMEs alike. Find yours below and see just some examples of what we could fix."
      background={<BubblePitBackground />}
    />

    <HorizontalGallery
      blocks={PHYSICAL_BLOCKS}
      eyebrow="Blue-collar SMEs"
      title="Built for the businesses that build the world"
      lede="If your work happens in vans, on sites, and in buildings, not just behind desks, you are exactly who we built Dreamlabs for."
      surface="workshop"
    />

    <HorizontalGallery
      blocks={SERVICE_BLOCKS}
      eyebrow="Service SMEs"
      title="Built for the businesses that service the world"
      lede="If your business runs on client relationships, expertise, and fast-moving teams, Dreamlabs builds the systems that let you scale without adding headcount."
      surface="dream"
    />

    {/* CTA */}
    <Section surface="workshop" className="text-center">
      <Reveal>
        <h2 className="font-heading text-2xl font-semibold text-navy-deep md:text-[2rem]">
          Don't see your industry?
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-base text-navy-deep/75">
          The approach is the same wherever the bottleneck lives. If you run an SME with a
          problem worth fixing, the audit is still free.
        </p>
        <div className="mt-8">
          <Button variant="primary" href="/contact">Get your free audit</Button>
        </div>
      </Reveal>
    </Section>
  </>
)

/** React Router lazy-route entry. */
export const Component = IndustriesPage
