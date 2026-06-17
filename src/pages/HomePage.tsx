import { HeroAssembly } from '@/components/interactive/hero/HeroAssembly'
import { PainPoints } from '@/components/home/PainPoints'
import { Method } from '@/components/home/Method'
import { Pillars } from '@/components/home/Pillars'
import { KpiImpact } from '@/components/home/KpiImpact'
import { WhyDreamlabs } from '@/components/home/WhyDreamlabs'
import { Industries } from '@/components/home/Industries'
import { CalculatorSection } from '@/components/home/CalculatorSection'
import { Proof } from '@/components/home/Proof'
import { Faq } from '@/components/home/Faq'
import { FinalCta } from '@/components/home/FinalCta'
import { SHOW_PROOF } from '@/lib/config'
import { Seo } from '@/lib/Seo'

/**
 * Flagship scroll narrative (Brief §7). Section rhythm alternates Deep Navy
 * "dream" and Off White "workshop" surfaces — dream → reality → dream →
 * reality, resolving back in the dream register, activated (Brief §8.2).
 * The Bottleneck Calculator section is added in Phase 4 (between Industries
 * and Proof/FAQ).
 */
export const HomePage = () => (
  <>
    <Seo
      title="DI Dreamlabs"
      description="AI-powered systems for cleaning, construction, trades and logistics businesses. Free audit, pilot before any retainer, and you own everything we build. Enterprise capability, human-scale pricing."
      path="/"
    />
    <HeroAssembly />
    <PainPoints />
    <Method />
    <Pillars />
    <KpiImpact />
    <WhyDreamlabs />
    <Industries />
    <CalculatorSection />
    {SHOW_PROOF && <Proof />}
    <Faq />
    <FinalCta />
  </>
)
