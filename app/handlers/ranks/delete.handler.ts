import type { DialogInput } from '~/composables/useDialog'
import { showErrorDialog } from '~/utils/error-handling'

const DELETE_RANK_DIALOG: DialogInput = Object.freeze({
  type: 'warning',
  title: 'Delete rank record?',
  message: 'This action cannot be undone. Do you want to continue?',
  confirmLabel: 'Delete',
  cancelLabel: 'Cancel',
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
      return
    }

    try {
      await deleteRank(rankId)
      await onDeleteSuccess?.()
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
