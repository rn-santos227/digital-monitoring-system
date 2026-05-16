import type { DialogInput } from '~/composables/useDialog'
import { showErrorDialog } from '~/utils/error-handling'

interface UseDeleteEngagementHandlerOptions {
  deleteEngagement: (id: string) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

interface UseDeleteEngagementRecordHandlerOptions {
  deleteEngagementRecord: (id: string) => Promise<void>
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

export const useDeleteEngagementRecordHandler = ({
  deleteEngagementRecord,
  showDialog,
}: UseDeleteEngagementRecordHandlerOptions) => {
  const onDeleteEngagementRecord = async (id: string) => {
    const confirmation = await showDialog({
      type: 'question',
      title: 'Delete engagement record',
      message: 'Are you sure you want to delete this personnel engagement record?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })

    if (!confirmation.confirmed) {
      return
    }

    try {
      await deleteEngagementRecord(id)
      await showDialog({
        type: 'success',
        title: 'Engagement record deleted',
        message: 'Personnel engagement record has been deleted successfully.',
        confirmLabel: 'OK',
      })
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Engagement record deletion failed',
        error,
        fallbackMessage: 'Unable to delete personnel engagement record right now.',
      })
    }
  }

  return {
    onDeleteEngagementRecord,
  }
}
