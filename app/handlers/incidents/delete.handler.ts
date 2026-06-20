import type { DialogInput } from '~/composables/useDialog'
import { showErrorDialog } from '~/utils/error-handling'

interface UseDeleteEquipmentIncidentHandlerOptions {
  deleteEquipmentIncident: (id: string) => Promise<void>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

