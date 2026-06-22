import { useEffect, useId } from 'react'

declare global {
  interface Window {
    Cal?: ((...args: unknown[]) => void) & {
      loaded?: boolean
      ns?: Record<string, unknown>
      q?: unknown[]
    }
  }
}

/**
 * Renders an inline Cal.com booking calendar via the Cal Embed script.
 * calLink is the Cal.com path only — e.g. "kevin-di/free-audit".
 */
export const CalInlineEmbed = ({ calLink }: { calLink: string }) => {
  const uid = useId().replace(/:/g, '')
  const elId = `cal-inline-${uid}`

  useEffect(() => {
    const mount = () => {
      const Cal = window.Cal
      if (!Cal) return
      Cal('init', { origin: 'https://cal.com' })
      Cal('inline', {
        elementOrSelector: `#${elId}`,
        calLink,
        layout: 'month_view',
      })
      Cal('ui', {
        theme: 'dark',
        styles: { branding: { brandColor: '#8B32FF' } },
        hideEventTypeDetails: false,
      })
    }

    if (window.Cal?.loaded) {
      mount()
    } else {
      const script = document.createElement('script')
      script.src = 'https://cal.com/embed.js'
      script.async = true
      script.onload = mount
      document.head.appendChild(script)
    }
  }, [calLink, elId])

  return (
    <div
      id={elId}
      className="w-full overflow-hidden rounded-card"
      style={{ minHeight: 600 }}
    />
  )
}
