import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'
import { deleteBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkDeleteTrainingCategoriesHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

interface BulkDeleteTrainingsHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

interface BulkDeleteTrainingRecordsHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeleteTrainingCategoriesHandler = ({
  selectedIds,
  reload,
  showDialog,
}: BulkDeleteTrainingCategoriesHandlerOptions) => {
  const deleteSelectedTrainingCategories = async () => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      return
    }

    const result = await showDialog({
      type: 'question',
      title: 'Proceed with bulk delete?',
      message: `Are you sure you want to delete ${ids.length} selected ${ids.length === 1 ? 'training category' : 'training categories'}? This action cannot be undone. For safety, no records will be deleted if any selection is missing or is referenced by another record.`,
      confirmLabel: 'Yes, delete selected',
      cancelLabel: 'No, keep records',
    })
    if (!result.confirmed) {
      return
    }

    try {
      const response = await deleteBulkRecordsEndpoint('training-categories', ids)
      selectedIds.value = []
      await reload()
      await showDialog({
        type: 'success',
        title: 'Training categories deleted',
        message: `${response.affectedCount} ${response.affectedCount === 1 ? 'training category' : 'training categories'} ${response.affectedCount === 1 ? 'was' : 'were'} deleted successfully.`,
        confirmLabel: 'OK',
      })
    } catch (error: unknown) {
      await showDialog({
        type: 'error',
        title: 'Bulk delete blocked',
        message: extractApiErrorMessage(
          error,
          'No training categories were deleted. Check whether the selected records are still in use and try again.',
        ),
        confirmLabel: 'OK',
      })
    }
  }

  return { deleteSelectedTrainingCategories }
}

export const useBulkDeleteTrainingsHandler = ({
  selectedIds,
  reload,
  showDialog,
}: BulkDeleteTrainingsHandlerOptions) => {
  const deleteSelectedTrainings = async () => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      return
    }

    const result = await showDialog({
      type: 'question',
      title: 'Proceed with bulk delete?',
      message: `Are you sure you want to delete ${ids.length} selected ${ids.length === 1 ? 'training' : 'trainings'}? This action cannot be undone. For safety, no records will be deleted if any selection is missing or is referenced by another record.`,
      confirmLabel: 'Yes, delete selected',
      cancelLabel: 'No, keep records',
    })
    if (!result.confirmed) {
      return
    }

    try {
      const response = await deleteBulkRecordsEndpoint('trainings', ids)
      selectedIds.value = []
      await reload()
      await showDialog({
        type: 'success',
        title: 'Trainings deleted',
        message: `${response.affectedCount} ${response.affectedCount === 1 ? 'training' : 'trainings'} ${response.affectedCount === 1 ? 'was' : 'were'} deleted successfully.`,
        confirmLabel: 'OK',
      })
    } catch (error: unknown) {
      await showDialog({
        type: 'error',
        title: 'Bulk delete blocked',
        message: extractApiErrorMessage(
          error,
          'No trainings were deleted. Check whether the selected records are still in use and try again.',
        ),
        confirmLabel: 'OK',
      })
    }
  }

  return { deleteSelectedTrainings }
}

export const useBulkDeleteTrainingRecordsHandler = ({
  selectedIds,
  reload,
  showDialog,
}: BulkDeleteTrainingRecordsHandlerOptions) => {
  const deleteSelectedTrainingRecords = async () => {
   const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      return
    }

    const result = await showDialog({
      type: 'question',
      title: 'Proceed with bulk delete?',
      message: `Are you sure you want to delete ${ids.length} selected ${ids.length === 1 ? 'training record' : 'training records'}? This action cannot be undone. For safety, no records will be deleted if any selection is missing or is referenced by another record.`,
      confirmLabel: 'Yes, delete selected',
      cancelLabel: 'No, keep records',
    })

    if (!result.confirmed) {
      return
    }

    try {

    } catch (error: unknown) {

    }
  }

  return { deleteSelectedTrainingRecords }
}
