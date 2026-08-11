import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { RankBulkUpdateValues } from '~/types/domain/rank'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdateRanksHandlerOptions {
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdateRanksHandler = (options: BulkUpdateRanksHandlerOptions) => {
  const closeBulkUpdateRanksModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = false
  }

  const openBulkUpdateRanksModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = true
  }

  const updateSelectedRanks = async (updates: RankBulkUpdateValues) => {
    const ids = [...new Set(options.selectedIds.value)].filter(Boolean)
    if (ids.length === 0) return closeBulkUpdateRanksModal()

    options.errorMessage.value = ''
    try {
    
    } catch (error: unknown) {
      options.errorMessage.value = extractApiErrorMessage(error, 'No ranks were updated. Review the sort order and try again.')
      await options.showDialog({
        type: 'error',
        title: 'Bulk update failed',
        message: options.errorMessage.value,
        confirmLabel: 'OK',
      })
    }
  }

  return { 
    openBulkUpdateRanksModal,
    closeBulkUpdateRanksModal,
    updateSelectedRanks
  }
}
