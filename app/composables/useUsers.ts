import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '~/stores/users'
import type {
  UserManagementTabId,
  CreateAccountTypePayload,
  CreateUserProfilePayload,
  UpdateUserActivationPayload,
  UpdateAccountTypePayload,
  UpdateUserPasswordPayload,
  UpdateUserProfilePayload,
  UserAccountsSearchQuery,
  UserProfilesSearchQuery,
} from '~/types/domain/users'

export const useUsers = () => {
  const usersStore = useUsersStore()
  const { profileItems, accountItems, privilegeItems, kpis, profilePagination, accountPagination, isLoading, error } = storeToRefs(usersStore)

  const activeTab = ref<UserManagementTabId>('user-profile')
  const profileFilters = ref<Partial<UserProfilesSearchQuery>>({})
  const accountFilters = ref<Partial<UserAccountsSearchQuery>>({})

  const profileTableRows = computed(() => {
    return profileItems.value.map((item) => ({
      id: item.id,
      fullName: item.fullName,
      email: item.email,
      accountTypes: item.accountTypeCodes.join(', ') || 'No account type',
      status: item.isActive ? 'Active' : 'Inactive',
      lastLoginAt: item.lastLoginAt ? item.lastLoginAt : 'Never',
    }))
  })

  const accountTableRows = computed(() => {
    return accountItems.value.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      description: item.description || '—',
      systemType: item.isSystem ? 'System' : 'Custom',
    }))
  })

  const accountTypeOptions = computed(() => {
    return accountItems.value.map((item) => ({
      value: item.id,
      label: `${item.name} (${item.code})`,
    }))
  })

  const privilegeOptions = computed(() => {
    return privilegeItems.value.map((item) => ({
      value: item.id,
      code: item.code,
      name: item.name,
      module: item.module,
    }))
  })

  const loadUserProfiles = async (page = profilePagination.value.page, filters: Partial<UserProfilesSearchQuery> = profileFilters.value, pageSize = profilePagination.value.pageSize) => {
    profileFilters.value = { ...filters }

    try {
      await usersStore.fetchUserProfiles(page, profileFilters.value, pageSize)
    } catch {
      // Error state is exposed from the store.
    }
  }

  const createUserProfile = async (payload: CreateUserProfilePayload): Promise<{ id: string | null }> => {
    return await usersStore.createUserProfile(payload)
  }

  const createAccountType = async (payload: CreateAccountTypePayload): Promise<{ id: string | null }> => {
    return await usersStore.createAccountType(payload)
  }

  const getUserProfileById = async (id: string) => {
    return await usersStore.getUserProfileById(id)
  }

  const getUserProfileViewById = async (id: string) => {
    return await usersStore.getUserProfileViewById(id)
  }

  const updateUserProfile = async (id: string, payload: UpdateUserProfilePayload) => {
    await usersStore.updateUserProfile(id, payload)
  }

  const updateUserPassword = async (id: string, payload: UpdateUserPasswordPayload) => {
    await usersStore.updateUserPassword(id, payload)
  }

  const updateUserActivation = async (id: string, payload: UpdateUserActivationPayload) => {
    await usersStore.updateUserActivation(id, payload)
  }

  const deleteUserProfile = async (id: string) => {
    await usersStore.deleteUserProfile(id)
  }

  const getAccountTypeById = async (id: string) => {
    return await usersStore.getAccountTypeById(id)
  }

  const updateAccountType = async (id: string, payload: UpdateAccountTypePayload) => {
    await usersStore.updateAccountType(id, payload)
  }

  const deleteAccountType = async (id: string) => {
    await usersStore.deleteAccountType(id)
  }

  const loadPrivileges = async () => {
    try {
      await usersStore.fetchPrivileges()
    } catch {
      // Error state is exposed from the store.
    }
  }

  const loadUserAccounts = async (page = accountPagination.value.page, filters: Partial<UserAccountsSearchQuery> = accountFilters.value, pageSize = accountPagination.value.pageSize) => {
    accountFilters.value = { ...filters }

    try {
      await usersStore.fetchUserAccounts(page, accountFilters.value, pageSize)
    } catch {
      // Error state is exposed from the store.
    }
  }

  onMounted(() => {
    void usersStore.fetchUserManagementKpisOnce().catch(() => {})
    void Promise.all([
      loadUserProfiles(1),
      loadUserAccounts(1),
    ])
  })

  return {
    activeTab,
    profileFilters,
    accountFilters,
    profileTableRows,
    accountTableRows,
    kpis,
    profilePagination,
    accountPagination,
    isLoading,
    error,
    loadUserProfiles,
    loadUserAccounts,
    loadPrivileges,
    accountTypeOptions,
    privilegeOptions,
    createUserProfile,
    createAccountType,
    getAccountTypeById,
    updateAccountType,
    deleteAccountType,
    getUserProfileById,
    getUserProfileViewById,
    updateUserProfile,
    updateUserPassword,
    updateUserActivation,
    deleteUserProfile,
  }
}
