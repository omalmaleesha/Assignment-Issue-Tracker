import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string | undefined
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id ?? props.name
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'focus-ring min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
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

Textarea.displayName = 'Textarea'
