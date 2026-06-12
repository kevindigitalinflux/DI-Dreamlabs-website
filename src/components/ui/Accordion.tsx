import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDownIcon } from '@/components/icons'

export type AccordionItem = {
  question: string
  answer: string
}

type AccordionProps = {
  items: ReadonlyArray<AccordionItem>
}

/** Keyboard-accessible disclosure list for FAQs (Brief §7.8). */
export const Accordion = ({ items }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const baseId = useId()
  const reduceMotion = useReducedMotion()

  return (
    <div className="divide-y divide-navy-deep/10 rounded-card bg-white shadow-card">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const buttonId = `${baseId}-q${i}`
        const panelId = `${baseId}-a${i}`
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-heading text-base font-semibold text-navy-deep transition-colors hover:text-violet-ray md:text-lg"
              >
                {item.question}
                <ChevronDownIcon
                  className={`h-5 w-5 shrink-0 text-violet-ray transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 font-body text-base leading-relaxed text-navy-deep/80">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
