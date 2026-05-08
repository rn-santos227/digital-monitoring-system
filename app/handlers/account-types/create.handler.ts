import type { Ref } from 'vue'
import type { CreateAccountTypePayload } from '~/types/domain/users'

interface UseCreateAccountTypeHandlerOptions {
  isAccountTypeModalOpen: Ref<boolean>
  createAccountType: (payload: CreateAccountTypePayload) => Promise<{ id: string | null }>
}

export const useCreateAccountTypeHandler = ({
  isAccountTypeModalOpen,
  createAccountType,
}: UseCreateAccountTypeHandlerOptions) => {
  const onOpenCreateAccountTypeModal = () => {
    isAccountTypeModalOpen.value = true
  }

  const onCreateAccountType = async (payload: Parameters<typeof createAccountType>[0]) => {
    await createAccountType(payload)
    isAccountTypeModalOpen.value = false
  }

  return {
    onOpenCreateAccountTypeModal,
    onCreateAccountType,
  }
}
