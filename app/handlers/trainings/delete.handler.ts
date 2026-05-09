import type { Ref } from 'vue'
import { showErrorDialog } from '~/utils/error-handling'

interface UseDeleteTrainingHandlerOptions {
  deleteTraining: (id: string) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  onDeleteSuccess?: () => void
  onDeleteCancelled?: () => void
}

interface UseDeleteTrainingCategoryHandlerOptions {
  deleteTrainingCategory: (id: string) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  onDeleteSuccess?: () => void
  onDeleteCancelled?: () => void
}

interface UseDeleteTrainingRecordHandlerOptions {
  deleteTrainingRecord: (id: string) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  onDeleteSuccess?: () => void
  onDeleteCancelled?: () => void
}

export const useDeleteTrainingHandler = ({
  deleteTraining,
  showDialog,
  onDeleteSuccess,
  onDeleteCancelled,
}: UseDeleteTrainingHandlerOptions) => {
  const onDeleteTraining = async (trainingId: string) => {
    const result = await showDialog({
      type: 'warning',
      title: 'Delete training record?',
      message: 'This action cannot be undone. Do you want to continue?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })

    if (!result.confirmed) {
      onDeleteCancelled?.()
      return
    }

    try {
      await deleteTraining(trainingId)
      onDeleteSuccess?.()
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Training deletion failed',
        error,
        fallbackMessage: 'Unable to delete training record right now.',
      })
    }
  }

  return {
    onDeleteTraining,
  }
}

export const useDeleteTrainingCategoryHandler = ({
  deleteTrainingCategory,
  showDialog,
  onDeleteSuccess,
  onDeleteCancelled,
}: UseDeleteTrainingCategoryHandlerOptions) => {
  const onDeleteTrainingCategory = async (categoryId: string) => {
    const result = await showDialog({
      type: 'warning',
      title: 'Delete training category?',
      message: 'This action cannot be undone. Do you want to continue?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })

    if (!result.confirmed) {
      onDeleteCancelled?.()
      return
    }

    try {
      await deleteTrainingCategory(categoryId)
      onDeleteSuccess?.()
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Training category deletion failed',
        error,
        fallbackMessage: 'Unable to delete training category right now.',
      })
    }
  }

  return {
    onDeleteTrainingCategory,
  }
}

export const useDeleteTrainingRecordHandler = ({
  deleteTrainingRecord,
  showDialog,
  onDeleteSuccess,
  onDeleteCancelled,
}: UseDeleteTrainingRecordHandlerOptions) => {
  const onDeleteTrainingRecord = async (recordId: string) => {
    const result = await showDialog({
      type: 'warning',
      title: 'Delete training record?',
      message: 'This action cannot be undone. Do you want to continue?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })

    if (!result.confirmed) {
      onDeleteCancelled?.()
      return
    }

    try {
      await deleteTrainingRecord(recordId)
      onDeleteSuccess?.()
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Training record deletion failed',
        error,
        fallbackMessage: 'Unable to delete training record right now.',
      })
    }
  }

  return {
    onDeleteTrainingRecord,
  }
}
