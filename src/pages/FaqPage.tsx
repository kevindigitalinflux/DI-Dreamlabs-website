import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Accordion } from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { FAQ_ITEMS } from '@/lib/faqContent'

/** Full objection-handling FAQ (Brief §5). */
export const FaqPage = () => (
  <>
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
