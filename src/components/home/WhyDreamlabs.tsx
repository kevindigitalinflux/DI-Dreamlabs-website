import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
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
    image: '/images/why/own-everything.png',
    imageAlt: 'Everything we build belongs to you',
  },
  {
    icon: GuaranteeIcon,
    title: 'Money-back guarantee',
    body: 'If we do not deliver what we agree, you always get your money back. It\'s as simple as that.',
    image: '/images/why/money-back.png',
    imageAlt: 'Money-back guarantee',
  },
  {
    icon: PilotIcon,
    title: 'Pilot before any retainer',
    body: 'Prove it on real work first. You only commit once you have seen it earn its keep.',
    image: '/images/why/pilot.png',
    imageAlt: 'Pilot project before committing',
  },
  {
    icon: TeamIcon,
    title: 'Enterprise team, SME pricing',
    body: 'Big-firm capability without big-firm overheads, via the Digital Influx Academy pipeline.',
    image: '/images/why/sme-pricing.png',
    imageAlt: 'Enterprise team at SME pricing',
  },
  {
    icon: DeliveryIcon,
    title: 'Delivered in 2–8 weeks',
    body: 'Working software in weeks, not a roadmap that ships next year.',
    image: '/images/why/delivered.png',
    imageAlt: 'Ready software delivered fast',
  },
]

/** Individual trust-signal card with duotone image treatment (matches Industries). */
const WhyCard = ({ icon: Icon, title, body, image, imageAlt, className }: WhyCardData & { className?: string }) => (
  <article className={`group flex flex-shrink-0 flex-col overflow-hidden rounded-card border border-offwhite/10 bg-navy-deep transition-all duration-300 hover:border-violet-ray/50 hover:shadow-glow-violet ${className ?? 'w-[calc(100vw-3rem)] sm:w-80'}`}>
    <div className="relative h-56 overflow-hidden">
      <img
        src={image}
        alt={imageAlt}
        loading="lazy"
        width={640}
        height={480}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-navy-deep/90 via-navy-deep/60 to-violet-ray/50 mix-blend-multiply" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent" />
    </div>
    <div className="flex flex-1 flex-col p-6">
      <Icon className="h-8 w-8 text-violet-ray" aria-hidden />
      <h3 className="mt-4 font-heading text-lg font-semibold text-offwhite">{title}</h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-offwhite/70">{body}</p>
    </div>
  </article>
)

/** Hand-drawn SVG underline that draws itself when scrolled into view. */
const DrawnUnderline = () => (
  <motion.svg
    className="pointer-events-none absolute -bottom-2 left-0 h-[10px] w-full overflow-visible"
    viewBox="0 0 300 10"
    preserveAspectRatio="none"
    aria-hidden
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, margin: '-60px' }}
  >
    <motion.path
      d="M 2,7 C 40,2 80,9 130,5 C 180,1 230,8 298,6"
      stroke="#F0386B"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
    />
  </motion.svg>
)

// Carousel constants — matches Industries carousel speed
const CARD_W = 280
const CARD_GAP = 16
const CARD_STRIDE = CARD_W + CARD_GAP
const AUTO_SPEED = 0.9
const SNAP_PAUSE = 900
const EASE = 0.09

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

