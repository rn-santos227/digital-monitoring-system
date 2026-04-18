import type { Ref } from 'vue'
import type { CreateUserProfilePayload } from '~/types/domain/users'

interface UseCreateUserProfileHandlerOptions {
  accountTypeOptions: Ref<Array<{ value: string; label: string }>>
  isCreateUserProfileModalOpen: Ref<boolean>
  profileWarning: Ref<string>
  loadUserAccounts: (page?: number, search?: string) => Promise<void>
  createUserProfile: (payload: CreateUserProfilePayload) => Promise<void>
  loadUserProfiles: (page?: number, search?: string) => Promise<void>
}

export const useCreateUserProfileHandler = ({
  accountTypeOptions,
  isCreateUserProfileModalOpen,
  profileWarning,
  loadUserAccounts,
  createUserProfile,
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
