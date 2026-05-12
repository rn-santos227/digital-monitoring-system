import type { Ref } from 'vue'
import type { CreateCompanyPayload, CreateCompanyResponse } from '~/types/domain/units'

interface UseCreateCompanyHandlerOptions {
  isCreateCompanyModalOpen: Ref<boolean>
  createCompany: (payload: CreateCompanyPayload) => Promise<CreateCompanyResponse>
  onCreateSuccess?: () => void
  onCreateError?: () => void
}

export const useCreateCompanyHandler = ({
  isCreateCompanyModalOpen,
  createCompany,
  onCreateSuccess,
  onCreateError,
}: UseCreateCompanyHandlerOptions) => {
  const onOpenCreateCompanyModal = () => {
    isCreateCompanyModalOpen.value = true
  }

  const onCloseCreateCompanyModal = () => {
    isCreateCompanyModalOpen.value = false
  }

  const onCreateCompany = async (payload: CreateCompanyPayload) => {
    try {
      await createCompany(payload)
      onCloseCreateCompanyModal()
      onCreateSuccess?.()
    } catch (error) {
      onCreateError?.()
      throw error
    }
  }

  return {
    onOpenCreateCompanyModal,
    onCloseCreateCompanyModal,
    onCreateCompany,
  }
}
