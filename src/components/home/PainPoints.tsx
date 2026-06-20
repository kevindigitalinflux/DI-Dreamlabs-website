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
type PainCard = {
  icon: IconFn
  title: string
  body: string
  metric: string
  bigNumber: string
  bigNumberLabel: string
}

const PAIN_POINTS: PainCard[] = [
  {
    icon: MissedCallIcon,
    title: 'Missed calls, lost jobs',
    body: 'Every call that rings out while your team is on the tools is revenue walking to a competitor who picked up. Most businesses never track what it actually costs them.',
    metric: '62% of small-business calls go unanswered',
    bigNumber: '$126k',
    bigNumberLabel: 'average annual revenue lost from missed calls — for the typical service business',
  },
  {
    icon: ScheduleIcon,
    title: 'Scheduling chaos',
    body: 'Rotas in one place, jobs in another, changes by text. No-shows and last-minute cancellations mean your crew never runs at full capacity.',
    metric: 'no-shows and cancellations directly cut booked revenue and crew productivity',
    bigNumber: '1 in 5',
    bigNumberLabel: 'scheduled jobs disrupted each week by a no-show, cancellation, or last-minute change',
  },
  {
    icon: VisibilityIcon,
    title: 'No real-time job visibility',
    body: 'You find out a job went wrong when the client rings you. Broken handoffs between field and office cause rework, disputes, and delays that were entirely preventable.',
    metric: 'broken job handoffs are a top driver of field service rework',
    bigNumber: '1 in 4',
    bigNumberLabel: 'field jobs leads to a return visit, dispute call, or rework because the office was not updated in time',
  },
  {
    icon: QuoteIcon,
    title: 'Slow quoting',
    body: 'Quotes go out days after the site visit. By the time yours lands, the lead has already said yes to whoever replied same day.',
    metric: 'slow lead response is a top driver of lost service revenue',
    bigNumber: '$76,800',
    bigNumberLabel: 'in annual revenue lost from slow follow-up — on exactly the same lead volume',
  },
  {
    icon: PaperworkIcon,
    title: 'Paper-based admin',
    body: 'Timesheets, job sheets, invoices — hours spent retyping what was already written down once, by people who could be on a job.',
    metric: '36% of UK SMEs cite rising operating costs as a top business obstacle',
    bigNumber: '56%',
    bigNumberLabel: 'of businesses extending credit say late payment is a problem — often driven by paper invoicing delays',
  },
  {
    icon: InventoryIcon,
    title: 'Stock surprises',
    body: 'You find out you are out of a critical supply on the morning you need it. And when invoices sit unpaid for weeks, there is no cash to restock ahead of time.',
    metric: '30% of UK SME employers say late payment is a current problem',
    bigNumber: '59 days',
    bigNumberLabel: 'the average time businesses wait to be paid — cash that should be in your supply chain',
  },
]

/** Section 1 — ICP pain with profit/time loss framing and metric impact per card. */
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
          title="Every week you don't fix this, you lose money you'll never get back"
          lede="The average service SME loses 20–30% of potential revenue to bottlenecks it can see but can't fix. These are the six we find most often."
          surface="dark"
        />
      </div>
    </Reveal>
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {PAIN_POINTS.map(({ icon: Icon, title, body, metric, bigNumber, bigNumberLabel }, i) => (
        <Reveal key={title} delay={i * 100} className="h-full">
          <Card surface="glass" className="flex h-full flex-col">
            <Icon className="h-8 w-8 text-cyan-strong" aria-hidden />
            <h3 className="mt-4 font-heading text-lg font-semibold text-offwhite">{title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-offwhite/75">{body}</p>
            <div className="mt-auto border-t border-offwhite/10 pt-5">
              <p className="font-body text-xs uppercase tracking-wider text-offwhite/40">{metric}</p>
              <p className="mt-2 font-heading text-3xl font-bold text-offwhite">{bigNumber}</p>
              <p className="mt-1 font-body text-xs leading-relaxed text-offwhite/60">{bigNumberLabel}</p>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  </Section>
)
