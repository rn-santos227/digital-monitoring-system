import type { DialogInput } from '~/composables/useDialog'
import {
  BATTALION_DELETE_DIALOG_MESSAGE,
  BATTALION_DELETE_DIALOG_TITLE,
  UNITS_MODAL_CANCEL_LABEL,
} from '~/constants/page.constants'
import { showErrorDialog } from '~/utils/error-handling'
import { BATTALION_ACTION_KEYS } from './index.handler'

type BattalionRow = Record<string, unknown>

const DELETE_BATTALION_DIALOG: DialogInput = Object.freeze({
  type: 'warning',
  title: BATTALION_DELETE_DIALOG_TITLE,
  message: BATTALION_DELETE_DIALOG_MESSAGE,
  confirmLabel: 'Delete',
  cancelLabel: UNITS_MODAL_CANCEL_LABEL,
})

const resolveBattalionActionRowId = (row: BattalionRow): string => {
  return String(row.id ?? '')
}

interface UseDeleteBattalionHandlerOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  deleteBattalion: (id: string) => Promise<void>
  onDeleteSuccess?: () => void | Promise<void>
  onDeleteCancelled?: () => void | Promise<void>
}

export const useDeleteBattalionHandler = ({
  showDialog,
  deleteBattalion,
  onDeleteSuccess,
  onDeleteCancelled,
}: UseDeleteBattalionHandlerOptions) => {
  const onDeleteBattalionAction = async (row: BattalionRow): Promise<boolean> => {
    const selectedBattalionRowId = resolveBattalionActionRowId(row)
    if (!selectedBattalionRowId) {
      return true
    }

    const result = await showDialog(DELETE_BATTALION_DIALOG)
    if (!result.confirmed) {
      await onDeleteCancelled?.()
      return true
    }

    try {
      await deleteBattalion(selectedBattalionRowId)
      await onDeleteSuccess?.()
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Battalion deletion failed',
        error,
        fallbackMessage: 'Unable to delete battalion right now.',
      })
    }
    return true
  }

  const canHandleDeleteBattalionAction = (actionKey: string): boolean => {
    return actionKey === BATTALION_ACTION_KEYS.delete
  }

  return {
    canHandleDeleteBattalionAction,
    onDeleteBattalionAction,
  }
}
