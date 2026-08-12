import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { AccountTypeBulkUpdateValues } from '~/types/domain/users'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdateAccountTypesHandlerOptions {

}
