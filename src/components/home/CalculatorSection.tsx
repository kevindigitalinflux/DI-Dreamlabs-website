import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BottleneckCalculator } from '@/components/interactive/calculator/BottleneckCalculator'

/** Section 6 — the "show, don't tell" interactive lead magnet (Brief §7). */
export const CalculatorSection = () => (
  <Section surface="dream" orbs id="bottleneck-check">
    <Reveal>
      <SectionHeading
        eyebrow="The bottleneck check"
        title="What is your biggest bottleneck actually costing you?"
        lede="Four quick questions. No email needed to see your first number."
        surface="dark"
      />
    </Reveal>
    <Reveal className="mx-auto mt-12 max-w-3xl">
      <BottleneckCalculator />
    </Reveal>
  </Section>
)
