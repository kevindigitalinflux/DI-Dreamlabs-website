import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { BubblePhysics } from './bubblePhysics'

const COLORS = ['#7C3AED', '#8B5CF6', '#A78BFA', '#6D28D9', '#C4B5FD', '#6366F1']
const COUNT = 42

/**
 * Three.js physics bubble background. Soap-bubble spheres (iridescent,
 * semi-transparent) float upward and scatter away from the cursor.
 * Canvas tracks the window's mousemove so it stays responsive even though
 * the wrapper is pointer-events-none (content sits above it).
 */
export const BubblePitBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const parent = containerRef.current
    const canvas = canvasRef.current
    if (!parent || !canvas) return

    // Renderer — transparent background so the ivory section shows through
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    // Scene + HDR environment for realistic reflections on the bubble surfaces
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment()).texture
    const scene = new THREE.Scene()
    scene.environment = envTexture

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000)
    camera.position.z = 18

    // Soap-bubble material: iridescent thin-film effect built into Three.js r151+
    const geometry = new THREE.SphereGeometry(1, 28, 28)
    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.05,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      transparent: true,
      opacity: 0.72,
      iridescence: 0.95,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [80, 380] as [number, number],
      envMap: envTexture,
      envMapIntensity: 1.6,
    })

    const imesh = new THREE.InstancedMesh(geometry, material, COUNT)
    scene.add(imesh)

    // Soft lavender ambient + a violet point light that rides the cursor ghost
    scene.add(new THREE.AmbientLight('#EDE9FE', 0.9))
    const pointLight = new THREE.PointLight('#A78BFA', 90)
    scene.add(pointLight)

    // Distribute violet palette across instances
    const palette = COLORS.map(c => new THREE.Color(c))
    for (let i = 0; i < COUNT; i++) imesh.setColorAt(i, palette[i % palette.length]!)
    imesh.instanceColor!.needsUpdate = true

    // Physics: negative gravity makes bubbles float upward like real ones
    const physics = new BubblePhysics({
      count: COUNT, minSize: 0.25, maxSize: 0.8,
      gravity: -0.04,
      friction: 0.992,
      wallBounce: 0.25,
      maxVelocity: 0.06,
      followCursor: true,
      maxX: 5, maxY: 5, maxZ: 1.5,
    })

    // Project cursor into the 3D world so bubbles scatter away from it
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const intersection = new THREE.Vector3()
    const pointer = new THREE.Vector2()

    const onPointer = (e: MouseEvent | TouchEvent) => {
      let x: number, y: number
      if ('touches' in e) {
        const t = e.touches[0]
        if (!t) return
        x = t.clientX; y = t.clientY
      } else {
        x = e.clientX; y = e.clientY
      }
      const rect = canvas.getBoundingClientRect()
      pointer.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1)
      raycaster.setFromCamera(pointer, camera)
      raycaster.ray.intersectPlane(plane, intersection)
      physics.cursorPos.copy(intersection)
    }
    window.addEventListener('mousemove', onPointer)
    window.addEventListener('touchmove', onPointer, { passive: true })

    // Keep world bounds in sync with the section's actual pixel dimensions
    const resize = () => {
      const w = parent.offsetWidth, h = parent.offsetHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      const wH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
      physics.config.maxX = (wH * camera.aspect) / 2
      physics.config.maxY = wH / 2
    }
    const ro = new ResizeObserver(resize)
    ro.observe(parent)
    resize()

    // Render loop — sphere 0 is the invisible cursor ghost, never drawn
    const clock = new THREE.Clock()
    const dummy = new THREE.Object3D()
    let rafId: number
    const tick = () => {
      physics.update(Math.min(clock.getDelta(), 0.1))
      for (let i = 0; i < COUNT; i++) {
        dummy.position.fromArray(physics.positionData, i * 3)
        dummy.scale.setScalar(i === 0 ? 0 : physics.sizeData[i]!)
        dummy.updateMatrix()
        imesh.setMatrixAt(i, dummy.matrix)
        if (i === 0) pointLight.position.copy(dummy.position)
      }
      imesh.instanceMatrix.needsUpdate = true
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onPointer)
      window.removeEventListener('touchmove', onPointer)
      ro.disconnect()
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      pmrem.dispose()
      envTexture.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="block h-full w-full outline-none" />
    </div>
  )
}
