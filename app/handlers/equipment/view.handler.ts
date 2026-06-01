import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type {
  EquipmentAssetListItem,
  EquipmentCategoryDetailItem,
  EquipmentIssuanceTableRow,
  EquipmentItemListItem,
} from '~/types/domain/equipment'

interface UseViewEquipmentCategoryHandlerOptions {
  isViewEquipmentCategoryModalOpen: Ref<boolean>
  selectedEquipmentCategory: Ref<EquipmentCategoryDetailItem | null>
  getEquipmentCategoryById: (id: string) => Promise<EquipmentCategoryDetailItem>
}

interface UseViewEquipmentItemHandlerOptions {
  isViewEquipmentItemModalOpen: Ref<boolean>
  selectedEquipmentItem: Ref<EquipmentItemListItem | null>
  getEquipmentItemById: (id: string) => Promise<EquipmentItemListItem>
}

interface UseViewEquipmentAssetHandlerOptions {
  isViewEquipmentAssetModalOpen: Ref<boolean>
  selectedEquipmentAsset: Ref<EquipmentAssetListItem | null>
  getEquipmentAssetById: (id: string) => Promise<EquipmentAssetListItem>
}

export const useViewEquipmentCategoryHandler = ({
  isViewEquipmentCategoryModalOpen,
  selectedEquipmentCategory,
  getEquipmentCategoryById,
}: UseViewEquipmentCategoryHandlerOptions) => {
  const closeViewEquipmentCategoryModal = () => {
    isViewEquipmentCategoryModalOpen.value = false
    selectedEquipmentCategory.value = null
  }

  const onViewEquipmentCategory = async (equipmentCategoryId: string) => {
    selectedEquipmentCategory.value = await getEquipmentCategoryById(equipmentCategoryId)
    isViewEquipmentCategoryModalOpen.value = true
  }

  return {
    closeViewEquipmentCategoryModal,
    onViewEquipmentCategory,
  }
}

export const useViewEquipmentItemHandler = ({
  isViewEquipmentItemModalOpen,
  selectedEquipmentItem,
  getEquipmentItemById,
}: UseViewEquipmentItemHandlerOptions) => {
  const closeViewEquipmentItemModal = () => {
    isViewEquipmentItemModalOpen.value = false
    selectedEquipmentItem.value = null
  }

  const onViewEquipmentItem = async (equipmentItemId: string) => {
    selectedEquipmentItem.value = await getEquipmentItemById(equipmentItemId)
    isViewEquipmentItemModalOpen.value = true
  }

  return {
    closeViewEquipmentItemModal,
    onViewEquipmentItem,
  }
}

export const useViewEquipmentAssetHandler = ({
  isViewEquipmentAssetModalOpen,
  selectedEquipmentAsset,
  getEquipmentAssetById,
}: UseViewEquipmentAssetHandlerOptions) => {
  const closeViewEquipmentAssetModal = () => {
    isViewEquipmentAssetModalOpen.value = false
    selectedEquipmentAsset.value = null
  }

  const onViewEquipmentAsset = async (equipmentAssetId: string) => {
    selectedEquipmentAsset.value = await getEquipmentAssetById(equipmentAssetId)
    isViewEquipmentAssetModalOpen.value = true
  }

  return {
    closeViewEquipmentAssetModal,
    onViewEquipmentAsset,
  }
}
