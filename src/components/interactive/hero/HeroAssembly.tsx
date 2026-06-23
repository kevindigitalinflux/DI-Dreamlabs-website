import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/Button'
import { LightBeamButton } from '@/components/ui/LightBeamButton'
import { ChevronDownIcon } from '@/components/icons'
import { HeroCloudHint } from './HeroCloudHint'
import { HeroCloudWipe } from './HeroCloudWipe'

gsap.registerPlugin(useGSAP)

/*
 * Headline options considered (Brief §14 asks for 3–5; runner-up kept for Kevin):
 * 1. "Your biggest daily headache, turned into your sharpest advantage." ← chosen
 * 2. "Stop patching the chaos. Own the system that runs it."
 * 3. "The dream where your business runs itself? We build that."
 * 4. "From 'someone should sort this out' to a system that just does."
 */

/**
 * The signature hero: full-bleed looping video background with left-aligned
 * headline and CTAs. Content animates in on mount. Reduced-motion gets a
 * static dark gradient in place of the video.
 */
export const HeroAssembly = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Entrance animation — headline, sub-copy, and buttons stagger in.
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) {
        gsap.set('.hero-enter', { opacity: 1, y: 0 })
        return
      }

      gsap.fromTo(
        '.hero-enter',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          stagger: 0.12,
          delay: 0.2,
        },
      )
    },
    { scope: containerRef },
  )

  // Viewport gap fill: on mobile, when the browser address bar hides mid-scroll
  // the viewport grows taller than the hero's pinned height (100svh in px).
  // We set the gap-fill div's top position to exactly window.innerHeight in
  // pixels at mount time — the same value GSAP captures for the pin height —
  // so the fill covers the exposed strip below the fixed hero.
  // Using px (not svh) ensures it works on all iOS/Android versions.
  useEffect(() => {
    const gapFill = document.querySelector<HTMLElement>('[data-hero-gap-fill]')
    if (!gapFill) return
    gapFill.style.top = `${window.innerHeight}px`
  }, [])

  return (
    <>
      <div ref={containerRef} data-hero className="relative z-20 overflow-hidden bg-navy-deep">
        <section className="relative flex h-[100svh] flex-col justify-start px-5 pt-20 sm:px-6 sm:pt-24 md:px-16 md:pt-28 lg:px-24">

          {/* Full-bleed video background */}
          <video
            className="absolute inset-0 h-full w-full object-cover [object-position:93%_50%] md:object-center"
            src="/videos/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
          />

          {/* Gradient: strong left for text legibility, fades quickly so the right
              side of the video (flask with logo) stays clearly visible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(4,15,73,0.90) 0%, rgba(4,15,73,0.80) 40%, rgba(4,15,73,0.25) 65%, rgba(4,15,73,0.05) 100%)',
            }}
            aria-hidden
          />

          <HeroCloudHint />
          <HeroCloudWipe />

          {/* Left-aligned content — max-w-xs on mobile keeps text tight to the left
              so the right side of the hero video stays visible */}
          <div className="hero-content relative z-50 max-w-xs sm:max-w-xl md:max-w-2xl">
            <p className="hero-enter mb-3 font-body text-xs font-semibold uppercase tracking-[0.08em] text-cyan-strong opacity-0 sm:tracking-widest sm:text-sm">
              AI Systems · Built for Blue-Collar &amp; Service Businesses
            </p>

            {/*
              Mobile headline: forced 4-line break so the rhythm reads
              "Your biggest daily headache," / "turned" / "into your" / "sharpest advantage."
              On sm+ the <br> tags hide and the text wraps naturally.
            */}
            <h1 className="hero-enter font-heading text-3xl font-extrabold leading-[1.1] text-offwhite opacity-0 sm:text-4xl md:text-5xl lg:text-7xl">
              Your biggest daily headache,
              <br className="sm:hidden" />
              {' '}
              <span className="bg-gradient-to-r from-violet-ray to-cyan-strong bg-clip-text text-transparent">
                turned
                <br className="sm:hidden" />
                {' '}into your
                <br className="sm:hidden" />
                {' '}sharpest advantage.
              </span>
            </h1>

            {/* Mobile: short hook */}
            <p className="hero-enter mt-4 font-body text-sm leading-relaxed text-offwhite/80 opacity-0 sm:hidden">
              You already know what's costing you.{' '}
              <span className="font-bold text-offwhite">We build the AI systems that fix it,</span>
              {' '}fast, practical, and you own everything.
            </p>

            {/* Desktop: full narrative */}
            <p className="hero-enter mt-4 hidden font-body text-sm leading-relaxed text-offwhite/80 opacity-0 sm:block sm:text-base md:text-lg">
              <span className="font-bold text-offwhite">
                Most blue-collar and service businesses leave 20–30% of revenue on the table,
              </span>
              {' '}not from lack of work, but from problems they can already name.
              We build the AI systems and products that fix them, for the businesses
              that service and build the world. You own everything.
              It starts with a free audit.
            </p>

            {/* Buttons side by side on all sizes — size="sm" keeps them short enough
                to sit side by side on mobile without the hero feeling cluttered */}
            <div className="hero-enter mt-8 flex flex-row flex-wrap gap-3 opacity-0">
              <Button variant="primary" href="/contact" className="!h-11 !px-5 !text-sm">
                Get your free audit
              </Button>
              <LightBeamButton href="/how-it-works" size="sm">
                See how it works
              </LightBeamButton>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="hero-cue absolute bottom-6 left-1/2 z-[70] -translate-x-1/2 text-offwhite/60 motion-safe:animate-bounce">
            <ChevronDownIcon className="h-6 w-6" aria-hidden />
            <span className="sr-only">Scroll to continue</span>
          </div>
        </section>
      </div>

      {/*
        Viewport gap fill: covers body offwhite that shows below the pinned hero
        when mobile browser chrome hides and the viewport grows. Top is set in px
        via useEffect (window.innerHeight at mount = same value GSAP uses for the
        pin height), so it works on all iOS/Android without needing svh support.
        HeroCloudWipe hides this via onLeave once the pin zone ends.
      */}
      <div
        data-hero-gap-fill
        aria-hidden
        className="pointer-events-none bg-navy-deep"
        style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 19 }}
      />
    </>
  )
}
