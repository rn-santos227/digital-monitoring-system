import { defineStore } from 'pinia'
import { AUTH_LOCAL_STORAGE_KEYS } from '../constants/api.constants'
import type { AuthState, LoginPayload } from '../types/domain/auth-store'
import { fetchAuthSession, postAuthLogin, postAuthLogout } from '../utils/auth-api'
import { parseErrorMessage } from '../utils/error-message'
import { getStoredSessionToken, persistSessionToken } from '../utils/session-token'

const DEFAULT_LOGIN_ERROR = 'Unable to sign in. Please verify your credentials and try again.'

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
    async initializeSession(force = false) {
      if (this.isCheckingSession || (this.hasCheckedSession && !force)) {
        return
      }

      this.isCheckingSession = true
      try {
        const response = await fetchAuthSession(getStoredSessionToken(AUTH_LOCAL_STORAGE_KEYS.sessionToken))
        this.currentUser = response.user
      } catch {
        this.currentUser = null
        persistSessionToken(AUTH_LOCAL_STORAGE_KEYS.sessionToken)
      } finally {
        this.hasCheckedSession = true
        this.isCheckingSession = false
      }
    },

    async login(payload: LoginPayload) {
      if (this.isSubmitting) {
        return false
      }

      this.isSubmitting = true
      this.loginError = ''

      try {
        const response = await postAuthLogin(payload)

        this.currentUser = response.user
        this.hasCheckedSession = true
        persistSessionToken(AUTH_LOCAL_STORAGE_KEYS.sessionToken, response.sessionToken)

        return true
      } catch (error: unknown) {
        this.currentUser = null
        this.loginError = parseErrorMessage(error, DEFAULT_LOGIN_ERROR)
        persistSessionToken(AUTH_LOCAL_STORAGE_KEYS.sessionToken)
      } finally {
        this.isSubmitting = false
      }
    },
  }
})
