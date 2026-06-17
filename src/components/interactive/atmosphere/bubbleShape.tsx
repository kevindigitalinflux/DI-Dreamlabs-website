import type { CSSProperties } from 'react'

/**
 * Soft lofi bubble (spec §3.2): Violet-Ray radial-gradient core fading to a
 * translucent edge, with a small off-centre off-white highlight — echoing the
 * flask bubbles in the hero video. ViewBox 100×100; caller sizes via width/height.
 */
type BubbleProps = { className?: string; style?: CSSProperties }

export const BubbleShape = ({ className = '', style }: BubbleProps) => (
  <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
    <circle cx="50" cy="50" r="48" fill="url(#atmos-bubble-fill)" />
    <circle cx="37" cy="34" r="8" fill="#F4F4F8" opacity="0.5" />
  </svg>
)
