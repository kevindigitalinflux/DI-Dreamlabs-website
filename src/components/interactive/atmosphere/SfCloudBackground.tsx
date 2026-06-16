import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { buildAtmosphere } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { CloudField } from './CloudField'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Cloud background for the "Sound Familiar?" section. Three depth layers
 * start at their natural (visible) position and parallax upward as the
 * section scrolls — back slowest, front fastest. Starting visible (rather than
 * shifted in from below) means clouds fill the section from the first scroll
 * pixel, and the HeroCloudHint peek in the hero reads as the same cloud world
 * cresting above the boundary. The 40vh spacer in PainPoints gives the clouds
 * breathing room before the heading appears. After entry, clouds continue with
 * ambient horizontal drift.
 */
export const SfCloudBackground = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const cfg = buildAtmosphere({ seed: 7, mobile })

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const root = ref.current
      if (!root) return

      const sfSection = document.querySelector('#sound-familiar') as HTMLElement | null

      if (sfSection) {
        // Clouds sit at their natural position when SF enters. No scroll-in
        // parallax for now — ambient drift handles the motion.
        void sfSection
      }

      // Ambient horizontal drift — clouds breathe once parallax settles.
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
      <CloudField layers={cfg.clouds} />
    </div>
  )
}
