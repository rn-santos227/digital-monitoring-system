import { defineStore } from 'pinia'
import type {
  CreateAccountTypePayload,
  CreateUserProfilePayload,
  UpdateAccountTypePayload,
  UpdateUserActivationPayload,
  UpdateUserPasswordPayload,
  UpdateUserProfilePayload,
  UserAccountDetailRecord,
  UserAccountRecord,
  UserProfileDetailRecord,
  UserProfileViewRecord,
  PrivilegeRecord,
  UserProfileRecord,
  UsersState,
  UsersTablePagination,
  UserAccountsSearchQuery,
  UserProfilesSearchQuery,
  UserAccountsEndpointQuery,
  UserProfilesEndpointQuery,
} from '~/types/domain/users'
import { extractApiErrorMessage } from '~/utils/api-request'
import {
  createAccountTypeEndpoint,
  createUserProfileEndpoint,
  deleteAccountTypeEndpoint,
  deleteUserProfileEndpoint,
  getAccountTypeByIdEndpoint,
  getPrivilegesEndpoint,
  getUserProfileByIdEndpoint,
  getUserProfileViewByIdEndpoint,
  getUserAccountsEndpoint,
  getUserProfilesEndpoint,
  searchUserAccountsEndpoint,
  searchUserProfilesEndpoint,
  updateAccountTypeEndpoint,
  updateUserActivationEndpoint,
  updateUserPasswordEndpoint,
  updateUserProfileEndpoint,
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
    async fetchUserProfiles(this: UsersState, page = 1, filters: Partial<UserProfilesSearchQuery> = {}, pageSize = this.profilePagination.pageSize) {
      this.isLoading = true
      this.error = ''

      const requestQuery: UserProfilesSearchQuery = {
        page,
        pageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        isActive: filters.isActive,
      }

      const hasSearchFilters = Boolean(requestQuery.term || typeof requestQuery.isActive === 'boolean')

      try {
        const response = hasSearchFilters
          ? await searchUserProfilesEndpoint(requestQuery)
          : await getUserProfilesEndpoint(requestQuery as UserProfilesEndpointQuery)

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

    async fetchUserAccounts(this: UsersState, page = 1, filters: Partial<UserAccountsSearchQuery> = {}, pageSize = this.accountPagination.pageSize) {
      this.isLoading = true
      this.error = ''

      const requestQuery: UserAccountsSearchQuery = {
        page,
        pageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        isSystem: typeof filters.isSystem === 'boolean' ? filters.isSystem : undefined,
      }

      const hasSearchFilters = Boolean(requestQuery.term || typeof requestQuery.isSystem === 'boolean')

      try {
        const response = hasSearchFilters
          ? await searchUserAccountsEndpoint(requestQuery)
          : await getUserAccountsEndpoint(requestQuery as UserAccountsEndpointQuery)

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

    async getAccountTypeById(this: UsersState, id: string): Promise<UserAccountDetailRecord> {
      this.error = ''
      try {
        const response = await getAccountTypeByIdEndpoint(id)
        return {
          id: response.id,
          code: response.code,
          name: response.name,
          description: response.description,
          isSystem: response.isSystem,
          permissionIds: response.permissions.map(permission => permission.id),
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to load account type details.')
        throw error
      }
    },

    async getUserProfileById(this: UsersState, id: string): Promise<UserProfileDetailRecord> {
      this.error = ''
      try {
        const response = await getUserProfileByIdEndpoint(id)
        return {
          id: response.id,
          personnelId: response.personnelId,
          email: response.email,
          fullName: response.fullName,
          avatarUrl: response.avatarUrl,
          isActive: response.isActive,
          accountTypeIds: response.accountTypes.map((accountType) => accountType.id),
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to load user profile details.')
        throw error
      }
    },

    async getUserProfileViewById(this: UsersState, id: string): Promise<UserProfileViewRecord> {
      this.error = ''
      try {
        const response = await getUserProfileViewByIdEndpoint(id)
        return {
          id: response.id,
          personnelId: response.personnelId,
          email: response.email,
          fullName: response.fullName,
          avatarUrl: response.avatarUrl,
          isActive: response.isActive,
          lastLoginAt: response.lastLoginAt,
          passwordUpdatedAt: response.passwordUpdatedAt,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          accountTypes: response.accountTypes.map(accountType => ({
            id: accountType.id,
            code: accountType.code,
            name: accountType.name,
          })),
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to load user profile details.')
        throw error
      }
    },

    async updateUserProfile(this: UsersState, id: string, payload: UpdateUserProfilePayload) {
      this.error = ''
      try {
        await updateUserProfileEndpoint(id, payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update user profile.')
        throw error
      }
    },

    async updateUserPassword(this: UsersState, id: string, payload: UpdateUserPasswordPayload) {
      this.error = ''
      try {
        await updateUserPasswordEndpoint(id, payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update user password.')
        throw error
      }
    },

    async updateUserActivation(this: UsersState, id: string, payload: UpdateUserActivationPayload) {
      this.error = ''
      try {
        await updateUserActivationEndpoint(id, payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update user status.')
        throw error
      }
    },

    async deleteUserProfile(this: UsersState, id: string) {
      this.error = ''
      try {
        await deleteUserProfileEndpoint(id)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete user profile.')
        throw error
      }
    },

    async updateAccountType(this: UsersState, id: string, payload: UpdateAccountTypePayload) {
      this.error = ''
      try {
        await updateAccountTypeEndpoint(id, payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update account type.')
        throw error
      }
    },

    async deleteAccountType(this: UsersState, id: string) {
      this.error = ''
      try {
        await deleteAccountTypeEndpoint(id)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete account type.')
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
