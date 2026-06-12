type GlowOrbProps = {
  colour?: 'violet' | 'rebecca' | 'cyan'
  /** Tailwind position/size classes, e.g. "left-[10%] top-[20%] h-96 w-96". */
  className?: string
}

const COLOURS: Record<NonNullable<GlowOrbProps['colour']>, string> = {
  violet: 'rgba(139, 50, 255, 0.35)',
  rebecca: 'rgba(100, 55, 139, 0.4)',
  cyan: 'rgba(0, 223, 223, 0.12)',
}

/**
 * Soft volumetric glow primitive for Deep Navy "dream" sections — the
 * Lucid-Tech atmosphere layer (Brief §4). Purely decorative.
 */
export const GlowOrb = ({ colour = 'violet', className = '' }: GlowOrbProps) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
    style={{
      background: `radial-gradient(circle, ${COLOURS[colour]} 0%, transparent 70%)`,
    }}
  />
)
