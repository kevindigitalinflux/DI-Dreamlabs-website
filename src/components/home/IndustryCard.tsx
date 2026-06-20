import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

export type IconFn = (props: { className?: string; 'aria-hidden'?: boolean }) => JSX.Element
export type IndustryEntry = { icon: IconFn; name: string; image: string; bottleneck: string }

const springConfig = { damping: 30, stiffness: 100, mass: 2 } as const

/**
 * Physics-based 3D tilt card (TiltedCard pattern). Mouse position drives rotateX/rotateY
 * via separate input MotionValues so the spring physics fire correctly. Scroll parallax
 * and scroll rotateX are applied by the parent .parallax-card wrapper (GSAP) — the two
 * effects compound through the DOM hierarchy without conflicting.
 */
export const IndustryCard = ({ icon: Icon, name, image, bottleneck }: IndustryEntry) => {
  const figRef = useRef<HTMLElement>(null)

  // Separate input values → spring outputs so spring physics run correctly
  const rotXInput = useMotionValue(0)
  const rotYInput = useMotionValue(0)
  const scaleInput = useMotionValue(1)
  const rotX = useSpring(rotXInput, springConfig)
  const rotY = useSpring(rotYInput, springConfig)
  const cardScale = useSpring(scaleInput, springConfig)

  // Tooltip position + fade
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const tooltipOpacity = useSpring(0, { damping: 20, stiffness: 300 })

  const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
    if (!figRef.current) return
    const rect = figRef.current.getBoundingClientRect()
    const ox = e.clientX - rect.left - rect.width / 2
    const oy = e.clientY - rect.top - rect.height / 2
    rotXInput.set((oy / (rect.height / 2)) * -10)
    rotYInput.set((ox / (rect.width / 2)) * 10)
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const handleEnter = () => { scaleInput.set(1.04); tooltipOpacity.set(1) }
  const handleLeave = () => {
    tooltipOpacity.set(0)
    scaleInput.set(1)
    rotXInput.set(0)
    rotYInput.set(0)
  }

  return (
    <figure
      ref={figRef}
      className="group relative h-full [perspective:800px]"
      onMouseMove={handleMouse}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <motion.div
        className="h-full overflow-hidden rounded-card border border-offwhite/10 transition-[border-color,box-shadow] duration-300 group-hover:border-violet-ray/50 group-hover:shadow-glow-violet"
        style={{ rotateX: rotX, rotateY: rotY, scale: cardScale }}
      >
        <Link
          to={`/tools/bottleneck-check?industry=${encodeURIComponent(name.toLowerCase())}`}
          className="flex h-full flex-col"
        >
          <div className="relative h-40 shrink-0 overflow-hidden">
            <img
              src={image}
              alt={`${name} industry`}
              loading="lazy"
              width={800}
              height={600}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-navy-deep/90 via-navy-deep/60 to-violet-ray/50 mix-blend-multiply" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent" />
            <span className="absolute bottom-3 left-4 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-ray/90 text-offwhite">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-heading text-lg font-semibold text-offwhite">{name}</span>
            </span>
          </div>
          <div className="flex-1 bg-offwhite/5 p-5">
            <p className="font-body text-sm leading-relaxed text-offwhite/75">{bottleneck}</p>
          </div>
        </Link>
      </motion.div>

      {/* Cursor-following tooltip — desktop only, hidden on mobile */}
      <motion.figcaption
        className="pointer-events-none absolute left-0 top-0 z-10 hidden whitespace-nowrap rounded bg-navy-deep/90 px-2.5 py-1 font-body text-xs font-medium text-offwhite border border-violet-ray/30 shadow-lg backdrop-blur-sm sm:block"
        style={{ x: mouseX, y: mouseY, opacity: tooltipOpacity }}
      >
        {name}
      </motion.figcaption>
    </figure>
  )
}
