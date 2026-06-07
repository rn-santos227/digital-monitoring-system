import type { Ref } from 'vue'
import { useDeploymentSearchHandlers } from './search.handler'
import type {
  DeploymentManagementListItem,
  DeploymentManagementSearchQuery,
  DeploymentManagementTabId,
} from '~/types/domain/deployment'

const DEPLOYMENT_MANAGEMENT_TAB_IDS: readonly DeploymentManagementTabId[] = ['records', 'deployments']

export const useDeploymentManagementPageHandlers = (
  activeTab: Ref<DeploymentManagementTabId>,
  deploymentFilters: Ref<Partial<DeploymentManagementSearchQuery>>,
  deploymentRecordFilters: Ref<Partial<DeploymentManagementSearchQuery>>,
) => {
  const handleTabChange = (nextTab: string) => {
    if (DEPLOYMENT_MANAGEMENT_TAB_IDS.includes(nextTab as DeploymentManagementTabId)) {
      activeTab.value = nextTab as DeploymentManagementTabId
    }
  }

  const { handleDeploymentFilterApply, handleDeploymentFilterReset } = useDeploymentSearchHandlers(deploymentFilters)
  const {
    handleDeploymentFilterApply: handleDeploymentRecordFilterApply,
    handleDeploymentFilterReset: handleDeploymentRecordFilterReset,
  } = useDeploymentSearchHandlers(deploymentRecordFilters)

  return {
    handleTabChange,
    handleDeploymentFilterApply,
    handleDeploymentFilterReset,
    handleDeploymentRecordFilterApply,
    handleDeploymentRecordFilterReset,
  }
}

interface UseDeploymentTableActionHandlersOptions {
  selectedDeployment: Ref<DeploymentManagementListItem | null>
  selectedDeploymentRecord: Ref<DeploymentManagementListItem | null>
  isUpdateDeploymentDetailModalOpen: Ref<boolean>
  isUpdateDeploymentLocationModalOpen: Ref<boolean>
  isViewDeploymentModalOpen: Ref<boolean>
  isUpdateDeploymentRecordModalOpen: Ref<boolean>
  isUpdateDeploymentRecordLocationModalOpen: Ref<boolean>
  getDeploymentById: (id: string) => Promise<DeploymentManagementListItem>
  getDeploymentRecordById: (id: string) => Promise<DeploymentManagementListItem>
  onViewDeploymentAction: (row: Partial<DeploymentManagementListItem>) => Promise<unknown>
  onViewDeploymentRecordAction: (row: Record<string, unknown>) => Promise<unknown>
  onOpenUpdateDeploymentModal: (
    row: Partial<DeploymentManagementListItem>,
  ) => Promise<unknown>
  onDeleteDeployment: (row: Record<string, unknown>) => Promise<unknown>
}

export const useDeploymentTableActionHandlers = ({
  selectedDeployment,
  selectedDeploymentRecord,
  isUpdateDeploymentDetailModalOpen,
  isUpdateDeploymentLocationModalOpen,
  isViewDeploymentModalOpen,
  isUpdateDeploymentRecordModalOpen,
  isUpdateDeploymentRecordLocationModalOpen,
  getDeploymentById,
  getDeploymentRecordById,
  onViewDeploymentAction,
  onViewDeploymentRecordAction,
  onOpenUpdateDeploymentModal,
  onDeleteDeployment,
}: UseDeploymentTableActionHandlersOptions) => {
  const onDeploymentRecordsTableAction = async ({
    actionKey,
    row,
  }: {
    actionKey: string
    row: Record<string, unknown>
  }) => {
    const id = String(row.id ?? '')

    if (!id) {
      return
    }

    if (actionKey === 'view-deployment-record') {
      await onViewDeploymentRecordAction(row)
      return
    }

    if (actionKey === 'edit-deployment-record') {
      selectedDeploymentRecord.value = await getDeploymentRecordById(id)
      isUpdateDeploymentRecordModalOpen.value = true
      return
    }

    if (actionKey === 'edit-deployment-record-location') {
      selectedDeploymentRecord.value = await getDeploymentRecordById(id)
      isUpdateDeploymentRecordLocationModalOpen.value = true
    }
  }

  const onDeploymentsTableAction = async ({
    actionKey,
    row,
  }: {
    actionKey: string
    row: Record<string, unknown>
  }) => {
    const id = String(row.id ?? '')

    if (!id) {
      return
    }

    if (actionKey === 'view-deployment') {
      isUpdateDeploymentDetailModalOpen.value = false
      isUpdateDeploymentLocationModalOpen.value = false
      await onViewDeploymentAction(row)
      return
    }

    if (actionKey === 'edit-deployment-details') {
      isUpdateDeploymentLocationModalOpen.value = false
      isViewDeploymentModalOpen.value = false
      await onOpenUpdateDeploymentModal(row)
      return
    }

    if (actionKey === 'edit-deployment-location') {
      selectedDeployment.value = await getDeploymentById(id)
      isUpdateDeploymentDetailModalOpen.value = false
      isViewDeploymentModalOpen.value = false
      isUpdateDeploymentLocationModalOpen.value = true
      return
    }

    if (actionKey === 'delete-deployment') {
      await onDeleteDeployment(row)
    }
  }

  return {
    onDeploymentRecordsTableAction,
    onDeploymentsTableAction,
  }
}
