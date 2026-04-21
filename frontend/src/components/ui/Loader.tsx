import { cn } from '../../lib/cn'

interface LoaderProps {
  className?: string
  label?: string
}

export function Loader({ className, label = 'Loading...' }: LoaderProps) {
  return (
    <div className={cn('inline-flex items-center gap-2 text-sm text-slate-500', className)} role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
      <span>{label}</span>
    </div>
  )
}
