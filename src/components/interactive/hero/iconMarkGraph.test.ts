import { describe, expect, it } from 'vitest'
import { ICON_MARK_EDGES, ICON_MARK_NODES, SPARK_NODE_INDEX } from './iconMarkGraph'

describe('iconMarkGraph', () => {
  it('has at least 60 nodes for a recognisable constellation', () => {
    expect(ICON_MARK_NODES.length).toBeGreaterThanOrEqual(60)
  })

  it('keeps every node within normalised 0–1 space', () => {
    for (const node of ICON_MARK_NODES) {
      expect(node.x).toBeGreaterThanOrEqual(0)
      expect(node.x).toBeLessThanOrEqual(1)
      expect(node.y).toBeGreaterThanOrEqual(0)
      expect(node.y).toBeLessThanOrEqual(1)
    }
  })

  it('only references valid node indices in edges', () => {
    for (const [a, b] of ICON_MARK_EDGES) {
      expect(a).toBeGreaterThanOrEqual(0)
      expect(a).toBeLessThan(ICON_MARK_NODES.length)
      expect(b).toBeGreaterThanOrEqual(0)
      expect(b).toBeLessThan(ICON_MARK_NODES.length)
    }
  })

  it('places the spark node inside the flask bulb region', () => {
    const spark = ICON_MARK_NODES[SPARK_NODE_INDEX]
    expect(spark).toBeDefined()
    expect(spark!.x).toBeGreaterThan(0.3)
    expect(spark!.x).toBeLessThan(0.65)
    expect(spark!.y).toBeGreaterThan(0.6)
    expect(spark!.y).toBeLessThan(0.9)
  })
})
