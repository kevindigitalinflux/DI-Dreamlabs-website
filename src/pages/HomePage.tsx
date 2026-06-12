import { HeroAssembly } from '@/components/interactive/hero/HeroAssembly'
import { PainPoints } from '@/components/home/PainPoints'
import { Method } from '@/components/home/Method'
import { Pillars } from '@/components/home/Pillars'
import { WhyDreamlabs } from '@/components/home/WhyDreamlabs'
import { Industries } from '@/components/home/Industries'
import { Proof } from '@/components/home/Proof'
import { Faq } from '@/components/home/Faq'
import { FinalCta } from '@/components/home/FinalCta'
import { SHOW_PROOF } from '@/lib/config'

/**
 * Flagship scroll narrative (Brief §7). Section rhythm alternates Deep Navy
 * "dream" and Off White "workshop" surfaces — dream → reality → dream →
 * reality, resolving back in the dream register, activated (Brief §8.2).
 * The Bottleneck Calculator section is added in Phase 4 (between Industries
 * and Proof/FAQ).
 */
export const HomePage = () => (
  <>
    <HeroAssembly />
    <PainPoints />
    <Method />
    <Pillars />
    <WhyDreamlabs />
    <Industries />
    {SHOW_PROOF && <Proof />}
    <Faq />
    <FinalCta />
  </>
)
