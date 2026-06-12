import { useParams } from 'react-router-dom'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Button } from '@/components/ui/Button'
import { Seo } from '@/lib/Seo'

/**
 * Scaffold for the future content-marketing programme — "bottleneck
 * breakdowns" per industry (Brief §5, P3). Route structure only; excluded
 * from the sitemap until real content lands.
 */
export const ResourcePage = () => {
  const { slug } = useParams()
  return (
    <>
      <Seo
        title="Resources — Coming Soon"
        description="Bottleneck breakdowns, industry by industry. Coming soon."
        path={`/resources/${slug ?? ''}`}
        noIndex
      />
      <PageHero
        eyebrow="Resources"
        title="Bottleneck breakdowns are on the way"
        lede={`This is where "${slug ?? 'this topic'}" will live — practical, plain-English breakdowns of the bottlenecks we fix, industry by industry.`}
      />
      <Section surface="workshop" className="text-center">
        <p className="font-body text-base text-navy-deep/75">
          Until then, the fastest way to learn what applies to your business:
        </p>
        <div className="mt-6">
          <Button variant="primary" href="/tools/bottleneck-check">
            Try the Bottleneck Check
          </Button>
        </div>
      </Section>
    </>
  )
}

/** React Router lazy-route entry. */
export const Component = ResourcePage
