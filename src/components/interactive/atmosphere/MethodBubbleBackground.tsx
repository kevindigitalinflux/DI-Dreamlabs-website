import { useState, useEffect } from 'react'
import { buildAtmosphere } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { BubbleField } from './BubbleField'

/**
 * Fully static bubble background for "The Dreamlabs Method" — no animation,
 * no GSAP, no will-change. Pure CSS positioning so the section stays smooth
 * regardless of scroll speed or device capability.
 */
export const MethodBubbleBackground = () => {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const cfg = buildAtmosphere({ seed: 7, mobile })

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <AtmosphereDefs />
      <BubbleField layers={cfg.bubbles} />
    </div>
  )
}
