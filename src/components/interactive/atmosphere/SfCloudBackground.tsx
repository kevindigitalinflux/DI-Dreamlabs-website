import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { buildAtmosphere } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { CloudField } from './CloudField'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Permanent, contained cloud background for the "Sound Familiar?" section
 * (spec §3, §6). Rendered INSIDE the section and clipped by its overflow-hidden,
 * so the clouds belong to the section: they scroll in and out with it and never
 * bleed into other sections, and they never fade. The hero is pinned
 * (pinSpacing:false) so this cloud-filled section scrolls up over it, sweeping
 * the clouds across the whole hero during the transition. The hero headline
 * recedes as that happens. Reduced motion keeps the clouds static.
 */
export const SfCloudBackground = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const cfg = buildAtmosphere({ seed: 7, mobile })

  useGSAP(
    () => {
      if (reduced) return
      const root = ref.current
      if (!root) return
      const driftWraps = gsap.utils.toArray<HTMLElement>('.atmos-layer-drift', root)
      const hero = document.querySelector('#main section') as HTMLElement | null
      const heroContent = document.querySelector('.hero-content') as HTMLElement | null

      // Pin the hero so the cloud-filled section scrolls up and over it,
      // sweeping the clouds across the whole hero (the transition).
      if (hero) {
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: '+=90%',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        })
        // Headline/CTA recede as the clouds rise over the hero.
        if (heroContent) {
          gsap.to(heroContent, {
            opacity: 0,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: '+=55%', scrub: true },
          })
        }
      }

      // Ambient horizontal drift so the clouds breathe when paused (spec §6).
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
    { scope: ref, dependencies: [reduced, mobile] },
  )

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      <AtmosphereDefs />
      <CloudField layers={cfg.clouds} />
    </div>
  )
}
