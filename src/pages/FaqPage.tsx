import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { FAQ_ITEMS } from '@/lib/faqContent'
import { Seo, breadcrumbs } from '@/lib/Seo'

/** Full objection-handling FAQ (Brief §5). */
export const FaqPage = () => (
  <>
    <Seo
      title="FAQ — Cost, Ownership, Timelines, Guarantee"
      description="Straight answers about working with Dreamlabs: what it costs, who owns the system, how long it takes, what happens if it doesn't work, and whether your team will use it."
      path="/faq"
      jsonLd={[
        breadcrumbs(['FAQ', '/faq']),
        {
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
          })),
        },
      ]}
    />
    <PageHero
      eyebrow="FAQ"
      title="Straight answers to fair questions"
      lede="If yours is not here, ask us directly — we reply within one working day."
    />
    <Section surface="workshop">
      <Reveal className="mx-auto max-w-3xl">
        <Accordion items={[...FAQ_ITEMS]} />
      </Reveal>
      <Reveal className="mt-12 text-center">
        <Button variant="primary" href="/contact">
          Ask us anything — book the free audit
        </Button>
      </Reveal>
    </Section>
  </>
)
