import { useEffect, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { createParticleEngine } from './particleEngine'

const HUES: Record<string, string> = {
  white: '#F4F4F8',
  violet: '#A866FF', // Violet Ray lifted slightly for luminosity on navy
  cyan: '#00DFDF',
}

type HeroCanvasProps = {
  /** Mutable scroll progress (0–1) written by the ScrollTrigger. */
  progressRef: MutableRefObject<number>
}

/**
 * Canvas layer of the Dream Assembly: bubbles, connecting threads, and the
 * magenta activation spark, all driven by scroll progress (Brief §6.3).
 * Mounted client-side only, after first paint.
 */
export const HeroCanvas = ({ progressRef }: HeroCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.innerWidth < 768
    const count = isMobile ? 30 : 80
    let engine = createParticleEngine({
      count,
      seed: 7,
      aspect: window.innerWidth / window.innerHeight,
    })

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      engine = createParticleEngine({
        count,
        seed: 7,
        aspect: canvas.clientWidth / Math.max(canvas.clientHeight, 1),
      })
    }
    resize()
    window.addEventListener('resize', resize)

    let raf = 0
    let lastProgress = -1
    const draw = () => {
      raf = requestAnimationFrame(draw)
      const progress = progressRef.current
      if (Math.abs(progress - lastProgress) < 0.0005) return
      lastProgress = progress

      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)
      const frame = engine.sampleFrame(progress)

      // Threads first (beneath particles) — fine cyan line-work.
      ctx.lineWidth = (isMobile ? 1.4 : 1) * dpr
      for (const t of frame.threads) {
        if (t.opacity <= 0.01) continue
        ctx.strokeStyle = `rgba(0, 223, 223, ${0.55 * t.opacity})`
        ctx.beginPath()
        ctx.moveTo(t.x1 * width, t.y1 * height)
        ctx.lineTo(t.x2 * width, t.y2 * height)
        ctx.stroke()
      }

      // Particles — soft glow on a subset only (perf guardrail).
      frame.particles.forEach((p, i) => {
        if (p.opacity <= 0.01) return
        const glow = i % 4 === 0
        ctx.shadowBlur = glow ? 12 * dpr : 0
        ctx.shadowColor = HUES[p.hue] ?? HUES.white!
        ctx.fillStyle = HUES[p.hue] ?? HUES.white!
        ctx.globalAlpha = p.opacity
        ctx.beginPath()
        ctx.arc(p.x * width, p.y * height, (p.size / 2) * dpr, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      // Activation spark — the single Magenta Bloom moment.
      if (frame.sparkOpacity > 0.01) {
        const sx = frame.spark.x * width
        const sy = frame.spark.y * height
        const radius = 26 * dpr * frame.sparkOpacity
        const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius)
        gradient.addColorStop(0, `rgba(240, 56, 107, ${frame.sparkOpacity})`)
        gradient.addColorStop(1, 'rgba(240, 56, 107, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(sx, sy, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [progressRef])

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
}
