import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'
import { deleteBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkDeleteAccountTypesHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeleteAccountTypesHandler = ({
  selectedIds,
  reload,
  showDialog,
}: BulkDeleteAccountTypesHandlerOptions) => {
  const deleteSelectedAccountTypes = async () => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      return
    }

    const result = await showDialog({
      type: 'question',
      title: 'Proceed with bulk delete?',
      message: `Are you sure you want to delete ${ids.length} selected ${ids.length === 1 ? 'account type' : 'account types'}? This action cannot be undone. For safety, no records will be deleted if any selection is missing or is referenced by another record.`,
      confirmLabel: 'Yes, delete selected',
      cancelLabel: 'No, keep records',
    })
    if (!result.confirmed) {
      return
    }

    try {
      const response = await deleteBulkRecordsEndpoint('account-types', ids)
      selectedIds.value = []
      await reload()
      await showDialog({
        type: 'success',
        title: 'Account types deleted',
        message: `${response.affectedCount} ${response.affectedCount === 1 ? 'account type' : 'account types'} ${response.affectedCount === 1 ? 'was' : 'were'} deleted successfully.`,
        confirmLabel: 'OK',
      })
    } catch (error: unknown) {
      await showDialog({
        type: 'error',
        title: 'Bulk delete blocked',
        message: extractApiErrorMessage(
          error,
          'No account types were deleted. Check whether the selected records are still in use and try again.',
        ),
        confirmLabel: 'OK',
      })
    }
  }

  return { deleteSelectedAccountTypes }
}
