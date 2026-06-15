import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { buildAtmosphere } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { CloudField } from './CloudField'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Fixed-position dream atmosphere (spec §3, §6). Sits at z-40, between each
 * section's background and its z-50 content. The hero is PINNED while scroll
 * scrubs a layered cloud rise (parallax depth: front rises furthest); the
 * clouds then stay as the "Sound Familiar?" background, drifting ambiently,
 * and fade out before "The Dreamlabs Method" so they never bleed past it.
 * Under prefers-reduced-motion the clouds render static at rest.
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
      const method = document.querySelector('#dreamlabs-method') as HTMLElement | null

      // Reduced motion: clouds static at rest, no pin/scrub/ambient (spec §8).
      if (reduced) {
        cloudLayers.forEach((el) => {
          const travel = Number(el.dataset.travel ?? 100)
          gsap.set(el, { yPercent: 120 - travel, opacity: Number(el.dataset.opacity ?? 0.9) })
        })
        return
      }

      // Start every layer below the fold and invisible.
      cloudLayers.forEach((el) => {
        gsap.set(el, { yPercent: 120, opacity: 0 })
      })

      // Transition 1: PIN the hero and scrub the layered cloud rise. The pin
      // holds the hero for ~1.3 screens of scroll while the clouds climb into
      // place; releasing the pin hands straight off to "Sound Familiar?".
      if (hero) {
        const riseTl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=130%',
            pin: true,
            anticipatePin: 1,
            scrub: 0.6,
          },
        })
        cloudLayers.forEach((el) => {
          const travel = Number(el.dataset.travel ?? 100)
          const target = Number(el.dataset.opacity ?? 0.9)
          // Front (larger travel) rises further -> parallax depth.
          riseTl.to(el, { yPercent: 120 - travel, ease: 'none' }, 0)
          riseTl.to(el, { opacity: target, ease: 'none', duration: 0.4 }, 0)
        })
      }

      // Clouds fade out as "The Dreamlabs Method" rises into view, so the fixed
      // layer never sits in front of later sections. Fade the ROOT container
      // (not the layers) so this doesn't fight the rise timeline's per-layer
      // opacity. Transition 2 will layer the bubbles into this same hand-off.
      if (method) {
        gsap.to(root, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: method,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.6,
          },
        })
      }

      // Ambient horizontal drift, independent of scroll (spec §6).
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
    { scope: rootRef, dependencies: [reduced, mobile] },
  )

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <AtmosphereDefs />
      <CloudField layers={cfg.clouds} />
    </div>
  )
}
