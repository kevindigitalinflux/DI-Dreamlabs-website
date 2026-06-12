import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type RevealProps = {
  children: ReactNode
  /** Delay in ms — use for stagger between siblings (80–120ms, Brief §9). */
  delay?: number
  className?: string
}

/**
 * Standard scroll reveal: fade + translateY(24px), 0.6s ease-out, fires once
 * when scrolled into view. Renders static under reduced motion.
 */
export const Reveal = ({ children, delay = 0, className = '' }: RevealProps) => {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className}>{children}</div>
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
