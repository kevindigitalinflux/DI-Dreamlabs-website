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

/** Builds a smooth S-curve SVG path through the given points. */
function buildPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  const first = pts[0]!
  let d = `M ${first.x.toFixed(1)},${first.y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!
    const b = pts[i]!
    const midY = ((a.y + b.y) / 2).toFixed(1)
    d += ` C ${a.x.toFixed(1)},${midY} ${b.x.toFixed(1)},${midY} ${b.x.toFixed(1)},${b.y.toFixed(1)}`
  }
  return d
}

/**
 * Section 4 — trust builders.
 * Five USP cards in a left-right-left-right-left zigzag, connected by
 * an SVG journey line (#8B32FF) that draws itself as the user scrolls.
 */
export const WhyDreamlabs = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const dotRefs = useRef<(SVGCircleElement | null)[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      const container = containerRef.current
      const svg = svgRef.current
      const path = pathRef.current
      if (!container || !svg || !path) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      // Journey line only makes visual sense on wider screens
      if (window.innerWidth < 768) return

      const cRect = container.getBoundingClientRect()

      // Measure the centre of each card relative to the container
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

      path.setAttribute('d', buildPath(pts))

      // Position dots at each card centre
      pts.forEach((pt, i) => {
        const dot = dotRefs.current[i]
        if (dot) {
          dot.setAttribute('cx', pt.x.toFixed(1))
          dot.setAttribute('cy', pt.y.toFixed(1))
        }
      })

      const length = path.getTotalLength()
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      const dots = dotRefs.current.filter((d): d is SVGCircleElement => d !== null)
      gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          // Short journey: animation completes within ~350px of scroll
          start: 'top 70%',
          end: '+=350',
          scrub: 1.2,
        },
      })

      tl.to(path, { strokeDashoffset: 0, ease: 'none', duration: 5 })

      // Each dot pops in as the line reaches it
      pts.forEach((_, i) => {
        const dot = dotRefs.current[i]
        if (!dot) return
        const progress = i / (pts.length - 1)
        tl.to(dot, { scale: 1, ease: 'back.out(2)', duration: 0.3 }, progress * 5)
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
        {/* Journey line — desktop only, hidden on mobile */}
        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-0 hidden md:block"
          aria-hidden
        >
          <path
            ref={pathRef}
            fill="none"
            stroke="#8B32FF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {USPS.map((_, i) => (
            <circle
              key={i}
              ref={el => { dotRefs.current[i] = el }}
              r="5"
              fill="#8B32FF"
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Zigzag card layout — left right left right left */}
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
