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

export const MarketingIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M2 9.5v5h4l4.5 4V5.5L6 9.5H2ZM15.5 9.5a5 5 0 0 1 0 5M18.5 7a8 8 0 0 1 0 10" />
  </svg>
)

export const LegalIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3v18M5 21h14" />
    <path d="M7.5 8l-4 8h8l-4-8ZM16.5 8l-4 8h8l-4-8Z" />
    <path d="M7.5 8h9" />
  </svg>
)

export const FinanceIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M3 17l5-6 4 3 4.5-7L21 11" />
    <path d="M3 21h18" />
  </svg>
)

export const HRIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="8.5" cy="7" r="3" />
    <path d="M2 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="17.5" cy="9" r="2.5" />
    <path d="M21.5 20a4.5 4.5 0 0 0-9 0" />
  </svg>
)

export const EcommerceIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6L18 2H6Z" />
    <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
  </svg>
)

export const SupportIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M3 11a9 9 0 1 1 18 0" />
    <path d="M3 11h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4ZM19 11h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z" />
    <path d="M12 20a3 3 0 0 0 3-3h-2" />
  </svg>
)

export const RecruitmentIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="7.5" r="3.5" />
    <path d="M3 20a7 7 0 0 1 10.6-6" />
    <circle cx="17.5" cy="16.5" r="3.5" />
    <path d="M20 19.5l2 2" />
  </svg>
)

export const SalesIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M22 7l-9.5 9.5-4-4L2 19" />
    <path d="M16 7h6v6" />
  </svg>
)
