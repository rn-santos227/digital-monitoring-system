import type { DialogInput } from '~/composables/useDialog'
import { showErrorDialog } from '~/utils/error-handling'

const DELETE_PERSONNEL_DIALOG: DialogInput = Object.freeze({
  type: 'warning',
  title: 'Delete personnel record?',
  message: 'This action cannot be undone. Do you want to continue?',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
})

interface UseDeletePersonnelHandlerOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  deletePersonnel: (id: string) => Promise<void>
  onDeleteSuccess?: () => void | Promise<void>
  onDeleteCancelled?: () => void | Promise<void>
}

export const useDeletePersonnelHandler = ({
  showDialog,
  deletePersonnel,
  onDeleteSuccess,
  onDeleteCancelled,
}: UseDeletePersonnelHandlerOptions) => {
  const onDeletePersonnel = async (personnelId: string) => {
    const result = await showDialog(DELETE_PERSONNEL_DIALOG)

    if (!result.confirmed) {
      await onDeleteCancelled?.()
      return
    }

    try {
      await deletePersonnel(personnelId)
      await onDeleteSuccess?.()
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Personnel deletion failed',
        error,
        fallbackMessage: 'Unable to delete personnel record right now.',
      })
    }
  }

  return {
    onDeletePersonnel,
  }
}
