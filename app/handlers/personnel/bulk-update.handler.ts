import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { PersonnelBulkUpdateValues } from '~/types/domain/personnel'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

