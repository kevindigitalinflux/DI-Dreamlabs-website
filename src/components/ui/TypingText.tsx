import { useRef, useState, useEffect } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

type Props = {
  /** The full text to reveal. */
  text: string
  className?: string
  /** Milliseconds between characters. Default: 50. */
  charDelay?: number
}

/**
 * Reveals text one character at a time, starting when scrolled into view.
 * Provides aria-label so screen readers announce the full text immediately.
 * Under prefers-reduced-motion the text appears instantly.
 */
export const TypingText = ({ text, className, charDelay = 50 }: Props) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setCount(text.length)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i++
      setCount(i)
      if (i >= text.length) clearInterval(id)
    }, charDelay)
    return () => clearInterval(id)
  // count intentionally excluded: interval manages its own cursor via closure
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion])

  const done = count >= text.length

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      {!done && inView && (
        <span className="animate-pulse opacity-60 select-none" aria-hidden>
          |
        </span>
      )}
    </span>
  )
}
