import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import {
  DeliveryIcon,
  GuaranteeIcon,
  OwnIcon,
  PilotIcon,
  TeamIcon,
} from '@/components/icons'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const USPS = [
  {
    icon: OwnIcon,
    title: 'You own everything we build',
    body: 'Code, data, accounts, all yours outright. No licence fees, no lock-in, no hostage situations.',
  },
  {
    icon: GuaranteeIcon,
    title: 'Money-back guarantee',
    body: 'If the system does not deliver what we agreed, you get your money back. Simple as that.',
  },
  {
    icon: PilotIcon,
    title: 'Pilot before any retainer',
    body: 'Prove it on real work first. You only commit once you have seen it earn its keep.',
  },
  {
    icon: TeamIcon,
    title: 'Enterprise team, SME pricing',
    body: 'Our talent comes through the Digital Influx Academy pipeline, big-firm capability without big-firm overheads.',
  },
  {
    icon: DeliveryIcon,
    title: 'Delivered in 2–8 weeks',
    body: 'Working software in weeks, not a roadmap that ships next year.',
  },
] as const

/**
 * Section 4 — trust builders.
 * Cards in a left-right-left-right-left zigzag. An SVG connector line
 * draws itself through the card centres as the user scrolls.
 */
export const WhyDreamlabs = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      const container = containerRef.current
      const svg = svgRef.current
      const path = pathRef.current
      if (!container || !svg || !path) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (window.innerWidth < 768) return

      const cRect = container.getBoundingClientRect()

      // Measure centre of each card relative to the container
      const pts = cardRefs.current
        .filter((el): el is HTMLDivElement => el !== null)
        .map(el => {
          const r = el.getBoundingClientRect()
          return {
            x: r.left - cRect.left + r.width / 2,
            y: r.top - cRect.top + r.height / 2,
          }
        })

      if (pts.length < 2) return

      svg.setAttribute('width', String(Math.ceil(cRect.width)))
      svg.setAttribute('height', String(Math.ceil(cRect.height)))

      // Smooth S-curve through each card centre
      const first = pts[0]!
      let d = `M ${first.x.toFixed(1)},${first.y.toFixed(1)}`
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]!
        const b = pts[i]!
        const mid = ((a.y + b.y) / 2).toFixed(1)
        d += ` C ${a.x.toFixed(1)},${mid} ${b.x.toFixed(1)},${mid} ${b.x.toFixed(1)},${b.y.toFixed(1)}`
      }
      path.setAttribute('d', d)

      // Draw the line based on scroll percentage
      const len = path.getTotalLength()
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: true,
        },
      })
    },
    { scope: containerRef },
  )

  return (
    <Section surface="workshop">
      <Reveal>
        <SectionHeading
          eyebrow="Why Dreamlabs"
          title="Built to be the safest decision you make this year"
          surface="light"
        />
      </Reveal>

      <div ref={containerRef} className="relative mt-16">
        {/* SVG connector — desktop only */}
        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-0 hidden md:block"
          aria-hidden
        >
          <path
            ref={pathRef}
            fill="none"
            stroke="#8B32FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Zigzag card layout: left right left right left */}
        <div className="flex flex-col gap-8">
          {USPS.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              ref={el => { cardRefs.current[i] = el }}
              className={`w-full md:w-[46%] ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}
            >
              <Card surface="light">
                <Icon className="h-8 w-8 text-violet-ray" aria-hidden />
                <h3 className="mt-4 font-heading text-lg font-semibold text-navy-deep">{title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-navy-deep/75">{body}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
