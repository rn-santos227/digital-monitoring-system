import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { EngagementBulkUpdateValues } from '~/types/domain/engagement'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdateEngagementsHandlerOptions {
  domain: 'engagements' | 'engagement-records'
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}


export const useBulkUpdateEngagementsHandler = ({
  domain,
  selectedIds,
  isModalOpen,
  errorMessage,
  reload,
  showDialog,
}: BulkUpdateEngagementsHandlerOptions) => {
  const label = domain === 'engagements' ? 'engagement' : 'engagement record'

  const openBulkUpdateModal = () => {
    errorMessage.value = ''
    isModalOpen.value = true
  }

  const closeBulkUpdateModal = () => {
    errorMessage.value = ''
    isModalOpen.value = false
  }

  const updateSelectedEngagements = async (updates: EngagementBulkUpdateValues) => {
   const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      closeBulkUpdateModal()
      return
    }

    errorMessage.value = ''
    try {
      const response = await updateBulkRecordsEndpoint(domain, ids, updates)
      selectedIds.value = []
      closeBulkUpdateModal()
      await reload()
    } catch (error: unknown) {
      errorMessage.value = extractApiErrorMessage(
        error,
        `No ${label}s were updated. Review the selected values and try again.`,
      )
      await showDialog({
        type: 'error',
        title: 'Bulk update failed',
        message: errorMessage.value,
        confirmLabel: 'OK',
      })
    }
  }

  return {
    openBulkUpdateModal,
    closeBulkUpdateModal,
    updateSelectedEngagements,
  }
}
