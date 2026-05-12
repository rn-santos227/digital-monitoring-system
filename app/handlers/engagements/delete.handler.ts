import type { DialogInput } from '~/composables/useDialog'
import { showErrorDialog } from '~/utils/error-handling'

interface UseDeleteEngagementHandlerOptions {
  deleteEngagement: (id: string) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

export const useDeleteEngagementHandler = ({
  deleteEngagement,
  showDialog,
}: UseDeleteEngagementHandlerOptions) => {
  const onDeleteEngagement = async (id: string) => {
    const confirmation = await showDialog({
      type: 'question',
      title: 'Delete engagement',
      message: 'Are you sure you want to delete this engagement profile?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })

    if (!confirmation.confirmed) {
      return
    }

    try {
      await deleteEngagement(id)
      await showDialog({
        type: 'success',
        title: 'Engagement deleted',
        message: 'Engagement profile has been deleted successfully.',
        confirmLabel: 'OK',
      })
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Engagement deletion failed',
        error,
        fallbackMessage: 'Unable to delete engagement profile right now.',
      })
    }
  }

  return {
    onDeleteEngagement,
  }
}
