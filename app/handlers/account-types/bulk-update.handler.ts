import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { AccountTypeBulkUpdateValues } from '~/types/domain/users'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdateAccountTypesHandlerOptions {
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdateAccountTypesHandler = (options: BulkUpdateAccountTypesHandlerOptions) => {
  const closeBulkUpdateAccountTypesModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = false
  }

  const openBulkUpdateAccountTypesModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = true
  }

  const updateSelectedAccountTypes = async (updates: AccountTypeBulkUpdateValues) => {
    const ids = [...new Set(options.selectedIds.value)].filter(Boolean)
    if (ids.length === 0) return closeBulkUpdateAccountTypesModal()

  }

  return {
    openBulkUpdateAccountTypesModal,
    closeBulkUpdateAccountTypesModal,
    updateSelectedAccountTypes
  }
}
