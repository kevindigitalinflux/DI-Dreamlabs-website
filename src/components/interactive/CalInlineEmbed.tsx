import { useState } from 'react'
import { BOOKING_URL } from '@/lib/config'

const MIN_H = 'clamp(500px, 72vh, 680px)'

/** Pulsing calendar skeleton shown while the Cal.com iframe loads. */
const CalSkeleton = () => (
  <div className="absolute inset-0 flex flex-col gap-3 overflow-hidden rounded-card p-4">
    <div className="flex items-center justify-between">
      <div className="h-5 w-24 animate-pulse rounded bg-offwhite/15" />
      <div className="flex gap-2">
        <div className="h-7 w-7 animate-pulse rounded-full bg-offwhite/10" />
        <div className="h-7 w-7 animate-pulse rounded-full bg-offwhite/10" />
      </div>
    </div>
    <div className="grid grid-cols-7 gap-1.5">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-4 animate-pulse rounded bg-offwhite/10" />
      ))}
    </div>
    {Array.from({ length: 5 }).map((_, row) => (
      <div key={row} className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 7 }).map((_, col) => (
          <div
            key={col}
            className="h-8 animate-pulse rounded-lg bg-offwhite/10"
            style={{ animationDelay: `${(row * 7 + col) * 18}ms` }}
          />
        ))}
      </div>
    ))}
  </div>
)

/**
 * Inline Cal.com booking calendar via direct iframe embed.
 * Uses the Cal.com embed URL directly — no SDK, no script loading, no CSP issues.
 * The skeleton fades out once the iframe fires its onLoad event.
 */
export const CalInlineEmbed = () => {
  const [loaded, setLoaded] = useState(false)

  const src = `https://cal.com/${BOOKING_URL}?embed=true&theme=light&layout=month_view&brandColor=%238B32FF`

  return (
    <div className="relative overflow-hidden rounded-card" style={{ minHeight: MIN_H }}>
      {!loaded && <CalSkeleton />}
      <iframe
        src={src}
        title="Book a free audit"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`block w-full border-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ minHeight: MIN_H, height: MIN_H }}
        allow="payment"
      />
    </div>
  )
}
