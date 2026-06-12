import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonProps = {
  variant?: 'primary' | 'secondary'
  /** Which background the button sits on — affects secondary outline colour. */
  surface?: 'dark' | 'light'
  /** Internal route — renders a Link instead of a button. */
  href?: string
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

const baseClasses =
  'inline-flex h-14 items-center justify-center gap-2 rounded-card px-8 font-body text-base font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50'

/**
 * Brand button (Brief §8.3). Primary: Violet Ray fill + glow on hover.
 * Secondary: outline that fills on hover, colour depends on surface.
 */
export const Button = ({
  variant = 'primary',
  surface = 'dark',
  href,
  children,
  className = '',
  type,
  ...rest
}: ButtonProps) => {
  const variantClasses =
    variant === 'primary'
      ? 'bg-violet-ray text-offwhite hover:scale-[1.03] hover:shadow-glow-violet'
      : surface === 'dark'
        ? 'border border-offwhite text-offwhite hover:bg-offwhite hover:text-navy-deep'
        : 'border border-violet-ray text-violet-ray hover:bg-violet-ray hover:text-offwhite'

  const classes = `${baseClasses} ${variantClasses} ${className}`

  if (href) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type ?? 'button'} className={classes} {...rest}>
      {children}
    </button>
  )
}
