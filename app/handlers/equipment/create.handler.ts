import type { Ref } from 'vue'
import type {
  CreateEquipmentCategoryPayload,
  CreateEquipmentItemPayload,
} from '~/types/domain/equipment'

interface UseCreateEquipmentCategoryHandlerOptions {
  isCreateEquipmentCategoryModalOpen: Ref<boolean>
  createEquipmentCategory: (payload: CreateEquipmentCategoryPayload) => Promise<{ id: string }>
}

interface UseCreateEquipmentItemHandlerOptions {
  isCreateEquipmentItemModalOpen: Ref<boolean>
  createEquipmentItem: (payload: CreateEquipmentItemPayload) => Promise<{ id: string }>
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

export const useCreateEquipmentItemHandler = ({
  isCreateEquipmentItemModalOpen,
  createEquipmentItem,
}: UseCreateEquipmentItemHandlerOptions) => {
  const onOpenCreateEquipmentItemModal = () => {
    isCreateEquipmentItemModalOpen.value = true
  }

  const onCloseCreateEquipmentItemModal = () => {
    isCreateEquipmentItemModalOpen.value = false
  }

  const onCreateEquipmentItem = async (payload: CreateEquipmentItemPayload) => {
    await createEquipmentItem(payload)
    onCloseCreateEquipmentItemModal()
  }

  return {
    onOpenCreateEquipmentItemModal,
    onCloseCreateEquipmentItemModal,
    onCreateEquipmentItem,
  }
}
