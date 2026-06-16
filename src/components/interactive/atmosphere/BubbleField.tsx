import type { LayerConfig } from './atmosphere'
import { BubbleShape } from './bubbleShape'

type BubbleFieldProps = { layers: LayerConfig[] }

/**
 * Renders the three Violet-Ray bubble depth layers (spec §5) as a section
 * background, the same way CloudField does for "Sound Familiar?" — placement
 * is a percentage of the section's own height (not viewport vh), so bubbles
 * spread across the full background regardless of how tall the section is.
 */
export const BubbleField = ({ layers }: BubbleFieldProps) => (
  <div className="absolute inset-0">
    {layers.map((layer) => (
      <div
        key={layer.depth}
        className="absolute inset-0"
        style={{ opacity: layer.targetOpacity, filter: layer.blurPx > 0 ? `blur(${layer.blurPx}px)` : undefined }}
      >
        <div className="absolute inset-0">
          {layer.placements.map((p, i) => (
            <BubbleShape
              key={i}
              className="absolute"
              style={{
                left: `${p.x * 100}%`,
                bottom: `${p.bottomVh}%`,
                width: `${p.sizePx}px`,
                height: `${p.sizePx}px`,
                transform: `translateX(-50%) scale(${p.scale})`,
              }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
)
