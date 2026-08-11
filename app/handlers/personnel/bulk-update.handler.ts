import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { PersonnelBulkUpdateValues } from '~/types/domain/personnel'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdatePersonnelHandlerOptions {
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdatePersonnelHandler = (options: BulkUpdatePersonnelHandlerOptions) => {
  const closeBulkUpdatePersonnelModal = () => {
    options.errorMessage.value = ''
    options.isModalOpen.value = false
  }

}
