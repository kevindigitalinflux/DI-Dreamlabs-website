import type { ReactNode } from 'react'
import { useRef } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

type Props = {
  children: ReactNode
  className?: string
}

/**
 * Wraps text with a hand-drawn SVG underline that animates in on scroll into view.
 * Uses strokeDashoffset to reveal the path from left to right.
 */
export const DrawUnderline = ({ children, className = '' }: Props) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const reduceMotion = useReducedMotion()
  const show = inView || (reduceMotion ?? false)

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      <svg
        aria-hidden
        className="pointer-events-none absolute -bottom-2 left-0 w-full overflow-visible"
        height="10"
        preserveAspectRatio="none"
        viewBox="0 0 100 10"
      >
        <path
          d="M 1,6 C 12,2 26,8 42,5 C 58,2 74,7 90,4 C 95,3 98,5 99,5"
          fill="none"
          stroke="#B8A77A"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1"
          style={{
            strokeDasharray: '1',
            strokeDashoffset: show ? '0' : '1',
            transition: show
              ? 'stroke-dashoffset 0.85s cubic-bezier(0.4, 0, 0.2, 1) 0.15s'
              : 'none',
          }}
        />
      </svg>
    </span>
  )
}
