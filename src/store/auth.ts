import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type User } from '../api/auth'
import { tokenStorage } from '../api/http'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)

  // Actions
  async function loadUserIfAuthenticated() {
    const { accessToken } = tokenStorage.get()
    if (!accessToken) {
      user.value = null
      return
    }
    
    error.value = null
    try {
      user.value = await authApi.me()
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function login(login: string, password: string) {
    loading.value = true
    error.value = null
    try {
      await authApi.login({ login, password })
      user.value = await authApi.me()
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      error.value = errorResponse?.response?.data?.message ?? 'Login failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, emailOrPhone: { email?: string; phone?: string }, password: string) {
    loading.value = true
    error.value = null
    try {
      await authApi.register({ name, ...emailOrPhone, password })
      user.value = await authApi.me()
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      error.value = errorResponse?.response?.data?.message ?? 'Registration failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await authApi.logout()
    } finally {
      user.value = null
      loading.value = false
    }
  }

  async function googleLogin(idToken: string) {
    loading.value = true
    error.value = null
    try {
      await authApi.google({ id_token: idToken })
      user.value = await authApi.me()
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      error.value = errorResponse?.response?.data?.message ?? 'Google sign-in failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function forgot(email: string) {
    return authApi.forgot({ email })
  }

  async function reset(payload: { token: string; email: string; password: string; password_confirmation: string }) {
    return authApi.reset(payload)
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    userRole,
    // Actions
    loadUserIfAuthenticated,
    login,
    register,
    logout,
    googleLogin,
    forgot,
    reset,
    clearError,
  }
})

// Legacy compatibility - remove after updating all imports
export function useAuth() {
  const store = useAuthStore()
  return {
    user: store.user,
    loading: store.loading,
    error: store.error,
    loadUserIfAuthenticated: store.loadUserIfAuthenticated,
    login: store.login,
    register: store.register,
    logout: store.logout,
    googleLogin: store.googleLogin,
    forgot: store.forgot,
    reset: store.reset,
  }
}


