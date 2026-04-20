import type { Ref } from 'vue'

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
