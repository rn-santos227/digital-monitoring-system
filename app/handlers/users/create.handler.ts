import type { Ref } from 'vue'
import type { CreateUserProfilePayload, UserAccountsSearchQuery } from '~/types/domain/users'

interface UseCreateUserProfileHandlerOptions {
  accountTypeOptions: Ref<Array<{ value: string; label: string }>>
  isCreateUserProfileModalOpen: Ref<boolean>
  profileWarning: Ref<string>
  createUserProfile: (payload: CreateUserProfilePayload) => Promise<{ id: string | null }>
  loadUserAccounts: (page?: number, filters?: Partial<UserAccountsSearchQuery>) => Promise<void>
}

export const useCreateUserProfileHandler = ({
  accountTypeOptions,
  isCreateUserProfileModalOpen,
  profileWarning,
  createUserProfile,
  loadUserAccounts,
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
  }

  return {
    onOpenCreateUserProfileModal,
    onCreateUserProfile,
  }
}
