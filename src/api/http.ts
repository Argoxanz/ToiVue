import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

// Simple token storage utility
type StoredTokens = {
  accessToken: string | null
  refreshToken: string | null
}

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const tokenStorage = {
  get(): StoredTokens {
    return {
      accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    }
  },
  set(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

const apiBaseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

export const http: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string | null) => void
  reject: (error: unknown) => void
}> = []

function queueTokenPromise() {
  return new Promise<string | null>((resolve, reject) => {
    pendingQueue.push({ resolve, reject })
  })
}

function flushQueue(token: string | null, error?: unknown) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  pendingQueue = []
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = tokenStorage.get()
  if (accessToken) {
    config.headers = config.headers ?? {}
    ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    const status = error.response?.status
    if (status === 401 && !original._retry) {
      original._retry = true

      try {
        if (isRefreshing) {
          const newToken = await queueTokenPromise()
          if (newToken) {
            original.headers = original.headers ?? {}
            ;(original.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`
            return http(original)
          }
        }

        isRefreshing = true
        const { refreshToken } = tokenStorage.get()
        if (!refreshToken) {
          tokenStorage.clear()
          throw error
        }

        const refreshResponse = await axios.post(
          `${apiBaseURL}/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const data = refreshResponse.data as { access_token: string; refresh_token: string }
        tokenStorage.set(data.access_token, data.refresh_token)
        flushQueue(data.access_token)

        original.headers = original.headers ?? {}
        ;(original.headers as Record<string, string>)['Authorization'] = `Bearer ${data.access_token}`
        return http(original)
      } catch (refreshError) {
        flushQueue(null, refreshError)
        tokenStorage.clear()
        // Redirect to login if router is available and public
        try {
          const { default: router } = await import('../router')
          if (router.currentRoute.value.path !== '/login') {
            router.replace({ path: '/login' })
          }
        } catch {
          // ignore navigation errors
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default http


