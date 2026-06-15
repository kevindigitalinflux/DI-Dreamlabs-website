import type { CSSProperties } from 'react'

/**
 * Lo-fi flat cumulus clouds (spec §3.1), styled after the reference sky art:
 * a fully-rounded scalloped silhouette (puffy top AND billowy bottom — no flat
 * cut edges) filled with a deep Rebecca-Purple vertical gradient, with soft
 * pink rim-light revealed along the undersides by drawing each cluster shifted
 * up over a pink copy of itself. A lower front cluster adds an internal,
 * stacked lo-fi band. Four variants of differing width so the field never looks
 * tiled. ViewBox 240×170 with overflow visible so nothing is clipped.
 */
type CloudProps = { variant: number; className?: string; style?: CSSProperties }

/** A puff: [cx, cy, r] in the viewBox. */
type Bump = readonly [number, number, number]
type CloudVariant = { silhouette: readonly Bump[]; front: readonly Bump[] }

const VARIANTS: ReadonlyArray<CloudVariant> = [
  {
    // top scallops + a spanning lower row -> rounded all the way round
    silhouette: [
      [58, 66, 36],
      [104, 50, 46],
      [152, 60, 40],
      [196, 74, 30],
      [50, 100, 34],
      [98, 106, 40],
      [146, 104, 40],
      [192, 98, 32],
    ],
    front: [
      [84, 116, 30],
      [134, 118, 32],
    ],
  },
  {
    silhouette: [
      [50, 70, 30],
      [90, 54, 40],
      [132, 48, 44],
      [176, 58, 36],
      [206, 74, 26],
      [54, 104, 32],
      [100, 110, 40],
      [150, 108, 40],
      [196, 100, 30],
    ],
    front: [
      [92, 120, 30],
      [146, 120, 30],
    ],
  },
  {
    silhouette: [
      [64, 62, 42],
      [118, 50, 50],
      [170, 66, 40],
      [60, 102, 38],
      [116, 110, 44],
      [168, 102, 38],
    ],
    front: [[112, 124, 36]],
  },
  {
    silhouette: [
      [46, 72, 28],
      [84, 56, 38],
      [124, 50, 42],
      [164, 58, 36],
      [200, 72, 28],
      [52, 104, 30],
      [96, 110, 38],
      [142, 110, 38],
      [188, 102, 30],
    ],
    front: [
      [86, 122, 28],
      [138, 122, 30],
    ],
  },
]

/** How far the pink rim peeks out beneath each purple cluster. */
const RIM = 8

const cluster = (bumps: readonly Bump[], dy: number, fill: string) => (
  <g transform={`translate(0 ${dy})`} fill={fill}>
    {bumps.map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} />
    ))}
  </g>
)

export const CloudShape = ({ variant, className = '', style }: CloudProps) => {
  const { silhouette, front } = VARIANTS[variant % VARIANTS.length]!
  return (
    <svg
      viewBox="0 0 240 170"
      className={`overflow-visible ${className}`}
      style={style}
      aria-hidden
      preserveAspectRatio="xMidYMax meet"
    >
      {cluster(silhouette, 0, 'url(#atmos-cloud-rim)')}
      {cluster(silhouette, -RIM, 'url(#atmos-cloud-body)')}
      {cluster(front, 0, 'url(#atmos-cloud-rim)')}
      {cluster(front, -RIM, 'url(#atmos-cloud-body)')}
    </svg>
  )
}
