import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SfCloudBackground } from '@/components/interactive/atmosphere/SfCloudBackground'

gsap.registerPlugin(ScrollTrigger, useGSAP)
import {
  InventoryIcon,
  MissedCallIcon,
  PaperworkIcon,
  QuoteIcon,
  ScheduleIcon,
  VisibilityIcon,
} from '@/components/icons'

type IconFn = (props: { className?: string; 'aria-hidden'?: boolean }) => JSX.Element
type CountStat = { prefix?: string; value: number; suffix?: string; durationMs?: number }
type PainCard = {
  icon: IconFn; title: string; body: string; metric: string
  moneyStat: CountStat; moneyLabel: string
  timeStat: CountStat; timeLabel: string
}

type AccentKey = 'violet' | 'cyan' | 'magenta'

const CARD_ACCENTS: AccentKey[] = ['violet', 'cyan', 'magenta', 'violet', 'cyan', 'magenta']

const ACCENT = {
  violet: {
    bar: 'from-violet-ray/70 via-violet-ray/40 to-transparent',
    icon: 'bg-violet-ray/15 text-violet-ray',
    border: 'border-violet-ray/20',
    counter: 'text-violet-ray',
    glow: '0 0 32px -4px rgba(139,50,255,0.25)',
    moneyColor: 'text-violet-ray',
  },
  cyan: {
    bar: 'from-cyan-strong/70 via-cyan-strong/40 to-transparent',
    icon: 'bg-cyan-strong/15 text-cyan-strong',
    border: 'border-cyan-strong/20',
    counter: 'text-cyan-strong',
    glow: '0 0 32px -4px rgba(0,223,223,0.2)',
    moneyColor: 'text-cyan-strong',
  },
  magenta: {
    bar: 'from-magenta-bloom/70 via-magenta-bloom/40 to-transparent',
    icon: 'bg-magenta-bloom/15 text-magenta-bloom',
    border: 'border-magenta-bloom/20',
    counter: 'text-magenta-bloom',
    glow: '0 0 32px -4px rgba(240,56,107,0.2)',
    moneyColor: 'text-magenta-bloom',
  },
}

/** Count-up animation that triggers once on scroll entry. */
const PainCounter = ({
  prefix = '', value, suffix = '', durationMs = 1600, colorClass,
}: CountStat & { colorClass: string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) { setCount(value); return }
    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / (durationMs ?? 1600), 1)
      setCount(Math.round(value * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, durationMs, reduceMotion])

  return (
    <span ref={ref} className={`font-heading text-2xl font-extrabold tabular-nums ${colorClass}`}>
      {prefix}{count.toLocaleString('en-GB')}{suffix}
    </span>
  )
}

/**
 * Individual stacking pain card — solid, accent-coloured border and top bar to
 * contrast sharply with the glassy "Sound Familiar" header card above.
 * Accent colour cycles through violet → cyan → magenta across the 6 cards.
 */
