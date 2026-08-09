import type { Ref } from "vue";
import type { DialogInput, DialogResult } from "~/composables/useDialog";
import type { DeploymentBulkUpdateValues } from "~/types/domain/deployment";
import { extractApiErrorMessage } from "~/utils/api-request";
import { updateBulkRecordsEndpoint } from "~/utils/bulk-management-endpoints";

interface BulkUpdateDeploymentsHandlerOptions {

}
