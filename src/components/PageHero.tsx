import type { ReactNode } from 'react'
import { GlowOrb } from '@/components/ui/GlowOrb'
import { HeroConstellationSvg } from '@/components/interactive/hero/HeroConstellationSvg'

type PageHeroProps = {
  eyebrow?: string
  title: string
  lede?: string
  /** Optional full-bleed background layer (e.g. BubblePitBackground). */
  background?: ReactNode
}

/**
 * Simplified hero banner for secondary pages — the frozen constellation +
 * gradient glow, same visual vocabulary as the homepage without the pinned
 * sequence (Brief §5).
 */
export const PageHero = ({ eyebrow, title, lede, background }: PageHeroProps) => (
  <section className="relative overflow-hidden bg-navy-deep px-6 pb-20 pt-36 md:pb-24">
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="hero-grain absolute inset-0" />
      <GlowOrb colour="violet" className="-left-24 top-0 h-96 w-96" />
      <GlowOrb colour="rebecca" className="right-0 top-1/3 h-80 w-80" />
      <HeroConstellationSvg className="absolute -right-10 top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 opacity-25 lg:block" />
      {background}
    </div>
    <div className="relative mx-auto max-w-content">
      {eyebrow && (
        background ? (
          /* Rotating beam pill — same conic-gradient animation as LightBeamButton.
             backdrop-blur on the fill dynamically separates violet text from violet
             bubbles regardless of where they drift. */
          <span className="relative inline-flex items-center overflow-hidden rounded-full">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from var(--gradient-angle), transparent 0%, #8B32FF 38%, #C088FF 50%, transparent 62%)',
                animation: 'border-spin 2.5s linear infinite',
              }}
            />
            <span aria-hidden className="absolute inset-[1.5px] rounded-full bg-navy-deep/50 backdrop-blur-sm" />
            <p className="relative z-10 px-4 py-1.5 font-heading text-sm font-semibold uppercase tracking-[0.2em] text-offwhite">
              {eyebrow}
            </p>
          </span>
        ) : (
          <p className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-violet-ray">
            {eyebrow}
          </p>
        )
      )}
      <h1
        className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-[1.1] text-offwhite md:text-5xl"
        style={background ? { textShadow: '0 2px 12px rgba(4,15,73,0.7)' } : undefined}
      >
        {title}
      </h1>
      {lede && (
        <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-offwhite/80 md:text-lg">
          {lede}
        </p>
      )}
    </div>
  </section>
)
