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

interface UseUserProfileActionHandlerOptions {
  profileWarning: Ref<string>
  canHandleViewAction: (actionKey: string) => boolean
  onViewProfileAction: (row: Record<string, unknown>) => Promise<unknown>
  canHandleUpdateProfileAction: (actionKey: string) => boolean
  onEditProfileAction: (row: Record<string, unknown>) => Promise<unknown>
  canHandlePasswordAction: (actionKey: string) => boolean
  onPasswordAction: (row: Record<string, unknown>) => void
  canHandleActivationAction: (actionKey: string) => boolean
  onActivationAction: (row: Record<string, unknown>) => Promise<unknown>
  canHandleDeleteAction: (actionKey: string) => boolean
  onDeleteAction: (row: Record<string, unknown>) => Promise<unknown>
}

export const useUserProfileActionHandler = ({
  profileWarning,
  canHandleViewAction,
  onViewProfileAction,
  canHandleUpdateProfileAction,
  onEditProfileAction,
  canHandlePasswordAction,
  onPasswordAction,
  canHandleActivationAction,
  onActivationAction,
  canHandleDeleteAction,
  onDeleteAction,
}: UseUserProfileActionHandlerOptions) => {
  const onProfileAction = async ({
    actionKey,
    row,
  }: {
    actionKey: string
    row: Record<string, unknown>
  }) => {
    profileWarning.value = ''

    if (canHandleViewAction(actionKey)) {
      await onViewProfileAction(row)
      return
    }

    if (canHandleUpdateProfileAction(actionKey)) {
      await onEditProfileAction(row)
      return
    }

    if (canHandlePasswordAction(actionKey)) {
      onPasswordAction(row)
      return
    }

    if (canHandleActivationAction(actionKey)) {
      await onActivationAction(row)
      return
    }

    if (canHandleDeleteAction(actionKey)) {
      await onDeleteAction(row)
    }
  }

  return {
    onProfileAction,
  }
}
