import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { PersonnelBulkUpdateValues } from '~/types/domain/personnel'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdatePersonnelHandlerOptions {
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdatePersonnelHandler = (options: BulkUpdatePersonnelHandlerOptions) => {
  const closeBulkUpdatePersonnelModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = false
  }

  const openBulkUpdatePersonnelModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = true
  }

  const updateSelectedPersonnel = async (updates: PersonnelBulkUpdateValues) => {
    const ids = [...new Set(options.selectedIds.value)].filter(Boolean)
    if (ids.length === 0) return closeBulkUpdatePersonnelModal()

    options.errorMessage.value = ''
    try {

    } catch (error: unknown) {
      options.errorMessage.value = extractApiErrorMessage(error, 'No personnel records were updated. Review the selected values and try again.')
      await options.showDialog({
        type: 'error',
        title: 'Bulk update failed',
        message: options.errorMessage.value,
        confirmLabel: 'OK',
      })
    }
  }

  return { 
    openBulkUpdatePersonnelModal,
    closeBulkUpdatePersonnelModal,
    updateSelectedPersonnel
  }
}
