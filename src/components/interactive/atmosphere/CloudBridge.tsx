import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { buildAtmosphere } from './atmosphere'
import type { LayerDepth } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { CloudShape } from './cloudShapes'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Parallax travel per depth (yPercent). Kept small so clouds remain visible
 * at the seam with both the hero above and the SF section below — the whole
 * point of the bridge is seamlessness, not dramatic parallax magnitude.
 */
const TRAVEL: Record<LayerDepth, number> = { back: 10, mid: 15, front: 20 }

/**
 * Dedicated h-[50vh] transition section between the hero and Sound Familiar.
 * Two atmosphere seeds are combined for double cloud density, filling the
 * bridge completely. Three depth layers each parallax at a different speed
 * (back slowest, front fastest) to create depth without shifting clouds out
 * of view at the section edges. Same seed-7 art as the SF section ensures
 * visual continuity — the user cannot see the seam.
 */
export const CloudBridge = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  // Two configs combined → 6 cloud layers, ~68 clouds desktop / ~34 mobile
  const cfgA = buildAtmosphere({ seed: 7, mobile })
  const cfgB = buildAtmosphere({ seed: 19, mobile })

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const section = ref.current
      if (!section) return

      // Scrub each layer by its depth-based travel amount.
      const scrollLayers = gsap.utils.toArray<HTMLElement>('.bridge-scroll-layer', section)
      scrollLayers.forEach((layer) => {
        const depth = layer.dataset['depth'] as LayerDepth
        const travel = TRAVEL[depth] ?? 10
        gsap.fromTo(
          layer,
          { yPercent: travel },
          {
            yPercent: -travel,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      // Ambient drift — slightly faster cadence than hero/SF so layers
      // feel independent rather than all breathing as one.
      const driftWraps = gsap.utils.toArray<HTMLElement>('.bridge-drift', section)
      driftWraps.forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 === 0 ? 18 : -18,
          duration: 10 + i * 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    },
    { scope: ref, dependencies: [mobile] },
  )

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative overflow-hidden bg-navy-deep"
      style={{ height: '50vh' }}
    >
      {/* Top gradient: dissolves the hero's bottom edge so there is no hard line. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[30%]"
        style={{ background: 'linear-gradient(to bottom, #040F49 0%, rgba(4,15,73,0) 100%)' }}
      />

      <AtmosphereDefs />

      {/* Config A layers (seed 7 — same art as SF section) */}
      {cfgA.clouds.map((layer) => (
        <div
          key={`a-${layer.depth}`}
          className="bridge-scroll-layer absolute inset-0 will-change-transform"
          data-depth={layer.depth}
          style={{ opacity: layer.targetOpacity, filter: `blur(${layer.blurPx}px)` }}
        >
          <div className="bridge-drift absolute inset-0 will-change-transform">
            {layer.placements.map((p, idx) => (
              <CloudShape
                key={idx}
                variant={p.variant}
                className="absolute h-auto"
                style={{
                  left: `${p.x * 100}%`,
                  bottom: `${p.bottomVh}%`,
                  width: `${p.sizePx}px`,
                  transform: `translateX(-50%) scale(${p.scale})`,
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Config B layers (seed 19 — fills the gaps for a packed screen) */}
      {cfgB.clouds.map((layer) => (
        <div
          key={`b-${layer.depth}`}
          className="bridge-scroll-layer absolute inset-0 will-change-transform"
          data-depth={layer.depth}
          style={{ opacity: layer.targetOpacity, filter: `blur(${layer.blurPx}px)` }}
        >
          <div className="bridge-drift absolute inset-0 will-change-transform">
            {layer.placements.map((p, idx) => (
              <CloudShape
                key={idx}
                variant={p.variant}
                className="absolute h-auto"
                style={{
                  left: `${p.x * 100}%`,
                  bottom: `${p.bottomVh}%`,
                  width: `${p.sizePx}px`,
                  transform: `translateX(-50%) scale(${p.scale})`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
