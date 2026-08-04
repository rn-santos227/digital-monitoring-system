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

    const result = await showDialog({
      type: 'question',
      title: 'Proceed with bulk delete?',
      message: `Are you sure you want to delete ${ids.length} selected ${ids.length === 1 ? 'incident' : 'incidents'}? This action cannot be undone. For safety, no records will be deleted if any selection is missing or is referenced by another record.`,
      confirmLabel: 'Yes, delete selected',
      cancelLabel: 'No, keep records',
    })
    if (!result.confirmed) {
      return
    }


    try {
      const response = await deleteBulkRecordsEndpoint('incidents', ids)
      selectedIds.value = []
      await reload()
      await showDialog({
        type: 'success',
        title: 'Incidents deleted',
        message: `${response.affectedCount} ${response.affectedCount === 1 ? 'incident' : 'incidents'} ${response.affectedCount === 1 ? 'was' : 'were'} deleted successfully.`,
        confirmLabel: 'OK',
      })
    } catch (error: unknown) {
      await showDialog({
        type: 'error',
        title: 'Bulk delete blocked',
        message: extractApiErrorMessage(
          error,
          'No incidents were deleted. Check whether the selected records are still in use and try again.',
        ),
        confirmLabel: 'OK',
      })
    }
  }

  return { deleteSelectedIncidents }
}
