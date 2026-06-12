import { ICON_MARK_EDGES, ICON_MARK_NODES } from './iconMarkGraph'

/**
 * The fully-assembled constellation as a static SVG — the reduced-motion
 * hero fallback (Brief §6.4) and the frozen hero banner on secondary pages.
 * One gentle ambient opacity pulse only, disabled under reduced motion via
 * the global kill switch.
 */
export const HeroConstellationSvg = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    aria-hidden
    className={`hero-constellation-pulse ${className}`}
    fill="none"
  >
    {ICON_MARK_EDGES.map(([a, b], i) => {
      const n1 = ICON_MARK_NODES[a]
      const n2 = ICON_MARK_NODES[b]
      if (!n1 || !n2) return null
      return (
        <line
          key={i}
          x1={n1.x * 100}
          y1={n1.y * 100}
          x2={n2.x * 100}
          y2={n2.y * 100}
          stroke="#00DFDF"
          strokeWidth="0.35"
          opacity="0.55"
        />
      )
    })}
    {ICON_MARK_NODES.map((n, i) => (
      <circle key={i} cx={n.x * 100} cy={n.y * 100} r="0.7" fill="#F4F4F8" opacity="0.9" />
    ))}
  </svg>
)
