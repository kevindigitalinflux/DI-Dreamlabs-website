import { useState, useEffect } from 'react'
import { buildAtmosphere } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { CloudField } from './CloudField'

/**
 * Fully static cloud background for the "Sound Familiar?" section. No GSAP,
 * no will-change, no blur filters — pure CSS positioning for smooth scroll.
 */
export const SfCloudBackground = () => {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const cfg = buildAtmosphere({ seed: 7, mobile })

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <AtmosphereDefs />
      <CloudField layers={cfg.clouds} />
    </div>
  )
}
