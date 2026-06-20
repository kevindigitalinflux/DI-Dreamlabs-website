import { useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  CleaningIcon, ConstructionIcon, EcommerceIcon, FacilitiesIcon, FieldServicesIcon,
  FinanceIcon, GeneralContractingIcon, HRIcon, LegalIcon, LogisticsIcon, MaintenanceIcon,
  MarketingIcon, RecruitmentIcon, SalesIcon, SupportIcon, TradesIcon,
} from '@/components/icons'
import { IndustryCard, type IndustryEntry } from './IndustryCard'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// y travel (px) per column — col 1 is the baseline, others scroll faster
const COLUMN_OFFSETS = [60, 0, 80, 40] as const

/* Placeholder photography — swap files in public/images/industries/ (same names). */
const PHYSICAL: IndustryEntry[] = [
  { icon: CleaningIcon, name: 'Cleaning', image: '/images/industries/cleaning.jpg', bottleneck: 'Proof-of-work disputes and no-show chaos, solved before the client notices.' },
  { icon: FacilitiesIcon, name: 'Facilities', image: '/images/industries/facilities.jpg', bottleneck: 'One dashboard for every site, instead of forty unread emails a day.' },
  { icon: MaintenanceIcon, name: 'Maintenance', image: '/images/industries/maintenance.jpg', bottleneck: 'Reactive callouts turned into scheduled work you can actually plan around.' },
  { icon: ConstructionIcon, name: 'Construction', image: '/images/industries/construction.jpg', bottleneck: 'Site updates that reach the office without anyone typing them up twice.' },
  { icon: TradesIcon, name: 'Specialty Trades', image: '/images/industries/specialty-trades.png', bottleneck: 'Quotes out the same day, not the same week, before the lead goes cold.' },
  { icon: LogisticsIcon, name: 'Logistics', image: '/images/industries/logistics.jpg', bottleneck: 'Stock and job status you can trust without ringing the depot.' },
  { icon: FieldServicesIcon, name: 'Field Services', image: '/images/industries/field-services.png', bottleneck: 'Every emergency callout logged, dispatched, and invoiced before your engineer leaves the car park.' },
  { icon: GeneralContractingIcon, name: 'General Contracting', image: '/images/industries/general-contracting.png', bottleneck: 'Project status every trade sees in real time, no missing sign-offs, no phone tag, no surprises.' },
]

const SERVICE: IndustryEntry[] = [
  { icon: MarketingIcon, name: 'Marketing', image: '/images/industries/marketing.png', bottleneck: 'Campaigns tracked in three spreadsheets, unified into one live pipeline that moves without chasing.' },
  { icon: LegalIcon, name: 'Legal', image: '/images/industries/legal.png', bottleneck: 'Time-entry and billing that writes itself, so fee earners bill the hours they actually work.' },
  { icon: FinanceIcon, name: 'Finance', image: '/images/industries/finance.png', bottleneck: 'Month-end closes in days instead of weeks, with reconciliation that flags the gaps automatically.' },
  { icon: HRIcon, name: 'HR', image: '/images/industries/hr.png', bottleneck: 'Onboarding, offboarding, and payroll paperwork that runs without a coordinator chasing anyone.' },
  { icon: EcommerceIcon, name: 'E-commerce', image: '/images/industries/ecommerce.png', bottleneck: 'Order, fulfilment, and returns in one flow, no more selling stock you no longer have.' },
  { icon: SupportIcon, name: 'Customer Support', image: '/images/industries/customer-support.png', bottleneck: 'Tickets triaged, routed, and resolved faster without burning out your best agents.' },
  { icon: RecruitmentIcon, name: 'Recruitment', image: '/images/industries/recruitment.png', bottleneck: 'Candidate pipelines that move on their own, so consultants close deals instead of chasing data.' },
  { icon: SalesIcon, name: 'Sales', image: '/images/industries/sales.png', bottleneck: 'Proposals out the same day you qualify the lead, before the competitor beats you to it.' },
]

/**
 * 4-column grid with GSAP column parallax (independent y speeds) and scroll-linked
 * rotateX tilt. Desktop only — mobile uses native snap scroll. GSAP targets the
 * .parallax-card wrappers; IndustryCard's Framer Motion tilt targets the inner figure.
 */
const ParallaxGrid = ({ entries }: { entries: IndustryEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useGSAP(() => {
    if (!ready) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(min-width: 1024px)').matches) return
    const grid = ref.current
    if (!grid) return
    gsap.utils.toArray<HTMLElement>('.parallax-card', grid).forEach((card, i) => {
      const offset = COLUMN_OFFSETS[i % 4]
      gsap.set(card, { transformPerspective: 1000 })
      if (offset) {
        gsap.fromTo(card, { y: offset }, { y: -offset, ease: 'none',
          scrollTrigger: { trigger: grid, start: 'top bottom', end: 'bottom top', scrub: 1.5, invalidateOnRefresh: true },
        })
      }
      gsap.fromTo(card, { rotateX: -8 }, { rotateX: 8, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
      })
    })
  }, { scope: ref, dependencies: [ready] })

  return (
    <div ref={ref} className="-mx-6 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
      {entries.map(({ icon: Icon, name, image, bottleneck }, i) => (
        <Reveal key={name} delay={i * 60} className="w-72 shrink-0 snap-start md:w-auto">
          <div className="parallax-card h-full">
            <IndustryCard icon={Icon} name={name} image={image} bottleneck={bottleneck} />
          </div>
        </Reveal>
      ))}
    </div>
  )
}

/** Section 5 — physical-world SMEs (top) and service SMEs (bottom), each with parallax tilt grid. */
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
      <ParallaxGrid entries={PHYSICAL} />
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
      <ParallaxGrid entries={SERVICE} />
    </Section>
  </>
)
