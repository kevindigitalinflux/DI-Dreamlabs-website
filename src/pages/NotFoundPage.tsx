import { Section } from '@/components/Section'
import { Button } from '@/components/ui/Button'
import { HeroConstellationSvg } from '@/components/interactive/hero/HeroConstellationSvg'

/** Branded 404 — the constellation holds its shape even when the page doesn't. */
export const NotFoundPage = () => (
  <Section surface="dream" orbs className="pt-36 text-center">
    <HeroConstellationSvg className="mx-auto h-64 w-64 opacity-40" />
    <h1 className="mt-8 font-heading text-3xl font-bold text-offwhite md:text-5xl">
      This page drifted off
    </h1>
    <p className="mx-auto mt-4 max-w-md font-body text-base text-offwhite/75">
      The link is broken or the page has moved. The good stuff is still exactly where it was.
    </p>
    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button variant="primary" href="/">
        Back to the homepage
      </Button>
      <Button variant="secondary" surface="dark" href="/contact">
        Get your free audit
      </Button>
    </div>
  </Section>
)
