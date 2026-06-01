import type { Ref } from 'vue'
import type {
  CreateEquipmentAssetPayload,
  CreateEquipmentCategoryPayload,
  CreateEquipmentItemPayload,
  CreateEquipmentIssuancePayload,
} from '~/types/domain/equipment'

interface UseCreateEquipmentCategoryHandlerOptions {
  isCreateEquipmentCategoryModalOpen: Ref<boolean>
  createEquipmentCategory: (payload: CreateEquipmentCategoryPayload) => Promise<{ id: string }>
}

interface UseCreateEquipmentItemHandlerOptions {
  isCreateEquipmentItemModalOpen: Ref<boolean>
  createEquipmentItem: (payload: CreateEquipmentItemPayload) => Promise<{ id: string }>
}

interface UseCreateEquipmentAssetHandlerOptions {
  isCreateEquipmentAssetModalOpen: Ref<boolean>
  createEquipmentAsset: (payload: CreateEquipmentAssetPayload) => Promise<{ id: string }>
}

interface UseCreateEquipmentIssuanceHandlerOptions {
  isCreateEquipmentIssuanceModalOpen: Ref<boolean>
  createEquipmentIssuance: (payload: CreateEquipmentIssuancePayload) => Promise<{ id: string }>
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

export const useCreateEquipmentAssetHandler = ({
  isCreateEquipmentAssetModalOpen,
  createEquipmentAsset,
}: UseCreateEquipmentAssetHandlerOptions) => {
  const onOpenCreateEquipmentAssetModal = () => {
    isCreateEquipmentAssetModalOpen.value = true
  }

  const onCloseCreateEquipmentAssetModal = () => {
    isCreateEquipmentAssetModalOpen.value = false
  }

  const onCreateEquipmentAsset = async (payload: CreateEquipmentAssetPayload) => {
    await createEquipmentAsset(payload)
    onCloseCreateEquipmentAssetModal()
  }

  return {
    onOpenCreateEquipmentAssetModal,
    onCloseCreateEquipmentAssetModal,
    onCreateEquipmentAsset,
  }
}


export const useCreateEquipmentIssuanceHandler = ({
  isCreateEquipmentIssuanceModalOpen,
  createEquipmentIssuance,
}: UseCreateEquipmentIssuanceHandlerOptions) => {
  const onOpenCreateEquipmentIssuanceModal = () => {
    isCreateEquipmentIssuanceModalOpen.value = true
  }

  const onCloseCreateEquipmentIssuanceModal = () => {
    isCreateEquipmentIssuanceModalOpen.value = false
  }

  const onCreateEquipmentIssuance = async (payload: CreateEquipmentIssuancePayload) => {
    await createEquipmentIssuance(payload)
    onCloseCreateEquipmentIssuanceModal()
  }

  return {
    onOpenCreateEquipmentIssuanceModal,
    onCloseCreateEquipmentIssuanceModal,
    onCreateEquipmentIssuance,
  }
}
