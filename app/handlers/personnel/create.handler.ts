import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'

interface PersonnelBatchUploadResult {
  insertedCount: number
  totalCount: number
}

export const useCreatePersonnelModalHandler = (isOpen: Ref<boolean>) => {
  const openCreatePersonnelModal = () => {
    isOpen.value = true
  }

  const closeCreatePersonnelModal = () => {
    isOpen.value = false
  }

  return {
    openCreatePersonnelModal,
    closeCreatePersonnelModal,
  }
}

interface UsePersonnelBatchUploadHandlerOptions {
  isSubmitting: Ref<boolean>
  processedCount: Ref<number>
  totalCount: Ref<number>
  isModalOpen: Ref<boolean>
  uploadPersonnelBatch: (
    file: File,
    employmentStatusId: string,
    serviceStatusId: string,
    onProgress?: (processedCount: number, totalCount: number) => void,
  ) => Promise<PersonnelBatchUploadResult>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

export const usePersonnelBatchUploadHandler = ({
  isSubmitting,
  processedCount,
  totalCount,
  isModalOpen,
  uploadPersonnelBatch,
  showDialog,
}: UsePersonnelBatchUploadHandlerOptions) => {
  const handleBatchUploadPersonnel = async ({
    file,
    employmentStatusId,
    serviceStatusId,
  }: {
    file: File
    employmentStatusId: string
    serviceStatusId: string
  }) => {
    isSubmitting.value = true
    processedCount.value = 0
    totalCount.value = 0

    try {
      const response = await uploadPersonnelBatch(
        file,
        employmentStatusId,
        serviceStatusId,
        (nextProcessedCount, nextTotalCount) => {
          processedCount.value = nextProcessedCount
          totalCount.value = nextTotalCount
        },
      )

      isModalOpen.value = false
      await showDialog({
        type: 'success',
        title: 'Batch upload complete',
        message: `${response.insertedCount} of ${response.totalCount} personnel records were inserted successfully.`,
        confirmLabel: 'Close',
        cancelLabel: 'Dismiss',
      })
    } catch {
      await showDialog({
        type: 'error',
        title: 'Personnel batch upload failed',
        message: 'Unable to upload personnel batch right now.',
        confirmLabel: 'OK',
      })
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    handleBatchUploadPersonnel,
  }
}
