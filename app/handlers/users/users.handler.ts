import type { Ref } from 'vue'
import type { UserManagementTabId } from '~/types/domain/users'

export const USER_MANAGEMENT_TAB_IDS: readonly UserManagementTabId[] = ['user-profile', 'user-account']

export const useUsersManagementPageHandlers = (
  activeTab: Ref<UserManagementTabId>,
  profileSearchQuery: Ref<string>,
  accountSearchQuery: Ref<string>
) => {
  const handleTabChange = (nextTab: string) => {
    if (USER_MANAGEMENT_TAB_IDS.includes(nextTab as UserManagementTabId)) {
      activeTab.value = nextTab as UserManagementTabId
    }
  }

  const handleProfileSearch = (value: string) => {
    profileSearchQuery.value = value
  }

  const handleAccountSearch = (value: string) => {
    accountSearchQuery.value = value
  }

  return {
    handleTabChange,
    handleProfileSearch,
    handleAccountSearch,
  }
}
