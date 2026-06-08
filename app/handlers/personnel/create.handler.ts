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
