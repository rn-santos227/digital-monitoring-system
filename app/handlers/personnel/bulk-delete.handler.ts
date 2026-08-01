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

    try {

    } catch (error: unknown) {
      await showDialog({
        type: 'error',
        title: 'Bulk delete blocked',
        message: extractApiErrorMessage(error, 'No personnel records were deleted. Check whether the selected records are still in use and try again.'),
        confirmLabel: 'OK',
      })
    }
  }
}
