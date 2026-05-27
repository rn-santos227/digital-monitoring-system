import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  EquipmentCategoryDetailItem,
  EquipmentItemListItem,
  UpdateEquipmentCategoryPayload,
  UpdateEquipmentItemPayload,
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
