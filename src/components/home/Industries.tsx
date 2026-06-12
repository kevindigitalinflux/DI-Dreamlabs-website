import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  CleaningIcon,
  ConstructionIcon,
  FacilitiesIcon,
  LogisticsIcon,
  MaintenanceIcon,
  TradesIcon,
} from '@/components/icons'
import { Link } from 'react-router-dom'

/* Placeholder photography (Unsplash) — swap-ready: replace files in
   public/images/industries/ keeping the same names. */
const INDUSTRIES = [
  {
    icon: CleaningIcon,
    name: 'Cleaning',
    image: '/images/industries/cleaning.jpg',
    bottleneck: 'Proof-of-work disputes and no-show chaos, solved before the client notices.',
  },
  {
    icon: FacilitiesIcon,
    name: 'Facilities',
    image: '/images/industries/facilities.jpg',
    bottleneck: 'One dashboard for every site, instead of forty unread emails a day.',
  },
  {
    icon: MaintenanceIcon,
    name: 'Maintenance',
    image: '/images/industries/maintenance.jpg',
    bottleneck: 'Reactive callouts turned into scheduled work you can actually plan around.',
  },
  {
    icon: ConstructionIcon,
    name: 'Construction',
    image: '/images/industries/construction.jpg',
    bottleneck: 'Site updates that reach the office without anyone typing them up twice.',
  },
  {
    icon: TradesIcon,
    name: 'Trades',
    image: '/images/industries/trades.jpg',
    bottleneck: 'Quotes out the same day, not the same week — before the lead goes cold.',
  },
  {
    icon: LogisticsIcon,
    name: 'Logistics',
    image: '/images/industries/logistics.jpg',
    bottleneck: 'Stock and job status you can trust without ringing the depot.',
  },
] as const

/**
 * Section 5 — relevance signal for the primary persona. Photography is
 * treated with the navy→violet duotone overlay inside a containing shape so
 * it stays in the Lucid-Tech register (spec §3). Horizontal scroll-snap on
 * mobile, grid on desktop.
 */
export const Industries = () => (
  <Section surface="dream" orbs>
    <Reveal>
      <SectionHeading
        eyebrow="Industries we serve"
        title="Built for the businesses that build the world"
        lede="If your work happens in vans, on sites, and in buildings — not just behind desks — you are exactly who we built Dreamlabs for."
        surface="dark"
      />
    </Reveal>
    <div className="-mx-6 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
      {INDUSTRIES.map(({ icon: Icon, name, image, bottleneck }, i) => (
        <Reveal key={name} delay={i * 80} className="w-72 shrink-0 snap-start md:w-auto">
          <Link
            to={`/tools/bottleneck-check?industry=${name.toLowerCase()}`}
            className="group block h-full overflow-hidden rounded-card border border-offwhite/10 transition-all duration-300 hover:border-violet-ray/50 hover:shadow-glow-violet"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={image}
                alt={`${name} work`}
                loading="lazy"
                width={800}
                height={600}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Duotone: Deep Navy → Violet Ray, keeps photos on-brand */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-navy-deep/90 via-navy-deep/60 to-violet-ray/50 mix-blend-multiply"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent"
              />
              <span className="absolute bottom-3 left-4 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-ray/90 text-offwhite">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-heading text-lg font-semibold text-offwhite">{name}</span>
              </span>
            </div>
            <div className="bg-offwhite/5 p-5">
              <p className="font-body text-sm leading-relaxed text-offwhite/75">{bottleneck}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  </Section>
)
