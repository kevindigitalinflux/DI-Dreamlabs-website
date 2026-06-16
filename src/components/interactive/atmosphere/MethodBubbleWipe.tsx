import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { buildAtmosphere } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { BubbleField } from './BubbleField'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Pinned hand-off between "Sound Familiar?" (Deep Navy) and "The Dreamlabs
 * Method" (Off White) — the same mechanism as HeroCloudWipe (pin + scrub +
 * rise + solid backdrop fade), with Violet-Ray bubbles in place of clouds.
 * SF is several viewports tall, so unlike the hero (exactly one viewport,
 * pinned whole) this transition gets its own dedicated h-screen zone at the
 * SF/Method seam, after all of SF's real content has scrolled past, and pins
 * itself. The backdrop fades to Off White rather than Deep Navy, since this
 * hand-off lands on Method's light surface instead of another dark one.
 *
 * BubbleField's layers start at opacity 0 (see BubbleField docstring) — the
 * cloud layers in HeroCloudWipe are already visible and only need a position
 * tween, but each bubble layer's opacity is tweened up to its target
 * alongside the rise.
 */
export const MethodBubbleWipe = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const cfg = buildAtmosphere({ seed: 7, mobile })

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const container = containerRef.current
      const backdrop = backdropRef.current
      const canvas = canvasRef.current
      if (!container || !backdrop || !canvas) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.1,
          scrub: true,
          pin: container,
          anticipatePin: 1,
        },
      })

      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0)

      const REST_BUFFER_VH = 90
      const scrollLayers = gsap.utils.toArray<HTMLElement>('.atmos-layer-scroll', canvas)
      scrollLayers.forEach((el) => {
        const travelVh = Number(el.dataset.travel ?? 0)
        const targetOpacity = Number(el.dataset.opacity ?? 1)
        tl.fromTo(
          el,
          { y: `${travelVh + REST_BUFFER_VH}vh`, opacity: 0 },
          { y: '0vh', opacity: targetOpacity, ease: 'none' },
          0,
        )
      })

      const driftLayers = gsap.utils.toArray<HTMLElement>('.atmos-layer-drift', canvas)
      driftLayers.forEach((el, i) => {
        gsap.to(el, {
          x: i % 2 === 0 ? 14 : -14,
          duration: 14 + i * 4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    },
    { scope: containerRef, dependencies: [mobile] },
  )

  return (
    <div ref={containerRef} aria-hidden className="relative z-20 h-screen overflow-hidden bg-navy-deep">
      <div ref={backdropRef} className="absolute inset-0 bg-offwhite opacity-0" />
      <div ref={canvasRef} className="absolute inset-0">
        <AtmosphereDefs />
        <BubbleField layers={cfg.bubbles} />
      </div>
    </div>
  )
}
