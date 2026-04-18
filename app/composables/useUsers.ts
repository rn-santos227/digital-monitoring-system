import { computed, onMounted, ref, watch } from 'vue'
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
} from '~/types/domain/users'

export const useUsers = () => {
  const usersStore = useUsersStore()
  const { profileItems, accountItems, privilegeItems, profilePagination, accountPagination, isLoading, error } = storeToRefs(usersStore)

  const activeTab = ref<UserManagementTabId>('user-profile')
  const profileSearchQuery = ref('')
  const accountSearchQuery = ref('')

  const profileTableRows = computed(() => {
    return profileItems.value.map((item) => ({
      id: item.id,
      fullName: item.fullName,
      email: item.email,
      accountTypes: item.accountTypeCodes.join(', ') || 'No account type',
      status: item.isActive ? 'Active' : 'Inactive',
      lastLoginAt: item.lastLoginAt ? new Date(item.lastLoginAt).toLocaleString() : 'Never',
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

  const loadUserProfiles = async (page = profilePagination.value.page, search = profileSearchQuery.value) => {
    try {
      await usersStore.fetchUserProfiles(page, search)
    } catch {
      // Error state is exposed from the store.
    }
  }

  const createUserProfile = async (payload: CreateUserProfilePayload) => {
    await usersStore.createUserProfile(payload)
  }

  const createAccountType = async (payload: CreateAccountTypePayload) => {
    await usersStore.createAccountType(payload)
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

  const loadUserAccounts = async (page = accountPagination.value.page, search = accountSearchQuery.value) => {
    try {
      await usersStore.fetchUserAccounts(page, search)
    } catch {
      // Error state is exposed from the store.
    }
  }

  watch(activeTab, (nextTab) => {
    if (nextTab === 'user-profile') {
      void loadUserProfiles(1)
      return
    }

    void loadUserAccounts(1)
  })

  onMounted(() => {
    void loadUserProfiles(1)
  })

  return {
    activeTab,
    profileSearchQuery,
    accountSearchQuery,
    profileTableRows,
    accountTableRows,
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
