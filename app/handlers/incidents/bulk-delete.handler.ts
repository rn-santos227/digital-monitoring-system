import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'
import { deleteBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkDeleteIncidentsHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeleteIncidentsHandler = ({
  selectedIds,
  reload,
  showDialog,
}: BulkDeleteIncidentsHandlerOptions) => {
  const deleteSelectedIncidents = async () => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      return
    }

  }

  return { deleteSelectedIncidents }
}
