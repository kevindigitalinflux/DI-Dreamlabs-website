import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { useId } from 'react'

type FieldShellProps = {
  label: string
  error?: string
  hint?: string
  children: (ids: { inputId: string; describedBy: string | undefined }) => ReactNode
}

/** Shared label + error scaffolding for all form controls. */
const FieldShell = ({ label, error, hint, children }: FieldShellProps) => {
  const inputId = useId()
  const messageId = useId()
  const describedBy = error || hint ? messageId : undefined
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="font-body text-sm font-medium">
        {label}
      </label>
      {children({ inputId, describedBy })}
      {error ? (
        <p id={messageId} className="font-body text-sm font-medium text-magenta-bloom">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="font-body text-sm font-light opacity-70">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const controlClasses = (error?: string) =>
  `h-[52px] w-full rounded-card border bg-white px-4 font-body text-base text-navy-deep transition-colors placeholder:text-navy-deep/40 focus:outline-none focus:ring-2 focus:ring-violet-ray ${
    error ? 'border-magenta-bloom' : 'border-navy-deep/15'
  }`

type InputProps = { label: string; error?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>

/** Text input with label, hint, and Magenta Bloom error state (Brief §8.3). */
export const Input = ({ label, error, hint, className = '', ...rest }: InputProps) => (
  <FieldShell label={label} error={error} hint={hint}>
    {({ inputId, describedBy }) => (
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${controlClasses(error)} ${className}`}
        {...rest}
      />
    )}
  </FieldShell>
)

type TextAreaProps = { label: string; error?: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>

/** Multi-line input sharing the Input styling. */
export const TextArea = ({ label, error, hint, className = '', ...rest }: TextAreaProps) => (
  <FieldShell label={label} error={error} hint={hint}>
    {({ inputId, describedBy }) => (
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        rows={4}
        className={`${controlClasses(error)} min-h-[120px] py-3 ${className}`}
        {...rest}
      />
    )}
  </FieldShell>
)

type SelectProps = { label: string; error?: string; hint?: string } & SelectHTMLAttributes<HTMLSelectElement>

/** Native select sharing the Input styling. */
export const Select = ({ label, error, hint, className = '', children, ...rest }: SelectProps) => (
  <FieldShell label={label} error={error} hint={hint}>
    {({ inputId, describedBy }) => (
      <select
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${controlClasses(error)} appearance-none ${className}`}
        {...rest}
      >
        {children}
      </select>
    )}
  </FieldShell>
)
