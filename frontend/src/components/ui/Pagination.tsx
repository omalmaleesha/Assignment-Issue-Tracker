import { Button } from './Button'

interface PaginationProps {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))

  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-between gap-2" aria-label="Issue pages">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Page <span className="font-semibold">{page}</span> of {totalPages}
      </p>
      <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </nav>
  )
}
