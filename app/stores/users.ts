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
}

export const useUsersStore = defineStore('users', usersStoreOptions)
