import { defineStore } from 'pinia'
import { AUTH_API_ENDPOINTS } from '../constants/api.constants'
import { ref } from 'vue'

interface SessionUser {
  id: string
  username: string
  fullName: string | null
}

interface SessionResponse {
  ok: boolean
  user: SessionUser
}

interface LoginPayload {
  identifier: string
  password: string
}

interface AuthState {
  currentUser: SessionUser | null
  hasCheckedSession: boolean
  isCheckingSession: boolean
  isSubmitting: boolean
  isLoggingOut: boolean
  loginError: string
}

const DEFAULT_LOGIN_ERROR = 'Unable to sign in. Please try again.'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    currentUser: null,
    hasCheckedSession: false,
    isCheckingSession: false,
    isSubmitting: false,
    isLoggingOut: false,
    loginError: ''
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser)
  },

  actions: {
    async initializeSession() {
      if (this.isCheckingSession) return

      this.isCheckingSession = true

      try {
        const response = await $fetch<SessionResponse>(AUTH_API_ENDPOINTS.session)
        this.currentUser = response.user
      } catch {
        this.currentUser = null
      } finally {
        this.hasCheckedSession = true
        this.isCheckingSession = false
      }
    },

    async login(payload: LoginPayload) {
      if (this.isSubmitting) return false

      this.loginError = ''
      this.isSubmitting = true

      try {
        const response = await $fetch<SessionResponse>(AUTH_API_ENDPOINTS.login, {
          method: 'POST',
          body: payload
        })

        this.currentUser = response.user
        return true
      } catch (error: unknown) {
        const statusMessage =
          typeof error === 'object' &&
          error !== null &&
          'data' in error &&
          typeof error.data === 'object' &&
          error.data !== null &&
          'statusMessage' in error.data &&
          typeof error.data.statusMessage === 'string'
            ? error.data.statusMessage
            : ''

        const fallbackMessage = error instanceof Error ? error.message : DEFAULT_LOGIN_ERROR
        this.loginError = statusMessage || fallbackMessage || DEFAULT_LOGIN_ERROR
        return false
      } finally {
        this.isSubmitting = false
      }
    },

    async logout() {
      if (this.isLoggingOut) return

      this.isLoggingOut = true

      try {
        await $fetch(AUTH_API_ENDPOINTS.logout, { method: 'POST' })
      } finally {
        this.currentUser = null
        this.isLoggingOut = false
      }
    }
  }
})
