import type { Ref } from 'vue'
import type { CreateCompanyPayload } from '~/types/domain/units'

interface UseCreateCompanyHandlerOptions {
  isCreateCompanyModalOpen: Ref<boolean>
  createCompany: (payload: CreateCompanyPayload) => Promise<void>
}

export const useCreateCompanyHandler = ({
  isCreateCompanyModalOpen,
  createCompany,
}: UseCreateCompanyHandlerOptions) => {
  const onOpenCreateCompanyModal = () => {
    isCreateCompanyModalOpen.value = true
  }

  const onCloseCreateCompanyModal = () => {
    isCreateCompanyModalOpen.value = false
  }

  const onCreateCompany = async (payload: CreateCompanyPayload) => {
    await createCompany(payload)
    onCloseCreateCompanyModal()
  }

  return {
    onOpenCreateCompanyModal,
    onCloseCreateCompanyModal,
    onCreateCompany,
  }
}