const StackCard = ({
  icon: Icon, title, body, metric, moneyStat, moneyLabel,
  timeStat, timeLabel, index, total,
}: PainCard & { index: number; total: number }) => {
  const accentKey = CARD_ACCENTS[index]
  const a = ACCENT[accentKey]

  return (
    <div
      className={`relative overflow-hidden rounded-card border ${a.border} bg-[#050b3d]`}
      style={{ boxShadow: a.glow }}
    >
      {/* Coloured bar — thicker so it's visible as a peek-tab when cards stack */}
      <div className={`h-[3px] bg-gradient-to-r ${a.bar}`} />

      <div className="p-6 md:p-8">
        {/* Header row: icon + title + card counter */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${a.icon}`}>
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="font-heading text-lg font-semibold leading-snug text-offwhite md:text-xl">
              {title}
            </h3>
          </div>
          {/* Counter badge (01/06 etc.) orients the user in the deck */}
          <span className={`shrink-0 font-body text-xs font-medium tabular-nums opacity-50 ${a.counter}`}>
            {String(index + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(total).padStart(2, '0')}
          </span>
        </div>

        <p className="mt-4 font-body text-sm leading-relaxed text-offwhite/70 md:text-base">
          {body}
        </p>

        {/* Stat panel — inset dark surface for maximum number legibility */}
        <div className="mt-6 rounded-xl bg-navy-deep/70 p-5">
          <p className="mb-4 font-body text-[0.7rem] uppercase tracking-widest text-offwhite/35">
            {metric}
          </p>
          <div className="grid grid-cols-2 divide-x divide-offwhite/8">
            <div className="pr-4">
              <PainCounter {...moneyStat} colorClass={a.moneyColor} />
              <p className="mt-1.5 font-body text-xs leading-relaxed text-offwhite/50">{moneyLabel}</p>
            </div>
            <div className="pl-4">
              <PainCounter {...timeStat} colorClass="text-offwhite" />
              <p className="mt-1.5 font-body text-xs leading-relaxed text-offwhite/50">{timeLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Glassy header card for the "Sound Familiar" section intro. */
const GlowCard = ({ children }: { children: ReactNode }) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current; const border = borderRef.current; const glow = glowRef.current
    if (!el || !border || !glow) return
    const rect = el.getBoundingClientRect()
    const cx = rect.width / 2; const cy = rect.height / 2
    const dx = e.clientX - rect.left - cx; const dy = e.clientY - rect.top - cy
    let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90
    if (deg < 0) deg += 360
    const kx = Math.abs(dx) > 0.5 ? cx / Math.abs(dx) : Infinity
    const ky = Math.abs(dy) > 0.5 ? cy / Math.abs(dy) : Infinity
    const edge = Math.min(1 / Math.min(kx, ky), 1)
    const mask = `conic-gradient(from ${deg.toFixed(1)}deg at center, #000 20%, transparent 42%, transparent 58%, #000 80%)`
    border.style.opacity = Math.max(0, (edge - 0.15) / 0.85).toFixed(3)
    border.style.setProperty('mask-image', mask)
    border.style.setProperty('-webkit-mask-image', mask)
    glow.style.opacity = Math.max(0, (edge - 0.1) / 0.9).toFixed(3)
  }

  const handlePointerLeave = () => {
    if (borderRef.current) borderRef.current.style.opacity = '0'
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }

  return (
    <div ref={wrapRef} className="relative" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <div ref={borderRef} aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-card"
        style={{ border: '1.5px solid rgba(139,50,255,0.85)', opacity: '0', transition: 'opacity 120ms ease-out' }} />
      <div ref={glowRef} aria-hidden className="pointer-events-none absolute -inset-px z-0 rounded-card"
        style={{ boxShadow: '0 0 22px -3px rgba(139,50,255,0.45)', opacity: '0', transition: 'opacity 120ms ease-out' }} />
      <div className="relative z-[5] rounded-card border border-offwhite/10 bg-navy-deep/55 p-6 backdrop-blur-md md:px-10 md:py-10">
        {children}
      </div>
    </div>
  )
}

const PAIN_POINTS: PainCard[] = [
  {
    icon: MissedCallIcon,
    title: 'Missed calls, lost jobs',
    body: 'Every call that rings out while your team is on the tools is revenue walking to a competitor, along with the hours your staff spend chasing it back down.',
    metric: '62% of small-business calls go unanswered',
    moneyStat: { prefix: '$', value: 126000, suffix: '/yr' },
    moneyLabel: 'average revenue lost from missed calls per year',
    timeStat: { value: 3, suffix: '+ hrs/wk' },
    timeLabel: 'chasing missed enquiries, redialling, and following up manually',
  },
  {
    icon: ScheduleIcon,
    title: 'Scheduling chaos',
    body: 'Rotas in one place, jobs in another, changes by text. No-shows and last-minute cancellations eat hours of coordinator time and mean your crew never runs at full capacity.',
    metric: 'no-shows and cancellations directly cut booked revenue and crew productivity',
    moneyStat: { prefix: '1 in ', value: 5, suffix: '' },
    moneyLabel: 'scheduled jobs disrupted by a no-show, cancellation, or last-minute change each week',
    timeStat: { value: 8, suffix: '+ hrs/wk' },
    timeLabel: 'lost to manual scheduling, rescheduling, and dispatch coordination',
  },
  {
    icon: VisibilityIcon,
    title: 'No real-time job visibility',
    body: 'You find out a job went wrong when the client rings you. Broken handoffs between field and office drive rework, disputes, and hours of reactive admin that should not exist.',
    metric: 'broken job handoffs are a top driver of field service rework',
    moneyStat: { prefix: '1 in ', value: 4, suffix: '' },
    moneyLabel: 'field jobs leads to a return visit, dispute call, or rework due to poor visibility',
    timeStat: { value: 5, suffix: '+ hrs/wk' },
    timeLabel: 'on reactive calls, revisits, and avoidable rework',
  },
  {
    icon: QuoteIcon,
    title: 'Slow quoting',
    body: 'Quotes go out days after the site visit, and the hours building them from scratch could be on the tools. By the time yours lands, the lead has said yes to whoever replied same day.',
    metric: 'slow lead response is a top driver of lost service revenue',
    moneyStat: { prefix: '$', value: 76800, suffix: '/yr' },
    moneyLabel: 'in annual revenue lost from slow follow-up, on exactly the same lead volume',
    timeStat: { value: 4, suffix: '+ hrs per quote' },
    timeLabel: 'building each proposal manually from scratch, when it could take minutes',
  },
  {
    icon: PaperworkIcon,
    title: 'Paper-based admin',
    body: 'Timesheets, job sheets, invoices — hours spent retyping what was already written down once, by people who could be on a job or closing the next one.',
    metric: '36% of UK SMEs cite rising operating costs as a top business obstacle',
    moneyStat: { value: 56, suffix: '%' },
    moneyLabel: 'of businesses extending credit say late payment is a problem, often driven by paper invoicing delays',
    timeStat: { value: 10, suffix: '+ hrs/wk' },
    timeLabel: 'per employee on data re-entry, chasing signatures, and manual admin',
  },
  {
    icon: InventoryIcon,
    title: 'Stock surprises',
    body: 'You find out you\'re out of a critical supply on the morning you need it, and someone burns half a day finding an emergency solution instead of doing the job.',
    metric: '30% of UK SME employers say late payment is a current problem',
    moneyStat: { value: 59, suffix: ' days' },
    moneyLabel: 'the average time businesses wait to be paid — cash that should be in your supply chain',
    timeStat: { value: 3, suffix: '+ hrs/wk' },
    timeLabel: 'on emergency supply runs and reactive reordering instead of planned procurement',
  },
]

/**
 * GSAP-driven stacking cards component. Pins itself; each card slides in from
 * below as the user scrolls, building a visible deck with the previous cards'
 * coloured bars peeking above the current one.
 */
const StackingCards = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.pain-stack-card', containerRef.current)
      if (!cards.length) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // ALL cards start below the viewport — nothing is visible until GSAP
      // animates each one in. This prevents Card 1 from "popping" into view
      // when the user first scrolls into the section, and prevents any card
      // from overlapping the Sound Familiar header card above this container.
      gsap.set(cards, { y: window.innerHeight })

      if (reduceMotion) {
        gsap.set(cards, { y: 0 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80px',
          end: `+=${cards.length * 550}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      })

      // Animate all 6 cards in sequence, one per timeline slot
      cards.forEach((card, idx) => {
        tl.to(card, { y: 0, ease: 'none', duration: 1 }, idx)
      })
    },
    { scope: containerRef },
  )

  return (
    // min-height sets the container height so the GSAP pin spacer reserves the
    // right amount of page space. All cards are absolute so they overlay each
    // other with the 10px top-stagger peek-tab effect. The Sound Familiar card
    // above this container stays in normal document flow and is never covered.
    <div
      ref={containerRef}
      className="relative mx-auto mt-10 max-w-2xl"
      style={{ minHeight: '520px' }}
    >
      {PAIN_POINTS.map((card, i) => (
        <div
          key={card.title}
          className="pain-stack-card"
          style={{ position: 'absolute', top: `${i * 10}px`, left: 0, right: 0, zIndex: i + 1 }}
        >
          <StackCard {...card} index={i} total={PAIN_POINTS.length} />
        </div>
      ))}
    </div>
  )
}

/**
 * Sound Familiar section — ICP pain points with stacking card scroll effect.
 * Each card is position:sticky so it slides over the previous one like a deck
 * as the user scrolls, keeping the section dynamic rather than a static list.
 */
export const PainPoints = () => (
  <Section
    surface="dream"
    elevateContent
    id="sound-familiar"
    className="z-10"
    background={<SfCloudBackground />}
  >
    <div aria-hidden className="h-[8vh]" />

    {/* Glassy header card — matches the hero's depth aesthetic */}
    <Reveal>
      <div className="mx-auto max-w-2xl">
        <GlowCard>
          <SectionHeading
            eyebrow="Sound familiar?"
            title="Every week you don't fix this, you lose time and money you'll never get back"
            surface="dark"
          />
          <p className="mt-4 text-center font-body text-base leading-relaxed text-offwhite/75 md:text-lg">
            Blue-collar or service business, the pattern is the same:{' '}
            <span className="font-bold text-offwhite">
              the average SME loses 20 to 30% of potential revenue to operational bottlenecks
            </span>
            {' '}it can see but has not fixed. These are the six we find most often.
          </p>
        </GlowCard>
      </div>
    </Reveal>

    {/*
      GSAP-driven stacking: the container is pinned at the top of the viewport.
      Cards 2-6 start off-screen below (y = window.innerHeight) and animate in
      one by one as the user scrolls through the pin runway. Each card slides up
      and stops at a progressive top offset (10px stagger) — earlier cards peek
      above later ones as visible coloured tabs, creating the deck-of-cards look.
      Card 1 (position:relative) sets the container height; cards 2-6 are
      position:absolute overlaying it. GSAP scrub drives the animation.
    */}
    <StackingCards />

    <div aria-hidden className="h-12" />
  </Section>
)
