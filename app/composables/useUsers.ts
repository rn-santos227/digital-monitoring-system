import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUsersStore } from '~/stores/users'
import type { UserManagementTabId, CreateAccountTypePayload, CreateUserProfilePayload } from '~/types/domain/users'

export const useUsers = () => {
  const usersStore = useUsersStore()
  const { profileItems, accountItems, profilePagination, accountPagination, isLoading, error } = storeToRefs(usersStore)

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
    accountTypeOptions,
    createUserProfile,
    createAccountType,
  }
}
