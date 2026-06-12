import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import {
  InventoryIcon,
  MissedCallIcon,
  PaperworkIcon,
  QuoteIcon,
  ScheduleIcon,
  VisibilityIcon,
} from '@/components/icons'

const PAIN_POINTS = [
  {
    icon: MissedCallIcon,
    title: 'Missed calls, lost jobs',
    body: 'Every call that rings out while your team is on the tools is work going to a competitor.',
  },
  {
    icon: ScheduleIcon,
    title: 'Scheduling chaos',
    body: 'Rotas in one place, jobs in another, changes by text. One sick day and the whole week wobbles.',
  },
  {
    icon: VisibilityIcon,
    title: 'No real-time job visibility',
    body: 'You find out a job went wrong when the client rings you — not when it happened.',
  },
  {
    icon: QuoteIcon,
    title: 'Slow quoting',
    body: 'Quotes take days because the numbers live in your head and three different spreadsheets.',
  },
  {
    icon: PaperworkIcon,
    title: 'Paper-based admin',
    body: 'Timesheets, job sheets, invoices — hours of typing up things that were already written down once.',
  },
  {
    icon: InventoryIcon,
    title: 'Stock surprises',
    body: 'You discover you are out of supplies on the morning you need them, not the week before.',
  },
] as const

/** Section 1 — name the pain before pitching the solution (Brief §7). */
export const PainPoints = () => (
  <Section surface="dream" orbs>
    <Reveal>
      <SectionHeading
        eyebrow="Sound familiar?"
        title="The bottlenecks quietly eating your week"
        lede="Every growing service business hits the same walls. They are not a sign something is wrong — they are a sign you have outgrown the way things are done by hand."
        surface="dark"
      />
    </Reveal>
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {PAIN_POINTS.map(({ icon: Icon, title, body }, i) => (
        <Reveal key={title} delay={i * 100}>
          <Card surface="dark" className="h-full">
            <Icon className="h-8 w-8 text-cyan-strong" aria-hidden />
            <h3 className="mt-4 font-heading text-lg font-semibold text-offwhite">{title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-offwhite/75">{body}</p>
          </Card>
        </Reveal>
      ))}
    </div>
  </Section>
)
