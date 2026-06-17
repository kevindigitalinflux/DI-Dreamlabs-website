import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = {
  /** Which section background the card sits on. */
  surface?: 'dark' | 'light' | 'glass'
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

/**
 * Brand card (Brief §8.3). Dark sections: translucent surface with a faint
 * violet border-glow on hover. Light sections: Off White fill, soft shadow,
 * gentle lift on hover. Glass: frosted Deep-Navy panel for content floating
 * over the dream cloud field (readable, with the clouds visible behind).
 * Transform/opacity transitions only (GPU-friendly).
 */
export const Card = ({ surface = 'dark', children, className = '', ...rest }: CardProps) => {
  const surfaceClasses =
    surface === 'dark'
      ? 'border border-offwhite/10 bg-offwhite/5 hover:border-violet-ray/50 hover:shadow-glow-violet'
      : surface === 'glass'
        ? 'border border-offwhite/15 bg-navy-deep/55 backdrop-blur-md hover:border-violet-ray/50 hover:shadow-glow-violet'
        : 'bg-white shadow-card hover:-translate-y-1 hover:shadow-card-hover'

  return (
    <div
      className={`rounded-card p-6 transition-all duration-300 will-change-transform ${surfaceClasses} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
