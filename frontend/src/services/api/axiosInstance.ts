import axios from 'axios'
import { STORAGE_KEYS } from '../../constants/storageKeys'

interface ErrorPayload {
  message?: string
  error?: string
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
  timeout: 12_000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status as number | undefined
    const data = error.response?.data as ErrorPayload | undefined
    const message =
      data?.message ?? data?.error ?? error.message ?? 'Something went wrong.'

    if (status === 401) {
      window.dispatchEvent(new Event('app:unauthorized'))
    }

    return Promise.reject({ message, status })
  },
)
