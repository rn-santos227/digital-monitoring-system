import { defineStore } from 'pinia'
import type { AuthState, LoginPayload } from '~/types/domain/auth-store'
import { getSessionEndpoint, loginWithPasswordEndpoint, logoutEndpoint } from '~/utils/auth-endpoints'

const INITIAL_AUTH_STATE: AuthState = {
  currentUser: null,
  hasCheckedSession: false,
  isCheckingSession: false,
  isSubmitting: false,
  isLoggingOut: false,
  loginError: '',
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({ ...INITIAL_AUTH_STATE }),

  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser),
  },

  actions: {

  },
})
 