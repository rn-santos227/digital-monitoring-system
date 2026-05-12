import type { Ref } from 'vue'
import type { CreateBattalionPayload, CreateBattalionResponse } from '~/types/domain/units'

interface UseCreateBattalionHandlerOptions {
  isCreateBattalionModalOpen: Ref<boolean>
  createBattalion: (payload: CreateBattalionPayload) => Promise<CreateBattalionResponse>
}

export const useCreateBattalionHandler = ({
  isCreateBattalionModalOpen,
  createBattalion,
}: UseCreateBattalionHandlerOptions) => {
  const onOpenCreateBattalionModal = () => {
    isCreateBattalionModalOpen.value = true
  }

  const onCloseCreateBattalionModal = () => {
    isCreateBattalionModalOpen.value = false
  }

  const onCreateBattalion = async (payload: CreateBattalionPayload) => {
    await createBattalion(payload)
    onCloseCreateBattalionModal()
  }

  return {
    onOpenCreateBattalionModal,
    onCloseCreateBattalionModal,
    onCreateBattalion,
  }
}
