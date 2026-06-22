import type { AccordionItem } from '@/components/ui/Accordion'

/**
 * FAQ content — shared between the homepage (subset) and /faq (full set).
 * Every answer must pass the Plumber Test (Brief §2.5).
 */
export const FAQ_ITEMS: ReadonlyArray<AccordionItem> = [
  {
    question: 'How much does it cost?',
    answer:
      'Every project starts with a free audit, so you get a fixed price before committing to anything. Because our team comes through our own Academy rather than expensive contractors, the price is built for SME budgets, and you pilot the system before any retainer starts.',
  },
  {
    question: 'Who owns what you build?',
    answer:
      'You do. Outright. The code, the data, the accounts it runs on, everything is handed over in your name. No licence fees, no monthly ransom, and if we part ways, the system keeps working for you.',
  },
  {
    question: 'How long does it take?',
    answer:
      'Most systems are live in 2 to 8 weeks depending on size. You see working software early and often, not a big reveal at the end.',
  },
  {
    question: 'Will this replace my staff?',
    answer:
      'No. It takes the repetitive admin off their plate, the typing-up, the chasing, the double-entry, so the people you already have can do more of the work that actually earns money.',
  },
  {
    question: "What happens if it doesn't work?",
    answer:
      'Two safety nets. First, you pilot the system on real work before paying any retainer. Second, our money-back guarantee: if we do not deliver what we agreed, you always get your money back. It\'s as simple as that.',
  },
  {
    question: 'Is my business data safe?',
    answer:
      'Yes. Your data lives in your own accounts, not ours, with security controls (access rules, encryption, backups) built in from day one, and because you own the system, nothing about your business is locked inside someone else\'s platform.',
  },
  {
    question: 'We are not a "tech" business. Will my team actually use it?',
    answer:
      'That is exactly who we design for. Every system ships with a simple app built around how your team already works, tested with them during the pilot. If your team would not use it, it is not finished.',
  },
  {
    question: 'What does the free audit involve?',
    answer:
      'A conversation and a look at how work flows through your business, where jobs come in, where they get stuck, where time disappears. You get a clear written breakdown of what we would fix and what it would be worth. No pitch, no pressure, and it costs nothing.',
  },
  {
    question: 'Do you only work with blue-collar and service businesses?',
    answer:
      'They are who we built Dreamlabs for, and they are our main focus: the businesses that build and service the world. But the same approach applies to any SME or startup with a bottleneck worth fixing, free audit, pilot first, you own everything.',
  },
  {
    question: 'What if we already use software like a CRM or job-management app?',
    answer:
      'Good, we build around it. Most of our systems connect the tools you already pay for so they finally talk to each other, rather than asking you to rip anything out.',
  },
] as const

/** Subset shown on the homepage. */
export const HOME_FAQ_ITEMS = FAQ_ITEMS.slice(0, 6)
