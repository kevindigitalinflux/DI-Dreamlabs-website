import type { CSSProperties } from 'react'

/**
 * Lo-fi flat cumulus clouds (spec §3.1), styled after the reference sky art:
 * scalloped puff silhouettes filled with a deep Rebecca-Purple vertical
 * gradient, with soft pink rim-light revealed along the undersides by drawing
 * each purple cluster shifted up over a pink copy of itself. A back row (with a
 * flat base) plus a lower front row gives the stacked, layered lo-fi look. Four
 * variants of differing width so the field never looks tiled. ViewBox 240×150;
 * callers size via width with height auto.
 */
type CloudProps = { variant: number; className?: string; style?: CSSProperties }

/** A puff: [cx, cy, r] in the 240×150 viewBox. */
type Bump = readonly [number, number, number]
type CloudVariant = { top: readonly Bump[]; front: readonly Bump[] }

const VARIANTS: ReadonlyArray<CloudVariant> = [
  {
    top: [
      [60, 70, 38],
      [108, 52, 46],
      [156, 62, 40],
      [198, 78, 28],
    ],
    front: [
      [70, 96, 30],
      [120, 90, 34],
      [170, 98, 26],
    ],
  },
  {
    top: [
      [50, 74, 32],
      [92, 56, 40],
      [134, 50, 44],
      [178, 60, 36],
      [210, 76, 26],
    ],
    front: [
      [64, 98, 28],
      [116, 94, 32],
      [166, 96, 30],
    ],
  },
  {
    top: [
      [66, 66, 44],
      [120, 54, 50],
      [172, 70, 40],
    ],
    front: [
      [82, 98, 32],
      [140, 96, 36],
    ],
  },
  {
    top: [
      [46, 78, 28],
      [84, 60, 38],
      [124, 52, 42],
      [164, 60, 36],
      [200, 76, 28],
    ],
    front: [
      [70, 100, 26],
      [118, 96, 32],
      [166, 100, 26],
    ],
  },
]

/** Flat bottom baseline of every cloud (viewBox units). */
const BASE_Y = 122
/** How far the pink rim peeks out beneath each purple cluster. */
const RIM = 8

const cluster = (bumps: readonly Bump[], dy: number, fill: string, base?: { x: number; w: number }) => (
  <g transform={`translate(0 ${dy})`} fill={fill}>
    {bumps.map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} />
    ))}
    {base && <rect x={base.x} y={BASE_Y - 42} width={base.w} height={42} rx={5} />}
  </g>
)

export const CloudShape = ({ variant, className = '', style }: CloudProps) => {
  const { top, front } = VARIANTS[variant % VARIANTS.length]!
  const minX = Math.min(...top.map(([cx, , r]) => cx - r))
  const maxX = Math.max(...top.map(([cx, , r]) => cx + r))
  const base = { x: minX, w: maxX - minX }

  return (
    <svg
      viewBox="0 0 240 150"
      className={`overflow-visible ${className}`}
      style={style}
      aria-hidden
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Back row: pink rim under the purple body */}
      {cluster(top, 0, 'url(#atmos-cloud-rim)', base)}
      {cluster(top, -RIM, 'url(#atmos-cloud-body)', base)}
      {/* Front row: its own rim creates an internal stacked-layer band */}
      {cluster(front, 0, 'url(#atmos-cloud-rim)')}
      {cluster(front, -RIM, 'url(#atmos-cloud-body)')}
    </svg>
  )
}
