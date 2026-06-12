import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

type StatCounterProps = {
  value: number
  /** Rendered before/after the number, e.g. "£" / " hrs". */
  prefix?: string
  suffix?: string
  durationMs?: number
}

/**
 * Animated stat counter in Strong Cyan — the brand's data-highlight domain
 * (Brief §2.2). Counts up on scroll-into-view; static under reduced motion.
 */
export const StatCounter = ({ value, prefix = '', suffix = '', durationMs = 1200 }: StatCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(value * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, durationMs, reduceMotion])

  return (
    <span ref={ref} className="font-heading text-4xl font-extrabold tabular-nums text-cyan-strong md:text-5xl">
      {prefix}
      {display.toLocaleString('en-GB')}
      {suffix}
    </span>
  )
}
