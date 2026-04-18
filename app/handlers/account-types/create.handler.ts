import type { Ref } from 'vue'
import type { CreateAccountTypePayload, UserAccountsSearchQuery } from '~/types/domain/users'

interface UseCreateAccountTypeHandlerOptions {
  isAccountTypeModalOpen: Ref<boolean>
  createAccountType: (payload: CreateAccountTypePayload) => Promise<void>
  loadUserAccounts: (page?: number, filters?: Partial<UserAccountsSearchQuery>) => Promise<void>
}

export const useCreateAccountTypeHandler = ({
  isAccountTypeModalOpen,
  createAccountType,
  loadUserAccounts,
}: UseCreateAccountTypeHandlerOptions) => {
  const onOpenCreateAccountTypeModal = () => {
    isAccountTypeModalOpen.value = true
  }

  const onCreateAccountType = async (payload: Parameters<typeof createAccountType>[0]) => {
    await createAccountType(payload)
    isAccountTypeModalOpen.value = false
    await loadUserAccounts(1)
  }

  return {
    onOpenCreateAccountTypeModal,
    onCreateAccountType,
  }
}
