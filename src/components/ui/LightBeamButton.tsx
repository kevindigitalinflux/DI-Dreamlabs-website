import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface LightBeamButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
}

const BEAM_BG =
  'conic-gradient(from var(--gradient-angle), transparent 0%, #8B32FF 38%, #C088FF 50%, transparent 62%)'

const BASE =
  'group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden ' +
  'rounded-full px-8 font-body text-base font-bold text-offwhite bg-navy-deep ' +
  'transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] ' +
  'shadow-[0_0_20px_-5px_rgba(139,50,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(139,50,255,0.55)]'

/** CTA button with a rotating violet-ray light beam border — use on dark hero surfaces. */
export const LightBeamButton = ({ children, href, onClick }: LightBeamButtonProps) => {
  const inner = (
    <>
      {/* Rotating conic gradient fills the button area */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: BEAM_BG, animation: 'border-spin 2.5s linear infinite' }}
      />
      {/* Navy fill covers the interior, leaving only the 1.5 px edge as the visible beam */}
      <div aria-hidden className="absolute inset-[1.5px] rounded-full bg-navy-deep" />
      {/* Violet bloom on hover */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(139,50,255,0.3) 0%, transparent 70%)' }}
      />
      {/* Label — sits above all decorative layers */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  )

  if (href) {
    return <Link to={href} className={BASE}>{inner}</Link>
  }

  return (
    <button type="button" onClick={onClick} className={BASE}>
      {inner}
    </button>
  )
}
