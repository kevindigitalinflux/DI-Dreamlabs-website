import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/Button'
import { ChevronDownIcon } from '@/components/icons'

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
        // No entrance animation, but the content must still be visible
        // (the .hero-enter elements ship with opacity-0 for the animated path).
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

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-navy-deep">
      <section className="relative flex h-screen flex-col justify-start px-6 pt-28 md:px-16 md:pt-36 lg:px-24">

        {/* Full-bleed video background */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />

        {/* Dark gradient overlay — left side lighter to keep text legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(5,5,20,0.82) 0%, rgba(5,5,20,0.72) 50%, rgba(5,5,20,0.35) 100%)',
          }}
          aria-hidden
        />

        {/* Left-aligned content */}
        <div className="hero-content relative z-50 max-w-2xl">
          <p className="hero-enter mb-4 font-body text-sm font-semibold uppercase tracking-widest text-cyan-strong opacity-0">
            AI-Powered Operations · Built for Trade Businesses
          </p>

          <h1 className="hero-enter font-heading text-4xl font-extrabold leading-[1.05] text-offwhite opacity-0 md:text-6xl lg:text-7xl">
            Your biggest daily headache,{' '}
            <span className="bg-gradient-to-r from-violet-ray to-cyan-strong bg-clip-text text-transparent">
              turned into your sharpest advantage.
            </span>
          </h1>

          <p className="hero-enter mt-6 font-body text-base leading-relaxed text-offwhite/80 opacity-0 md:text-lg">
            We build AI-powered systems for cleaning, construction, trades and logistics
            businesses. You own everything we build — and it starts with a free audit.
          </p>

          <div className="hero-enter mt-10 flex flex-col gap-4 opacity-0 sm:flex-row">
            <Button variant="primary" href="/contact">
              Get your free audit
            </Button>
            <Button variant="secondary" surface="dark" href="/how-it-works">
              See how it works
            </Button>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hero-cue absolute bottom-6 left-1/2 z-50 -translate-x-1/2 text-offwhite/60 motion-safe:animate-bounce">
          <ChevronDownIcon className="h-6 w-6" aria-hidden />
          <span className="sr-only">Scroll to continue</span>
        </div>
      </section>
    </div>
  )
}
