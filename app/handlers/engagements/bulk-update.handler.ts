import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { EngagementBulkUpdateValues } from '~/types/domain/engagement'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdateEngagementsHandlerOptions {
  domain: 'engagements' | 'engagement-records'
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}


export const useBulkUpdateEngagementsHandler = ({
  domain,
  selectedIds,
  isModalOpen,
  errorMessage,
  reload,
  showDialog,
}: BulkUpdateEngagementsHandlerOptions) => {
  const label = domain === 'engagements' ? 'engagement' : 'engagement record'
}
