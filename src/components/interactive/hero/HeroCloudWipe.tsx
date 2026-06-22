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
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
    setReady(true)
  }, [])

  const cfg = buildAtmosphere({ seed: 7, mobile })

  useGSAP(
    () => {
      // Wait for the real mobile/desktop value to resolve post-mount before
      // creating the ScrollTrigger. Without this guard, the first run (using
      // the SSR-safe `mobile: false` default) creates a real pin, which then
      // gets reverted and recreated once `mobile` resolves — and that
      // revert/recreate cycle was observed to double the pin's scroll
      // distance on mobile (measured: ~1858px instead of the intended
      // ~928px). Creating the ScrollTrigger
      // exactly once, only after `ready`, avoids the bug entirely.
      if (!ready) return
      // Without reduced motion: make wrapper visible now that GSAP will immediately
      // push cloud layers below the fold. Keeping opacity:0 until this point prevents
      // the flash where cloud layers sit at y:0 (visible) before GSAP positions them.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.set(wipeRef.current!, { opacity: 1 })
      const canvas = canvasRef.current
      const backdrop = backdropRef.current
      if (!canvas || !backdrop) return
      const hero = document.querySelector('[data-hero]') as HTMLElement | null
      if (!hero) return

      // Scroll runway for the rise + backdrop fade to play out gradually
      // instead of snapping shut. Kept just over one viewport so the pin
      // doesn't eat too much scroll before SF's content appears underneath.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 1.1,
          scrub: true,
          pin: hero,
          anticipatePin: 1,
          // pinSpacing defaults to true — GSAP inserts a spacer reserving the
          // full scroll distance, so the SF section starts exactly where the
          // pin ends. Without it (tried previously), the pin consumes scroll
          // distance out of SF's own document space instead of adding to it,
          // so SF's heading is already scrolled past by the time hero
          // unpins — it only becomes visible mid-card-grid, well into the
          // section, looking like a sudden cut instead of a handoff.
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
    { scope: wipeRef, dependencies: [ready, mobile] },
  )

  return (
    <div ref={wipeRef} aria-hidden className="pointer-events-none absolute inset-0 z-[60] overflow-hidden" style={{ opacity: 0 }}>
      <div ref={backdropRef} className="absolute inset-0 bg-navy-deep opacity-0" />
      <div ref={canvasRef} className="absolute inset-0">
        <AtmosphereDefs />
        <CloudField layers={cfg.clouds} />
      </div>
    </div>
  )
}
