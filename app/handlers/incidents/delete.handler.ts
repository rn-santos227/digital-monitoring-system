import type { DialogInput } from '~/composables/useDialog'
import { showErrorDialog } from '~/utils/error-handling'

interface UseDeleteEquipmentIncidentHandlerOptions {
  deleteEquipmentIncident: (id: string) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

export const useDeleteEquipmentIncidentHandler = ({
  deleteEquipmentIncident,
  showDialog,
}: UseDeleteEquipmentIncidentHandlerOptions) => {
  const onDeleteEquipmentIncident = async (equipmentIncidentId: string) => {
    const result = await showDialog({
      type: 'warning',
      title: 'Delete equipment incident?',
      message: 'This action cannot be undone. Do you want to continue?',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    })

    if (!result.confirmed) return

    try {

    } catch (error) {

    }
  }

  return { onDeleteEquipmentIncident }
}
