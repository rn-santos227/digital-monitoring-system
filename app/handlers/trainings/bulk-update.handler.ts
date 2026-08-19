import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { TrainingBulkUpdateValuesByDomain, TrainingBulkUpdateDomain } from '~/types/domain/training'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdateTrainingsHandlerOptions<TDomain extends TrainingBulkUpdateDomain> {

}
