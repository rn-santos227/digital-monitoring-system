import type { Ref } from 'vue'
import { USER_MANAGEMENT_TAB_IDS } from './constants'
import { useUsersSearchHandlers } from './search.handler'
import type { UserAccountsSearchQuery, UserManagementTabId, UserProfilesSearchQuery } from '~/types/domain/users'

export const useUsersPageHandlers = (
  activeTab: Ref<UserManagementTabId>,
  profileFilters: Ref<Partial<UserProfilesSearchQuery>>,
  accountFilters: Ref<Partial<UserAccountsSearchQuery>>
) => {
  const handleTabChange = (nextTab: string) => {
    if (USER_MANAGEMENT_TAB_IDS.includes(nextTab as UserManagementTabId)) {
      activeTab.value = nextTab as UserManagementTabId
    }
  }

  const {
    handleProfileFilterApply,
    handleProfileFilterReset,
    handleAccountFilterApply,
    handleAccountFilterReset
  } = useUsersSearchHandlers(profileFilters, accountFilters)  

  return {
    handleTabChange,
    handleProfileFilterApply,
    handleProfileFilterReset,
    handleAccountFilterApply,
    handleAccountFilterReset,
  }
}
