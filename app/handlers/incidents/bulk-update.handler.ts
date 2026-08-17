import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { EquipmentIncidentBulkUpdateValues } from '~/types/domain/incident'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdateIncidentsHandlerOptions {
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  isSubmitting: Ref<boolean>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdateIncidentsHandler = (options: BulkUpdateIncidentsHandlerOptions) => {
  const openBulkUpdateIncidentsModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = true
  }

}
