import { AlertTriangle, ArrowRight, CircleDot, Pencil } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { Table } from '../../../components/ui/Table'
import { Skeleton } from '../../../components/ui/Skeleton'
import { Card } from '../../../components/ui/Card'
import { formatRelativeTime } from '../../../lib/time'
import type { Issue } from '../../../types'

export function IssuesSkeleton() {
  return (
    <Card className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </Card>
  )
}

export function IssuesEmptyState() {
  return (
    <Card className="flex flex-col items-center gap-3 py-12 text-center">
      <AlertTriangle className="h-8 w-8 text-slate-400" />
      <h3 className="text-lg font-semibold">No issues found</h3>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
        No issues found. Create your first issue 🚀
      </p>
      <Link
        to="/issues/new"
        className="focus-ring inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Create issue
      </Link>
    </Card>
  )
}

export function IssuesTable({ issues }: { issues: Issue[] }) {
  const navigate = useNavigate()

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Title</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Priority</th>
                <th className="px-4 py-3 text-left font-semibold">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {issues.map((issue) => (
                <tr
                  key={issue.id}
                  role="link"
                  tabIndex={0}
                  aria-label={`Open issue ${issue.title}`}
                  onClick={() => navigate(`/issues/${issue.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/issues/${issue.id}`)
                    }
                  }}
                  className="cursor-pointer transition hover:bg-slate-50 focus:outline-none focus-visible:bg-slate-50 dark:hover:bg-slate-900/60 dark:focus-visible:bg-slate-900/60"
                >
                  <td className="px-4 py-3 font-medium">{issue.title}</td>
                  <td className="px-4 py-3">
                    <Badge value={issue.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge value={issue.priority} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {formatRelativeTime(issue.updatedAt)}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
                    <Link
                      to={`/issues/${issue.id}/edit`}
                      className="focus-ring mr-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/30"
                    >
                      <Pencil size={14} /> Edit
                    </Link>
                    <Link
                      to={`/issues/${issue.id}`}
                      className="focus-ring inline-flex items-center gap-1 rounded-md px-2 py-1 text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/30"
                    >
                      View <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {issues.map((issue) => (
          <Card key={issue.id} className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">{issue.title}</h3>
              <CircleDot className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex gap-2">
              <Badge value={issue.status} />
              <Badge value={issue.priority} />
            </div>
            <div className="flex items-center gap-3">
              <Link to={`/issues/${issue.id}`} className="focus-ring inline-flex text-sm text-blue-600 hover:underline dark:text-blue-300">
                Open details
              </Link>
              <Link to={`/issues/${issue.id}/edit`} className="focus-ring inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-300">
                <Pencil size={14} /> Edit
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
