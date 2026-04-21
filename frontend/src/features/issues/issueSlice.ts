import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import type { ApiError } from '../../services/api/types'
import {
  issuesApi,
  type IssueFormPayload,
  type ListIssuesParams,
} from '../../services/api/issuesApi'
import type { Issue, IssuePriority, IssueStatus } from '../../types'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

const issuesAdapter = createEntityAdapter<Issue>()

interface IssuesState {
  fetchStatus: RequestStatus
  mutationStatus: RequestStatus
  error: string | null
  insights: {
    status: RequestStatus
    total: number
    open: number
    closed: number
    high: number
    error: string | null
  }
  filters: {
    search: string
    status: IssueStatus | 'all'
    priority: IssuePriority | 'all'
  }
  pagination: {
    page: number
    limit: number
    total: number
  }
}

const initialState = issuesAdapter.getInitialState<IssuesState>({
  fetchStatus: 'idle',
  mutationStatus: 'idle',
  error: null,
  insights: {
    status: 'idle',
    total: 0,
    open: 0,
    closed: 0,
    high: 0,
    error: null,
  },
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
})

export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async (params: ListIssuesParams, { rejectWithValue }) => {
    try {
      return await issuesApi.list(params)
    } catch (error) {
      return rejectWithValue((error as ApiError).message)
    }
  },
)

export const fetchIssueById = createAsyncThunk('issues/fetchIssueById', async (id: string, { rejectWithValue }) => {
  try {
    return await issuesApi.getById(id)
  } catch (error) {
    return rejectWithValue((error as ApiError).message)
  }
})

export const fetchIssueInsights = createAsyncThunk(
  'issues/fetchIssueInsights',
  async (_, { rejectWithValue }) => {
    try {
      const [totalResponse, openResponse, closedResponse, highResponse] = await Promise.all([
        issuesApi.list({ page: 1, limit: 1 }),
        issuesApi.list({ page: 1, limit: 1, status: 'open' }),
        issuesApi.list({ page: 1, limit: 1, status: 'closed' }),
        issuesApi.list({ page: 1, limit: 1, priority: 'high' }),
      ])

      return {
        total: totalResponse.total,
        open: openResponse.total,
        closed: closedResponse.total,
        high: highResponse.total,
      }
    } catch (error) {
      return rejectWithValue((error as ApiError).message)
    }
  },
)

export const createIssue = createAsyncThunk('issues/createIssue', async (payload: IssueFormPayload, { rejectWithValue }) => {
  try {
    return await issuesApi.create(payload)
  } catch (error) {
    return rejectWithValue((error as ApiError).message)
  }
})

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async ({ id, payload }: { id: string; payload: IssueFormPayload }, { rejectWithValue }) => {
    try {
      return await issuesApi.update(id, payload)
    } catch (error) {
      return rejectWithValue((error as ApiError).message)
    }
  },
)

export const updateIssueStatus = createAsyncThunk(
  'issues/updateIssueStatus',
  async (
    { id, status }: { id: string; status: IssueStatus },
    { rejectWithValue },
  ) => {
    try {
      return await issuesApi.updateStatus(id, status)
    } catch (error) {
      return rejectWithValue((error as ApiError).message)
    }
  },
)

export const deleteIssue = createAsyncThunk(
  'issues/deleteIssue',
  async (id: string, { rejectWithValue }) => {
    try {
      return await issuesApi.delete(id)
    } catch (error) {
      return rejectWithValue((error as ApiError).message)
    }
  },
)

const issueSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<{ search: string; status: IssueStatus | 'all'; priority: IssuePriority | 'all' }>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload
    },
    clearIssueError: (state) => {
      state.error = null
    },
    optimisticStatusUpdate: (
      state,
      action: PayloadAction<{ id: string; status: IssueStatus }>,
    ) => {
      issuesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: { status: action.payload.status, updatedAt: new Date().toISOString() },
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.fetchStatus = 'loading'
        state.error = null
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded'
        issuesAdapter.setAll(state, action.payload.data)
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        }
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.fetchStatus = 'failed'
        state.error = action.payload as string
      })
      .addCase(fetchIssueInsights.pending, (state) => {
        state.insights.status = 'loading'
        state.insights.error = null
      })
      .addCase(fetchIssueInsights.fulfilled, (state, action) => {
        state.insights.status = 'succeeded'
        state.insights.total = action.payload.total
        state.insights.open = action.payload.open
        state.insights.closed = action.payload.closed
        state.insights.high = action.payload.high
      })
      .addCase(fetchIssueInsights.rejected, (state, action) => {
        state.insights.status = 'failed'
        state.insights.error = action.payload as string
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        issuesAdapter.upsertOne(state, action.payload)
      })
      .addCase(createIssue.pending, (state) => {
        state.mutationStatus = 'loading'
      })
      .addCase(createIssue.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        issuesAdapter.addOne(state, action.payload)
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload as string
      })
      .addCase(updateIssue.pending, (state) => {
        state.mutationStatus = 'loading'
      })
      .addCase(updateIssue.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        issuesAdapter.upsertOne(state, action.payload)
      })
      .addCase(updateIssue.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload as string
      })
      .addCase(updateIssueStatus.fulfilled, (state, action) => {
        issuesAdapter.upsertOne(state, action.payload)
      })
      .addCase(updateIssueStatus.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(deleteIssue.pending, (state) => {
        state.mutationStatus = 'loading'
      })
      .addCase(deleteIssue.fulfilled, (state, action) => {
        state.mutationStatus = 'succeeded'
        issuesAdapter.removeOne(state, action.payload.id)
      })
      .addCase(deleteIssue.rejected, (state, action) => {
        state.mutationStatus = 'failed'
        state.error = action.payload as string
      })
  },
})

export const issuesSelectors = issuesAdapter.getSelectors<RootState>((state) => state.issues)

export const { setFilters, setPage, clearIssueError, optimisticStatusUpdate } = issueSlice.actions
export const issuesReducer = issueSlice.reducer
