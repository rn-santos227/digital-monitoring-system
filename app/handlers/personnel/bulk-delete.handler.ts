import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'
import { deleteBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkDeletePersonnelHandlerOptions {
  selectedIds: Ref<string[]>
  loadPersonnel: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeletePersonnelHandler = ({ selectedIds, loadPersonnel, showDialog }: BulkDeletePersonnelHandlerOptions) => {
  const deleteSelectedPersonnel = async () => {

  }
}
