import axios, { AxiosHeaders } from 'axios'

import { AUTH_STORAGE_KEY } from '@/features/auth/constants'
import type { AuthState } from '@/features/auth/types'
import { readStorage } from '@/lib/storage'

export class ApiError extends Error {
  status?: number
  data?: unknown
  cause?: unknown

  constructor(message: string, options?: { status?: number; data?: unknown; cause?: unknown }) {
    super(message)
    this.name = 'ApiError'
    this.status = options?.status
    this.data = options?.data
    if (options?.cause) {
      this.cause = options.cause
    }
  }
}

const defaultErrorMessage =
  'Nao foi possivel completar a requisicao. Verifique sua conexao e tente novamente.'

export const brasilAPI = axios.create({
  baseURL: 'https://brasilapi.com.br/api',
  timeout: 10_000,
})

brasilAPI.interceptors.request.use((config) => {
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers)

  const session = readStorage<AuthState | null>(AUTH_STORAGE_KEY, null)

  if (session && session.status === 'authenticated' && session.token) {
    headers.set('Authorization', `Bearer ${session.token}`)
  } else {
    headers.delete('Authorization')
  }

  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  config.headers = headers

  return config
})

brasilAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const data = error.response?.data

    const message =
      data?.message ??
      data?.errors?.[0]?.message ??
      error.message ??
      defaultErrorMessage

    return Promise.reject(new ApiError(message, { status, data, cause: error }))
  },
)
