import type { CSSProperties } from 'react'

/**
 * Four lofi cumulus cloud variants (spec §3.1): overlapping ellipses merged by
 * the shared #atmos-goo filter into one soft blob with a puffy top and flatter
 * bottom, filled with the inner Rebecca→Violet gradient. ViewBox is 200×100;
 * callers size via width and keep aspect with height auto.
 */
type CloudProps = { variant: number; className?: string; style?: CSSProperties }

/** Ellipse cluster per variant — [cx, cy, rx, ry] in the 200×100 viewBox. */
const VARIANTS: ReadonlyArray<ReadonlyArray<readonly [number, number, number, number]>> = [
  [
    [60, 62, 42, 30],
    [100, 50, 50, 38],
    [140, 64, 40, 28],
    [100, 78, 78, 22],
  ],
  [
    [55, 60, 34, 26],
    [92, 54, 40, 32],
    [128, 58, 36, 28],
    [158, 66, 28, 22],
    [100, 80, 82, 20],
  ],
  [
    [70, 58, 46, 34],
    [120, 64, 42, 30],
    [100, 80, 70, 20],
  ],
  [
    [50, 64, 30, 24],
    [82, 56, 36, 30],
    [116, 52, 40, 34],
    [150, 62, 34, 26],
    [100, 80, 84, 20],
  ],
]

export const CloudShape = ({ variant, className = '', style }: CloudProps) => {
  const ellipses = VARIANTS[variant % VARIANTS.length]!
  return (
    <svg viewBox="0 0 200 100" className={className} style={style} aria-hidden preserveAspectRatio="xMidYMax meet">
      <g filter="url(#atmos-goo)" fill="url(#atmos-cloud-fill)">
        {ellipses.map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} />
        ))}
      </g>
    </svg>
  )
}
