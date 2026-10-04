import type { DialogInput } from '~/composables/useDialog'

interface DeleteDialogCallbacksOptions {
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  onRefresh: () => Promise<void>
  successTitle: string
  successMessage: string
  cancelledMessage: string
}

export const createDeleteDialogCallbacks = ({
  showDialog,
  onRefresh,
  successTitle,
  successMessage,
  cancelledMessage,
}: DeleteDialogCallbacksOptions) => ({
  onDeleteSuccess: async () => {
    await onRefresh()
    await showDialog({
      type: 'success',
      title: successTitle,
      message: successMessage,
      confirmLabel: 'OK',
    })
  },
  onDeleteCancelled: async () => {
    await showDialog({
      type: 'warning',
      title: 'Delete cancelled',
      message: cancelledMessage,
      confirmLabel: 'OK',
    })
  },
})
