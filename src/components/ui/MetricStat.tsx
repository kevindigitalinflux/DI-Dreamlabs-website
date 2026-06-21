import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

export type MetricEntry = {
  value: number
  prefix?: string
  suffix?: string
  label: string
  direction: 'up' | 'down'
}

/**
 * Single animated stat — counts up from zero to target on scroll-into-view.
 * Up metrics: violet-ray (light surface) or cyan-strong (dark surface).
 * Down metrics: magenta-bloom on both surfaces.
 */
export const MetricStat = ({
  value, prefix = '', suffix = '', label, direction, surface = 'light',
}: MetricEntry & { surface?: 'light' | 'dark' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduceMotion) { setDisplay(value); return }
    let frame: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1400, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(value * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, reduceMotion])

  const numCls = direction === 'up'
    ? (surface === 'dark' ? 'text-cyan-strong' : 'text-violet-ray')
    : 'text-magenta-bloom'
  const labelCls = surface === 'dark' ? 'text-offwhite/60' : 'text-navy-deep/55'

  return (
    <div ref={ref} className="flex flex-col gap-0.5">
      <span aria-hidden className={`font-body text-xs font-bold ${numCls}`}>
        {direction === 'up' ? '↑' : '↓'}
      </span>
      <span className={`font-heading text-3xl font-extrabold tabular-nums leading-none ${numCls}`}>
        {prefix}{display}{suffix}
      </span>
      <span className={`font-body text-xs leading-snug ${labelCls}`}>{label}</span>
    </div>
  )
}
