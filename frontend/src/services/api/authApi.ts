import { api } from './axiosInstance'
import type { User } from '../../types'

export interface AuthPayload {
  email: string
  password: string
  name?: string
}

export interface AuthResponse {
  token: string
  user: User
  message?: string
}

interface AuthResponsePayload {
  token?: string
  accessToken?: string
  user?: User
  message?: string
}

interface WrappedAuthResponse {
  data?: AuthResponsePayload
  token?: string
  accessToken?: string
  user?: User
  message?: string
}

function normalizeAuthResponse(payload: AuthResponsePayload | WrappedAuthResponse): AuthResponse {
  const source = 'data' in payload && payload.data ? payload.data : payload
  const token = source.token ?? source.accessToken

  if (!token) {
    throw new Error('Authentication token missing in response.')
  }

  if (!source.user) {
    throw new Error('Authenticated user data missing in response.')
  }

  return {
    token,
    user: source.user,
    ...(source.message ? { message: source.message } : {}),
  }
}

export const authApi = {
  login: async (payload: AuthPayload) => {
    const { data } = await api.post<AuthResponsePayload | WrappedAuthResponse>(
      '/auth/login',
      payload,
    )
    return normalizeAuthResponse(data)
  },
  register: async (payload: AuthPayload) => {
    const { data } = await api.post<AuthResponsePayload | WrappedAuthResponse>(
      '/auth/register',
      payload,
    )
    return normalizeAuthResponse(data)
  },
}
