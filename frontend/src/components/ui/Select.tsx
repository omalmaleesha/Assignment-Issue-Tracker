import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface Option {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Option[]
  error?: string | undefined
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, id, className, ...props }, ref) => {
    const inputId = id ?? props.name
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'focus-ring w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
            error && 'border-rose-500 dark:border-rose-400',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

Select.displayName = 'Select'
