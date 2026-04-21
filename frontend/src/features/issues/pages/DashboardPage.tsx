import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Download, FolderKanban, Plus, TriangleAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Pagination } from '../../../components/ui/Pagination'
import { Skeleton } from '../../../components/ui/Skeleton'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { useDebounce } from '../../../hooks/useDebounce'
import {
  fetchIssueInsights,
  fetchIssues,
  issuesSelectors,
  setFilters,
  setPage,
} from '../issueSlice'
import { IssueFilters } from '../components/IssueFilters'
import { IssuesEmptyState, IssuesSkeleton, IssuesTable } from '../components/IssueList'
import { issuesApi } from '../../../services/api/issuesApi'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const issues = useAppSelector(issuesSelectors.selectAll)
  const filters = useAppSelector((state) => state.issues.filters)
  const pagination = useAppSelector((state) => state.issues.pagination)
  const fetchStatus = useAppSelector((state) => state.issues.fetchStatus)
  const insights = useAppSelector((state) => state.issues.insights)

  const [searchInput, setSearchInput] = useState(filters.search)
  const [isExporting, setIsExporting] = useState(false)
  const debouncedSearch = useDebounce(searchInput, 450)

  const handleExportJson = async () => {
    setIsExporting(true)

    try {
      const payload = await issuesApi.exportJson({
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
      })

      const timestamp = (payload.exportedAt ?? new Date().toISOString())
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .replace('Z', '')

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json;charset=utf-8',
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `issues-export-${timestamp}.json`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      toast.success(payload.message ?? 'Issues exported successfully.')
    } catch {
      toast.error('Failed to export issues. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }))
    dispatch(setPage(1))
  }, [debouncedSearch, dispatch])

  useEffect(() => {
    void dispatch(
      fetchIssues({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
      }),
    )
  }, [dispatch, filters.priority, filters.search, filters.status, pagination.limit, pagination.page])

  useEffect(() => {
    void dispatch(fetchIssueInsights())
  }, [dispatch])

  const insightCards = [
    {
      title: 'Total Issues',
      value: insights.total,
      icon: FolderKanban,
      tone: 'text-sky-600 dark:text-sky-400',
    },
    {
      title: 'Open Issues',
      value: insights.open,
      icon: AlertCircle,
      tone: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Closed Issues',
      value: insights.closed,
      icon: CheckCircle2,
      tone: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'High Priority',
      value: insights.high,
      icon: TriangleAlert,
      tone: 'text-rose-600 dark:text-rose-400',
    },
  ]

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Issue Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Search, filter, and manage project issues efficiently.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={handleExportJson} loading={isExporting}>
            <Download size={16} /> Download JSON
          </Button>
          <Link to="/issues/new">
            <Button>
              <Plus size={16} /> Create issue
            </Button>
          </Link>
        </div>
      </div>

      {insights.status === 'loading' ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={`insight-skeleton-${index}`} className="h-full min-w-0 space-y-2 p-3 sm:p-3.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
          {insightCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title} className="h-full min-w-0 space-y-1.5 p-3 sm:p-3.5">
                <div className="flex items-center justify-between">
                  <p className="truncate text-[11px] font-medium text-slate-500 sm:text-xs dark:text-slate-400">
                    {card.title}
                  </p>
                  <Icon className={`${card.tone} h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]`} />
                </div>
                <p className="text-xl font-bold tracking-tight sm:text-2xl">
                  {card.value.toLocaleString()}
                </p>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="space-y-4">
        <IssueFilters
          search={searchInput}
          status={filters.status}
          priority={filters.priority}
          onSearchChange={setSearchInput}
          onStatusChange={(status) => {
            dispatch(setFilters({ status }))
            dispatch(setPage(1))
          }}
          onPriorityChange={(priority) => {
            dispatch(setFilters({ priority }))
            dispatch(setPage(1))
          }}
        />
      </Card>

      {fetchStatus === 'loading' ? <IssuesSkeleton /> : null}
      {fetchStatus !== 'loading' && issues.length === 0 ? <IssuesEmptyState /> : null}
      {fetchStatus !== 'loading' && issues.length > 0 ? <IssuesTable issues={issues} /> : null}

      <Pagination
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.total}
        onPageChange={(page) => dispatch(setPage(page))}
      />
    </section>
  )
}
