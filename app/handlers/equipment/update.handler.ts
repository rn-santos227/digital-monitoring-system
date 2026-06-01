import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  EquipmentAssetFormValues,
  EquipmentAssetListItem,
  EquipmentCategoryDetailItem,
  EquipmentIssuanceListItem,
  EquipmentItemListItem,
  UpdateEquipmentAssetPayload,
  UpdateEquipmentCategoryPayload,
  UpdateEquipmentItemPayload,
  UpdateEquipmentIssuancePayload,
} from '~/types/domain/equipment'

interface UseUpdateEquipmentCategoryHandlerOptions {
  isUpdateEquipmentCategoryModalOpen: Ref<boolean>
  selectedEquipmentCategory: Ref<EquipmentCategoryDetailItem | null>
  getEquipmentCategoryById: (id: string) => Promise<EquipmentCategoryDetailItem>
  updateEquipmentCategory: (id: string, payload: UpdateEquipmentCategoryPayload) => Promise<void>
}

interface UseUpdateEquipmentItemHandlerOptions {
  isUpdateEquipmentItemModalOpen: Ref<boolean>
  selectedEquipmentItem: Ref<EquipmentItemListItem | null>
  getEquipmentItemById: (id: string) => Promise<EquipmentItemListItem>
  updateEquipmentItem: (id: string, payload: UpdateEquipmentItemPayload) => Promise<void>
}

interface UseUpdateEquipmentAssetHandlerOptions {
  isUpdateEquipmentAssetModalOpen: Ref<boolean>
  selectedEquipmentAsset: Ref<EquipmentAssetListItem | null>
  getEquipmentAssetById: (id: string) => Promise<EquipmentAssetListItem>
  updateEquipmentAsset: (id: string, payload: UpdateEquipmentAssetPayload) => Promise<void>
}

interface UseUpdateEquipmentIssuanceHandlerOptions {
  isUpdateEquipmentIssuanceModalOpen: Ref<boolean>
  selectedEquipmentIssuance: Ref<EquipmentIssuanceListItem | null>
  getEquipmentIssuanceById: (id: string) => Promise<EquipmentIssuanceListItem>
  updateEquipmentIssuance: (id: string, payload: UpdateEquipmentIssuancePayload) => Promise<void>
}

export const useUpdateEquipmentCategoryHandler = ({
  isUpdateEquipmentCategoryModalOpen,
  selectedEquipmentCategory,
  getEquipmentCategoryById,
  updateEquipmentCategory,
}: UseUpdateEquipmentCategoryHandlerOptions) => {
  const closeUpdateEquipmentCategoryModal = () => {
    isUpdateEquipmentCategoryModalOpen.value = false
    selectedEquipmentCategory.value = null
  }

  const onOpenUpdateEquipmentCategoryModal = async (equipmentCategoryId: string) => {
    selectedEquipmentCategory.value = await getEquipmentCategoryById(equipmentCategoryId)
    isUpdateEquipmentCategoryModalOpen.value = true
  }

  const onUpdateEquipmentCategory = async (payload: UpdateEquipmentCategoryPayload) => {
    const categoryId = selectedEquipmentCategory.value?.id

    if (!categoryId) {
      return
    }

    await updateEquipmentCategory(categoryId, payload)
    closeUpdateEquipmentCategoryModal()
  }

  const selectedEquipmentCategoryFormValues: ComputedRef<{
    code: string
    name: string
    isActive: boolean
  }> = computed(() => ({
    code: selectedEquipmentCategory.value?.code ?? '',
    name: selectedEquipmentCategory.value?.name ?? '',
    isActive: selectedEquipmentCategory.value?.isActive ?? true,
  }))

  return {
    closeUpdateEquipmentCategoryModal,
    onOpenUpdateEquipmentCategoryModal,
    onUpdateEquipmentCategory,
    selectedEquipmentCategoryFormValues,
  }
}

export const useUpdateEquipmentItemHandler = ({
  isUpdateEquipmentItemModalOpen,
  selectedEquipmentItem,
  getEquipmentItemById,
  updateEquipmentItem,
}: UseUpdateEquipmentItemHandlerOptions) => {
  const closeUpdateEquipmentItemModal = () => {
    isUpdateEquipmentItemModalOpen.value = false
    selectedEquipmentItem.value = null
  }

  const onOpenUpdateEquipmentItemModal = async (equipmentItemId: string) => {
    selectedEquipmentItem.value = await getEquipmentItemById(equipmentItemId)
    isUpdateEquipmentItemModalOpen.value = true
  }

  const onUpdateEquipmentItem = async (payload: UpdateEquipmentItemPayload) => {
    const equipmentItemId = selectedEquipmentItem.value?.id

    if (!equipmentItemId) {
      return
    }

    await updateEquipmentItem(equipmentItemId, payload)
    closeUpdateEquipmentItemModal()
  }

  const selectedEquipmentItemFormValues = computed(() => ({
    equipmentCode: selectedEquipmentItem.value?.equipmentCode ?? '',
    categoryId: selectedEquipmentItem.value?.categoryId ?? '',
    name: selectedEquipmentItem.value?.name ?? '',
    model: selectedEquipmentItem.value?.model ?? '',
    manufacturer: selectedEquipmentItem.value?.manufacturer ?? '',
    description: selectedEquipmentItem.value?.description ?? '',
    unitOfMeasure: selectedEquipmentItem.value?.unitOfMeasure ?? '',
    minimumStockLevel: selectedEquipmentItem.value?.minimumStockLevel ?? 0,
    isSerialized: selectedEquipmentItem.value?.isSerialized ?? false,
    isActive: selectedEquipmentItem.value?.isActive ?? true,
  }))

  return {
    closeUpdateEquipmentItemModal,
    onOpenUpdateEquipmentItemModal,
    onUpdateEquipmentItem,
    selectedEquipmentItemFormValues,
  }
}

