import { useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Reveal } from '@/components/Reveal'
import {
  ArrowRightIcon,
  DeliveryIcon,
  GuaranteeIcon,
  OwnIcon,
  PilotIcon,
  TeamIcon,
} from '@/components/icons'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type WhyCardData = {
  icon: (props: { className?: string; 'aria-hidden'?: boolean }) => JSX.Element
  title: string
  body: string
  image: string
  imageAlt: string
}

const USPS: WhyCardData[] = [
  {
    icon: OwnIcon,
    title: 'You own everything we build',
    body: 'Code, data, accounts, all yours outright. No licence fees, no lock-in, no hostage situations.',
    image: '/images/industries/construction.jpg',
    imageAlt: 'Construction site',
  },
  {
    icon: GuaranteeIcon,
    title: 'Money-back guarantee',
    body: 'If the system does not deliver what we agreed, you get your money back. Simple as that.',
    image: '/images/industries/cleaning.jpg',
    imageAlt: 'Professional cleaning service',
  },
  {
    icon: PilotIcon,
    title: 'Pilot before any retainer',
    body: 'Prove it on real work first. You only commit once you have seen it earn its keep.',
    image: '/images/industries/maintenance.jpg',
    imageAlt: 'Maintenance work',
  },
  {
    icon: TeamIcon,
    title: 'Enterprise team, SME pricing',
    body: 'Big-firm capability without big-firm overheads, via the Digital Influx Academy pipeline.',
    image: '/images/industries/facilities.jpg',
    imageAlt: 'Facilities management',
  },
  {
    icon: DeliveryIcon,
    title: 'Delivered in 2–8 weeks',
    body: 'Working software in weeks, not a roadmap that ships next year.',
    image: '/images/industries/logistics.jpg',
    imageAlt: 'Logistics and delivery',
  },
]

/** Individual trust-signal card with duotone image treatment (matches Industries). */
const WhyCard = ({ icon: Icon, title, body, image, imageAlt }: WhyCardData) => (
  <article className="group flex w-80 flex-shrink-0 flex-col overflow-hidden rounded-card border border-offwhite/10 bg-navy-deep transition-all duration-300 hover:border-violet-ray/50 hover:shadow-glow-violet">
    <div className="relative h-56 overflow-hidden">
      <img
        src={image}
        alt={imageAlt}
        loading="lazy"
        width={640}
        height={480}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Duotone: Deep Navy → Violet Ray — identical to Industries section treatment */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-tr from-navy-deep/90 via-navy-deep/60 to-violet-ray/50 mix-blend-multiply"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent"
      />
    </div>
    <div className="flex flex-1 flex-col p-6">
      <Icon className="h-8 w-8 text-violet-ray" aria-hidden />
      <h3 className="mt-4 font-heading text-lg font-semibold text-offwhite">{title}</h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-offwhite/70">{body}</p>
    </div>
  </article>
)

/** Section 4 — trust builders, sticky horizontal scroll gallery (Brief §7). */
export const WhyDreamlabs = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  // useLayoutEffect fires after DOM mutations. The rAF inside guarantees the
  // browser has completed its first layout pass so GSAP reads accurate widths.
  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useGSAP(
    () => {
      if (!ready) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const track = trackRef.current
      const rightPanel = rightPanelRef.current
      const container = containerRef.current
      if (!track || !rightPanel || !container) return

      // Amount the track needs to travel = its full width minus the visible panel width
      const getDistance = () => track.scrollWidth - rightPanel.clientWidth
      if (getDistance() <= 0) return

      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    },
    { scope: containerRef, dependencies: [ready] },
  )

  return (
    <section ref={containerRef} className="relative bg-offwhite" aria-label="Why Dreamlabs">

      {/* ── Desktop: pinned two-panel layout ── */}
      <div className="hidden h-screen items-stretch md:flex">

        {/* Left panel — stays fixed during horizontal scroll */}
        <div className="flex w-[38%] flex-shrink-0 flex-col justify-center px-12 lg:px-16 xl:px-20">
          <Reveal>
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-violet-ray">
              Why Dreamlabs
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-navy-deep lg:text-4xl">
              Built to be the safest decision you make this year
            </h2>
            <p className="mt-4 font-body text-base leading-relaxed text-navy-deep/60">
              At Dreamlabs we are all about giving our clients as much value upfront. We understand
              that sometimes business owners can be hesitant, which is why we do this
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-violet-ray/25" />
              <ArrowRightIcon className="h-5 w-5 flex-shrink-0 text-violet-ray" aria-hidden />
            </div>
          </Reveal>
        </div>

        {/* Right panel — cards scroll horizontally via GSAP */}
        <div ref={rightPanelRef} className="flex flex-1 items-center overflow-hidden py-14">
          <div ref={trackRef} className="flex gap-5 pl-6 pr-24 will-change-transform">
            {USPS.map((usp) => <WhyCard key={usp.title} {...usp} />)}
          </div>
        </div>
      </div>

      {/* ── Mobile: stacked + horizontal snap scroll ── */}
      <div className="px-6 py-20 md:hidden">
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-violet-ray">
          Why Dreamlabs
        </span>
        <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-navy-deep">
          Built to be the safest decision you make this year
        </h2>
        <p className="mt-4 font-body text-base leading-relaxed text-navy-deep/60">
          At Dreamlabs we are all about giving our clients as much value upfront. We understand
          that sometimes business owners can be hesitant, which is why we do this
        </p>
        <div className="-mx-6 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4">
          {USPS.map((usp) => <WhyCard key={usp.title} {...usp} />)}
        </div>
      </div>

    </section>
  )
}
