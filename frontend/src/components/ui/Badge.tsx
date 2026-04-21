import type { IssuePriority, IssueStatus } from '../../types'
import { cn } from '../../lib/cn'

type BadgeVariant = IssueStatus | IssuePriority

const styles: Record<BadgeVariant, string> = {
  open: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  closed: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  low: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  medium: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
}

export function Badge({ value }: { value: BadgeVariant }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize',
        styles[value],
      )}
    >
      {value.replace('_', ' ')}
    </span>
  )
}
