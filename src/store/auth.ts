import { reactive, toRefs } from 'vue'
import { authApi, type User } from '../api/auth'
import { tokenStorage } from '../api/http'

type AuthState = {
  user: User | null
  loading: boolean
  error: string | null
}

const state = reactive<AuthState>({
  user: null,
  loading: false,
  error: null,
})

export function useAuth() {
  async function loadUserIfAuthenticated() {
    const { accessToken } = tokenStorage.get()
    if (!accessToken) {
      state.user = null
      return
    }
    console.log(1);
// state.loading = true
    state.error = null
    try {
      state.user = await authApi.me()
    } catch (e) {
      state.user = null
    } finally {
      state.loading = false
    }
  }

  async function login(login: string, password: string) {
    console.log(2);
state.loading = true
    state.error = null
    try {
      await authApi.login({ login, password })
      state.user = await authApi.me()
    } catch (e: any) {
      state.error = e?.response?.data?.message ?? 'Login failed'
      throw e
    } finally {
      state.loading = false
    }
  }

  async function register(name: string, emailOrPhone: { email?: string; phone?: string }, password: string) {
    console.log(3);
state.loading = true
    state.error = null
    try {
      await authApi.register({ name, ...emailOrPhone, password })
      state.user = await authApi.me()
    } catch (e: any) {
      state.error = e?.response?.data?.message ?? 'Registration failed'
      throw e
    } finally {
      state.loading = false
    }
  }

  async function logout() {
    console.log(4);
state.loading = true
    try {
      await authApi.logout()
    } finally {
      state.user = null
      state.loading = false
    }
  }

  async function googleLogin(idToken: string) {
    console.log(5);
state.loading = true
    state.error = null
    try {
      await authApi.google({ id_token: idToken })
      state.user = await authApi.me()
    } catch (e: any) {
      state.error = e?.response?.data?.message ?? 'Google sign-in failed'
      throw e
    } finally {
      state.loading = false
    }
  }

  async function forgot(email: string) {
    return authApi.forgot({ email })
  }

  async function reset(payload: { token: string; email: string; password: string; password_confirmation: string }) {
    return authApi.reset(payload)
  }

  return {
    ...toRefs(state),
    loadUserIfAuthenticated,
    login,
    register,
    logout,
    googleLogin,
    forgot,
    reset,
  }
}


