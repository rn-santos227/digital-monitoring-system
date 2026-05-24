import { showErrorDialog } from '~/utils/error-handling'

interface UseDeleteEquipmentCategoryHandlerOptions {
  deleteEquipmentCategory: (id: string) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  onDeleteSuccess?: () => void
  onDeleteCancelled?: () => void
}

export const useDeleteEquipmentCategoryHandler = ({
  deleteEquipmentCategory,
  showDialog,
  onDeleteSuccess,
  onDeleteCancelled,
}: UseDeleteEquipmentCategoryHandlerOptions) => {
  const onDeleteEquipmentCategory = async (equipmentCategoryId: string) => {
    const result = await showDialog({
      type: 'warning',
      title: 'Delete equipment category?',
      message: 'This action cannot be undone. Do you want to continue?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })

    if (!result.confirmed) {
      onDeleteCancelled?.()
      return
    }

    try {
      await deleteEquipmentCategory(equipmentCategoryId)
      onDeleteSuccess?.()
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Equipment category deletion failed',
        error,
        fallbackMessage: 'Unable to delete equipment category right now.',
      })
    }
  }

  return {
    onDeleteEquipmentCategory,
  }
}
