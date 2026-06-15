import type { LayerConfig } from './atmosphere'
import { CloudShape } from './cloudShapes'

type CloudFieldProps = { layers: LayerConfig[] }

/**
 * Renders the three Rebecca-Purple cloud depth layers (spec §5). Layers start
 * below the fold (translateY 110%) and are raised by the orchestrator. Inner
 * `.atmos-layer-drift` wrapper is reserved for the ambient horizontal drift.
 */
export const CloudField = ({ layers }: CloudFieldProps) => (
  <div className="absolute inset-0">
    {layers.map((layer) => (
      <div
        key={layer.depth}
        className="atmos-layer-scroll atmos-cloud-layer absolute inset-0 will-change-transform"
        data-depth={layer.depth}
        data-travel={layer.travelVh}
        data-opacity={layer.targetOpacity}
        style={{ opacity: 0, filter: `blur(${layer.blurPx}px)` }}
      >
        <div className="atmos-layer-drift absolute inset-0 will-change-transform">
          {layer.placements.map((p, i) => (
            <CloudShape
              key={i}
              variant={p.variant}
              className="absolute h-auto"
              style={{
                left: `${p.x * 100}%`,
                bottom: `${p.bottomVh}vh`,
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
