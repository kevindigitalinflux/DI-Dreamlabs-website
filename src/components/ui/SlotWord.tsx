import { useState, useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Props = {
  /** Words to cycle through. First word is shown immediately. */
  words: readonly string[]
  /** Milliseconds between each word change. Default: 3000. */
  cycleMs?: number
  /** Milliseconds to wait before the first cycle starts. Default: 0. */
  delayMs?: number
  className?: string
}

/**
 * Cycles through words with a physical slot-machine / Rolodex 3D rotation:
 * the current word folds backward (rotateX → -90°) while the next flips up
 * from below (rotateX +90° → 0°). Container uses preserve-3d and is not
 * clipped so the full depth rotation is visible.
 *
 * Left-aligns content so it stays flush with preceding text — never centred.
 */
export const SlotWord = ({ words, cycleMs = 3000, delayMs = 0, className = '' }: Props) => {
  const [current, setCurrent] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const nextRef = useRef(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const start = setTimeout(() => {
      const id = setInterval(() => {
        nextRef.current = (current + 1) % words.length
        setPhase('out')
      }, cycleMs)
      return () => clearInterval(id)
    }, delayMs)
    return () => clearTimeout(start)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, words.length, cycleMs, delayMs, reduceMotion])

  const onOutEnd = () => {
    setCurrent(nextRef.current)
    setPhase('in')
  }

  const onInEnd = () => setPhase('idle')

  const currentWord = words[current] ?? ''
  const nextWord = words[nextRef.current] ?? ''

  return (
    /*
     * perspective must be on a PARENT of the animated elements (not the element
     * itself) so the 3D space is shared. overflow: visible so the rotation arc
     * isn't clipped at the container boundary.
     */
    <span
      className={`relative inline-block text-left ${className}`}
      style={{ perspective: '900px', overflow: 'visible' }}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Outgoing word — absolute overlay that rotates backward and disappears */}
      {phase === 'out' && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 inline-block whitespace-nowrap"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 0%',
            animation: 'slot-out 0.38s ease-in forwards',
          }}
          onAnimationEnd={onOutEnd}
        >
          {currentWord}
        </span>
      )}

      {/*
       * Main span — drives the container width.
       * During 'out' phase it is hidden but shows the NEXT word so the container
       * pre-sizes to the incoming word's width before the flip begins.
       */}
      <span
        className="inline-block whitespace-nowrap"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 100%',
          animation: phase === 'in' ? 'slot-in 0.38s ease-out forwards' : 'none',
          visibility: phase === 'out' ? 'hidden' : 'visible',
        }}
        onAnimationEnd={phase === 'in' ? onInEnd : undefined}
      >
        {phase === 'out' ? nextWord : currentWord}
      </span>
    </span>
  )
}
