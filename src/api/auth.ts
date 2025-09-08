import http, { tokenStorage } from './http'

export type TokensResponse = {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  refresh_token: string
}

export type User = {
  id: number
  name: string
  email: string | null
  phone: string | null
  role: string
}

export const authApi = {
  async register(payload: { name: string; email?: string; phone?: string; password: string }): Promise<TokensResponse> {
    const { data } = await http.post<TokensResponse>('/auth/register', payload)
    tokenStorage.set(data.access_token, data.refresh_token)
    return data
  },

  async login(payload: { login: string; password: string }): Promise<TokensResponse> {
    const { data } = await http.post<TokensResponse>('/auth/login', payload)
    tokenStorage.set(data.access_token, data.refresh_token)
    return data
  },

  async google(payload: { id_token: string }): Promise<TokensResponse> {
    const { data } = await http.post<TokensResponse>('/auth/google', payload)
    tokenStorage.set(data.access_token, data.refresh_token)
    return data
  },

  async refresh(refreshToken: string): Promise<TokensResponse> {
    const { data } = await http.post<TokensResponse>('/auth/refresh', { refresh_token: refreshToken })
    tokenStorage.set(data.access_token, data.refresh_token)
    return data
  },

  async forgot(payload: { email: string }): Promise<{ message: string }> {
    const { data } = await http.post<{ message: string }>('/auth/password/forgot', payload)
    return data
  },

  async reset(payload: { token: string; email: string; password: string; password_confirmation: string }): Promise<{ message: string }> {
    const { data } = await http.post<{ message: string }>('/auth/password/reset', payload)
    return data
  },

  async me(): Promise<User> {
    const { data } = await http.get<User>('/auth/me')
    return data
  },

  async logout(): Promise<void> {
    const { refreshToken } = tokenStorage.get()
    try {
      await http.post('/auth/logout', refreshToken ? { refresh_token: refreshToken } : {})
    } finally {
      tokenStorage.clear()
    }
  },
}


