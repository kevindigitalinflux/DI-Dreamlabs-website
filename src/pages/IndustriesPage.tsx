import { Link } from 'react-router-dom'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import {
  ArrowRightIcon,
  CleaningIcon, ConstructionIcon, EcommerceIcon, FacilitiesIcon,
  FieldServicesIcon, FinanceIcon, GeneralContractingIcon, HRIcon,
  LegalIcon, LogisticsIcon, MaintenanceIcon, MarketingIcon,
  RecruitmentIcon, SalesIcon, SupportIcon, TradesIcon,
} from '@/components/icons'
import { Seo, breadcrumbs } from '@/lib/Seo'

type IconFn = (props: { className?: string; 'aria-hidden'?: boolean }) => JSX.Element
type IndustryBlock = {
  icon: IconFn; slug: string; name: string; image: string; pain: string; fix: string
}

const PHYSICAL_BLOCKS: IndustryBlock[] = [
  { icon: CleaningIcon, slug: 'cleaning', name: 'Cleaning', image: '/images/industries/cleaning.jpg',
    pain: 'Disputed work, no-shows discovered too late, and clients asking "did anyone actually come?"',
    fix: 'Photo-verified proof of work, live shift visibility, and automated client updates — disputes end before they start.' },
  { icon: FacilitiesIcon, slug: 'facilities', name: 'Facilities', image: '/images/industries/facilities.jpg',
    pain: 'Dozens of sites, hundreds of emails, and no single view of what is happening where.',
    fix: 'One dashboard across every site and contractor, with issues raised, assigned, and tracked automatically.' },
  { icon: MaintenanceIcon, slug: 'maintenance', name: 'Maintenance', image: '/images/industries/maintenance.jpg',
    pain: 'Everything is reactive: the phone rings, someone drives, the paperwork catches up days later.',
    fix: 'Scheduled preventive work, jobs dispatched to the nearest engineer, and job sheets that write themselves.' },
  { icon: ConstructionIcon, slug: 'construction', name: 'Construction', image: '/images/industries/construction.jpg',
    pain: 'Site and office live in different worlds, and progress, variations, and delays travel by phone call.',
    fix: 'Site updates captured in seconds on a phone, flowing straight into programmes, valuations, and client reports.' },
  { icon: TradesIcon, slug: 'specialty-trades', name: 'Specialty Trades', image: '/images/industries/specialty-trades.png',
    pain: 'Quotes go out days after the visit, and half the leads have gone cold or hired someone else by then.',
    fix: 'Same-day quoting from your own price book, automatic follow-ups, and a pipeline you can see at a glance.' },
  { icon: LogisticsIcon, slug: 'logistics', name: 'Logistics', image: '/images/industries/logistics.jpg',
    pain: 'Stock counts drift, job statuses live in drivers\' heads, and the depot phone never stops ringing.',
    fix: 'Live stock and job tracking with automatic alerts before things run out, not after.' },
  { icon: FieldServicesIcon, slug: 'field-services', name: 'Field Services', image: '/images/industries/field-services.png',
    pain: 'Emergency callouts get dispatched by text, job sheets get done at midnight, and half the paperwork never gets finished.',
    fix: 'Calls automatically logged, the nearest engineer dispatched in seconds, job sheets generated on-site and invoiced before they leave.' },
  { icon: GeneralContractingIcon, slug: 'general-contracting', name: 'General Contracting', image: '/images/industries/general-contracting.png',
    pain: 'Sub-contractors, RFIs, variations, and sign-offs all travel by email and phone call. Nothing is in one place.',
    fix: 'One project hub where every trade sees their tasks, variations are approved digitally, and the programme updates itself in real time.' },
]

