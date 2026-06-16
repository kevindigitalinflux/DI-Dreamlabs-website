import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { buildAtmosphere } from '@/components/interactive/atmosphere/atmosphere'
import { AtmosphereDefs } from '@/components/interactive/atmosphere/AtmosphereDefs'
import { CloudField } from '@/components/interactive/atmosphere/CloudField'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Scroll-driven cloud wipe with true per-layer parallax. The canvas matches
 * the hero exactly (inset-0) — the same sizing CloudField uses for the SF
 * section's permanent background — so each layer's "natural" position (at
 * travel progress 1) is the same dense, visible bank SF shows, giving
 * continuity across the handoff. At rest each layer is pushed straight down
 * by its own `travelVh` (back slowest/least, front fastest/most), hiding it
 * below the fold; scrolling animates that back to 0, rising into place.
 *
 * CloudField's own layout is deliberately gappy at the top (sparse "back"
 * layer) — by design for the SF section, which has its own navy-deep section
 * background showing through those gaps. The hero has no such backing, so a
 * solid Deep Navy backdrop fades in behind the clouds over the same scrub,
 * reaching full opacity by the end of the scroll — guaranteeing the hero is
 * completely covered (video, headline, everything) by the time it hands off
 * to the SF section, instead of relying on cloud density alone.
 */
export const HeroCloudWipe = () => {
  const wipeRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const cfg = buildAtmosphere({ seed: 7, mobile })

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const canvas = canvasRef.current
      const backdrop = backdropRef.current
      if (!canvas || !backdrop) return
      const hero = document.querySelector('[data-hero]') as HTMLElement | null
      if (!hero) return

      // More scroll runway than one viewport height — gives the rise and the
      // backdrop fade room to play out gradually instead of snapping shut.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.6,
          scrub: true,
          pin: hero,
          pinSpacing: false,
          anticipatePin: 1,
          // Hero needs to outrank the SF section (z-10) only while actively
          // pinned, so the wipe can't be seen through early. Once unpinned,
          // GSAP leaves hero translated down by the pin's full scroll
          // distance — since hero is as tall as the gap it translated
          // through, it keeps physically overlapping SF's content for a long
          // stretch afterward. Dropping z-index back down on release lets SF
          // (z-10) win that overlap, same as before hero had any z-index.
          // GSAP wraps the pinned element in a `.pin-spacer` div that copies
          // its z-index at pin setup — that wrapper, not hero itself, is the
          // actual sibling competing for stacking order, so it's the one that
          // needs toggling.
          onLeave: () => gsap.set(hero.parentElement ?? hero, { zIndex: 0 }),
          onEnterBack: () => gsap.set(hero.parentElement ?? hero, { zIndex: 20 }),
        },
      })

      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0)

      // travelVh alone isn't enough buffer to clear hero content at rest for
      // every layer (back layer's highest placements sit close to the fold
      // even at full hide) — add a flat buffer on top so nothing intrudes.
      const REST_BUFFER_VH = 90
      const scrollLayers = gsap.utils.toArray<HTMLElement>('.atmos-layer-scroll', canvas)
      scrollLayers.forEach((el) => {
        const travelVh = Number(el.dataset.travel ?? 0)
        tl.fromTo(el, { y: `${travelVh + REST_BUFFER_VH}vh` }, { y: '0vh', ease: 'none' }, 0)
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
    { scope: wipeRef, dependencies: [mobile] },
  )

  return (
    <div ref={wipeRef} aria-hidden className="pointer-events-none absolute inset-0 z-[60] overflow-hidden">
      <div ref={backdropRef} className="absolute inset-0 bg-navy-deep opacity-0" />
      <div ref={canvasRef} className="absolute inset-0">
        <AtmosphereDefs />
        <CloudField layers={cfg.clouds} />
      </div>
    </div>
  )
}
