import type { Ref } from 'vue'
import type { CreateUserProfilePayload, UserAccountsSearchQuery, UserProfilesSearchQuery } from '~/types/domain/users'

interface UseCreateUserProfileHandlerOptions {
  accountTypeOptions: Ref<Array<{ value: string; label: string }>>
  isCreateUserProfileModalOpen: Ref<boolean>
  profileWarning: Ref<string>
  createUserProfile: (payload: CreateUserProfilePayload) => Promise<void>
  loadUserAccounts: (page?: number, filters?: Partial<UserAccountsSearchQuery>) => Promise<void>
  loadUserProfiles: (page?: number, filters?: Partial<UserProfilesSearchQuery>) => Promise<void>
}

export const useCreateUserProfileHandler = ({
  accountTypeOptions,
  isCreateUserProfileModalOpen,
  profileWarning,
  createUserProfile,
  loadUserAccounts,
  loadUserProfiles,
}: UseCreateUserProfileHandlerOptions) => {
  const onOpenCreateUserProfileModal = async () => {
    profileWarning.value = ''
    if (accountTypeOptions.value.length === 0) {
      await loadUserAccounts(1)
    }

    isCreateUserProfileModalOpen.value = true
  }

  const onCreateUserProfile = async (payload: Parameters<typeof createUserProfile>[0]) => {
    await createUserProfile(payload)
    isCreateUserProfileModalOpen.value = false
    await loadUserProfiles(1)
  }

  return {
    onOpenCreateUserProfileModal,
    onCreateUserProfile,
  }
}
