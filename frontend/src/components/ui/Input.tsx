import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string | undefined
  hideLabel?: boolean | undefined
  error?: string | undefined
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hideLabel = false, error, id, className, ...props }, ref) => {
    const inputId = id ?? props.name
    return (
      <div className="space-y-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-slate-700 dark:text-slate-200',
              hideLabel && 'sr-only',
            )}
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'focus-ring w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 transition-all duration-200 ease-out hover:border-slate-400 focus:scale-[1.01] focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.18)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 dark:hover:border-slate-600 dark:focus:border-blue-400 dark:focus:shadow-[0_0_0_3px_rgba(96,165,250,0.2)]',
            error && 'border-rose-500 dark:border-rose-400',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-rose-600 dark:text-rose-400">
            {error}
          </p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
