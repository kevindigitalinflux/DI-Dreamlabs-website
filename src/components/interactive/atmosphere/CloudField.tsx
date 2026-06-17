import type { LayerConfig } from './atmosphere'
import { CloudShape } from './cloudShapes'

type CloudFieldProps = { layers: LayerConfig[] }

/**
 * Renders the three Rebecca-Purple cloud depth layers as a section background
 * (spec §5). Clouds are distributed across the section height (back highest,
 * front lowest/densest) and are visible at rest — they are the permanent
 * "Sound Familiar?" background. The `.atmos-layer-scroll` wrapper is available
 * for internal parallax and `.atmos-layer-drift` for the ambient drift.
 */
export const CloudField = ({ layers }: CloudFieldProps) => (
  <div className="absolute inset-0">
    {layers.map((layer) => (
      <div
        key={layer.depth}
        className="atmos-layer-scroll atmos-cloud-layer absolute inset-0"
        data-depth={layer.depth}
        data-travel={layer.travelVh}
        data-opacity={layer.targetOpacity}
        style={{ opacity: layer.targetOpacity, filter: layer.blurPx > 0 ? `blur(${layer.blurPx}px)` : undefined }}
      >
        <div className="atmos-layer-drift absolute inset-0 will-change-transform">
          {layer.placements.map((p, i) => (
            <CloudShape
              key={i}
              variant={p.variant}
              className="absolute h-auto"
              style={{
                left: `${p.x * 100}%`,
                bottom: `${p.bottomVh}%`,
                width: `${p.sizePx}px`,
                transform: `translateX(-50%) scale(${p.scale})`,
              }}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
)
