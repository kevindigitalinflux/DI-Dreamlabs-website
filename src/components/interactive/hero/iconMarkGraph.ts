/**
 * The Dreamlabs icon mark (the "a" flask with rising bubble trail) expressed
 * as a node graph in normalised 0–1 coordinates, traced from
 * assets/brand/logo/icon-navy-bg.png. This is the constellation "end state"
 * the hero's particles assemble into (Brief §6.3) — the particles' target
 * positions ARE the icon mark.
 *
 * Generated parametrically (circles + paths) so density stays consistent and
 * the silhouette is easy to tune.
 */

export type GraphNode = { x: number; y: number }
export type GraphEdge = [number, number]

/** Points around a circle, starting at angle `startDeg`, clockwise. */
const circle = (cx: number, cy: number, r: number, count: number, startDeg = -90): GraphNode[] =>
  Array.from({ length: count }, (_, i) => {
    const a = ((startDeg + (360 / count) * i) * Math.PI) / 180
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  })

/** Evenly-spaced points along a polyline defined by waypoints. */
const path = (waypoints: ReadonlyArray<GraphNode>): GraphNode[] => [...waypoints]

const nodes: GraphNode[] = []
const edges: GraphEdge[] = []

/** Adds a sub-shape, wiring consecutive nodes; closes the loop if `closed`. */
const addShape = (pts: GraphNode[], closed: boolean): number => {
  const startIndex = nodes.length
  nodes.push(...pts)
  for (let i = 0; i < pts.length - 1; i++) edges.push([startIndex + i, startIndex + i + 1])
  if (closed && pts.length > 2) edges.push([startIndex + pts.length - 1, startIndex])
  return startIndex
}

/* — Bubble trail (three rising bubbles, top-left to mid-right) — */
addShape(circle(0.41, 0.17, 0.095, 10), true)
addShape(circle(0.625, 0.31, 0.045, 7), true)
addShape(circle(0.515, 0.39, 0.038, 6), true)

/* — The "a" bowl: outer ring of the letterform's round body — */
addShape(circle(0.47, 0.715, 0.165, 18), true)

/* — The "a" stem: right-hand vertical bar, top serif edge to base — */
addShape(
  path([
    { x: 0.635, y: 0.525 },
    { x: 0.725, y: 0.525 },
    { x: 0.725, y: 0.65 },
    { x: 0.725, y: 0.78 },
    { x: 0.725, y: 0.915 },
    { x: 0.635, y: 0.915 },
    { x: 0.635, y: 0.84 },
  ]),
  false,
)

/* — Flask neck: channel from the bowl's top down into the bulb — */
addShape(
  path([
    { x: 0.45, y: 0.55 },
    { x: 0.45, y: 0.63 },
    { x: 0.49, y: 0.63 },
    { x: 0.49, y: 0.55 },
  ]),
  false,
)

/* — Flask bulb: round-bottom vessel inside the bowl — */
const bulbStart = addShape(circle(0.47, 0.745, 0.085, 10), true)

/* — Liquid line: the wave across the bulb — */
addShape(
  path([
    { x: 0.395, y: 0.73 },
    { x: 0.44, y: 0.745 },
    { x: 0.5, y: 0.72 },
    { x: 0.545, y: 0.735 },
  ]),
  false,
)

/** Node index used for the Magenta Bloom activation spark (flask core). */
export const SPARK_NODE_INDEX = bulbStart + 5 // bottom of the bulb circle

export const ICON_MARK_NODES: ReadonlyArray<GraphNode> = nodes
export const ICON_MARK_EDGES: ReadonlyArray<GraphEdge> = edges
