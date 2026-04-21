import type { PropsWithChildren } from 'react'
import { cn } from '../../lib/cn'

interface CardProps extends PropsWithChildren {
  className?: string
}

export function Card({ className, children }: CardProps) {
  return <article className={cn('surface p-4 sm:p-6', className)}>{children}</article>
}
