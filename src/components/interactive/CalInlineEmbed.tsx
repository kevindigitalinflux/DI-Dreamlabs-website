import { useEffect } from 'react'

// Cal.com SDK doesn't ship TypeScript types; targeted casts used throughout.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CalAny = any

const CAL_LINK = 'kevin-zamora-saenz-a1nikc/30min'
const CAL_NS   = '30min'
const EMBED_SRC = 'https://app.cal.com/embed/embed.js'

/**
 * Inline Cal.com booking calendar.
 * Mirrors Cal's official namespace embed snippet exactly, adapted for React.
 * The queue shim lets us call Cal() synchronously; embed.js loads async and
 * processes the queue, rendering the calendar into the target div.
 */
export const CalInlineEmbed = () => {
  useEffect(() => {
    const w = window as CalAny

    // Install Cal's loader shim (idempotent — skipped if already present).
    if (!w.Cal) {
      const push = (fn: CalAny, args: CalAny) => { fn.q.push(args) }
      const d = document

      w.Cal = function (...args: unknown[]) {
        const cal: CalAny = w.Cal
        if (!cal.loaded) {
          cal.ns  = {}
          cal.q   = cal.q || []
          const s = d.createElement('script')
          s.src   = EMBED_SRC
          d.head.appendChild(s)
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
    }

    const Cal: CalAny = w.Cal

    Cal('init', CAL_NS, { origin: 'https://app.cal.com' })
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
  }, [])

  return (
    <div
      id={`my-cal-inline-${CAL_NS}`}
      style={{ width: '100%', minHeight: 'clamp(420px, 70vh, 600px)' }}
    />
  )
}
