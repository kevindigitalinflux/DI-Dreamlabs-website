import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Button } from '@/components/ui/Button'
import { GlowOrb } from '@/components/ui/GlowOrb'
import { ChevronDownIcon } from '@/components/icons'
import { HeroCanvas } from './HeroCanvas'
import { HeroConstellationSvg } from './HeroConstellationSvg'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/*
 * Headline options considered (Brief §14 asks for 3–5; runner-up kept for Kevin):
 * 1. "Your biggest daily headache, turned into your sharpest advantage." ← chosen
 * 2. "Stop patching the chaos. Own the system that runs it."
 * 3. "The dream where your business runs itself? We build that."
 * 4. "From 'someone should sort this out' to a system that just does."
 */

/**
 * The signature hero: a pinned, scroll-scrubbed sequence where dream elements
 * (clouds, bubbles) assemble into the Dreamlabs icon-mark constellation
 * (Brief §6). Headline and CTAs are server-rendered and interactive
 * immediately; the canvas mounts after first paint. Reduced motion gets a
 * static hero with the fully-formed constellation.
 */
export const HeroAssembly = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)
  const [canvasReady, setCanvasReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Mount the canvas only after critical content has painted (Brief §6.4).
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true)
      return
    }
    const idle = window.setTimeout(() => setCanvasReady(true), 150)
    return () => window.clearTimeout(idle)
  }, [])

  useGSAP(
    () => {
      if (reducedMotion) return
      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean }

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: desktop ? '+=280%' : '+=180%',
              pin: true,
              scrub: true,
              onUpdate: (self) => {
                progressRef.current = self.progress
              },
            },
          })

          // 0–15%: establishing shot — orbs drift very slowly throughout.
          tl.to('.hero-orb-1', { yPercent: -14, duration: 1 }, 0)
          tl.to('.hero-orb-2', { yPercent: -20, xPercent: 6, duration: 1 }, 0)
          tl.to('.hero-orb-3', { yPercent: -10, xPercent: -8, duration: 1 }, 0)

          // 15–40%: the dream stirs — headline recedes (desktop only;
          // mobile keeps the headline static for readability, Brief §6.4).
          if (desktop) {
            tl.to('.hero-content', { scale: 0.85, yPercent: -14, opacity: 0.7, duration: 0.25 }, 0.15)
            // 40–65%: headline dissolves; the fixed nav logo carries the brand on.
            tl.to('.hero-content', { opacity: 0, scale: 0.72, duration: 0.18, pointerEvents: 'none' }, 0.42)
          } else {
            tl.to('.hero-content', { opacity: 0, duration: 0.2, pointerEvents: 'none' }, 0.38)
          }

          // 15–40%: cloud silhouettes drift in from the edges…
          tl.fromTo(
            '.hero-cloud-left',
            { xPercent: -60, opacity: 0 },
            { xPercent: 0, opacity: 0.5, duration: 0.25 },
            0.15,
          )
          tl.fromTo(
            '.hero-cloud-right',
            { xPercent: 60, opacity: 0 },
            { xPercent: 0, opacity: 0.4, duration: 0.25 },
            0.18,
          )
          tl.fromTo(
            '.hero-cloud-low',
            { yPercent: 50, opacity: 0 },
            { yPercent: 0, opacity: 0.3, duration: 0.25 },
            0.22,
          )
          // …then dissolve into the converging bubble field (40–65%).
          tl.to('.hero-clouds > *', { opacity: 0, scale: 0.7, duration: 0.2, stagger: 0.02 }, 0.45)

          // 65–85%: supporting line breathes in beneath the forming shape.
          tl.fromTo(
            '.hero-support',
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.14, ease: 'power1.out' },
            0.68,
          )

          // Background orbs brighten slightly as the shape emerges.
          tl.to('.hero-orbs', { opacity: 1.25, duration: 0.2 }, 0.65)

          // Scroll cue fades as soon as the journey starts.
          tl.to('.hero-cue', { opacity: 0, duration: 0.05 }, 0.05)

          return () => tl.scrollTrigger?.kill()
        },
      )

      return () => mm.revert()
    },
    { scope: containerRef, dependencies: [reducedMotion] },
  )

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-navy-deep">
      <section className="relative flex h-screen flex-col items-center justify-center px-6">
        {/* Atmosphere: volumetric orbs + grain */}
        <div className="hero-orbs absolute inset-0" aria-hidden>
          <GlowOrb colour="violet" className="hero-orb-1 -left-32 top-[8%] h-[34rem] w-[34rem]" />
          <GlowOrb colour="rebecca" className="hero-orb-2 right-[-10%] top-[30%] h-[30rem] w-[30rem]" />
          <GlowOrb colour="cyan" className="hero-orb-3 bottom-[-15%] left-[30%] h-[26rem] w-[26rem]" />
        </div>
        <div className="hero-grain absolute inset-0" aria-hidden />

        {/* Reduced motion: the dream already assembled */}
        {reducedMotion && (
          <HeroConstellationSvg className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 opacity-40" />
        )}

        {/* Particle canvas (mounts after first paint) */}
        {canvasReady && !reducedMotion && <HeroCanvas progressRef={progressRef} />}

        {/* Cloud silhouettes (DOM layer above canvas) */}
        {!reducedMotion && (
          <div className="hero-clouds pointer-events-none absolute inset-0" aria-hidden>
            <CloudShape className="hero-cloud-left absolute left-[-5%] top-[22%] w-72 text-rebecca/60 opacity-0 md:w-96" />
            <CloudShape className="hero-cloud-right absolute right-[-8%] top-[14%] w-80 text-violet-ray/40 opacity-0 md:w-[28rem]" />
            <CloudShape className="hero-cloud-low absolute bottom-[12%] left-[18%] w-64 text-rebecca/50 opacity-0 md:w-80" />
          </div>
        )}

        {/* Critical content — server-rendered, interactive immediately */}
        <div className="hero-content relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] text-offwhite md:text-7xl">
            Your biggest daily headache,{' '}
            <span className="bg-gradient-to-r from-violet-ray to-cyan-strong bg-clip-text text-transparent">
              turned into your sharpest advantage.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-offwhite/80 md:text-lg">
            We build AI-powered systems for cleaning, construction, trades and logistics
            businesses. You own everything we build — and it starts with a free audit.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="primary" href="/contact">
              Get your free audit
            </Button>
            <Button variant="secondary" surface="dark" href="/how-it-works">
              See how it works
            </Button>
          </div>
        </div>

        {/* Supporting line — appears as the constellation locks in */}
        {!reducedMotion && (
          <p className="hero-support absolute bottom-[14%] left-1/2 z-10 w-full max-w-xl -translate-x-1/2 px-6 text-center font-body text-base text-offwhite/85 opacity-0 md:text-lg">
            Scattered problems, assembled into one working system. That's the job.
          </p>
        )}

        {/* Scroll cue */}
        <div className="hero-cue absolute bottom-6 left-1/2 -translate-x-1/2 text-offwhite/60 motion-safe:animate-bounce">
          <ChevronDownIcon className="h-6 w-6" aria-hidden />
          <span className="sr-only">Scroll to continue</span>
        </div>
      </section>
    </div>
  )
}

/** Soft cloud silhouette reused from the logo's cloud motif. */
const CloudShape = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 100" fill="currentColor" className={className} aria-hidden>
    <path d="M28 88c-15 0-26-11-26-25 0-12 8-22 19-24 3-17 18-30 36-30 14 0 26 7 32 18 4-2 9-4 14-4 16 0 29 11 31 26 9 1 17 9 17 19 0 11-9 20-20 20H28Z" />
  </svg>
)
