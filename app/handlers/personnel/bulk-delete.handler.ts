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
      type: 'question',
      title: 'Proceed with bulk delete?',
      message: `Are you sure you want to delete ${ids.length} selected personnel record${ids.length === 1 ? '' : 's'}? This action cannot be undone. For safety, no records will be deleted if any selection is missing or is referenced by another record.`,
      confirmLabel: 'Yes, delete selected',
      cancelLabel: 'No, keep records',
    })
    if (!result.confirmed) {
      return
    }

    try {
      const response = await deleteBulkRecordsEndpoint('personnel', ids)
      selectedIds.value = []
      await loadPersonnel()
      await showDialog({
        type: 'success',
        title: 'Personnel records deleted',
        message: `${response.affectedCount} personnel record${response.affectedCount === 1 ? ' was' : 's were'} deleted successfully.`,
        confirmLabel: 'OK',
      })
    } catch (error: unknown) {
      await showDialog({
        type: 'error',
        title: 'Bulk delete blocked',
        message: extractApiErrorMessage(error, 'No personnel records were deleted. Check whether the selected records are still in use and try again.'),
        confirmLabel: 'OK',
      })
    }
  }

  return { deleteSelectedPersonnel }
}
