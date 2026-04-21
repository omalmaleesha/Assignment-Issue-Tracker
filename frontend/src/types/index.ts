export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type IssuePriority = 'low' | 'medium' | 'high'

export interface User {
  id: string
  name: string
  email: string
}

export interface Issue {
  id: string
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  createdAt: string
  updatedAt: string
  reporterId?: string
  assigneeId?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
}
