import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenis: Lenis | null = null

/**
 * Initialises the global Lenis smooth-scroll singleton and binds it to GSAP's
 * ticker so ScrollTrigger stays in sync (official integration pattern).
 * No-ops on the server and under prefers-reduced-motion.
 */
export const initLenis = (): Lenis | null => {
  if (typeof window === 'undefined') return null
  if (lenis) return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  gsap.registerPlugin(ScrollTrigger)
  lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)
  return lenis
}
