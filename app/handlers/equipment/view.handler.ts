import type { Ref } from 'vue'
import type {
  EquipmentAssetListItem,
  EquipmentCategoryDetailItem,
  EquipmentIssuanceListItem,
} from '~/types/domain/equipment'
interface UseViewEquipmentCategoryHandlerOptions {
  isViewEquipmentCategoryModalOpen: Ref<boolean>
  selectedEquipmentCategory: Ref<EquipmentCategoryDetailItem | null>
  getEquipmentCategoryById: (id: string) => Promise<EquipmentCategoryDetailItem>
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

interface UseViewEquipmentIssuanceHandlerOptions {
  isViewEquipmentIssuanceModalOpen: Ref<boolean>
  selectedEquipmentIssuance: Ref<EquipmentIssuanceListItem | null>
  getEquipmentIssuanceById: (id: string) => Promise<EquipmentIssuanceListItem>
}

export const useViewEquipmentIssuanceHandler = ({
  isViewEquipmentIssuanceModalOpen,
  selectedEquipmentIssuance,
  getEquipmentIssuanceById,
}: UseViewEquipmentIssuanceHandlerOptions) => {
  const closeViewEquipmentIssuanceModal = () => {
    isViewEquipmentIssuanceModalOpen.value = false
    selectedEquipmentIssuance.value = null
  }

  const onViewEquipmentIssuance = async (equipmentIssuanceId: string) => {
    selectedEquipmentIssuance.value = await getEquipmentIssuanceById(equipmentIssuanceId)
    isViewEquipmentIssuanceModalOpen.value = true
  }

  return {
    closeViewEquipmentIssuanceModal,
    onViewEquipmentIssuance,
  }
}
