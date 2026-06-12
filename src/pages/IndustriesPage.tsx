import { Link } from 'react-router-dom'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/Button'
import { ArrowRightIcon } from '@/components/icons'
import {
  CleaningIcon,
  ConstructionIcon,
  FacilitiesIcon,
  LogisticsIcon,
  MaintenanceIcon,
  TradesIcon,
} from '@/components/icons'
import { Seo, breadcrumbs } from '@/lib/Seo'

const INDUSTRY_BLOCKS = [
  {
    icon: CleaningIcon,
    slug: 'cleaning',
    name: 'Cleaning',
    image: '/images/industries/cleaning.jpg',
    pain: 'Disputed work, no-shows discovered too late, and clients asking "did anyone actually come?"',
    fix: 'Photo-verified proof of work, live shift visibility, and automated client updates — so disputes end before they start.',
  },
  {
    icon: FacilitiesIcon,
    slug: 'facilities',
    name: 'Facilities',
    image: '/images/industries/facilities.jpg',
    pain: 'Dozens of sites, hundreds of emails, and no single view of what is happening where.',
    fix: 'One dashboard across every site and contractor, with issues raised, assigned and tracked automatically.',
  },
  {
    icon: MaintenanceIcon,
    slug: 'maintenance',
    name: 'Maintenance',
    image: '/images/industries/maintenance.jpg',
    pain: 'Everything is reactive: the phone rings, someone drives, the paperwork catches up days later.',
    fix: 'Scheduled preventive work, jobs dispatched to the nearest engineer, and job sheets that write themselves.',
  },
  {
    icon: ConstructionIcon,
    slug: 'construction',
    name: 'Construction',
    image: '/images/industries/construction.jpg',
    pain: 'Site and office live in different worlds — progress, variations and delays travel by phone call.',
    fix: 'Site updates captured in seconds on a phone, flowing straight into programmes, valuations and client reports.',
  },
  {
    icon: TradesIcon,
    slug: 'trades',
    name: 'Trades',
    image: '/images/industries/trades.jpg',
    pain: 'Quotes go out days after the visit, and half the leads have gone cold by then.',
    fix: 'Same-day quoting from your own price book, automatic follow-ups, and a pipeline you can see at a glance.',
  },
  {
    icon: LogisticsIcon,
    slug: 'logistics',
    name: 'Logistics',
    image: '/images/industries/logistics.jpg',
    pain: 'Stock counts drift, job statuses live in drivers\' heads, and the depot phone never stops.',
    fix: 'Live stock and job tracking with automatic alerts before things run out — not after.',
  },
] as const

/** Blue-collar verticals, each with its own bottleneck framing (Brief §5). */
export const IndustriesPage = () => (
  <>
    <Seo
      title="Industries — Cleaning, Facilities, Maintenance, Construction, Trades, Logistics"
      description="AI automation for blue-collar businesses: cleaning, facilities, maintenance, construction, trades and logistics. See the bottleneck we fix first in your industry."
      path="/industries"
      jsonLd={[breadcrumbs(['Industries', '/industries'])]}
    />
    <PageHero
      eyebrow="Industries"
      title="Your industry's bottlenecks, not generic ones"
      lede="We build for the businesses that build and run the physical world. Find yours below — and what we'd fix first."
    />
    {INDUSTRY_BLOCKS.map(({ icon: Icon, slug, name, image, pain, fix }, i) => (
      <Section key={slug} surface={i % 2 === 0 ? 'workshop' : 'dream'}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className={i % 2 === 0 ? '' : 'lg:order-2'}>
            <div className="relative overflow-hidden rounded-card">
              <img
                src={image}
                alt={`${name} work`}
                loading="lazy"
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-navy-deep/90 via-navy-deep/50 to-violet-ray/50 mix-blend-multiply"
              />
              <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-violet-ray text-offwhite">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2
              className={`font-heading text-2xl font-semibold md:text-[2rem] ${
                i % 2 === 0 ? 'text-navy-deep' : 'text-offwhite'
              }`}
            >
              {name}
            </h2>
            <p
              className={`mt-4 font-body text-base leading-relaxed ${
                i % 2 === 0 ? 'text-navy-deep/75' : 'text-offwhite/75'
              }`}
            >
              <strong className="font-medium">The bottleneck we see most:</strong> {pain}
            </p>
            <p
              className={`mt-3 font-body text-base leading-relaxed ${
                i % 2 === 0 ? 'text-navy-deep/75' : 'text-offwhite/75'
              }`}
            >
              <strong className="font-medium">What we build:</strong> {fix}
            </p>
            <Link
              to={`/tools/bottleneck-check?industry=${slug}`}
              className={`mt-6 inline-flex items-center gap-2 font-body text-sm font-bold ${
                i % 2 === 0 ? 'text-violet-ray' : 'text-cyan-strong'
              } hover:underline`}
            >
              Check your {name.toLowerCase()} bottleneck
              <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </Section>
    ))}
    <Section surface="dream" className="text-center">
      <Reveal>
        <h2 className="font-heading text-2xl font-semibold text-offwhite md:text-[2rem]">
          Don't see your industry?
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-base text-offwhite/75">
          The approach is the same wherever the bottleneck lives. If you run an SME with a
          problem worth fixing, the audit is still free.
        </p>
        <div className="mt-8">
          <Button variant="primary" href="/contact">
            Get your free audit
          </Button>
        </div>
      </Reveal>
    </Section>
  </>
)
