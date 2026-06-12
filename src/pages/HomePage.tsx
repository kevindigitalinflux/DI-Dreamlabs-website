import { HeroAssembly } from '@/components/interactive/hero/HeroAssembly'

/** Flagship scroll narrative — hero now, sections 1–10 added in Phase 3. */
export const HomePage = () => (
  <>
    <HeroAssembly />
    {/* Temporary spacer so the pinned hero has somewhere to hand off to —
        replaced by the real narrative sections in Phase 3. */}
    <section className="flex min-h-[50vh] items-center justify-center bg-navy-deep">
      <p className="font-body text-offwhite/60">Narrative sections arrive in Phase 3.</p>
    </section>
  </>
)
