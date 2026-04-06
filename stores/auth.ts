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
    },
  }
})
