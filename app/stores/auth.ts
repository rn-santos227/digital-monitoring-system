import { defineStore } from 'pinia'
import type { AuthState, LoginPayload } from '~/types/domain/auth-store'
import { getSessionEndpoint, loginWithPasswordEndpoint, logoutEndpoint } from '~/utils/auth-endpoints'
import { extractApiErrorMessage } from '~/utils/api-request'

const INITIAL_AUTH_STATE: AuthState = {
  currentUser: null,
  hasCheckedSession: false,
  isCheckingSession: false,
  isSubmitting: false,
  isLoggingOut: false,
  loginError: '',
}

const authStoreOptions = {
  state: (): AuthState => ({ ...INITIAL_AUTH_STATE }),

  getters: {
    isAuthenticated: (state: AuthState) => Boolean(state.currentUser),
    accountTypeCodes: (state: AuthState) => state.currentUser?.accountTypeCodes ?? [],
    permissionCodes: (state: AuthState) => state.currentUser?.permissionCodes ?? [],
  },

  actions: {
    hasRole(this: AuthState & { accountTypeCodes: string[] }, accountTypeCode: string) {
      return this.accountTypeCodes.includes(accountTypeCode)
    },

    hasPermission(this: AuthState & { permissionCodes: string[] }, permissionCode: string) {
      return this.permissionCodes.includes(permissionCode)
    },

    hasPermissionAccess(this: AuthState & { permissionCodes: string[]; hasPermission: (code: string) => boolean }, requiredPermissions?: readonly string[]) {
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true
      }

      return requiredPermissions.every((permissionCode) => {
        return this.hasPermission(permissionCode)
      })
    },

    hasAnyPermissionAccess(this: AuthState & { permissionCodes: string[]; hasPermission: (code: string) => boolean }, requiredPermissions?: readonly string[]) {
      if (!requiredPermissions || requiredPermissions.length === 0) {
        return true
      }

      return requiredPermissions.some((permissionCode) => {
        return this.hasPermission(permissionCode)
      })
    },

    async login(this: AuthState, payload: LoginPayload) {
      this.isSubmitting = true
      this.loginError = ''

      try {
        const response = await loginWithPasswordEndpoint(payload)
        this.currentUser = response.user
        this.hasCheckedSession = true
        return response
      } catch (error) {
        this.loginError = extractApiErrorMessage(error, 'Unable to sign in right now.')
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    async fetchSession(this: AuthState) {
      this.isCheckingSession = true

      try {
        const response = await getSessionEndpoint()
        this.currentUser = response.user
      } catch {
        this.currentUser = null
      } finally {
        this.hasCheckedSession = true
        this.isCheckingSession = false
      }
    },

    async logout(this: AuthState) {
      this.isLoggingOut = true

      try {
        await logoutEndpoint()
        this.currentUser = null
      } finally {
        this.isLoggingOut = false
      }
    },
  },
}

export const useAuthStore = defineStore('auth', authStoreOptions)