/** Auto-scrolling swipe carousel for Why Dreamlabs cards — mobile only. */
const WhyCarousel = () => {
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

  const cards = [...USPS, ...USPS, ...USPS]
  const setWidth = CARD_STRIDE * USPS.length

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
      if (!isDragging && !isSnapping) { s.target += AUTO_SPEED; s.current += AUTO_SPEED }
      s.current = lerp(s.current, s.target, EASE)
      if (s.current >= setWidth * 1.5) { s.current -= setWidth; s.target -= setWidth; dragRef.current.startScroll -= setWidth }
      if (s.current < setWidth * 0.5) { s.current += setWidth; s.target += setWidth; dragRef.current.startScroll += setWidth }
      const padLeft = (container.offsetWidth - CARD_W) / 2
      track.style.transform = `translateX(${padLeft - s.current}px)`
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
    const t = e.touches[0]; const d = dragRef.current
    d.isDown = true; d.startX = t.clientX; d.startY = t.clientY
    d.startScroll = scrollRef.current.current; d.intentDetermined = false; d.isHorizontal = false
    velRef.current = { v: 0, lastX: t.clientX, lastTime: performance.now() }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    const d = dragRef.current; if (!d.isDown) return
    const t = e.touches[0]
    if (!d.intentDetermined) {
      const dx = Math.abs(t.clientX - d.startX); const dy = Math.abs(t.clientY - d.startY)
      if (dx < 6 && dy < 6) return
      d.intentDetermined = true; d.isHorizontal = dx > dy * 0.9
    }
    if (!d.isHorizontal) return
    const now = performance.now(); const dt = now - velRef.current.lastTime
    if (dt > 8 && dt < 100) { const rawV = (velRef.current.lastX - t.clientX) / dt; velRef.current.v = Math.max(-4, Math.min(4, rawV)) }
    velRef.current.lastX = t.clientX; velRef.current.lastTime = now
    scrollRef.current.target = d.startScroll + (d.startX - t.clientX) * 1.1
  }
  const onTouchEnd = () => {
    const d = dragRef.current; if (!d.isDown) return
    d.isDown = false; if (!d.isHorizontal) return
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
      className="mt-8 overflow-hidden py-4"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div ref={trackRef} className="flex" style={{ willChange: 'transform' }}>
        {cards.map((usp, i) => (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el }}
            aria-hidden={i < USPS.length || i >= USPS.length * 2}
            className="shrink-0"
            style={{ width: `${CARD_W}px`, marginRight: `${CARD_GAP}px`, willChange: 'transform, opacity' }}
          >
            <WhyCard {...usp} className="!w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

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
    <section ref={containerRef} className="relative overflow-hidden bg-offwhite" aria-label="Why Dreamlabs">

      {/* ── Desktop: pinned two-panel layout ── */}
      <div className="hidden h-screen flex-col md:flex">

        {/* Top centre eyebrow — matches original SectionHeading position */}
        <div className="flex-shrink-0 pt-14 text-center">
          <Reveal>
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-violet-ray">
              Why Dreamlabs
            </span>
          </Reveal>
        </div>

        {/* Two-panel row fills remaining height */}
        <div className="flex flex-1 items-stretch">

          {/* Left panel — heading + underlined copy + arrow */}
          <div className="flex w-[38%] flex-shrink-0 flex-col justify-center px-12 lg:px-16 xl:px-20">
            <Reveal>
              <h2 className="font-heading text-3xl font-bold leading-tight text-navy-deep lg:text-4xl">
                Built to be the safest decision you make this year
              </h2>

              {/* Body copy with hand-drawn underline on the key phrase */}
              <p className="mt-4 font-body text-base leading-relaxed text-navy-deep/60">
                At Dreamlabs —
              </p>
              <div className="relative mt-1 inline-block">
                <p className="whitespace-nowrap font-body text-base font-bold leading-relaxed text-navy-deep/60">
                  we give real value before you commit
                </p>
                <DrawnUnderline />
              </div>
              <p className="mt-1 font-body text-base leading-relaxed text-navy-deep/60">
                We understand that sometimes business owners can be hesitant, which is why we do this
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
      </div>

      {/* ── Mobile: stacked + horizontal snap scroll ── */}
      <div className="px-6 py-20 md:hidden">
        <span className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-violet-ray">
          Why Dreamlabs
        </span>
        <h2 className="mt-3 font-heading text-3xl font-bold leading-tight text-navy-deep">
          Built to be the safest decision you make this year
        </h2>
        <p className="mt-4 font-body text-base leading-relaxed text-navy-deep/60">
          At Dreamlabs we are all about giving our clients as much value upfront. We understand
          that sometimes business owners can be hesitant, which is why we do this
        </p>
        {/* Break out of px-6 section padding for full-width carousel track */}
        <div className="-mx-6">
          <WhyCarousel />
        </div>
      </div>

    </section>
  )
}
