import * as THREE from 'three'

export interface BubblePhysicsConfig {
  count: number
  minSize: number
  maxSize: number
  /** Negative value = upward float (real bubble behaviour). */
  gravity: number
  friction: number
  wallBounce: number
  maxVelocity: number
  followCursor: boolean
  maxX: number
  maxY: number
  maxZ: number
}

/**
 * Seeded physics simulation for floating soap bubbles.
 * Pre-allocates all work vectors to avoid per-frame GC pressure.
 */
export class BubblePhysics {
  config: BubblePhysicsConfig
  readonly positionData: Float32Array
  readonly velocityData: Float32Array
  readonly sizeData: Float32Array
  cursorPos = new THREE.Vector3()

  private readonly _p = new THREE.Vector3()
  private readonly _v = new THREE.Vector3()
  private readonly _o = new THREE.Vector3()
  private readonly _d = new THREE.Vector3()

  constructor(config: BubblePhysicsConfig) {
    this.config = config
    const n = config.count
    this.positionData = new Float32Array(3 * n)
    this.velocityData = new Float32Array(3 * n)
    this.sizeData = new Float32Array(n)
    this.spawn()
  }

  private spawn() {
    const { count, minSize, maxSize, maxX, maxY, maxZ } = this.config
    for (let i = 0; i < count; i++) {
      const b = 3 * i
      this.positionData[b]     = THREE.MathUtils.randFloatSpread(2 * maxX)
      this.positionData[b + 1] = THREE.MathUtils.randFloatSpread(2 * maxY)
      this.positionData[b + 2] = THREE.MathUtils.randFloatSpread(2 * maxZ)
      this.velocityData[b + 1] = THREE.MathUtils.randFloat(0.005, 0.02)
      this.sizeData[i]         = THREE.MathUtils.randFloat(minSize, maxSize)
    }
  }

  update(dt: number) {
    const { count, gravity, friction, wallBounce, maxVelocity, followCursor, maxX, maxY, maxZ } = this.config
    const start = followCursor ? 1 : 0

    if (followCursor) {
      this._p.fromArray(this.positionData, 0).lerp(this.cursorPos, 0.1).toArray(this.positionData, 0)
      this.velocityData[0] = this.velocityData[1] = this.velocityData[2] = 0
    }

    for (let i = start; i < count; i++) {
      const b = 3 * i
      this._p.fromArray(this.positionData, b)
      this._v.fromArray(this.velocityData, b)
      // sizeData is fully initialised in spawn() so index i is always defined
      const r = this.sizeData[i]!

      this._v.y -= dt * gravity * r
      this._v.multiplyScalar(friction).clampLength(0, maxVelocity)
      this._p.add(this._v)

      // Sphere-sphere separation
      for (let j = i + 1; j < count; j++) {
        const ob = 3 * j
        this._o.fromArray(this.positionData, ob)
        this._d.copy(this._o).sub(this._p)
        const dist = this._d.length()
        const sumR = r + this.sizeData[j]!
        if (dist > 0 && dist < sumR) {
          const push = (sumR - dist) * 0.5
          this._d.normalize().multiplyScalar(push)
          this._p.sub(this._d)
          this._o.add(this._d)
          this._o.toArray(this.positionData, ob)
        }
      }

      // Cursor-follower repulsion (sphere 0 is the invisible cursor ghost)
      if (followCursor) {
        this._o.fromArray(this.positionData, 0)
        this._d.copy(this._o).sub(this._p)
        const d = this._d.length()
        const sumR = r + this.sizeData[0]!
        if (d > 0 && d < sumR) {
          this._d.normalize().multiplyScalar((sumR - d) * 0.3)
          this._p.sub(this._d)
          this._v.sub(this._d)
        }
      }

      // All six walls — works for any gravity sign
      if (this._p.x - r < -maxX) { this._p.x = -maxX + r; this._v.x =  Math.abs(this._v.x) * wallBounce }
      if (this._p.x + r >  maxX) { this._p.x =  maxX - r; this._v.x = -Math.abs(this._v.x) * wallBounce }
      if (this._p.y - r < -maxY) { this._p.y = -maxY + r; this._v.y =  Math.abs(this._v.y) * wallBounce }
      if (this._p.y + r >  maxY) { this._p.y =  maxY - r; this._v.y = -Math.abs(this._v.y) * wallBounce }
      if (this._p.z - r < -maxZ) { this._p.z = -maxZ + r; this._v.z =  Math.abs(this._v.z) * wallBounce }
      if (this._p.z + r >  maxZ) { this._p.z =  maxZ - r; this._v.z = -Math.abs(this._v.z) * wallBounce }

      this._p.toArray(this.positionData, b)
      this._v.toArray(this.velocityData, b)
    }
  }
}
