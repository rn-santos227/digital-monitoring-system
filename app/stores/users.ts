import { defineStore } from 'pinia'
import type { UserAccountRecord, UserProfileRecord, UsersState, UsersTablePagination } from '~/types/domain/users'
import { extractApiErrorMessage } from '~/utils/api-request'
import { getUserAccountsEndpoint, getUserProfilesEndpoint } from '~/utils/users-endpoints'

const DEFAULT_PAGINATION: UsersTablePagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

const INITIAL_USERS_STATE: UsersState = {
  profileItems: [],
  accountItems: [],
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
  },
}

export const useUsersStore = defineStore('users', usersStoreOptions)
