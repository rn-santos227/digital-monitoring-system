import { defineStore } from 'pinia'
import { AUTH_API_ENDPOINTS, AUTH_HEADERS, AUTH_LOCAL_STORAGE_KEYS } from '../constants/api.constants'
import type { AuthState, LoginPayload, SessionResponse } from '../types/domain/auth-store'

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
        const storedSessionToken = import.meta.client
          ? localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken)
          : null

        let oauthAccessToken: string | null = null

        if (import.meta.client) {
          const supabaseClient = useSupabaseClient()
          const { data } = await supabaseClient.auth.getSession()
          oauthAccessToken = data.session?.access_token ?? null
        }

        const sessionHeaders: Record<string, string> = {}

        if (storedSessionToken) {
          sessionHeaders[AUTH_HEADERS.sessionToken] = storedSessionToken
        }

        if (oauthAccessToken) {
          sessionHeaders.Authorization = `Bearer ${oauthAccessToken}`
        }

        const response = await $fetch<SessionResponse>(AUTH_API_ENDPOINTS.session, Object.keys(sessionHeaders).length
          ? {
              headers: sessionHeaders
          } : undefined)

        this.currentUser = response.user
      } catch {
        this.currentUser = null
        if (import.meta.client) {
          localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken)
        }
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

        if (import.meta.client && response.sessionToken) {
          localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken, response.sessionToken)
        }

        this.currentUser = response.user
        this.hasCheckedSession = true
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
        if (import.meta.client) {
          localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken)
        }

        this.currentUser = null
        this.hasCheckedSession = true
        this.isLoggingOut = false
      }
    }
  }
})
