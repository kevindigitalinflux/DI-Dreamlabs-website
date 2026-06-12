import type { SVGProps } from 'react'

/**
 * Brand-motif and content icons — 24px grid, 1.75 stroke, rounded caps,
 * extending the cloud/bubble/flask visual language (Brief §8.3).
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

/* — Brand motifs — */

export const FlaskIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M10 3v6l-4.5 8A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3L14 9V3" />
    <path d="M8.5 3h7M7.5 15h9" />
    <circle cx="12" cy="1.8" r="0.4" fill="currentColor" stroke="none" />
  </svg>
)

export const BubblesIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="14" r="5" />
    <circle cx="17.5" cy="8.5" r="2.5" />
    <circle cx="15.5" cy="16.5" r="1.5" />
  </svg>
)

export const CloudIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M7 18a4 4 0 0 1-.6-7.95 5.5 5.5 0 0 1 10.7-1.1A4.5 4.5 0 0 1 16.5 18H7Z" />
  </svg>
)

/* — Pain points (Brief §7.1) — */

export const MissedCallIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 5c0 8.3 6.7 15 15 15l1.5-3.5L17 15l-2 1.5c-2.5-1-4.5-3-5.5-5.5L11 9 9.5 5.5 4 5Z" />
    <path d="M15 4l5 5M20 4l-5 5" />
  </svg>
)

export const ScheduleIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5M9 14l2 2 4-4" />
  </svg>
)

export const VisibilityIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
)

export const QuoteIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 3.5h9l4 4v13H6v-17Z" />
    <path d="M14.5 3.5v4.5H19" />
    <path d="M10 15.5c0-3 3-2.2 3-4.2 0-1-.8-1.8-1.8-1.8s-1.7.6-1.9 1.4M10 18.2v.05" />
  </svg>
)

export const PaperworkIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h9A1.5 1.5 0 0 1 20 4.5v12A1.5 1.5 0 0 1 18.5 18H17" />
    <rect x="4" y="6" width="13" height="15" rx="1.5" />
    <path d="M7 10.5h7M7 14h7M7 17.5h4" />
  </svg>
)

export const InventoryIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M3.5 8 12 3.5 20.5 8v8L12 20.5 3.5 16V8Z" />
    <path d="M3.5 8 12 12.5 20.5 8M12 12.5v8" />
  </svg>
)

/* — Method steps (Brief §7.2) — */

export const AuditIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 21 21M8 10.5l1.8 1.8 3.2-3.2" />
  </svg>
)

export const BuildIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M14.5 6.5a4 4 0 0 1 5-3.9l-2.7 2.7 1.9 1.9 2.7-2.7a4 4 0 0 1-4.9 5L8 18a2 2 0 0 1-2.8-2.8l9.3-8.7Z" />
    <circle cx="6.5" cy="17.5" r="0.4" fill="currentColor" stroke="none" />
  </svg>
)

export const PilotIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 14c0-5 3-9.5 7-11 4 1.5 7 6 7 11l-2.5 4.5-2-2.5h-5l-2 2.5L5 14Z" />
    <circle cx="12" cy="9.5" r="2" />
    <path d="M10 21h4" />
  </svg>
)

export const OwnIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="8" cy="14.5" r="4.5" />
    <path d="M11.2 11.3 20 2.5M16 6.5l2.5 2.5M13.5 9l2 2" />
  </svg>
)

/* — USPs (Brief §7.4) — */

export const GuaranteeIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3 5 5.5v6c0 4.5 3 7.5 7 9.5 4-2 7-5 7-9.5v-6L12 3Z" />
    <path d="M9 11.5l2 2 4-4" />
  </svg>
)

export const TeamIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <circle cx="16.5" cy="9.5" r="2.3" />
    <path d="M16.5 14.5c2.5 0 4.5 1.8 4.5 4.3" />
  </svg>
)

export const DeliveryIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="13" r="7.5" />
    <path d="M12 9v4l3 2M9.5 2.5h5" />
  </svg>
)
