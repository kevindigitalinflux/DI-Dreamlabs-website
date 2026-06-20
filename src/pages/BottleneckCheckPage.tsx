import { useSearchParams } from 'react-router-dom'
import { INDUSTRIES } from '@/lib/calculator'
import type { Industry } from '@/lib/calculator'
import { BottleneckCalculator } from '@/components/interactive/calculator/BottleneckCalculator'
import { Section } from '@/components/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Seo, breadcrumbs } from '@/lib/Seo'

/**
 * Standalone Bottleneck Check (Brief §5) — SEO page + shareable lead magnet.
 * Supports ?industry=cleaning etc. to pre-select step one.
 */
export const BottleneckCheckPage = () => {
  const [params] = useSearchParams()
  const requested = params.get('industry')
  const initialIndustry = INDUSTRIES.find((i) => i.value === requested)?.value as
    | Industry
    | undefined

  return (
    <div className="pt-16">
      <Seo
        title="Free Bottleneck Check: What Is Your Bottleneck Costing You?"
        description="Free tool for UK service SMEs: answer four quick questions and see what your biggest operational bottleneck costs every month, in hours and pounds."
        path="/tools/bottleneck-check"
        jsonLd={[breadcrumbs(['Bottleneck Check', '/tools/bottleneck-check'])]}
      />
      <Section surface="dream" orbs>
        <SectionHeading
          eyebrow="Free tool — blue-collar &amp; service businesses"
          title="What is your biggest bottleneck costing you?"
          lede="Answer four quick questions and get a broad estimate of the time you're losing every week and the revenue at risk every month — based on averages for your industry and team size."
          surface="dark"
        />
        <div className="mx-auto mt-12 max-w-3xl">
          <BottleneckCalculator
            {...(initialIndustry ? { initialIndustry } : {})}
          />
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center font-body text-sm font-light text-offwhite/60">
          Figures are broad estimates based on published SME benchmarks for your industry and team
          size — not precise forecasts. Your free audit is where we get precise.
        </p>
      </Section>
    </div>
  )
}

/** React Router lazy-route entry. */
export const Component = BottleneckCheckPage
