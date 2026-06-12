import type { SVGProps } from 'react'

/** Industry icons — same 24px/1.75-stroke language as the brand set. */
type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const CleaningIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M8 8h5l1.5 12.5h-8L8 8ZM9 8V5.5A1.5 1.5 0 0 1 10.5 4h0A1.5 1.5 0 0 1 12 5.5V8" />
    <circle cx="17.5" cy="6.5" r="1.5" />
    <circle cx="19.5" cy="11" r="1" />
    <circle cx="16.5" cy="13.5" r="0.7" />
  </svg>
)

export const FacilitiesIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5V21M14 9h4.5A1.5 1.5 0 0 1 20 10.5V21M2.5 21h19" />
    <path d="M7 8h4M7 12h4M7 16h4M17 13h0M17 17h0" />
  </svg>
)

export const MaintenanceIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M13.5 7.5a4.5 4.5 0 0 1 5.6-4.4L16 6.2l2.3 2.3 3.1-3.1a4.5 4.5 0 0 1-5.5 5.6L9 18a2.1 2.1 0 0 1-3-3l7.5-7.5Z" />
    <path d="M5 5l3.5 3.5" />
  </svg>
)

export const ConstructionIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 18v-6.5C5 8 8 5.5 12 5.5S19 8 19 11.5V18" />
    <path d="M12 5.5V3.5M3.5 18h17M8.5 18v-3M15.5 18v-3" />
  </svg>
)

export const TradesIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3" y="8.5" width="18" height="11" rx="2" />
    <path d="M9 8.5V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5v2M3 13.5h18M12 12.5v2" />
  </svg>
)

export const LogisticsIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M2.5 6h11v10h-11V6ZM13.5 9.5H18l3.5 3.5v3h-8" />
    <circle cx="6.5" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </svg>
)
