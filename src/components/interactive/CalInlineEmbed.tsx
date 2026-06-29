import { useEffect, useRef, useState } from 'react'
import { Head } from 'vite-react-ssg'

const FALLBACK_DELAY_MS = 9000

// Cal.com SDK doesn't ship TypeScript types; targeted casts used throughout.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CalAny = any

const CAL_LINK  = 'kevin-zamora-saenz-a1nikc/30min'
const CAL_NS    = '30min'
const EMBED_SRC = 'https://app.cal.com/embed/embed.js'
const MIN_H     = 'clamp(420px, 70vh, 600px)'

/**
 * Install the Cal shim and kick off embed.js download immediately when this
 * module is imported — before React hydrates — so the script is already
 * in-flight (or fully loaded) by the time useEffect calls Cal('init', ...).
 * The SSR guard ensures this never runs during static pre-rendering.
 */
if (typeof window !== 'undefined') {
  const w = window as CalAny
  if (!w.Cal) {
    const push = (fn: CalAny, args: CalAny) => { fn.q.push(args) }
    w.Cal = function (...args: unknown[]) {
      const cal: CalAny = w.Cal
      if (!cal.loaded) {
        cal.ns = {}
        cal.q  = cal.q || []
        const s = document.createElement('script')
        s.src  = EMBED_SRC
        document.head.appendChild(s)
        cal.loaded = true
      }
      if (args[0] === 'init') {
        const api: CalAny = function (...a: unknown[]) { push(api, a) }
        const ns = args[1]
        api.q = []
        if (typeof ns === 'string') {
          cal.ns[ns] = cal.ns[ns] || api
          push(cal.ns[ns], args)
          push(cal, ['initNamespace', ns])
        } else {
          push(cal, args)
        }
        return
      }
      push(cal, args)
    }
    // Trigger the script download now — the queue holds calls until it's ready.
    ;(w.Cal as CalAny)('init', CAL_NS, { origin: 'https://app.cal.com' })
  }
}

/** Pulsing calendar skeleton shown while Cal.com loads. */
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
    <div className="mt-1 h-4 w-1/3 animate-pulse rounded bg-offwhite/10" />
  </div>
)

/**
 * Inline Cal.com booking calendar.
 * embed.js starts loading at module import time (above), so it's already
 * in-flight before React hydrates. useEffect only handles init + render.
 */
/** Shown when the Cal.com iframe hasn't appeared after FALLBACK_DELAY_MS. */
const CalFallback = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-card bg-offwhite/5 p-6 text-center">
    <p className="font-body text-sm text-offwhite/70">
      The calendar is taking longer than expected to load.
    </p>
    <a
      href={`https://cal.com/${CAL_LINK}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-card border border-violet-ray/50 bg-violet-ray/10 px-5 py-3 font-body text-sm font-semibold text-offwhite transition-all hover:bg-violet-ray/20"
    >
      Book directly on Cal.com →
    </a>
  </div>
)

export const CalInlineEmbed = () => {
  const [loaded, setLoaded] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) setTimedOut(true)
    }, FALLBACK_DELAY_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const Cal = (window as CalAny).Cal
    Cal.config = Cal.config || {}
    Cal.config.forwardQueryParams = true

    Cal.ns[CAL_NS]('inline', {
      elementOrSelector: `#my-cal-inline-${CAL_NS}`,
      config: {
        layout: 'month_view',
        useSlotsViewOnSmallScreen: true,
        theme: 'light',
      },
      calLink: CAL_LINK,
    })

    Cal.ns[CAL_NS]('ui', {
      cssVarsPerTheme: {
        light: { 'cal-brand': '#8B32FF' },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    })

    // Hide skeleton once Cal injects its iframe.
    const observer = new MutationObserver(() => {
      if (containerRef.current?.querySelector('iframe')) {
        setLoaded(true)
        observer.disconnect()
      }
    })
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true })
    }
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Warm up the connection for Cal's subsequent API requests. */}
      <Head>
        <link rel="preconnect" href="https://app.cal.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
        <link rel="preload" as="script" href={EMBED_SRC} crossOrigin="anonymous" />
      </Head>

      <div className="relative" style={{ minHeight: MIN_H }}>
        {!loaded && !timedOut && <CalSkeleton />}
        {!loaded && timedOut && <CalFallback />}
        <div
          ref={containerRef}
          id={`my-cal-inline-${CAL_NS}`}
          className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: '100%', minHeight: MIN_H }}
        />
      </div>
    </>
  )
}
