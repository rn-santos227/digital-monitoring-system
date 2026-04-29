import type { Ref } from 'vue'
import type {
  CreateBattalionPayload,
  CreateCompanyPayload,
  UnitManagementTabId,
} from '~/types/domain/units'

interface UseCreateUnitHandlerOptions {
  activeTab: Ref<UnitManagementTabId>
  onOpenCreateBattalionModal: () => void
  onOpenCreateCompanyModal: () => void
  onCreateBattalion: (payload: CreateBattalionPayload) => Promise<void>
  onCreateCompany: (payload: CreateCompanyPayload) => Promise<void>
}

export const useCreateUnitHandler = ({
  activeTab,
  onOpenCreateBattalionModal,
  onOpenCreateCompanyModal,
  onCreateBattalion,
  onCreateCompany,
}: UseCreateUnitHandlerOptions) => {
  const onCreateActionClick = () => {
    if (activeTab.value === 'battalion') {
      onOpenCreateBattalionModal()
      return
    }

    onOpenCreateCompanyModal()
  }

  const handleCreateUnitBattalion = async (payload: CreateBattalionPayload) => {
    await onCreateBattalion(payload)
  }

  const handleCreateUnitCompany = async (payload: CreateCompanyPayload) => {
    await onCreateCompany(payload)
  }

  return {
    onCreateActionClick,
    handleCreateUnitBattalion,
    handleCreateUnitCompany,
  }
}
