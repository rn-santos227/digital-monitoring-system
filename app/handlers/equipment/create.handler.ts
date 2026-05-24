import type { Ref } from 'vue'
import type { CreateEquipmentCategoryPayload } from '~/types/domain/equipment'

interface UseCreateEquipmentCategoryHandlerOptions {
  isCreateEquipmentCategoryModalOpen: Ref<boolean>
  createEquipmentCategory: (payload: CreateEquipmentCategoryPayload) => Promise<{ id: string }>
}

export const useCreateEquipmentCategoryHandler = ({
  isCreateEquipmentCategoryModalOpen,
  createEquipmentCategory,
}: UseCreateEquipmentCategoryHandlerOptions) => {
  const onOpenCreateEquipmentCategoryModal = () => {
    isCreateEquipmentCategoryModalOpen.value = true
  }

  const onCloseCreateEquipmentCategoryModal = () => {
    isCreateEquipmentCategoryModalOpen.value = false
  }

  const onCreateEquipmentCategory = async (payload: CreateEquipmentCategoryPayload) => {
    await createEquipmentCategory(payload)
    onCloseCreateEquipmentCategoryModal()
  }

  return {
    onOpenCreateEquipmentCategoryModal,
    onCloseCreateEquipmentCategoryModal,
    onCreateEquipmentCategory,
  }
}
