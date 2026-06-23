import { useRef, useState, useLayoutEffect, useEffect } from 'react'
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

// Carousel constants (matches MobileTrustCarousel pattern from Mr Brush)
const CARD_W = 280
const CARD_GAP = 16
const CARD_STRIDE = CARD_W + CARD_GAP  // 296px per step
const AUTO_SPEED = 0.5                  // px/frame — gentle continuous scroll
const SNAP_PAUSE = 900                  // ms to pause auto-play after a user swipe
const EASE = 0.09

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

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
 * Auto-scrolling swipe carousel for industry cards — mobile only (< md).
 * Identical mechanics to the Mr Brush MobileTrustCarousel: continuous auto-scroll,
 * touch drag with momentum + card snapping, arc effect on edge cards.
 */
const IndustriesCarousel = ({ entries }: { entries: IndustryEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef(0)
  const scrollRef = useRef({ current: 0, target: 0 })
  const dragRef = useRef({
    isDown: false, startX: 0, startY: 0, startScroll: 0,
    intentDetermined: false, isHorizontal: false,
  })
  const velRef = useRef({ v: 0, lastX: 0, lastTime: 0 })
  const snapUntilRef = useRef(0)

  // Triple cards for seamless infinite loop
  const cards = [...entries, ...entries, ...entries]
  const setWidth = CARD_STRIDE * entries.length

  useEffect(() => {
    scrollRef.current.current = setWidth
    scrollRef.current.target = setWidth

    const tick = () => {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track || container.offsetWidth === 0) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const s = scrollRef.current
      const isDragging = dragRef.current.isDown
      const isSnapping = performance.now() < snapUntilRef.current

      if (!isDragging && !isSnapping) {
        s.target += AUTO_SPEED
        s.current += AUTO_SPEED
      }

      s.current = lerp(s.current, s.target, EASE)

      // Infinite wrap — keep viewport inside the middle card set
      if (s.current >= setWidth * 1.5) {
        s.current -= setWidth; s.target -= setWidth
        dragRef.current.startScroll -= setWidth
      }
      if (s.current < setWidth * 0.5) {
        s.current += setWidth; s.target += setWidth
        dragRef.current.startScroll += setWidth
      }

      const padLeft = (container.offsetWidth - CARD_W) / 2
      track.style.transform = `translateX(${padLeft - s.current}px)`

      // Arc effect: edge cards dip and fade slightly
      const centerX = container.offsetWidth / 2
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const cx = padLeft - s.current + i * CARD_STRIDE + CARD_W / 2
        const d = Math.max(-1, Math.min(1, (cx - centerX) / (container.offsetWidth * 0.65)))
        el.style.transform = `translateY(${d * d * 16}px) scale(${1 - Math.abs(d) * 0.05})`
        el.style.opacity = String(Math.max(0.3, 1 - Math.abs(d) * 0.4))
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [setWidth])

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    const d = dragRef.current
    d.isDown = true; d.startX = t.clientX; d.startY = t.clientY
    d.startScroll = scrollRef.current.current
    d.intentDetermined = false; d.isHorizontal = false
    velRef.current = { v: 0, lastX: t.clientX, lastTime: performance.now() }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const d = dragRef.current
    if (!d.isDown) return
    const t = e.touches[0]
    if (!d.intentDetermined) {
      const dx = Math.abs(t.clientX - d.startX)
      const dy = Math.abs(t.clientY - d.startY)
      if (dx < 6 && dy < 6) return
      d.intentDetermined = true
      d.isHorizontal = dx > dy * 0.9
    }
    if (!d.isHorizontal) return
    const now = performance.now()
    const dt = now - velRef.current.lastTime
    if (dt > 8 && dt < 100) {
      const rawV = (velRef.current.lastX - t.clientX) / dt
      velRef.current.v = Math.max(-4, Math.min(4, rawV))
    }
    velRef.current.lastX = t.clientX
    velRef.current.lastTime = now
    scrollRef.current.target = d.startScroll + (d.startX - t.clientX) * 1.1
  }

  const onTouchEnd = () => {
    const d = dragRef.current
    if (!d.isDown) return
    d.isDown = false
    if (!d.isHorizontal) return
    const s = scrollRef.current
    const projected = s.target + velRef.current.v * 160
    const baseCard = Math.round(s.target / CARD_STRIDE)
    const clamped = Math.max((baseCard - 2) * CARD_STRIDE, Math.min((baseCard + 2) * CARD_STRIDE, projected))
    s.target = Math.round(clamped / CARD_STRIDE) * CARD_STRIDE
    snapUntilRef.current = performance.now() + SNAP_PAUSE
  }

  return (
    <div
      ref={containerRef}
      className="mt-10 overflow-hidden py-4"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div ref={trackRef} className="flex" style={{ willChange: 'transform' }}>
        {cards.map((entry, i) => (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el }}
            aria-hidden={i < entries.length || i >= entries.length * 2}
            className="shrink-0"
            style={{ width: `${CARD_W}px`, marginRight: `${CARD_GAP}px`, willChange: 'transform, opacity' }}
          >
            <IndustryCard {...entry} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 4-column grid with GSAP column parallax (independent y speeds) and scroll-linked
 * rotateX tilt. Tablet/desktop only — mobile uses IndustriesCarousel.
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
    <>
      {/* Mobile carousel — break out of section px-6 gutter for full-width track */}
      <div className="-mx-6 md:hidden">
        <IndustriesCarousel entries={entries} />
      </div>

      {/* Tablet / desktop grid */}
      <div
        ref={ref}
        className="mt-12 hidden md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-4"
      >
        {entries.map(({ icon: Icon, name, image, bottleneck }, i) => (
          <Reveal key={name} delay={i * 60}>
            <div className="parallax-card h-full">
              <IndustryCard icon={Icon} name={name} image={image} bottleneck={bottleneck} />
            </div>
          </Reveal>
        ))}
      </div>
    </>
  )
}

/** Section 5 — physical-world SMEs (top) and service SMEs (bottom), each with parallax tilt grid. */
export const Industries = () => (
  <>
    <Section surface="dream" orbs className="overflow-hidden">
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

    <Section surface="dream" className="overflow-hidden">
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
