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
