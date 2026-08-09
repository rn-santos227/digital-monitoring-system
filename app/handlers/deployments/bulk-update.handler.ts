import type { Ref } from "vue";
import type { DialogInput, DialogResult } from "~/composables/useDialog";
import type { DeploymentBulkUpdateValues } from "~/types/domain/deployment";
import { extractApiErrorMessage } from "~/utils/api-request";
import { updateBulkRecordsEndpoint } from "~/utils/bulk-management-endpoints";

interface BulkUpdateDeploymentsHandlerOptions {
  domain: "deployments" | "deployment-records";
  selectedIds: Ref<string[]>;
  isModalOpen: Ref<boolean>;
  errorMessage: Ref<string>;
  reload: () => Promise<void>;
  showDialog: (input: DialogInput) => Promise<DialogResult>;
}

export const useBulkUpdateDeploymentsHandler = ({
  domain,
  selectedIds,
  isModalOpen,
  errorMessage,
  reload,
  showDialog,
}: BulkUpdateDeploymentsHandlerOptions) => {
  const label = domain === "deployments" ? "deployment" : "deployment record";

  const openBulkUpdateModal = () => {
    errorMessage.value = "";
    isModalOpen.value = true;
  };

  const closeBulkUpdateModal = () => {
    errorMessage.value = "";
    isModalOpen.value = false;
  };
}
