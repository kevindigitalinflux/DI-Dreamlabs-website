import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { SfCloudBackground } from '@/components/interactive/atmosphere/SfCloudBackground'
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

/** Count-up animation that triggers once on scroll entry. dim = white variant for time column. */
const PainCounter = ({ prefix = '', value, suffix = '', durationMs = 1600, dim = false }: CountStat & { dim?: boolean }) => {
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
    <span ref={ref} className={`font-heading text-2xl font-extrabold tabular-nums ${dim ? 'text-offwhite' : 'text-cyan-strong'}`}>
      {prefix}{count.toLocaleString('en-GB')}{suffix}
    </span>
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
    body: 'Timesheets, job sheets, invoices, hours spent retyping what was already written down once, by people who could be on a job or closing the next one.',
    metric: '36% of UK SMEs cite rising operating costs as a top business obstacle',
    moneyStat: { value: 56, suffix: '%' },
    moneyLabel: 'of businesses extending credit say late payment is a problem, often driven by paper invoicing delays',
    timeStat: { value: 10, suffix: '+ hrs/wk' },
    timeLabel: 'per employee on data re-entry, chasing signatures, and manual admin',
  },
  {
    icon: InventoryIcon,
    title: 'Stock surprises',
    body: 'You find out you are out of a critical supply on the morning you need it, and someone burns half a day finding an emergency solution instead of doing the job.',
    metric: '30% of UK SME employers say late payment is a current problem',
    moneyStat: { value: 59, suffix: ' days' },
    moneyLabel: 'the average time businesses wait to be paid, cash that should be in your supply chain',
    timeStat: { value: 3, suffix: '+ hrs/wk' },
    timeLabel: 'on emergency supply runs and reactive reordering instead of planned procurement',
  },
]

/** Section 1 — ICP pain with time and revenue loss framing per card; count-up on scroll entry. */
export const PainPoints = () => (
  <Section
    surface="dream"
    elevateContent
    id="sound-familiar"
    className="z-10"
    background={<SfCloudBackground />}
  >
    <div aria-hidden className="h-[8vh]" />
    <Reveal>
      <div className="mx-auto max-w-2xl rounded-card border border-offwhite/15 bg-navy-deep/55 px-6 py-8 backdrop-blur-md md:px-10 md:py-10">
        <SectionHeading
          eyebrow="Sound familiar?"
          title="Every week you don't fix this, you lose time and money you'll never get back"
          lede="Blue-collar or service business, the pattern is the same: the average SME loses 20 to 30% of potential revenue to operational bottlenecks it can see but has not fixed. These are the six we find most often."
          surface="dark"
        />
      </div>
    </Reveal>
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {PAIN_POINTS.map(({ icon: Icon, title, body, metric, moneyStat, moneyLabel, timeStat, timeLabel }, i) => (
        <Reveal key={title} delay={i * 100} className="h-full">
          <Card surface="glass" className="flex h-full flex-col">
            <Icon className="h-8 w-8 text-cyan-strong" aria-hidden />
            <h3 className="mt-4 font-heading text-lg font-semibold text-offwhite">{title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-offwhite/75">{body}</p>
            <div className="mt-auto border-t border-offwhite/10 pt-5">
              <p className="font-body text-xs uppercase tracking-wider text-offwhite/40">{metric}</p>
              <div className="mt-3 grid grid-cols-2 divide-x divide-offwhite/10">
                <div className="pr-4">
                  <PainCounter {...moneyStat} />
                  <p className="mt-1 font-body text-xs leading-relaxed text-offwhite/55">{moneyLabel}</p>
                </div>
                <div className="pl-4">
                  <PainCounter {...timeStat} dim />
                  <p className="mt-1 font-body text-xs leading-relaxed text-offwhite/55">{timeLabel}</p>
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  </Section>
)
