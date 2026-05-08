import type { DialogInput } from '~/composables/useDialog'
import { showErrorDialog } from '~/utils/error-handling'

const DELETE_RANK_DIALOG: DialogInput = Object.freeze({
  type: 'warning',
  title: 'Delete rank record?',
  message: 'This action cannot be undone. Do you want to continue?',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
})

const DELETE_RANK_CANCELLED_DIALOG: DialogInput = Object.freeze({
  type: 'warning',
  title: 'Delete cancelled',
  message: 'Rank deletion was cancelled.',
  confirmLabel: 'OK',
})

const DELETE_RANK_SUCCESS_DIALOG: DialogInput = Object.freeze({
  type: 'success',
  title: 'Rank deleted',
  message: 'Rank record has been deleted successfully.',
  confirmLabel: 'OK',
})

interface UseDeleteRankHandlerOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  deleteRank: (id: string) => Promise<void>
  onDeleteSuccess?: () => void | Promise<void>
  onDeleteCancelled?: () => void | Promise<void>
}

export const useDeleteRankHandler = ({
  showDialog,
  deleteRank,
  onDeleteSuccess,
  onDeleteCancelled,
}: UseDeleteRankHandlerOptions) => {
  const onDeleteRank = async (rankId: string) => {
    const result = await showDialog(DELETE_RANK_DIALOG)
    if (!result.confirmed) {
      await onDeleteCancelled?.()
      await showDialog(DELETE_RANK_CANCELLED_DIALOG)
      return
    }

    try {
      await deleteRank(rankId)
      await onDeleteSuccess?.()
      await showDialog(DELETE_RANK_SUCCESS_DIALOG)
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Rank deletion failed',
        error,
        fallbackMessage: 'Unable to delete rank record right now.',
      })
    }
  }

  return {
    onDeleteRank,
  }
}
