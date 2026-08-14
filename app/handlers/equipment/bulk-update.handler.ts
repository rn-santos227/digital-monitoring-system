import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type {
  EquipmentAssetBulkUpdateValues,
  EquipmentCategoryBulkUpdateValues,
  EquipmentIssuanceBulkUpdateValues,
  EquipmentItemBulkUpdateValues,
} from '~/types/domain/equipment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface EquipmentBulkUpdateValuesByDomain {
  'equipment-categories': EquipmentCategoryBulkUpdateValues
  'equipment-items': EquipmentItemBulkUpdateValues
  'equipment-assets': EquipmentAssetBulkUpdateValues
  'equipment-issuances': EquipmentIssuanceBulkUpdateValues
}

type EquipmentBulkDomain = keyof EquipmentBulkUpdateValuesByDomain

interface BulkUpdateEquipmentHandlerOptions<TDomain extends EquipmentBulkDomain> {
  domain: TDomain
  label: string
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdateEquipmentHandler = <
  TDomain extends EquipmentBulkDomain,
>(
  options: BulkUpdateEquipmentHandlerOptions<TDomain>,
) => {
  const openBulkUpdateEquipmentModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = true
  }

  const closeBulkUpdateEquipmentModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = false
  }

  const updateSelectedEquipment = async (
    updates: EquipmentBulkUpdateValuesByDomain[TDomain],
  ) => {
    const ids = [...new Set(options.selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      closeBulkUpdateEquipmentModal()
      return
    }

    options.errorMessage.value = ''
    try {
      const response = await updateBulkRecordsEndpoint<
        EquipmentBulkUpdateValuesByDomain[TDomain]
      >(
        options.domain,
        ids,
        updates,
      )
      options.selectedIds.value = []
      closeBulkUpdateEquipmentModal()
      await options.reload()
    } catch (error: unknown) {
      options.errorMessage.value = extractApiErrorMessage(
        error,
        `No ${options.label}s were updated. Review the selected values and try again.`,
      )
      await options.showDialog({
        type: 'error',
        title: 'Bulk update failed',
        message: options.errorMessage.value,
        confirmLabel: 'OK',
      })
    }
  }

  return {
    openBulkUpdateEquipmentModal,
    closeBulkUpdateEquipmentModal,
    updateSelectedEquipment,
  }
}
