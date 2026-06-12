type Option = { value: string; label: string }

type CalculatorOptionsProps = {
  legend: string
  options: ReadonlyArray<Option>
  selected: string | null
  onSelect: (value: string) => void
}

/** One wizard step: a keyboard-friendly radio group of large option buttons. */
export const CalculatorOptions = ({
  legend,
  options,
  selected,
  onSelect,
}: CalculatorOptionsProps) => (
  <fieldset>
    <legend className="font-heading text-xl font-semibold text-navy-deep md:text-2xl">
      {legend}
    </legend>
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {options.map(({ value, label }) => {
        const active = selected === value
        return (
          <label
            key={value}
            className={`flex min-h-[52px] cursor-pointer items-center rounded-card border px-5 py-3.5 font-body text-base transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-ray has-[:focus-visible]:ring-offset-2 ${
              active
                ? 'border-violet-ray bg-violet-ray text-offwhite shadow-glow-violet'
                : 'border-navy-deep/15 bg-white text-navy-deep hover:border-violet-ray/60'
            }`}
          >
            <input
              type="radio"
              name={legend}
              value={value}
              checked={active}
              onChange={() => onSelect(value)}
              className="sr-only"
            />
            {label}
          </label>
        )
      })}
    </div>
  </fieldset>
)
