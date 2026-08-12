import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { UserProfileBulkUpdateValues } from '~/types/domain/users'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdateUsersHandlerOptions {
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdateUsersHandler = (options: BulkUpdateUsersHandlerOptions) => {
  const closeBulkUpdateUsersModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = false
  }

  const openBulkUpdateUsersModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = true
  }

  const updateSelectedUsers = async (updates: UserProfileBulkUpdateValues) => {
    const ids = [...new Set(options.selectedIds.value)].filter(Boolean)
    if (ids.length === 0) return closeBulkUpdateUsers
  }

  return { 
    openBulkUpdateUsersModal,
    closeBulkUpdateUsersModal,
    updateSelectedUsers
  }
}
