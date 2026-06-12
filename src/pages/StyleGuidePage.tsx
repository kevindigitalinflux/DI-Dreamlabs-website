import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input, Select, TextArea } from '@/components/ui/Field'
import { Accordion } from '@/components/ui/Accordion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatCounter } from '@/components/ui/StatCounter'
import { GlowOrb } from '@/components/ui/GlowOrb'
import * as Icons from '@/components/icons'
import { Seo } from '@/lib/Seo'

const SWATCHES = [
  ['Violet Ray', 'bg-violet-ray', '#8B32FF'],
  ['Deep Navy', 'bg-navy-deep', '#040F49'],
  ['Rebecca Purple', 'bg-rebecca', '#64378B'],
  ['Magenta Bloom', 'bg-magenta-bloom', '#F0386B'],
  ['Strong Cyan', 'bg-cyan-strong', '#00DFDF'],
  ['Off White', 'bg-offwhite border border-navy-deep/10', '#F4F4F8'],
] as const

const ICON_ENTRIES = Object.entries(Icons).filter(([name]) => name.endsWith('Icon'))

/** Internal design-system review page — not linked from navigation. */
export const StyleGuidePage = () => (
  <div className="pt-16">
    <Seo title="Style Guide" description="Internal design system reference." path="/style-guide" noIndex />
    {/* Dark surface demos */}
    <section className="relative overflow-hidden bg-navy-deep px-6 py-20">
      <GlowOrb colour="violet" className="-left-20 top-10 h-96 w-96" />
      <GlowOrb colour="rebecca" className="right-0 top-1/2 h-80 w-80" />
      <div className="relative mx-auto max-w-content space-y-12">
        <h1 className="font-heading text-4xl font-extrabold leading-[1.05] text-offwhite md:text-7xl">
          Style Guide
        </h1>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {SWATCHES.map(([name, cls, hex]) => (
            <div key={name}>
              <div className={`h-20 rounded-card ${cls}`} />
              <p className="mt-2 font-body text-sm font-medium text-offwhite">{name}</p>
              <p className="font-body text-xs font-light text-offwhite/60">{hex}</p>
            </div>
          ))}
        </div>

        <SectionHeading
          eyebrow="Components"
          title="Buttons and cards on a dream surface"
          lede="Primary actions glow Violet Ray. Secondary actions stay quiet until needed."
          surface="dark"
          align="left"
        />

        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Get your free audit</Button>
          <Button variant="secondary" surface="dark">
            See what's possible
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card surface="dark">
            <Icons.MissedCallIcon className="h-8 w-8 text-violet-ray" />
            <h3 className="mt-4 font-heading text-lg font-semibold text-offwhite">Dark card</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-offwhite/75">
              Translucent surface, violet border-glow on hover.
            </p>
          </Card>
          <Card surface="dark">
            <p className="font-body text-sm text-offwhite/75">Data highlight (Cyan domain):</p>
            <div className="mt-3">
              <StatCounter value={32} suffix=" hrs" />
            </div>
            <p className="mt-1 font-body text-sm font-light text-offwhite/60">saved per month</p>
          </Card>
          <Card surface="dark">
            <p className="font-body text-sm font-medium text-magenta-bloom">
              Error / urgency (Magenta domain)
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-offwhite/75">
              Never shown next to Cyan elements.
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-4 gap-6 md:grid-cols-8">
          {ICON_ENTRIES.map(([name, Icon]) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <Icon className="h-7 w-7 text-cyan-strong" />
              <span className="text-center font-body text-[10px] font-light text-offwhite/60">
                {name.replace('Icon', '')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Light surface demos */}
    <section className="bg-offwhite px-6 py-20">
      <div className="mx-auto max-w-content space-y-12">
        <SectionHeading
          eyebrow="Workshop surface"
          title="Forms and content on Off White"
          lede="Deep Navy body text, Violet Ray focus rings, Magenta Bloom errors."
          surface="light"
          align="left"
        />

        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary on light</Button>
          <Button variant="secondary" surface="light">
            Secondary on light
          </Button>
        </div>

        <div className="grid max-w-2xl gap-6">
          <Input label="Your name" placeholder="Jane Smith" />
          <Input
            label="Email"
            type="email"
            placeholder="jane@company.co.uk"
            error="Enter a valid email address."
          />
          <Select label="Industry" defaultValue="">
            <option value="" disabled>
              Choose your industry
            </option>
            <option>Cleaning</option>
            <option>Construction</option>
          </Select>
          <TextArea label="What's your biggest bottleneck?" hint="A sentence or two is plenty." />
        </div>

        <Accordion
          items={[
            {
              question: 'How much does it cost?',
              answer: 'Every project starts with a free audit, so you know the price before committing.',
            },
            {
              question: 'Who owns what we build?',
              answer: 'You do. Outright. No licences, no lock-in.',
            },
          ]}
        />
      </div>
    </section>
  </div>
)

/** React Router lazy-route entry. */
export const Component = StyleGuidePage
