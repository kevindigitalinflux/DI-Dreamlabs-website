/**
 * Shared SVG filters + gradients for the atmosphere, rendered once. The "goo"
 * filter merges overlapping ellipses into one soft puffy blob (spec §3.1);
 * gradients give clouds inner depth and bubbles a glowing core (spec §3.2).
 * Exact brand hex: Rebecca #64378B, Violet Ray #8B32FF.
 */
export const AtmosphereDefs = () => (
  <svg aria-hidden width="0" height="0" className="absolute">
    <defs>
      <filter id="atmos-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
          result="goo"
        />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
      <linearGradient id="atmos-cloud-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7A45A8" />
        <stop offset="60%" stopColor="#64378B" />
        <stop offset="100%" stopColor="#4F2B70" />
      </linearGradient>
      <radialGradient id="atmos-bubble-fill" cx="38%" cy="34%" r="68%">
        <stop offset="0%" stopColor="#A866FF" />
        <stop offset="45%" stopColor="#8B32FF" />
        <stop offset="100%" stopColor="rgba(139,50,255,0)" />
      </radialGradient>
    </defs>
  </svg>
)
