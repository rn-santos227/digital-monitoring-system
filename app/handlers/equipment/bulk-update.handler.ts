import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { EquipmentBulkUpdateValues } from '~/types/domain/equipment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

type EquipmentBulkDomain =
  | 'equipment-categories'
  | 'equipment-items'
  | 'equipment-assets'
  | 'equipment-issuances'

interface BulkUpdateEquipmentHandlerOptions {
  domain: EquipmentBulkDomain
  label: string
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdateEquipmentHandler = (
  options: BulkUpdateEquipmentHandlerOptions,
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
    updates: EquipmentBulkUpdateValues,
  ) => {
    const ids = [...new Set(options.selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      closeBulkUpdateEquipmentModal()
      return
    }

    options.errorMessage.value = ''
    try {

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
