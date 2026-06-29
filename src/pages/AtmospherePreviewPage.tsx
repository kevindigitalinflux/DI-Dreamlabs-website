import { Navigate } from 'react-router-dom'
import { buildAtmosphere } from '@/components/interactive/atmosphere/atmosphere'
import { AtmosphereDefs } from '@/components/interactive/atmosphere/AtmosphereDefs'
import { CloudShape } from '@/components/interactive/atmosphere/cloudShapes'
import { BubbleShape } from '@/components/interactive/atmosphere/bubbleShape'
import { Seo } from '@/lib/Seo'

/** Internal scratch page to review atmosphere shapes statically. Not linked. */
export const AtmospherePreviewPage = () => {
  if (!import.meta.env.DEV) return <Navigate to="/404" replace />
  const cfg = buildAtmosphere({ seed: 7, mobile: false })
  return (
    <div
      className="min-h-screen px-6 py-24"
      style={{ background: 'linear-gradient(to bottom, #5B3E8E 0%, #8A5BA6 45%, #E6A6C4 100%)' }}
    >
      <Seo title="Atmosphere Preview" description="Internal scratch page." path="/atmosphere-preview" noIndex />
      <AtmosphereDefs />
      <h1 className="font-heading text-2xl font-bold text-offwhite">Clouds (Rebecca Purple)</h1>
      <div className="mt-6 flex flex-wrap items-end gap-6">
        {[0, 1, 2, 3].map((v) => (
          <CloudShape key={v} variant={v} className="h-auto w-72" />
        ))}
      </div>
      {/* Overlapping cluster to judge density against the reference sky */}
      <div className="relative mt-10 h-64 w-full">
        {[0, 1, 2, 3, 1, 2].map((v, i) => (
          <CloudShape
            key={i}
            variant={v}
            className="absolute h-auto"
            style={{ left: `${i * 16}%`, bottom: `${(i % 3) * 18}px`, width: `${260 - (i % 3) * 30}px` }}
          />
        ))}
      </div>
      <h2 className="mt-16 font-heading text-2xl font-bold text-offwhite">Bubbles (Violet Ray)</h2>
      <div className="mt-6 flex flex-wrap items-end gap-6">
        {[16, 28, 44, 64].map((s) => (
          <BubbleShape key={s} style={{ width: s, height: s }} />
        ))}
      </div>
      <h2 className="mt-16 font-heading text-2xl font-bold text-offwhite">
        Layer counts: clouds {cfg.clouds.map((l) => l.placements.length).join('/')} · bubbles{' '}
        {cfg.bubbles.map((l) => l.placements.length).join('/')}
      </h2>
    </div>
  )
}

export const Component = AtmospherePreviewPage
