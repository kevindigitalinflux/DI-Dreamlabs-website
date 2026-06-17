import { useRef, useState, useEffect } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

export type KpiMetricData = {
  label: string
  sublabel?: string
  /** Numeric target, supports decimals (e.g. 2.4 renders as "2.4"). */
  value: number
  /** Unit appended after the number, e.g. "%" or "×" or " hrs/wk". */
  suffix: string
  direction: 'down' | 'up'
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Single KPI metric card with a count-up animation triggered when scrolled into view.
 * Direction controls colour: violet-ray for down metrics, cyan-strong for up metrics.
 */
export const KpiMetric = ({ label, sublabel, value, suffix, direction }: KpiMetricData) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })
  const reduceMotion = useReducedMotion()
  const [raw, setRaw] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) {
      setRaw(value)
      return
    }
    const duration = 1500
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setRaw(easeOut(t) * value)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduceMotion])

  const isDecimal = value % 1 !== 0
  const formatted = isDecimal ? raw.toFixed(1) : String(Math.round(raw))
  const prefix = direction === 'down' ? '−' : '+'
  const valueColour = direction === 'down' ? 'text-violet-ray' : 'text-cyan-strong'

  return (
    <div ref={ref} className="py-4">
      <div className={`font-heading text-3xl font-bold tabular-nums ${valueColour}`}>
        {prefix}
        {formatted}
        {suffix}
      </div>
      <div className="mt-1 font-body text-sm font-semibold text-offwhite">{label}</div>
      {sublabel && (
        <div className="mt-0.5 font-body text-xs leading-relaxed text-offwhite/50">{sublabel}</div>
      )}
    </div>
  )
}
