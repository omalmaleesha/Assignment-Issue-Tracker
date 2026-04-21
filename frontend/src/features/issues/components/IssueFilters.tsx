import { Search } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import type { IssuePriority, IssueStatus } from '../../../types'

interface IssueFiltersProps {
  search: string
  status: IssueStatus | 'all'
  priority: IssuePriority | 'all'
  onSearchChange: (value: string) => void
  onStatusChange: (value: IssueStatus | 'all') => void
  onPriorityChange: (value: IssuePriority | 'all') => void
}

export function IssueFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: IssueFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="relative">
        <Input
          label="Search"
          name="search"
          placeholder="Search by title..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-9"
        />
        <Search className="pointer-events-none absolute left-3 top-9 h-4 w-4 text-slate-400" />
      </div>
      <Select
        label="Status"
        name="status-filter"
        value={status}
        options={[
          { value: 'all', label: 'All statuses' },
          { value: 'open', label: 'Open' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'closed', label: 'Closed' },
        ]}
        onChange={(event) => onStatusChange(event.target.value as IssueStatus | 'all')}
      />
      <Select
        label="Priority"
        name="priority-filter"
        value={priority}
        options={[
          { value: 'all', label: 'All priorities' },
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ]}
        onChange={(event) => onPriorityChange(event.target.value as IssuePriority | 'all')}
      />
    </div>
  )
}
