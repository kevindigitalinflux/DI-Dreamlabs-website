import { buildAtmosphere } from '@/components/interactive/atmosphere/atmosphere'
import { AtmosphereDefs } from '@/components/interactive/atmosphere/AtmosphereDefs'
import { CloudShape } from '@/components/interactive/atmosphere/cloudShapes'
import { BubbleShape } from '@/components/interactive/atmosphere/bubbleShape'
import { Seo } from '@/lib/Seo'

/** Internal scratch page to review atmosphere shapes statically. Not linked. */
export const AtmospherePreviewPage = () => {
  const cfg = buildAtmosphere({ seed: 7, mobile: false })
  return (
    <div className="min-h-screen bg-navy-deep px-6 py-24">
      <Seo title="Atmosphere Preview" description="Internal scratch page." path="/atmosphere-preview" noIndex />
      <AtmosphereDefs />
      <h1 className="font-heading text-2xl font-bold text-offwhite">Clouds (Rebecca Purple)</h1>
      <div className="mt-6 flex flex-wrap items-end gap-6">
        {[0, 1, 2, 3].map((v) => (
          <CloudShape key={v} variant={v} className="h-auto w-64" />
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
