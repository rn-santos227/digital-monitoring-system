import type { Ref } from 'vue'
import { USER_MANAGEMENT_TAB_IDS } from './constants'
import type { UserManagementTabId } from '~/types/domain/users'

export const useUsersPageHandlers = (
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
