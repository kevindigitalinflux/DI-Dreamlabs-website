import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { buildAtmosphere } from '@/components/interactive/atmosphere/atmosphere'
import { AtmosphereDefs } from '@/components/interactive/atmosphere/AtmosphereDefs'
import { CloudField } from '@/components/interactive/atmosphere/CloudField'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Parallax cloud bank that rises from below the hero viewport as the user
 * scrolls, bridging the hero into the Sound Familiar cloud section. Scrubbed
 * 0→80% of the hero pin window so clouds reach resting position before the SF
 * section enters. Same seed as SfCloudBackground so the two banks look like
 * one continuous field as the SF section slides up. Clipped by the hero
 * outer div's overflow-hidden.
 */
export const HeroCloudRise = () => {
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
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const hero = root.closest('section') as HTMLElement | null
      if (!hero) return

      // Scrub from fully below the hero to resting position.
      gsap.fromTo(
        root,
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=80%',
            scrub: true,
          },
        },
      )

      // Ambient drift — different phase offsets from the SF layer so they
      // don't move in perfect lockstep when both are on screen.
      const driftWraps = gsap.utils.toArray<HTMLElement>('.atmos-layer-drift', root)
      driftWraps.forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 === 0 ? 14 : -14,
          duration: 17 + i * 4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    },
    { scope: ref, dependencies: [mobile] },
  )

  return (
    // translateY(110%) as the initial style prevents a one-frame flash of clouds
    // at natural position before useGSAP's layout effect fires. z-[60] puts clouds
    // above the hero content (z-50) so they physically cover the text as they rise.
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[60]"
      style={{ transform: 'translateY(110%)' }}
    >
      {/* Defs declared here so gradients are available immediately (DOM-first). */}
      <AtmosphereDefs />
      <CloudField layers={cfg.clouds} />
    </div>
  )
}
