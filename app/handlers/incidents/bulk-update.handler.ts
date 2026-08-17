import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { EquipmentIncidentBulkUpdateValues } from '~/types/domain/incident'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdateIncidentsHandlerOptions {
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  isSubmitting: Ref<boolean>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdateIncidentsHandler = (options: BulkUpdateIncidentsHandlerOptions) => {
  const openBulkUpdateIncidentsModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = true
  }

  const closeBulkUpdateIncidentsModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = false
  }

  const updateSelectedIncidents = async (updates: EquipmentIncidentBulkUpdateValues) => {
    const ids = [...new Set(options.selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      closeBulkUpdateIncidentsModal()
      return
    }

    options.errorMessage.value = ''
    options.isSubmitting.value = true
    try {
      const response = await updateBulkRecordsEndpoint('incidents', ids, updates)
      options.selectedIds.value = []
      closeBulkUpdateIncidentsModal()
      await options.reload()

    } catch (error: unknown) {
      options.errorMessage.value = extractApiErrorMessage(
        error,
        'No incidents were updated. Review the selected values and try again.',
      )
      await options.showDialog({
        type: 'error',
        title: 'Bulk update failed',
        message: options.errorMessage.value,
        confirmLabel: 'OK',
      })
    } finally {
      options.isSubmitting.value = false
    }
  }

  return {
    openBulkUpdateIncidentsModal,
    closeBulkUpdateIncidentsModal,
    updateSelectedIncidents,
  }
}