export const useUpdateEquipmentAssetHandler = ({
  isUpdateEquipmentAssetModalOpen,
  selectedEquipmentAsset,
  getEquipmentAssetById,
  updateEquipmentAsset,
}: UseUpdateEquipmentAssetHandlerOptions) => {
  const closeUpdateEquipmentAssetModal = () => {
    isUpdateEquipmentAssetModalOpen.value = false
    selectedEquipmentAsset.value = null
  }

  const onOpenUpdateEquipmentAssetModal = async (equipmentAssetId: string) => {
    selectedEquipmentAsset.value = await getEquipmentAssetById(equipmentAssetId)
    isUpdateEquipmentAssetModalOpen.value = true
  }

  const onUpdateEquipmentAsset = async (payload: UpdateEquipmentAssetPayload) => {
    const equipmentAssetId = selectedEquipmentAsset.value?.id

    if (!equipmentAssetId) {
      return
    }

    await updateEquipmentAsset(equipmentAssetId, payload)
    closeUpdateEquipmentAssetModal()
  }

  const selectedEquipmentAssetFormValues: ComputedRef<EquipmentAssetFormValues> = computed(() => ({
    assetTag: selectedEquipmentAsset.value?.assetTag ?? '',
    equipmentItemId: selectedEquipmentAsset.value?.equipmentItemId ?? '',
    serialNo: selectedEquipmentAsset.value?.serialNo ?? '',
    batchNo: selectedEquipmentAsset.value?.batchNo ?? '',
    procurementDate: selectedEquipmentAsset.value?.procurementDate ?? '',
    acquisitionCost: selectedEquipmentAsset.value?.acquisitionCost ?? null,
    fundSource: selectedEquipmentAsset.value?.fundSource ?? '',
    currentLocation: selectedEquipmentAsset.value?.currentLocation ?? '',
    conditionStatusId: selectedEquipmentAsset.value?.conditionStatusName ?? '',
    serviceabilityStatusId: selectedEquipmentAsset.value?.serviceabilityStatusName ?? '',
    assetStatusId: selectedEquipmentAsset.value?.assetStatusName ?? 'In Stock',
    remarks: selectedEquipmentAsset.value?.remarks ?? '',
  }))

  return {
    closeUpdateEquipmentAssetModal,
    onOpenUpdateEquipmentAssetModal,
    onUpdateEquipmentAsset,
    selectedEquipmentAssetFormValues,
  }
}

export const useUpdateEquipmentIssuanceHandler = ({
  isUpdateEquipmentIssuanceModalOpen,
  selectedEquipmentIssuance,
  getEquipmentIssuanceById,
  updateEquipmentIssuance,
}: UseUpdateEquipmentIssuanceHandlerOptions) => {
  const closeUpdateEquipmentIssuanceModal = () => {
    isUpdateEquipmentIssuanceModalOpen.value = false
    selectedEquipmentIssuance.value = null
  }

  const onOpenUpdateEquipmentIssuanceModal = async (equipmentIssuanceId: string) => {
    selectedEquipmentIssuance.value = await getEquipmentIssuanceById(equipmentIssuanceId)
    isUpdateEquipmentIssuanceModalOpen.value = true
  }

  const onUpdateEquipmentIssuance = async (payload: UpdateEquipmentIssuancePayload) => {
    const equipmentIssuanceId = selectedEquipmentIssuance.value?.id

    if (!equipmentIssuanceId) {
      return
    }

    await updateEquipmentIssuance(equipmentIssuanceId, payload)
    closeUpdateEquipmentIssuanceModal()
  }

  const selectedEquipmentIssuanceFormValues = computed(() => ({
    equipmentAssetId: selectedEquipmentIssuance.value?.equipmentAssetId ?? '',
    issuedToPersonnelId: selectedEquipmentIssuance.value?.issuedToPersonnelId ?? '',
    issuedByPersonnelId: selectedEquipmentIssuance.value?.issuedByPersonnelId ?? '',
    deploymentId: selectedEquipmentIssuance.value?.deploymentId ?? null,
    issueDate: selectedEquipmentIssuance.value?.issueDate ?? '',
    expectedReturnDate: selectedEquipmentIssuance.value?.expectedReturnDate ?? null,
    actualReturnDate: selectedEquipmentIssuance.value?.actualReturnDate ?? null,
    quantityIssued: selectedEquipmentIssuance.value?.quantityIssued ?? 1,
    statusId: selectedEquipmentIssuance.value?.statusId ?? '',
    issuedLocation: selectedEquipmentIssuance.value?.issuedLocation ?? null,
    returnLocation: selectedEquipmentIssuance.value?.returnLocation ?? null,
    remarks: selectedEquipmentIssuance.value?.remarks ?? null,
  }))

  return {
    closeUpdateEquipmentIssuanceModal,
    onOpenUpdateEquipmentIssuanceModal,
    onUpdateEquipmentIssuance,
    selectedEquipmentIssuanceFormValues,
  }
}
