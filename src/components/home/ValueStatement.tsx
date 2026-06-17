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
 * increments continuously across all three lines so the reveal sweeps the
 * whole statement left-to-right, top-to-bottom.
 */
const LINES = [
  "We don't sell AI, product engineering",
  'or Automated systems.',
  'We sell ', // trailing nbsp keeps spacing before the SlotWord
] as const

const CHAR_DELAY_MS = 28 // delay between each letter starting its reveal
const REVEAL_DURATION_MS = 620 // how long each letter's animation takes

/** Compute total ms before all static text has finished revealing. */
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
    {/* Spaces rendered as nbsp so inline-block doesn't collapse them */}
    {char === ' ' ? ' ' : char}
  </span>
)

/**
 * Full-bleed dark section between the hero and the Sound Familiar section.
 * Reveals a bold value statement letter-by-letter (fade + slide-up + blur),
 * then cycles the final phrase through a slot-machine word animation.
 */
export const ValueStatement = () => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const reduceMotion = useReducedMotion()

  let delay = 0

  return (
    <section
      ref={ref}
      className="relative bg-navy-deep px-6 py-24 md:py-36"
      aria-label="Our value proposition"
    >
      <div className="hero-grain absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-content">
        <p className="font-heading font-extrabold leading-[1.1] tracking-tight text-offwhite text-4xl md:text-5xl lg:text-6xl">
          {LINES.map((line, lineIdx) => {
            const isLastLine = lineIdx === LINES.length - 1
            return (
              <span key={lineIdx} className="block">
                {line.split('').map((char, charIdx) => {
                  const currentDelay = delay
                  if (char !== ' ') delay += CHAR_DELAY_MS
                  return (
                    <Letter
                      key={`${lineIdx}-${charIdx}`}
                      char={char}
                      delay={currentDelay}
                      inView={inView}
                      reduceMotion={reduceMotion}
                    />
                  )
                })}

                {/* Slot-machine word lives inline at the end of the last line */}
                {isLastLine && (
                  <SlotWord
                    words={SLOT_WORDS}
                    cycleMs={3200}
                    delayMs={reduceMotion ? 0 : SLOT_START_DELAY_MS}
                    className="text-violet-ray"
                  />
                )}
              </span>
            )
          })}
        </p>
      </div>
    </section>
  )
}
