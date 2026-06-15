import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { buildAtmosphere } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { CloudField } from './CloudField'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Fixed-position dream atmosphere spanning Hero → "Sound Familiar?" → "The
 * Dreamlabs Method" (spec §3, §6). Sits at z-40 between each section's
 * background and its z-50 content. One scrubbed ScrollTrigger raises the cloud
 * layers with parallax depth; independent timelines add ambient drift. Under
 * prefers-reduced-motion everything renders static at rest.
 */
export const ScrollAtmosphere = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const cfg = buildAtmosphere({ seed: 7, mobile })

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const cloudLayers = gsap.utils.toArray<HTMLElement>('.atmos-cloud-layer', root)
      const driftWraps = gsap.utils.toArray<HTMLElement>('.atmos-layer-drift', root)
      const hero = document.querySelector('#main section') as HTMLElement | null
      const painPoints = document.querySelector('#sound-familiar') as HTMLElement | null

      // Reduced motion: park clouds at rest, no scroll/ambient (spec §8).
      if (reduced) {
        cloudLayers.forEach((el) => {
          gsap.set(el, { yPercent: 0, opacity: Number(el.dataset.opacity ?? 0.7) })
        })
        return
      }

      // Start every layer below the fold and invisible.
      cloudLayers.forEach((el) => {
        gsap.set(el, { yPercent: 110, opacity: 0 })
      })

      // Transition 1: raise clouds with parallax depth, scrubbed to scroll.
      if (hero && painPoints) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            endTrigger: painPoints,
            end: 'top top',
            scrub: 0.5,
          },
        })
        cloudLayers.forEach((el) => {
          const travel = Number(el.dataset.travel ?? 90)
          const target = Number(el.dataset.opacity ?? 0.7)
          // Front (larger travel) rises further/faster -> parallax depth.
          tl.to(el, { yPercent: 110 - travel, ease: 'none' }, 0)
          tl.to(el, { opacity: target, ease: 'none', duration: 0.3 }, 0)
        })
      }

      // Ambient horizontal drift, independent of scroll (spec §6).
      driftWraps.forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 === 0 ? 15 : -15,
          duration: 12 + i * 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    },
    { scope: rootRef, dependencies: [reduced, mobile] },
  )

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      <AtmosphereDefs />
      <CloudField layers={cfg.clouds} />
    </div>
  )
}
