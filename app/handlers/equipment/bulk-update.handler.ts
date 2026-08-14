import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { EquipmentBulkUpdateValues } from '~/types/domain/equipment'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

type EquipmentBulkDomain =
  | 'equipment-categories'
  | 'equipment-items'
  | 'equipment-assets'
  | 'equipment-issuances'

interface BulkUpdateEquipmentHandlerOptions {
  domain: EquipmentBulkDomain
  label: string
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdateEquipmentHandler = (
  options: BulkUpdateEquipmentHandlerOptions,
) => {
  const openBulkUpdateEquipmentModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = true
  }

  const closeBulkUpdateEquipmentModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = false
  }
}
