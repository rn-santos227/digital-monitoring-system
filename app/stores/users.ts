import { defineStore } from 'pinia'
import type {
  CreateAccountTypePayload,
  CreateUserProfilePayload,
  UserAccountRecord,
  PrivilegeRecord,
  UserProfileRecord,
  UsersState,
  UsersTablePagination,
} from '~/types/domain/users'
import { extractApiErrorMessage } from '~/utils/api-request'
import {
  createAccountTypeEndpoint,
  createUserProfileEndpoint,
  getPrivilegesEndpoint,
  getUserAccountsEndpoint,
  getUserProfilesEndpoint,
} from '~/utils/users-endpoints'

const DEFAULT_PAGINATION: UsersTablePagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

const INITIAL_USERS_STATE: UsersState = {
  profileItems: [],
  accountItems: [],
  privilegeItems: [],
  profilePagination: { ...DEFAULT_PAGINATION },
  accountPagination: { ...DEFAULT_PAGINATION },
  isLoading: false,
  error: '',
}

const usersStoreOptions = {
  state: (): UsersState => ({
    ...INITIAL_USERS_STATE,
    profilePagination: { ...DEFAULT_PAGINATION },
    accountPagination: { ...DEFAULT_PAGINATION },
  }),

  getters: {
    hasUserProfiles: (state: UsersState) => state.profileItems.length > 0,
    hasUserAccounts: (state: UsersState) => state.accountItems.length > 0,
    hasPrivileges: (state: UsersState) => state.privilegeItems.length > 0,
  },

  actions: {
    async fetchUserProfiles(this: UsersState, page = 1, search = '') {
      this.isLoading = true
      this.error = ''

      try {
        const response = await getUserProfilesEndpoint({
          page,
          pageSize: this.profilePagination.pageSize,
          search: search.trim() || undefined,
        })

        this.profileItems = response.items.map((item): UserProfileRecord => ({
          id: item.id,
          email: item.email,
          fullName: item.fullName,
          isActive: item.isActive,
          lastLoginAt: item.lastLoginAt,
          accountTypeCodes: item.accountTypes.map((accountType) => accountType.code),
        }))
        this.profilePagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.profileItems = []
        this.profilePagination = { ...DEFAULT_PAGINATION }
        this.error = extractApiErrorMessage(error, 'Unable to fetch user profiles.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchUserAccounts(this: UsersState, page = 1, search = '') {
      this.isLoading = true
      this.error = ''

      try {
        const response = await getUserAccountsEndpoint({
          page,
          pageSize: this.accountPagination.pageSize,
          search: search.trim() || undefined,
        })

        this.accountItems = response.items.map((item): UserAccountRecord => ({
          id: item.id,
          code: item.code,
          name: item.name,
          description: item.description,
          isSystem: item.isSystem,
        }))
        this.accountPagination = {
          page: response.page,
          pageSize: response.pageSize,
          totalItems: response.totalItems,
          totalPages: response.totalPages,
        }
      } catch (error) {
        this.accountItems = []
        this.accountPagination = { ...DEFAULT_PAGINATION }
        this.error = extractApiErrorMessage(error, 'Unable to fetch user accounts.')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createUserProfile(this: UsersState, payload: CreateUserProfilePayload) {
      this.error = ''
      try {
        await createUserProfileEndpoint(payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create user profile.')
        throw error
      }
    },

    async createAccountType(this: UsersState, payload: CreateAccountTypePayload) {
      this.error = ''
      try {
        await createAccountTypeEndpoint(payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create account type.')
        throw error
      }
    },

    async fetchPrivileges(this: UsersState) {
      this.error = ''
      try {
        const response = await getPrivilegesEndpoint()
        this.privilegeItems = response.items.map((item): PrivilegeRecord => ({
          id: item.id,
          code: item.code,
          name: item.name,
          module: item.module,
          isAssigned: item.isAssigned,
        }))
      } catch (error) {
        this.privilegeItems = []
        this.error = extractApiErrorMessage(error, 'Unable to fetch privileges.')
        throw error
      }
    },
  },
}

export const useUsersStore = defineStore('users', usersStoreOptions)
