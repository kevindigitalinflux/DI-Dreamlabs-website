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
        title="Free Bottleneck Check — What Is Your Bottleneck Costing You?"
        description="Free tool for UK service SMEs: answer four quick questions and see what your biggest operational bottleneck costs every month, in hours and pounds."
        path="/tools/bottleneck-check"
        jsonLd={[breadcrumbs(['Bottleneck Check', '/tools/bottleneck-check'])]}
      />
      <Section surface="dream" orbs>
        <SectionHeading
          eyebrow="Free tool"
          title="The Bottleneck Check"
          lede="Find out what your biggest operational headache costs every month — in hours and in pounds. Four questions, instant answer, no obligation."
          surface="dark"
        />
        <div className="mx-auto mt-12 max-w-3xl">
          <BottleneckCalculator
            {...(initialIndustry ? { initialIndustry } : {})}
          />
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center font-body text-sm font-light text-offwhite/60">
          Estimates are based on typical figures for UK service SMEs. Your free audit replaces
          them with your real numbers.
        </p>
      </Section>
    </div>
  )
}
