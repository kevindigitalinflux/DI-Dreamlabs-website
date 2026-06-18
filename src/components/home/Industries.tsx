import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  CleaningIcon,
  ConstructionIcon,
  EcommerceIcon,
  FacilitiesIcon,
  FinanceIcon,
  HRIcon,
  LegalIcon,
  LogisticsIcon,
  MaintenanceIcon,
  MarketingIcon,
  RecruitmentIcon,
  SalesIcon,
  SupportIcon,
  TradesIcon,
} from '@/components/icons'
import { Link } from 'react-router-dom'

type IconFn = (props: { className?: string; 'aria-hidden'?: boolean }) => JSX.Element
type Physical = { icon: IconFn; name: string; image: string; bottleneck: string }
type Service = { icon: IconFn; name: string; bottleneck: string }

/* Placeholder photography — swap-ready: replace files in public/images/industries/ */
const PHYSICAL: Physical[] = [
  { icon: CleaningIcon, name: 'Cleaning', image: '/images/industries/cleaning.jpg', bottleneck: 'Proof-of-work disputes and no-show chaos, solved before the client notices.' },
  { icon: FacilitiesIcon, name: 'Facilities', image: '/images/industries/facilities.jpg', bottleneck: 'One dashboard for every site, instead of forty unread emails a day.' },
  { icon: MaintenanceIcon, name: 'Maintenance', image: '/images/industries/maintenance.jpg', bottleneck: 'Reactive callouts turned into scheduled work you can actually plan around.' },
  { icon: ConstructionIcon, name: 'Construction', image: '/images/industries/construction.jpg', bottleneck: 'Site updates that reach the office without anyone typing them up twice.' },
  { icon: TradesIcon, name: 'Trades', image: '/images/industries/trades.jpg', bottleneck: 'Quotes out the same day, not the same week, before the lead goes cold.' },
  { icon: LogisticsIcon, name: 'Logistics', image: '/images/industries/logistics.jpg', bottleneck: 'Stock and job status you can trust without ringing the depot.' },
]

const SERVICE: Service[] = [
  { icon: MarketingIcon, name: 'Marketing', bottleneck: 'Campaigns tracked in three spreadsheets, unified into one live pipeline that moves without chasing.' },
  { icon: LegalIcon, name: 'Legal', bottleneck: 'Time-entry and billing that writes itself, so fee earners bill the hours they actually work.' },
  { icon: FinanceIcon, name: 'Finance', bottleneck: 'Month-end closes in days instead of weeks, with reconciliation that flags the gaps automatically.' },
  { icon: HRIcon, name: 'HR', bottleneck: 'Onboarding, offboarding, and payroll paperwork that runs without a coordinator chasing anyone.' },
  { icon: EcommerceIcon, name: 'E-commerce', bottleneck: 'Order, fulfilment, and returns in one flow — no more selling stock you no longer have.' },
  { icon: SupportIcon, name: 'Customer Support', bottleneck: 'Tickets triaged, routed, and resolved faster without burning out your best agents.' },
  { icon: RecruitmentIcon, name: 'Recruitment', bottleneck: 'Candidate pipelines that move on their own, so consultants close deals instead of chasing data.' },
  { icon: SalesIcon, name: 'Sales', bottleneck: 'Proposals out the same day you qualify the lead — before the competitor beats you to it.' },
]

const PhysicalCard = ({ icon: Icon, name, image, bottleneck }: Physical) => (
  <Link
    to={`/tools/bottleneck-check?industry=${name.toLowerCase()}`}
    className="group block h-full overflow-hidden rounded-card border border-offwhite/10 transition-all duration-300 hover:border-violet-ray/50 hover:shadow-glow-violet"
  >
    <div className="relative h-40 overflow-hidden">
      <img src={image} alt={`${name} work`} loading="lazy" width={800} height={600} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-navy-deep/90 via-navy-deep/60 to-violet-ray/50 mix-blend-multiply" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent" />
      <span className="absolute bottom-3 left-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-ray/90 text-offwhite"><Icon className="h-5 w-5" aria-hidden /></span>
        <span className="font-heading text-lg font-semibold text-offwhite">{name}</span>
      </span>
    </div>
    <div className="bg-offwhite/5 p-5"><p className="font-body text-sm leading-relaxed text-offwhite/75">{bottleneck}</p></div>
  </Link>
)

const ServiceCard = ({ icon: Icon, name, bottleneck }: Service) => (
  <Link
    to={`/tools/bottleneck-check?industry=${encodeURIComponent(name.toLowerCase())}`}
    className="group block h-full overflow-hidden rounded-card border border-offwhite/10 transition-all duration-300 hover:border-violet-ray/50 hover:shadow-glow-violet"
  >
    <div className="relative h-40 bg-gradient-to-br from-navy-deep via-[#0a1466] to-violet-ray/40">
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent" />
      <span className="absolute bottom-3 left-4 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-ray/90 text-offwhite"><Icon className="h-5 w-5" aria-hidden /></span>
        <span className="font-heading text-lg font-semibold text-offwhite">{name}</span>
      </span>
    </div>
    <div className="bg-offwhite/5 p-5"><p className="font-body text-sm leading-relaxed text-offwhite/75">{bottleneck}</p></div>
  </Link>
)

/**
 * Section 5 — two panels: physical-world industries (top) and service SMEs (bottom).
 * Photography uses navy→violet duotone overlay; service cards use a gradient tile.
 */
export const Industries = () => (
  <>
    <Section surface="dream" orbs>
      <Reveal>
        <SectionHeading
          eyebrow="Industries we serve"
          title="Built for the businesses that build the world"
          lede="If your work happens in vans, on sites, and in buildings, not just behind desks, you are exactly who we built Dreamlabs for."
          surface="dark"
        />
      </Reveal>
      <div className="-mx-6 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
        {PHYSICAL.map(({ icon: Icon, name, image, bottleneck }, i) => (
          <Reveal key={name} delay={i * 80} className="w-72 shrink-0 snap-start md:w-auto">
            <PhysicalCard icon={Icon} name={name} image={image} bottleneck={bottleneck} />
          </Reveal>
        ))}
      </div>
    </Section>

    <Section surface="dream">
      <Reveal>
        <SectionHeading
          eyebrow="Industries we serve"
          title="Built for the businesses that service the world"
          lede="If your business runs on client relationships, expertise, and fast-moving teams, Dreamlabs builds the systems that let you scale without adding headcount."
          surface="dark"
        />
      </Reveal>
      <div className="-mx-6 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
        {SERVICE.map(({ icon: Icon, name, bottleneck }, i) => (
          <Reveal key={name} delay={i * 60} className="w-72 shrink-0 snap-start md:w-auto">
            <ServiceCard icon={Icon} name={name} bottleneck={bottleneck} />
          </Reveal>
        ))}
      </div>
    </Section>
  </>
)
