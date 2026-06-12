import type { SVGProps } from 'react'

/**
 * DI Dreamlabs line-icon set — 24px grid, 1.75 stroke, rounded caps,
 * colour via currentColor. Brand-motif icons (cloud/bubble/flask) are
 * added in Phase 1; utility icons live here from Phase 0.
 */
type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const MenuIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 12h16m-6-6 6 6-6 6" />
  </svg>
)
