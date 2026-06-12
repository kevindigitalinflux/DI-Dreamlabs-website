import { Link } from 'react-router-dom'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Accordion } from '@/components/ui/Accordion'
import { HOME_FAQ_ITEMS } from '@/lib/faqContent'

/** Section 8 — objection handling (Brief §7). */
export const Faq = () => (
  <Section surface="workshop">
    <Reveal>
      <SectionHeading
        eyebrow="Questions, answered straight"
        title="The things you'd ask us over a brew"
        surface="light"
      />
    </Reveal>
    <Reveal className="mx-auto mt-12 max-w-3xl">
      <Accordion items={[...HOME_FAQ_ITEMS]} />
      <p className="mt-6 text-center font-body text-base text-navy-deep/75">
        More questions?{' '}
        <Link to="/faq" className="font-bold text-violet-ray hover:underline">
          See the full FAQ
        </Link>
      </p>
    </Reveal>
  </Section>
)
