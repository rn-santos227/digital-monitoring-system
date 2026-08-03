import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'
import { deleteBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkDeleteBattalionsHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeleteBattalionsHandler = ({
  selectedIds,
  reload,
  showDialog,
}: BulkDeleteBattalionsHandlerOptions) => {
  const deleteSelectedBattalions = async () => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      return
    }

  }
}
