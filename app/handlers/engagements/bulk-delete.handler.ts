import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import { extractApiErrorMessage } from '~/utils/api-request'
import { deleteBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkDeleteEngagementsHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

interface BulkDeleteEngagementRecordsHandlerOptions {
  selectedIds: Ref<string[]>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkDeleteEngagementRecordsHandler = ({
  selectedIds,
  reload,
  showDialog,
}: BulkDeleteEngagementRecordsHandlerOptions) => {
  const deleteSelectedEngagementRecords = async () => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
  }

  return { deleteSelectedEngagementRecords }
}
