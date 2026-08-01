import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'
import { deleteBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkDeletePersonnelHandlerOptions {
  selectedIds: Ref<string[]>
  loadPersonnel: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeletePersonnelHandler = ({ selectedIds, loadPersonnel, showDialog }: BulkDeletePersonnelHandlerOptions) => {
  const deleteSelectedPersonnel = async () => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      return
    }

    const result = await showDialog({
      type: 'warning',
      title: `Delete ${ids.length} personnel record${ids.length === 1 ? '' : 's'}?`,
      message: 'This cannot be undone. For safety, no records will be deleted if any selection is missing or is referenced by another record.',
      confirmLabel: 'Delete selected',
      cancelLabel: 'Keep records',
    })
    if (!result.confirmed) {
      return
    }

  }
}