const SERVICE_BLOCKS: IndustryBlock[] = [
  { icon: MarketingIcon, slug: 'marketing', name: 'Marketing', image: '/images/industries/marketing.png',
    pain: 'Campaign results live in five different platforms and a spreadsheet, and no one can say whether the budget is working.',
    fix: 'A single live dashboard pulling every platform, with automated reporting sent to clients before they have to ask.' },
  { icon: LegalIcon, slug: 'legal', name: 'Legal', image: '/images/industries/legal.png',
    pain: 'Billable hours leak between meetings, calls, and admin. By Friday, no one can fully account for where the week went.',
    fix: 'Automatic time capture against every matter, with draft bills generated directly from calendar and file activity.' },
  { icon: FinanceIcon, slug: 'finance', name: 'Finance', image: '/images/industries/finance.png',
    pain: 'Month-end is a manual sprint to reconcile accounts across systems that were never designed to talk to each other.',
    fix: 'Automated reconciliation that flags discrepancies in real time, turning month-end from a crisis into a review.' },
  { icon: HRIcon, slug: 'hr', name: 'HR', image: '/images/industries/hr.png',
    pain: 'Onboarding a new hire means chasing signatures, IT tickets, and induction bookings across half a dozen tools.',
    fix: 'A single triggered workflow on day one: contracts out, access set up, training scheduled, no coordinator chasing anyone.' },
  { icon: EcommerceIcon, slug: 'ecommerce', name: 'E-commerce', image: '/images/industries/ecommerce.png',
    pain: 'Orders, returns, and fulfilment run across separate systems. Overselling, shipping errors, and refund delays are a regular occurrence.',
    fix: 'Unified order management with live inventory sync, automated fulfilment triggers, and returns handled without manual input.' },
  { icon: SupportIcon, slug: 'customer-support', name: 'Customer Support', image: '/images/industries/customer-support.png',
    pain: 'Tickets arrive from email, chat, and social. Agents triage manually, and customers wait too long for answers to simple questions.',
    fix: 'Intelligent triage routes tickets automatically, handles tier-one queries instantly, and keeps agents on the issues that need them.' },
  { icon: RecruitmentIcon, slug: 'recruitment', name: 'Recruitment', image: '/images/industries/recruitment.png',
    pain: 'CVs arrive by email, shortlisting is manual, and interview scheduling takes days of back-and-forth with every candidate.',
    fix: 'Automated screening, calendar-linked scheduling, and a live pipeline that keeps consultants closing deals, not chasing admin.' },
  { icon: SalesIcon, slug: 'sales', name: 'Sales', image: '/images/industries/sales.png',
    pain: 'Proposals take an afternoon to build. Follow-ups fall through the cracks. Pipeline data is whatever people bothered to update last.',
    fix: 'Proposals generated from a brief in minutes, automatic follow-up sequences, and a CRM that updates itself from real activity.' },
]

const IndustrySection = ({
  icon: Icon, slug, name, image, pain, fix, i, surface,
}: IndustryBlock & { i: number; surface: 'workshop' | 'dream' }) => {
  const isDark = surface === 'dream'
  const reverse = i % 2 !== 0
  return (
    <Section surface={surface}>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <Reveal className={reverse ? 'lg:order-2' : ''}>
          <div className="relative overflow-hidden rounded-card">
            <img src={image} alt={`${name} work`} loading="lazy" width={800} height={600}
              className="aspect-[4/3] w-full object-cover" />
            <div aria-hidden
              className="absolute inset-0 bg-gradient-to-tr from-navy-deep/90 via-navy-deep/50 to-violet-ray/50 mix-blend-multiply" />
            <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-violet-ray text-offwhite">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className={`font-heading text-2xl font-semibold md:text-[2rem] ${isDark ? 'text-offwhite' : 'text-navy-deep'}`}>
            {name}
          </h2>
          <p className={`mt-4 font-body text-base leading-relaxed ${isDark ? 'text-offwhite/75' : 'text-navy-deep/75'}`}>
            <strong className="font-medium">The bottleneck we see most:</strong> {pain}
          </p>
          <p className={`mt-3 font-body text-base leading-relaxed ${isDark ? 'text-offwhite/75' : 'text-navy-deep/75'}`}>
            <strong className="font-medium">What we build:</strong> {fix}
          </p>
          <Link to={`/tools/bottleneck-check?industry=${slug}`}
            className={`mt-6 inline-flex items-center gap-2 font-body text-sm font-bold hover:underline ${isDark ? 'text-cyan-strong' : 'text-violet-ray'}`}>
            Check your {name.toLowerCase()} bottleneck
            <ArrowRightIcon className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </Section>
  )
}

/** Physical-world and service SME verticals, each with a tailored bottleneck framing. */
export const IndustriesPage = () => (
  <>
    <Seo
      title="Industries: Physical & Service SMEs — Cleaning, Legal, Finance, HR and More"
      description="AI automation for physical-world and service SMEs: cleaning, construction, legal, finance, HR, e-commerce and more. Find your industry and the bottleneck we'd fix first."
      path="/industries"
      jsonLd={[breadcrumbs(['Industries', '/industries'])]}
    />
    <PageHero
      eyebrow="Industries"
      title="Your industry's bottlenecks, not generic ones"
      lede="We build for physical-world businesses and service SMEs alike. Find yours below and see what we'd fix first."
    />
    {PHYSICAL_BLOCKS.map((b, i) => (
      <IndustrySection key={b.slug} {...b} i={i} surface={i % 2 === 0 ? 'workshop' : 'dream'} />
    ))}
    <Section surface="workshop">
      <Reveal>
        <SectionHeading
          eyebrow="Industries we serve"
          title="Built for the businesses that service the world"
          lede="If your business runs on client relationships, expertise, and fast-moving teams, Dreamlabs builds the systems that let you scale without adding headcount."
          surface="light"
        />
      </Reveal>
    </Section>
    {SERVICE_BLOCKS.map((b, i) => (
      <IndustrySection key={b.slug} {...b} i={i} surface={i % 2 === 0 ? 'dream' : 'workshop'} />
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

/** React Router lazy-route entry. */
export const Component = IndustriesPage
