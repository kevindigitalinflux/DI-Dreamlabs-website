import { useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { SlotWord } from '@/components/ui/SlotWord'

const SLOT_WORDS = [
  'Real business value',
  'Your time back',
  'An unfair competitive edge',
  'Unique selling points',
  'Scalability',
] as const

/*
 * Text split into lines so each renders as a block. The letter-reveal delay
 * increments continuously across all lines so the reveal sweeps the whole
 * statement left-to-right, top-to-bottom.
 *
 * Line layout (mobile-first):
 *   Line 1: "We don't sell AI, product"
 *   Line 2: "engineering or Automated systems. We sell"
 *   Line 3: [SlotWord alone — the purple rolladex]
 */
const LINES = [
  "We don't sell AI, product",
  'engineering or Automated systems.',
  'We sell',
] as const

const CHAR_DELAY_MS = 28
const REVEAL_DURATION_MS = 620

const totalStaticChars = LINES.reduce((n, l) => n + l.length, 0)
const SLOT_START_DELAY_MS = totalStaticChars * CHAR_DELAY_MS + REVEAL_DURATION_MS + 200

type LetterProps = {
  char: string
  delay: number
  inView: boolean
  reduceMotion: boolean | null
}

const Letter = ({ char, delay, inView, reduceMotion }: LetterProps) => (
  <span
    className="inline-block"
    style={
      inView || reduceMotion
        ? {
            animation: `letter-reveal ${REVEAL_DURATION_MS}ms ease both`,
            animationDelay: reduceMotion ? '0ms' : `${delay}ms`,
          }
        : { opacity: 0 }
    }
  >
    {char === ' ' ? ' ' : char}
  </span>
)

/**
 * Full-bleed dark section between the hero and the Sound Familiar section.
 * Reveals a bold value statement letter-by-letter (fade + slide-up + blur),
 * then cycles the final phrase through a slot-machine word animation on its
 * own dedicated line.
 */
export const ValueStatement = () => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const reduceMotion = useReducedMotion()

  let delay = 0

  return (
    <section
      ref={ref}
      className="relative bg-navy-deep px-6 py-32 md:py-44"
      aria-label="Our value proposition"
    >
      <div className="hero-grain absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-content">
        <p className="font-heading font-extrabold leading-[1.1] tracking-tight text-offwhite text-[1.85rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-7xl">
          {LINES.map((line, lineIdx) => {
            const words = line.split(' ')
            return (
              <span key={lineIdx} className="block">
                {words.map((word, wordIdx) => (
                  <span key={wordIdx}>
                    {wordIdx > 0 && (
                      // Space lives outside the whitespace-nowrap word span so
                      // the browser can only break at word boundaries, never
                      // mid-character inside a word.
                      <Letter
                        char=" "
                        delay={delay}
                        inView={inView}
                        reduceMotion={reduceMotion}
                      />
                    )}
                    <span className="inline-block whitespace-nowrap">
                      {word.split('').map((char, charIdx) => {
                        const currentDelay = delay
                        delay += CHAR_DELAY_MS
                        return (
                          <Letter
                            key={`${lineIdx}-${wordIdx}-${charIdx}`}
                            char={char}
                            delay={currentDelay}
                            inView={inView}
                            reduceMotion={reduceMotion}
                          />
                        )
                      })}
                    </span>
                  </span>
                ))}
              </span>
            )
          })}

          {/* SlotWord on its own block line so the rolladex sits alone */}
          <span className="block">
            <SlotWord
              words={SLOT_WORDS}
              cycleMs={3200}
              delayMs={reduceMotion ? 0 : SLOT_START_DELAY_MS}
              className="text-violet-ray"
            />
          </span>
        </p>
      </div>
    </section>
  )
}
