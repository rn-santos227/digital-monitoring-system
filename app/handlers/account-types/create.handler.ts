import type { Ref } from 'vue'

interface UseCreateAccountTypeHandlerOptions {
  isAccountTypeModalOpen: Ref<boolean>
  createAccountType: (payload: { code: string; name: string; description: string | null; privilegeIds: string[] }) => Promise<void>
  loadUserAccounts: (page?: number, search?: string) => Promise<void>
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
