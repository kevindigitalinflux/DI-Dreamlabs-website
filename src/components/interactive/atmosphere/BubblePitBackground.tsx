import { useRef, useEffect } from 'react'
import { spawnBubbles, updateBubbles } from './bubblePhysics'
import type { Bubble } from './bubblePhysics'

const COUNT = 35
const MIN_R = 18
const MAX_R = 56

/**
 * Draws one bubble matching the atmos-bubble-fill SVG gradient exactly.
 * Gradient origin matches cx="38%" cy="34%" r="68%" (objectBoundingBox).
 * Highlight matches SVG circle cx="37" cy="34" r="8" in 0-100 space / r=48.
 */
const drawBubble = (ctx: CanvasRenderingContext2D, b: Bubble) => {
  const { x, y, r } = b
  const gx = x - r * 0.24
  const gy = y - r * 0.32
  const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, r * 1.36)
  grad.addColorStop(0, '#A866FF')
  grad.addColorStop(0.45, '#8B32FF')
  grad.addColorStop(1, 'rgba(139,50,255,0)')
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x - r * 0.27, y - r * 0.33, r * 0.17, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(244,244,248,0.5)'
  ctx.fill()
}

/**
 * 2D canvas bubble field: lo-fi gradient bubbles matching the SVG atmos-bubble-fill style,
 * drifting organically in all directions with cursor repulsion.
 */
export const BubblePitBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const parent = containerRef.current
    const canvas = canvasRef.current
    if (!parent || !canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let bubbles: Bubble[] = []
    let cursorX: number | null = null
    let cursorY: number | null = null
    let rafId = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      w = parent.offsetWidth
      h = parent.offsetHeight
      // canvas.width assignment resets ctx state; scale immediately after
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      if (bubbles.length === 0) bubbles = spawnBubbles(COUNT, w, h, MIN_R, MAX_R)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      cursorX = e.clientX - rect.left
      cursorY = e.clientY - rect.top
    }
    const onMouseLeave = () => {
      cursorX = null
      cursorY = null
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      updateBubbles(bubbles, w, h, cursorX, cursorY)
      for (const b of bubbles) drawBubble(ctx, b)
      rafId = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    resize()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
