import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { buildAtmosphere } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { BubbleField } from './BubbleField'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Bubble background for "The Dreamlabs Method" — picks up where
 * MethodBubbleWipe leaves off (same seed-7 art), holding the bubbles at
 * their risen, target-opacity rest state for the rest of the section.
 * BubbleField's layers default to opacity 0 (they're normally driven by a
 * wipe), so this background sets each straight to its target on mount
 * instead of animating it in — done unconditionally (not gated on reduced
 * motion) since without it the bubbles would stay invisible forever. Ambient
 * horizontal drift keeps them breathing once settled.
 */
export const MethodBubbleBackground = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const cfg = buildAtmosphere({ seed: 7, mobile })

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return

      const scrollLayers = gsap.utils.toArray<HTMLElement>('.atmos-layer-scroll', root)
      gsap.set(scrollLayers, {
        opacity: (_i: number, el: HTMLElement) => Number(el.dataset.opacity ?? 1),
      })

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const driftWraps = gsap.utils.toArray<HTMLElement>('.atmos-layer-drift', root)
      driftWraps.forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 === 0 ? 16 : -16,
          duration: 13 + i * 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    },
    { scope: ref, dependencies: [mobile] },
  )

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      <AtmosphereDefs />
      <BubbleField layers={cfg.bubbles} />
    </div>
  )
}
