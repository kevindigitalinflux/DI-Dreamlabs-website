type SectionHeadingProps = {
  /** Short all-caps label above the heading. */
  eyebrow?: string
  title: string
  lede?: string
  surface?: 'dark' | 'light'
  align?: 'left' | 'center'
}

/** Standard section header: eyebrow label, H2, optional lede paragraph. */
export const SectionHeading = ({
  eyebrow,
  title,
  lede,
  surface = 'dark',
  align = 'center',
}: SectionHeadingProps) => {
  const alignClasses = align === 'center' ? 'mx-auto text-center' : 'text-left'
  return (
    <div className={`max-w-2xl ${alignClasses}`}>
      {eyebrow && (
        <p
          className={`font-heading text-sm font-semibold uppercase tracking-[0.2em] ${
            surface === 'dark' ? 'text-violet-ray' : 'text-rebecca'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 font-heading text-2xl font-semibold leading-[1.2] md:text-[2rem] ${
          surface === 'dark' ? 'text-offwhite' : 'text-navy-deep'
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-4 font-body text-base leading-relaxed md:text-lg ${
            surface === 'dark' ? 'text-offwhite/75' : 'text-navy-deep/75'
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  )
}
