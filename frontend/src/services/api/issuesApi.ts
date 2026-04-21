import { api } from './axiosInstance'
import type { Issue, IssuePriority, IssueStatus, PaginatedResponse } from '../../types'

export interface ListIssuesParams {
  page: number
  limit: number
  search?: string
  status?: IssueStatus | 'all'
  priority?: IssuePriority | 'all'
}

export interface IssueFormPayload {
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
}

type BackendStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
type BackendPriority = 'Low' | 'Medium' | 'High'

interface BackendIssue {
  id: number | string
  title: string
  description: string
  status: BackendStatus | string
  priority: BackendPriority | string
  user_id?: number | string
  created_at: string
  updated_at: string
}

interface BackendListResponse {
  success?: boolean
  message?: string
  data: BackendIssue[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface BackendExportResponse {
  success?: boolean
  message?: string
  exportedAt?: string
  count?: number
  data: BackendIssue[]
}

interface WrappedIssueResponse {
  success?: boolean
  message?: string
  data?: BackendIssue
}

interface DeleteIssueResponse {
  success?: boolean
  message?: string
}

const toBackendStatus = (status: IssueStatus): BackendStatus => {
  switch (status) {
    case 'open':
      return 'Open'
    case 'in_progress':
      return 'In Progress'
    case 'resolved':
      return 'Resolved'
    case 'closed':
      return 'Closed'
  }
}

const fromBackendStatus = (status: string): IssueStatus => {
  const normalized = status.trim().toLowerCase()
  switch (normalized) {
    case 'open':
      return 'open'
    case 'in progress':
    case 'in_progress':
      return 'in_progress'
    case 'resolved':
      return 'resolved'
    case 'closed':
      return 'closed'
    default:
      return 'open'
  }
}

const toBackendPriority = (priority: IssuePriority): BackendPriority => {
  switch (priority) {
    case 'low':
      return 'Low'
    case 'medium':
      return 'Medium'
    case 'high':
      return 'High'
  }
}

const fromBackendPriority = (priority: string): IssuePriority => {
  const normalized = priority.trim().toLowerCase()
  switch (normalized) {
    case 'low':
      return 'low'
    case 'medium':
      return 'medium'
    case 'high':
      return 'high'
    default:
      return 'medium'
  }
}

const toIssue = (item: BackendIssue): Issue => ({
  id: String(item.id),
  title: item.title,
  description: item.description,
  status: fromBackendStatus(item.status),
  priority: fromBackendPriority(item.priority),
  createdAt: item.created_at,
  updatedAt: item.updated_at,
  ...(item.user_id ? { reporterId: String(item.user_id) } : {}),
})

const buildIssueQueryParams = (params: {
  page?: number
  limit?: number
  search?: string
  status?: IssueStatus | 'all'
  priority?: IssuePriority | 'all'
}) => {
  const queryParams: Record<string, string | number> = {}

  if (typeof params.page === 'number') {
    queryParams.page = params.page
  }

  if (typeof params.limit === 'number') {
    queryParams.limit = params.limit
  }

  if (params.search?.trim()) {
    queryParams.search = params.search.trim()
  }

  if (params.status && params.status !== 'all') {
    queryParams.status = toBackendStatus(params.status)
  }

  if (params.priority && params.priority !== 'all') {
    queryParams.priority = toBackendPriority(params.priority)
  }

  return queryParams
}

const toBackendIssuePayload = (payload: IssueFormPayload) => ({
  title: payload.title,
  description: payload.description,
  status: toBackendStatus(payload.status),
  priority: toBackendPriority(payload.priority),
})

const getIssueFromPayload = (
  payload: BackendIssue | WrappedIssueResponse,
): BackendIssue => {
  if ('data' in payload && payload.data) {
    return payload.data
  }
  return payload as BackendIssue
}

export const issuesApi = {
  list: async (params: ListIssuesParams) => {
    const queryParams = buildIssueQueryParams(params)

    const { data } = await api.get<BackendListResponse>('/issues', {
      params: queryParams,
    })

    const response: PaginatedResponse<Issue> = {
      data: data.data.map(toIssue),
      page: data.pagination.page,
      limit: data.pagination.limit,
      total: data.pagination.total,
    }

    return response
  },
  exportJson: async (params: Pick<ListIssuesParams, 'search' | 'status' | 'priority'>) => {
    const queryParams = buildIssueQueryParams(params)
    const { data } = await api.get<BackendExportResponse>('/issues/export/json', {
      params: queryParams,
    })
    return data
  },
  getById: async (id: string) => {
    const { data } = await api.get<BackendIssue | WrappedIssueResponse>(`/issues/${id}`)
    return toIssue(getIssueFromPayload(data))
  },
  create: async (payload: IssueFormPayload) => {
    const { data } = await api.post<BackendIssue | WrappedIssueResponse>(
      '/issues',
      toBackendIssuePayload(payload),
    )
    return toIssue(getIssueFromPayload(data))
  },
  update: async (id: string, payload: IssueFormPayload) => {
    const { data } = await api.put<BackendIssue | WrappedIssueResponse>(
      `/issues/${id}`,
      toBackendIssuePayload(payload),
    )
    return toIssue(getIssueFromPayload(data))
  },
  updateStatus: async (id: string, status: IssueStatus) => {
    const { data } = await api.patch<BackendIssue | WrappedIssueResponse>(
      `/issues/${id}/status`,
      { status: toBackendStatus(status) },
    )
    return toIssue(getIssueFromPayload(data))
  },
  delete: async (id: string) => {
    const { data } = await api.delete<DeleteIssueResponse>(`/issues/${id}`)
    return {
      id,
      ...(data.message ? { message: data.message } : {}),
    }
  },
}
