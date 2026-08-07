import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'

interface BulkDeleteUsersHandlerOptions {
  selectedIds: Ref<string[]>
  deleteUserProfile: (id: string) => Promise<void>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeleteUsersHandler = ({
  selectedIds,
  deleteUserProfile,
  reload,
  showDialog,
}: BulkDeleteUsersHandlerOptions) => {
  const deleteSelectedUsers = async () => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      return
    }

    const result = await showDialog({
      type: 'question',
      title: 'Proceed with bulk delete?',
      message: `Are you sure you want to delete ${ids.length} selected user profile${ids.length === 1 ? '' : 's'}? This action cannot be undone.`,
      confirmLabel: 'Yes, delete selected',
      cancelLabel: 'No, keep records',
    })

    if (!result.confirmed) {
      return
    }

    try {
      for (const id of ids) {
        await deleteUserProfile(id)
      }
      selectedIds.value = []
      await reload()
      await showDialog({
        type: 'success',
        title: 'User profiles deleted',
        message: `${ids.length} user profile${ids.length === 1 ? ' was' : 's were'} deleted successfully.`,
        confirmLabel: 'OK',
      })
    } catch (error: unknown) {
      await reload()
      await showDialog({
        type: 'error',
        title: 'Bulk delete stopped',
        message: extractApiErrorMessage(error, 'The remaining user profiles were not deleted. The list has been refreshed to show the current state.'),
        confirmLabel: 'OK',
      })
    }
  }

  return { deleteSelectedUsers }
}
