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
