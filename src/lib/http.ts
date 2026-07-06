import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import type { ApiErrorResponse, ApiResponse } from '@/types'
import { env } from './env'
import { token, storedUser } from './token'
import { ApiError } from './api-error'

const api = axios.create({
  baseURL: `${env.apiUrl}/api/v1`,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const accessToken = token.get()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status ?? 0
    const message =
      error.response?.data?.message ?? error.message ?? 'Request failed'
    const apiError = new ApiError(status, message, error.response?.data?.errorDetails)

    if (status === 401 && !error.config?.url?.includes('/auth/login')) {
      token.clear()
      storedUser.clear()
      window.location.replace('/login?reason=expired')
    }

    return Promise.reject(apiError)
  }
)

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await api.request<ApiResponse<T>>(config)
  return response.data.data
}

export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: 'GET' }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: 'POST', data }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: 'PATCH', data }),
  del: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: 'DELETE' }),
}
