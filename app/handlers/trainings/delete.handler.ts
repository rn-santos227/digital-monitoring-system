import type { Ref } from 'vue'
import type { TrainingCategorySearchQuery, TrainingRecordSearchQuery, TrainingSearchQuery } from '~/types/domain/training'
import { showErrorDialog } from '~/utils/error-handling'

interface UseDeleteTrainingHandlerOptions {
  deleteTraining: (id: string) => Promise<void>
  loadTrainings: (page?: number, nextFilters?: Partial<TrainingSearchQuery>, pageSize?: number) => Promise<void>
  trainingFilters: Ref<Partial<TrainingSearchQuery>>
  kpiRefreshKey: Ref<number>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  onDeleteSuccess?: () => void
  onDeleteCancelled?: () => void
}

interface UseDeleteTrainingCategoryHandlerOptions {
  deleteTrainingCategory: (id: string) => Promise<void>
  loadTrainingCategories: (page?: number, nextFilters?: Partial<TrainingCategorySearchQuery>, pageSize?: number) => Promise<void>
  categoryFilters: Ref<Partial<TrainingCategorySearchQuery>>
  kpiRefreshKey: Ref<number>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  onDeleteSuccess?: () => void
  onDeleteCancelled?: () => void
}

interface UseDeleteTrainingRecordHandlerOptions {
  deleteTrainingRecord: (id: string) => Promise<void>
  loadTrainingRecords: (page?: number, nextFilters?: Partial<TrainingRecordSearchQuery>, pageSize?: number) => Promise<void>
  trainingRecordFilters: Ref<Partial<TrainingRecordSearchQuery>>
  trainingRecordsPageSize: Ref<number>
  kpiRefreshKey: Ref<number>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  onDeleteSuccess?: () => void
  onDeleteCancelled?: () => void
}

export const useDeleteTrainingHandler = ({
  deleteTraining,
  loadTrainings,
  trainingFilters,
  kpiRefreshKey,
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
      await loadTrainings(1, trainingFilters.value)
      kpiRefreshKey.value += 1
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
  loadTrainingCategories,
  categoryFilters,
  kpiRefreshKey,
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
      await loadTrainingCategories(1, categoryFilters.value)
      kpiRefreshKey.value += 1
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
  loadTrainingRecords,
  trainingRecordFilters,
  trainingRecordsPageSize,
  kpiRefreshKey,
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
      await loadTrainingRecords(1, trainingRecordFilters.value, trainingRecordsPageSize.value)
      kpiRefreshKey.value += 1
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
