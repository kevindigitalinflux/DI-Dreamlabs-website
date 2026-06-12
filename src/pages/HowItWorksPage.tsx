import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AuditIcon, BuildIcon, GuaranteeIcon, OwnIcon, PilotIcon } from '@/components/icons'
import { FAQ_ITEMS } from '@/lib/faqContent'
import { Seo, breadcrumbs } from '@/lib/Seo'

const STEPS = [
  {
    icon: AuditIcon,
    title: 'Step 1 — Free audit',
    duration: 'About a week',
    detail:
      'We visit (or video call), watch how work actually flows, and talk to the people doing it. You get a written breakdown: the bottlenecks we found, what each one costs you monthly, and what we would build first. It costs nothing and you keep the breakdown either way.',
  },
  {
    icon: BuildIcon,
    title: 'Step 2 — Build',
    duration: '2–8 weeks',
    detail:
      'We design and build the system around your real jobs and your real team. You see working software early — usually within the first fortnight — and your feedback steers the build, not a change-request form.',
  },
  {
    icon: PilotIcon,
    title: 'Step 3 — Pilot',
    duration: '2–4 weeks on real work',
    detail:
      'The system runs on live jobs with your team using it for real. We measure the difference against the audit numbers. No retainer starts until the pilot proves itself — and if it does not, the money-back guarantee applies.',
  },
  {
    icon: OwnIcon,
    title: 'Step 4 — Own & scale',
    duration: 'Ongoing, on your terms',
    detail:
      'Everything transfers to your name: code, accounts, data. You can run it yourself from day one. If you want us to keep improving it, that is a choice — never a dependency.',
  },
] as const

const PILOT_FAQS = FAQ_ITEMS.filter((item) =>
  ['How much does it cost?', "What happens if it doesn't work?", 'Who owns what you build?'].includes(
    item.question,
  ),
)

/** The process page — Free Audit → Build → Pilot → Own & Scale (Brief §5). */
export const HowItWorksPage = () => (
  <>
    <Seo
      title="How It Works — Free Audit, Build, Pilot, Own"
      description="Our four-step process: free audit, 2–8 week build, pilot on real work before any retainer, then you own the system outright — backed by a money-back guarantee."
      path="/how-it-works"
      jsonLd={[breadcrumbs(['How It Works', '/how-it-works'])]}
    />
    <PageHero
      eyebrow="How it works"
      title="From first chat to a system you own"
      lede="Four steps. The expensive mistakes — paying upfront, getting locked in, buying promises — are designed out."
    />

    <Section surface="workshop">
      <div className="mx-auto max-w-3xl space-y-8">
        {STEPS.map(({ icon: Icon, title, duration, detail }, i) => (
          <Reveal key={title} delay={i * 80}>
            <Card surface="light" className="flex gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-deep text-cyan-strong">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-heading text-lg font-semibold text-navy-deep md:text-[1.375rem]">
                    {title}
                  </h2>
                  <span className="font-body text-sm font-light text-rebecca">{duration}</span>
                </div>
                <p className="mt-2 font-body text-base leading-relaxed text-navy-deep/75">
                  {detail}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>

    <Section surface="dream">
      <Reveal>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <GuaranteeIcon className="h-12 w-12 text-violet-ray" aria-hidden />
          <h2 className="font-heading text-2xl font-semibold text-offwhite md:text-[2rem]">
            The money-back guarantee, in plain English
          </h2>
          <p className="font-body text-base leading-relaxed text-offwhite/80">
            Before we build, we agree in writing what the system must do and what result it must
            deliver. If the pilot does not hit that bar and we cannot fix it, you get your money
            back. Not credit, not a discount on more work — your money back.
          </p>
        </div>
      </Reveal>
    </Section>

    <Section surface="workshop">
      <Reveal>
        <SectionHeading
          eyebrow="Common questions at this stage"
          title="Before you book the audit"
          surface="light"
        />
      </Reveal>
      <Reveal className="mx-auto mt-10 max-w-3xl">
        <Accordion items={[...PILOT_FAQS]} />
      </Reveal>
      <Reveal className="mt-12 text-center">
        <Button variant="primary" href="/contact">
          Book your free audit
        </Button>
      </Reveal>
    </Section>
  </>
)

/** React Router lazy-route entry. */
export const Component = HowItWorksPage
