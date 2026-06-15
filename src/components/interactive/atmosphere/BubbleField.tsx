import type { LayerConfig } from './atmosphere'
import { BubbleShape } from './bubbleShape'

type BubbleFieldProps = { layers: LayerConfig[] }

/**
 * Renders the three Violet-Ray bubble depth layers (spec §5). Bubbles start
 * below the fold, small and transparent; the orchestrator raises + scales +
 * fades them in. Inner `.atmos-layer-drift` wrapper carries the ambient bob.
 */
export const BubbleField = ({ layers }: BubbleFieldProps) => (
  <div className="absolute inset-0">
    {layers.map((layer) => (
      <div
        key={layer.depth}
        className="atmos-layer-scroll atmos-bubble-layer absolute inset-0 will-change-transform"
        data-depth={layer.depth}
        data-travel={layer.travelVh}
        data-opacity={layer.targetOpacity}
        style={{ opacity: 0, filter: `blur(${layer.blurPx}px)` }}
      >
        <div className="atmos-layer-drift absolute inset-0 will-change-transform">
          {layer.placements.map((p, i) => (
            <BubbleShape
              key={i}
              className="absolute"
              style={{
                left: `${p.x * 100}%`,
                bottom: `${p.bottomVh}vh`,
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
