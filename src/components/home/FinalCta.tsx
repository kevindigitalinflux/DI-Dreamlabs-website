import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/Button'
import { GlowOrb } from '@/components/ui/GlowOrb'
import { BOOKING_URL } from '@/lib/config'

/**
 * Section 9 — primary conversion. The one place a slightly larger Violet Ray
 * glow/pulse on the CTA is appropriate (Brief §7).
 */
export const FinalCta = () => (
  <Section surface="dream" className="text-center">
    <GlowOrb colour="violet" className="left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2" />
    <Reveal>
      <div className="relative mx-auto max-w-2xl">
        <h2 className="font-heading text-3xl font-bold leading-[1.1] text-offwhite md:text-5xl">
          Find out what your bottleneck is costing you.
        </h2>
        <p className="mt-5 font-body text-base leading-relaxed text-offwhite/80 md:text-lg">
          A free audit with our team. No pitch, no pressure, no invoice, just a clear picture of
          what is possible and what it would be worth to you.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="primary"
            href="/contact"
            className="!h-16 !px-10 !text-lg shadow-glow-violet-lg motion-safe:animate-pulse [animation-duration:3s]"
          >
            Book your free audit
          </Button>
        </div>
        {!BOOKING_URL && (
          <p className="mt-4 font-body text-sm font-light text-offwhite/50">
            Prefer email? Use the contact form, and we reply within one working day.
          </p>
        )}
      </div>
    </Reveal>
  </Section>
)
