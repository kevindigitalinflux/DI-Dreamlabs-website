import type { ReactNode } from 'react'
import { GlowOrb } from '@/components/ui/GlowOrb'

type SectionProps = {
  /** 'dream' = Deep Navy with grain + glow; 'workshop' = Off White. */
  surface: 'dream' | 'workshop'
  children: ReactNode
  /** Adds ambient glow orbs on dream sections. */
  orbs?: boolean
  className?: string
  id?: string
}

/**
 * Homepage section shell. The dream/workshop alternation IS the brand story:
 * dream → reality → dream → reality (Brief §8.2).
 */
export const Section = ({ surface, children, orbs = false, className = '', id }: SectionProps) => (
  <section
    id={id}
    className={`relative overflow-hidden px-6 py-20 md:py-28 ${
      surface === 'dream' ? 'bg-navy-deep' : 'bg-offwhite'
    } ${className}`}
  >
    {surface === 'dream' && <div className="hero-grain absolute inset-0" aria-hidden />}
    {surface === 'dream' && orbs && (
      <>
        <GlowOrb colour="violet" className="-right-32 top-0 h-96 w-96" />
        <GlowOrb colour="rebecca" className="-left-24 bottom-0 h-80 w-80" />
      </>
    )}
    <div className="relative mx-auto max-w-content">{children}</div>
  </section>
)
