import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'
import { deleteBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkDeleteRanksHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeleteRanksHandler = ({
  selectedIds,
  reload,
  showDialog,
}: BulkDeleteRanksHandlerOptions) => {
  const deleteSelectedRanks = async () => {

  }

  return { deleteSelectedRanks }
}
