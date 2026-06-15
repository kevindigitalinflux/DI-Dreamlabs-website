/**
 * Shared SVG gradients for the atmosphere, rendered once (spec §3). Lo-fi flat
 * cloud look: a deep Rebecca-Purple body gradient with a soft pink rim-light
 * underside (matching the reference sky art); bubbles keep a Violet-Ray glowing
 * core. Brand anchor: Rebecca #64378B, Violet Ray #8B32FF. The pink rim is a
 * deliberate art accent requested for the lo-fi cloud style.
 */
export const AtmosphereDefs = () => (
  <svg aria-hidden width="0" height="0" className="absolute">
    <defs>
      <linearGradient id="atmos-cloud-body" gradientUnits="userSpaceOnUse" x1="0" y1="14" x2="0" y2="126">
        <stop offset="0%" stopColor="#3B2261" />
        <stop offset="55%" stopColor="#5A3088" />
        <stop offset="100%" stopColor="#7E47A4" />
      </linearGradient>
      <linearGradient id="atmos-cloud-rim" gradientUnits="userSpaceOnUse" x1="0" y1="96" x2="0" y2="134">
        <stop offset="0%" stopColor="#CE8EC6" />
        <stop offset="100%" stopColor="#F9BBD4" />
      </linearGradient>
      <radialGradient id="atmos-bubble-fill" cx="38%" cy="34%" r="68%">
        <stop offset="0%" stopColor="#A866FF" />
        <stop offset="45%" stopColor="#8B32FF" />
        <stop offset="100%" stopColor="rgba(139,50,255,0)" />
      </radialGradient>
    </defs>
  </svg>
)
