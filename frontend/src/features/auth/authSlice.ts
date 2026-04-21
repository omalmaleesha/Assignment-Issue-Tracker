import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '../../constants/storageKeys'
import { authApi, type AuthPayload, type AuthResponse } from '../../services/api/authApi'
import type { ApiError } from '../../services/api/types'
import type { User } from '../../types'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  status: RequestStatus
  error: string | null
  successMessage: string | null
}

const initialState: AuthState = {
  token: localStorage.getItem(STORAGE_KEYS.token),
  user: null,
  isAuthenticated: Boolean(localStorage.getItem(STORAGE_KEYS.token)),
  status: 'idle',
  error: null,
  successMessage: null,
}

export const loginUser = createAsyncThunk<AuthResponse, AuthPayload, { rejectValue: string }>(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      return await authApi.login(payload)
    } catch (error) {
      return rejectWithValue((error as ApiError).message)
    }
  },
)

export const registerUser = createAsyncThunk<AuthResponse, AuthPayload, { rejectValue: string }>(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      return await authApi.register(payload)
    } catch (error) {
      return rejectWithValue((error as ApiError).message)
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      state.successMessage = null
      state.error = null
      localStorage.removeItem(STORAGE_KEYS.token)
    },
    clearAuthFeedback: (state) => {
      state.error = null
      state.successMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.successMessage = 'Successfully logged in.'
        localStorage.setItem(STORAGE_KEYS.token, action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Login failed.'
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
        state.successMessage = action.payload.message ?? 'Account created successfully.'
        localStorage.setItem(STORAGE_KEYS.token, action.payload.token)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Registration failed.'
      })
  },
})

export const { logout, clearAuthFeedback } = authSlice.actions
export const authReducer = authSlice.reducer
