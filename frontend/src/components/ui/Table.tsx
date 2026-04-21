import type { PropsWithChildren } from 'react'

export function Table({ children }: PropsWithChildren) {
  return <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">{children}</div>
}
