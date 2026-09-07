import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import { resolveDefaultFetchPageSize } from '~/utils/application-settings-page-size'
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
  UserManagementKpiCounts,
} from '~/types/domain/users'
import {
  createAccountTypeEndpoint,
  createUserProfileEndpoint,
  deleteAccountTypeEndpoint,
  deleteUserProfileEndpoint,
  getAccountTypeByIdEndpoint,
  getPrivilegesEndpoint,
  getUserManagementKpisEndpoint,
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
  pageSize: resolveDefaultFetchPageSize(),
  totalItems: 0,
  totalPages: 0,
}

const DEFAULT_USER_MANAGEMENT_KPIS: UserManagementKpiCounts = {
  activeUsers: 0,
  inactiveUsers: 0,
  totalAccountTypes: 0,
  unusedAccountTypes: 0,
}

const INITIAL_USERS_STATE: UsersState = {
  profileItems: [],
  accountItems: [],
  privilegeItems: [],
  kpis: { ...DEFAULT_USER_MANAGEMENT_KPIS },
  hasLoadedKpis: false,
  profilePagination: { ...DEFAULT_PAGINATION },
  accountPagination: { ...DEFAULT_PAGINATION },
  isLoading: false,
  error: '',
}

const usersStoreOptions = {
  state: (): UsersState => ({
    ...INITIAL_USERS_STATE,
    kpis: { ...DEFAULT_USER_MANAGEMENT_KPIS },
    profilePagination: { ...DEFAULT_PAGINATION },
    accountPagination: { ...DEFAULT_PAGINATION },
  }),

  getters: {
    hasUserProfiles: (state: UsersState) => state.profileItems.length > 0,
    hasUserAccounts: (state: UsersState) => state.accountItems.length > 0,
    hasPrivileges: (state: UsersState) => state.privilegeItems.length > 0,
    userManagementKpis: (state: UsersState) => state.kpis,
  },

  actions: {
    async fetchUserManagementKpisOnce(this: UsersState) {
      if (this.hasLoadedKpis) {
        return
      }

      this.error = ''

      try {
        this.kpis = await getUserManagementKpisEndpoint()
        this.hasLoadedKpis = true
      } catch (error) {
        this.kpis = { ...DEFAULT_USER_MANAGEMENT_KPIS }
        this.hasLoadedKpis = false
        this.error = extractApiErrorMessage(error, 'Unable to fetch user management KPI counts.')
        throw error
      }
    },

    async fetchUserProfiles(this: UsersState, page = 1, filters: Partial<UserProfilesSearchQuery> = {}, pageSize = this.profilePagination.pageSize) {
      this.isLoading = true
      this.error = ''

      const requestQuery: UserProfilesSearchQuery = {
        page,
        pageSize,
        term: filters.term?.trim() || undefined,
        fields: filters.fields?.trim() || undefined,
        isActive: filters.isActive,
        conditions: filters.conditions,
        match: filters.match,
      }

      const hasSearchFilters = Boolean(requestQuery.term || requestQuery.conditions || typeof requestQuery.isActive === 'boolean')

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
        conditions: filters.conditions,
        match: filters.match,
      }

     const hasSearchFilters = Boolean(requestQuery.term || requestQuery.conditions || typeof requestQuery.isSystem === 'boolean')

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

    async createUserProfile(this: UsersState, payload: CreateUserProfilePayload): Promise<{ id: string | null }> {
      this.error = ''
      try {
        const response = await createUserProfileEndpoint(payload)
        const accountTypeCodes = payload.accountTypeIds
          .map((accountTypeId) => this.accountItems.find((accountType) => accountType.id === accountTypeId)?.code ?? '')
          .filter((accountTypeCode) => accountTypeCode.length > 0)

        if (response.id) {
          const newlyAssignedAccountTypes = payload.accountTypeIds.filter((accountTypeId) => {
            const accountType = this.accountItems.find((item) => item.id === accountTypeId)
            if (!accountType) {
              return false
            }

            return !this.profileItems.some((profileItem) => profileItem.accountTypeCodes.includes(accountType.code))
          }).length

          this.profileItems = [
            {
              id: response.id,
              email: payload.email,
              fullName: payload.fullName,
              isActive: true,
              lastLoginAt: null,
              accountTypeCodes,
            },
            ...this.profileItems,
          ]

          this.profilePagination = {
            ...this.profilePagination,
            totalItems: this.profilePagination.totalItems + 1,
            totalPages: Math.ceil((this.profilePagination.totalItems + 1) / this.profilePagination.pageSize),
          }

          if (this.hasLoadedKpis) {
            this.kpis = {
              ...this.kpis,
              activeUsers: this.kpis.activeUsers + 1,
              unusedAccountTypes: Math.max(0, this.kpis.unusedAccountTypes - newlyAssignedAccountTypes),
            }
          }
        }

        return { id: response.id }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to create user profile.')
        throw error
      }
    },

    async createAccountType(this: UsersState, payload: CreateAccountTypePayload): Promise<{ id: string | null }> {
      this.error = ''
      try {
        const response = await createAccountTypeEndpoint(payload)
        if (response.id) {
          this.accountItems = [
            {
              id: response.id,
              code: payload.code,
              name: payload.name,
              description: payload.description,
              isSystem: payload.isSystem,
            },
            ...this.accountItems,
          ]

          this.accountPagination = {
            ...this.accountPagination,
            totalItems: this.accountPagination.totalItems + 1,
            totalPages: Math.ceil((this.accountPagination.totalItems + 1) / this.accountPagination.pageSize),
          }

          if (this.hasLoadedKpis) {
            this.kpis = {
              ...this.kpis,
              totalAccountTypes: this.kpis.totalAccountTypes + 1,
              unusedAccountTypes: this.kpis.unusedAccountTypes + 1,
            }
          }
        }

        return { id: response.id }
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
        this.profileItems = this.profileItems.map((profileItem) => {
          if (profileItem.id !== id) {
            return profileItem
          }

          const normalizedAccountTypeIds = payload.accountTypeIds ?? []
          const accountTypeCodes = normalizedAccountTypeIds.length > 0
            ? normalizedAccountTypeIds
              .map((accountTypeId) => this.accountItems.find((accountType) => accountType.id === accountTypeId)?.code ?? '')
              .filter((accountTypeCode) => accountTypeCode.length > 0)
            : profileItem.accountTypeCodes

          return {
            ...profileItem,
            email: payload.email ?? profileItem.email,
            fullName: payload.fullName ?? profileItem.fullName,
            accountTypeCodes,
          }
        })
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
      const previousProfileItem = this.profileItems.find((profileItem) => profileItem.id === id) ?? null
      try {
        await updateUserActivationEndpoint(id, payload)
        this.profileItems = this.profileItems.map((profileItem) => {
          if (profileItem.id !== id) {
            return profileItem
          }

          return {
            ...profileItem,
            isActive: payload.isActive,
          }
        })

        if (this.hasLoadedKpis && previousProfileItem && previousProfileItem.isActive !== payload.isActive) {
          this.kpis = {
            ...this.kpis,
            activeUsers: Math.max(0, this.kpis.activeUsers + (payload.isActive ? 1 : -1)),
            inactiveUsers: Math.max(0, this.kpis.inactiveUsers + (payload.isActive ? -1 : 1)),
          }
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update user status.')
        throw error
      }
    },

    async deleteUserProfile(this: UsersState, id: string) {
      this.error = ''
      try {
        const deletedProfile = this.profileItems.find((profileItem) => profileItem.id === id) ?? null
        await deleteUserProfileEndpoint(id)
        this.profileItems = this.profileItems.filter((profileItem) => profileItem.id !== id)
        const nextTotalItems = this.profilePagination.totalItems > 0 ? this.profilePagination.totalItems - 1 : 0
        this.profilePagination = {
          ...this.profilePagination,
          totalItems: nextTotalItems,
          totalPages: Math.ceil(nextTotalItems / this.profilePagination.pageSize),
        }

        if (this.hasLoadedKpis && deletedProfile) {
          this.kpis = {
            ...this.kpis,
            activeUsers: Math.max(0, this.kpis.activeUsers - (deletedProfile.isActive ? 1 : 0)),
            inactiveUsers: Math.max(0, this.kpis.inactiveUsers - (deletedProfile.isActive ? 0 : 1)),
          }
        }
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to delete user profile.')
        throw error
      }
    },

    async updateAccountType(this: UsersState, id: string, payload: UpdateAccountTypePayload) {
      this.error = ''
      try {
        await updateAccountTypeEndpoint(id, payload)
        this.accountItems = this.accountItems.map((accountItem) => {
          if (accountItem.id !== id) {
            return accountItem
          }

          return {
            ...accountItem,
            code: payload.code,
            name: payload.name,
            description: payload.description,
            isSystem: payload.isSystem,
          }
        })
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to update account type.')
        throw error
      }
    },

    async deleteAccountType(this: UsersState, id: string) {
      this.error = ''
      try {
        const deletedAccountType = this.accountItems.find((accountItem) => accountItem.id === id) ?? null
        await deleteAccountTypeEndpoint(id)
        this.accountItems = this.accountItems.filter((accountItem) => accountItem.id !== id)
        const nextTotalItems = this.accountPagination.totalItems > 0 ? this.accountPagination.totalItems - 1 : 0
        this.accountPagination = {
          ...this.accountPagination,
          totalItems: nextTotalItems,
          totalPages: Math.ceil(nextTotalItems / this.accountPagination.pageSize),
        }

        if (this.hasLoadedKpis && deletedAccountType) {
          const isAssignedToLoadedProfile = this.profileItems.some((profileItem) => {
            return profileItem.accountTypeCodes.includes(deletedAccountType.code)
          })

          this.kpis = {
            ...this.kpis,
            totalAccountTypes: Math.max(0, this.kpis.totalAccountTypes - 1),
            unusedAccountTypes: Math.max(0, this.kpis.unusedAccountTypes - (isAssignedToLoadedProfile ? 0 : 1)),
          }
        }
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
