import { useState, useEffect } from 'react'
import { buildAtmosphere } from './atmosphere'
import { AtmosphereDefs } from './AtmosphereDefs'
import { BubbleShape } from './bubbleShape'

type Peek = { x: number; sizePx: number; scale: number; hideFraction: number }

/**
 * Minimal static bubble hint at the very bottom of the "Sound Familiar?"
 * section — foreshadows the violet bubble field that sits behind "The
 * Dreamlabs Method" just below, so the hand-off between sections isn't a
 * hard cut from "no bubbles at all" to "bubbles already there."
 */
export const SfBubbleHint = () => {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    setMobile(window.matchMedia('(max-width: 767px)').matches)
  }, [])

  const { bubbles } = buildAtmosphere({ seed: 7, mobile })
  const front = bubbles[2]!.placements

  const picks: Peek[] = front.slice(0, mobile ? 4 : 7).map((p) => ({
    x: p.x,
    sizePx: p.sizePx,
    scale: p.scale,
    hideFraction: 0.55,
  }))

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
      style={{ height: '16%' }}
    >
      <AtmosphereDefs />
      {picks.map((p, i) => (
        <BubbleShape
          key={i}
          className="absolute"
          style={{
            left: `${p.x * 100}%`,
            bottom: `-${Math.round(p.sizePx * p.hideFraction)}px`,
            width: `${p.sizePx}px`,
            height: `${p.sizePx}px`,
            transform: `translateX(-50%) scale(${p.scale})`,
            opacity: 0.65,
          }}
        />
      ))}
    </div>
  )
}
