import { useState, useEffect } from 'react'
import { buildAtmosphere } from '@/components/interactive/atmosphere/atmosphere'
import { AtmosphereDefs } from '@/components/interactive/atmosphere/AtmosphereDefs'
import { CloudShape } from '@/components/interactive/atmosphere/cloudShapes'

// CloudShape's viewBox is 240×170, so a cloud rendered at width sizePx has
// actual height sizePx * (170/240). Hiding a fraction of *width* (the old
// approach) hides more than the whole cloud — it must be a fraction of height.
const ASPECT = 170 / 240

type Peek = { x: number; sizePx: number; scale: number; variant: number; hideFraction: number }

/**
 * Minimal static cloud hint at the very bottom of the hero — occupies the
 * last 24% of the screen height. A general bank spreads across the bottom;
 * small clustered pairs add density at the left/right corners. The CTA
 * buttons sit at a fixed pixel offset from the top of the hero (padding +
 * content flow), independent of viewport height, while this strip is
 * anchored to the bottom of the viewport — so on a shorter window the gap
 * between them shrinks. hideFraction is tuned high (most of each cloud
 * hidden, only a small cap peeking) so the visible peek stays short enough
 * to clear the CTAs even on shorter viewports; density comes from layering
 * several small clouds rather than a few large ones. z-10 keeps this behind
 * hero content (z-50).
 */
export const HeroCloudHint = () => {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const { clouds } = buildAtmosphere({ seed: 7, mobile })
  const front = clouds[2]!.placements

  const bank: Peek[] = [1, 2, 4, 5, 7, 9, 11]
    .filter((i) => i < front.length)
    .map((i) => {
      const p = front[i]!
      return { x: p.x, sizePx: p.sizePx, scale: p.scale, variant: p.variant, hideFraction: 0.78 }
    })

  const cornerBaseSize = mobile ? 200 : 320
  const corners: Peek[] = [
    { x: 0.02, sizePx: cornerBaseSize, scale: 1, variant: 1, hideFraction: 0.82 },
    { x: 0.1, sizePx: cornerBaseSize - 50, scale: 1, variant: 2, hideFraction: 0.84 },
    { x: 0.98, sizePx: cornerBaseSize, scale: 1, variant: 3, hideFraction: 0.82 },
    { x: 0.9, sizePx: cornerBaseSize - 50, scale: 1, variant: 0, hideFraction: 0.84 },
  ]

  const picks = [...bank, ...corners]

  return (
    // Strip at absolute hero bottom. No background, no gradient.
    // overflow-hidden clips the cloud bodies; only the puffy tops show.
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden"
      style={{ height: '24%' }}
    >
      <AtmosphereDefs />
      {picks.map((p, i) => {
        const heightPx = p.sizePx * ASPECT
        return (
          <CloudShape
            key={i}
            variant={p.variant}
            className="absolute h-auto"
            style={{
              left: `${p.x * 100}%`,
              bottom: `-${Math.round(heightPx * p.hideFraction)}px`,
              width: `${p.sizePx}px`,
              transform: `translateX(-50%) scale(${p.scale})`,
            }}
          />
        )
      })}
    </div>
  )
}
