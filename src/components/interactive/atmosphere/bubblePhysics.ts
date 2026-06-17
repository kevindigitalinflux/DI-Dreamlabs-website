/** 2D bubble for canvas rendering. All units in CSS pixels. */
export interface Bubble {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  /** Current wander heading in radians — drifts each frame for organic movement. */
  angle: number
}

/**
 * Spawns bubbles at random positions across the canvas with random headings
 * pointing in all directions so they immediately drift outward, not upward.
 */
export const spawnBubbles = (
  count: number,
  width: number,
  height: number,
  minR: number,
  maxR: number,
): Bubble[] =>
  Array.from({ length: count }, () => {
    const r = minR + Math.random() * (maxR - minR)
    const angle = Math.random() * Math.PI * 2
    const speed = 0.3 + Math.random() * 0.5
    return {
      x: r + Math.random() * (width - 2 * r),
      y: r + Math.random() * (height - 2 * r),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r,
      angle,
    }
  })

/**
 * Advances the simulation one frame. Mutates bubbles in place.
 * Bubbles wander in all directions with gradual heading drift, bounce off walls,
 * separate from each other, and scatter away from the cursor.
 */
export const updateBubbles = (
  bubbles: Bubble[],
  width: number,
  height: number,
  cursorX: number | null,
  cursorY: number | null,
): void => {
  const FRICTION = 0.982
  const WALL_BOUNCE = 0.35
  const CURSOR_RADIUS = 130
  const CURSOR_STRENGTH = 2.5
  const WANDER = 0.04
  const MAX_SPEED = 1.2

  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i]!

    // Gradually rotate heading each frame → organic curved paths in all directions
    b.angle += (Math.random() - 0.5) * 0.12
    b.vx += Math.cos(b.angle) * WANDER
    b.vy += Math.sin(b.angle) * WANDER

    // Cursor repulsion
    if (cursorX !== null && cursorY !== null) {
      const dx = b.x - cursorX
      const dy = b.y - cursorY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < CURSOR_RADIUS && dist > 0.1) {
        const force = ((CURSOR_RADIUS - dist) / CURSOR_RADIUS) * CURSOR_STRENGTH
        b.vx += (dx / dist) * force
        b.vy += (dy / dist) * force
      }
    }

    b.vx *= FRICTION
    b.vy *= FRICTION

    const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy)
    if (speed > MAX_SPEED) {
      b.vx = (b.vx / speed) * MAX_SPEED
      b.vy = (b.vy / speed) * MAX_SPEED
    }

    b.x += b.vx
    b.y += b.vy

    // Bubble–bubble separation (O(n²) fine for n=35)
    for (let j = i + 1; j < bubbles.length; j++) {
      const o = bubbles[j]!
      const dx = o.x - b.x
      const dy = o.y - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      const minDist = b.r + o.r
      if (dist > 0 && dist < minDist) {
        const overlap = (minDist - dist) * 0.25
        const nx = dx / dist
        const ny = dy / dist
        b.x -= nx * overlap
        b.y -= ny * overlap
        o.x += nx * overlap
        o.y += ny * overlap
      }
    }

    // Wall bounce — all four edges
    if (b.x - b.r < 0)     { b.x = b.r;          b.vx =  Math.abs(b.vx) * WALL_BOUNCE }
    if (b.x + b.r > width)  { b.x = width - b.r;  b.vx = -Math.abs(b.vx) * WALL_BOUNCE }
    if (b.y - b.r < 0)     { b.y = b.r;          b.vy =  Math.abs(b.vy) * WALL_BOUNCE }
    if (b.y + b.r > height) { b.y = height - b.r; b.vy = -Math.abs(b.vy) * WALL_BOUNCE }
  }
}
