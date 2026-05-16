<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="DEPLOYMENTS_PAGE_SECTION_CLASSES">
      <header :class="DEPLOYMENTS_PAGE_HEADER_CLASSES">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900">{{ DEPLOYMENTS_PAGE_TITLE }}</h1>
          <p class="text-sm text-slate-600">{{ DEPLOYMENTS_PAGE_SUBTITLE }}</p>
        </div>
      </header>

      <div :class="DEPLOYMENTS_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          title="Total Deployments"
          subtitle="Deployment profiles available for operations."
          icon-name="map-pin"
          tone="sky"
          :value="totalDeployments"
          :loader="loadTotalDeployments"
        />
        <KpiCard
          title="Total Deployment Records"
          subtitle="Personnel deployment history records."
          icon-name="clipboard-document-list"
          tone="amber"
          :value="totalDeploymentRecords"
          :loader="loadTotalDeploymentRecords"
        />
      </div>

      <BaseTab
        :model-value="activeTab"
        :items="visibleTabItems"
        :aria-label="DEPLOYMENTS_PAGE_TABS_ARIA_LABEL"
        @update:model-value="handleTabChange"
      />

      <template v-if="activeTab === 'records'">
        <DeploymentRecordsFilter
          :model-value="deploymentRecordsFilters"
          :validation-errors="deploymentRecordsFilterValidationErrors"
          @apply="onApplyDeploymentRecordsFilter"
          @reset="onResetDeploymentRecordsFilter"
        />

        <BaseAlert v-if="deploymentRecordsError" :message="deploymentRecordsError" tone="danger" />

        <div
          v-if="authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.create)"
          :class="TRAINING_TABLE_ACTIONS_ROW_CLASSES"
        >
          <BaseButton @click="isCreateDeploymentRecordModalOpen = true">Create Deployment Record</BaseButton>
        </div>

        <DeploymentRecordsTable
          :rows="deploymentRecordRows"
          :is-loading="isDeploymentRecordsLoading"
          :current-page="deploymentRecordsPagination.page"
          :total-pages="deploymentRecordsPagination.totalPages"
          :total-items="deploymentRecordsPagination.totalItems"
          :page-size="deploymentRecordsPagination.pageSize"
          @update:current-page="onDeploymentRecordsPageChange"
          @update:page-size="onDeploymentRecordsPageSizeChange"
          @action="onDeploymentRecordsTableAction"
        />
      </template>

      <template v-else>
        <div v-if="showCreateButton" :class="TRAINING_TABLE_ACTIONS_ROW_CLASSES">
          <BaseButton @click="onOpenCreateDeploymentModal">Create Deployment</BaseButton>
        </div>
        <DeploymentsFilter
          :model-value="deploymentsFilters"
          :validation-errors="deploymentFilterValidationErrors"
          @apply="onApplyDeploymentsFilter"
          @reset="onResetDeploymentsFilter"
        />

        <BaseAlert v-if="deploymentsError" :message="deploymentsError" tone="danger" />

        <DeploymentsTable
          :rows="deploymentRows"
          :is-loading="isDeploymentsLoading"
          :current-page="deploymentsPagination.page"
          :total-pages="deploymentsPagination.totalPages"
          :total-items="deploymentsPagination.totalItems"
          :page-size="deploymentsPagination.pageSize"
          :show-actions="activeTab === 'deployments'"
          @action="onDeploymentsTableAction"
          @update:current-page="onDeploymentsPageChange"
          @update:page-size="onDeploymentsPageSizeChange"
        />
      </template>

      <CreateDeploymentModal
        v-if="isCreateDeploymentModalOpen"
        :is-submitting="isDeploymentsLoading"
        :error-message="createDeploymentErrorMessage"
        @close="onCloseCreateDeploymentModal"
        @submit="onSubmitCreateDeployment"
      />

      <CreateDeploymentRecordModal
        v-if="isCreateDeploymentRecordModalOpen"
        :is-submitting="isDeploymentRecordsLoading"
        @close="onCloseCreateDeploymentRecordModal"
        @submit="onSubmitCreateDeploymentRecord"
      />

      <UpdateDeploymentDetailModal
        v-if="isUpdateDeploymentDetailModalOpen && selectedDeployment"
        :initial-values="selectedDeploymentFormValues"
        :is-submitting="isDeploymentsLoading"
        :error-message="updateDeploymentErrorMessage"
        @close="onCloseUpdateDeploymentModal"
        @submit="onSubmitUpdateDeploymentDetails"
      />

      <UpdateDeploymentLocationModal
        v-if="isUpdateDeploymentLocationModalOpen && selectedDeployment"
        :initial-values="selectedDeploymentFormValues"
        :is-submitting="isDeploymentsLoading"
        :error-message="updateDeploymentErrorMessage"
        @close="onCloseUpdateDeploymentModal"
        @submit="onSubmitUpdateDeploymentLocation"
      />

      <UpdateDeploymentRecordModal
        v-if="isUpdateDeploymentRecordModalOpen && selectedDeploymentRecord"
        :initial-values="selectedDeploymentRecordFormValues"
        :is-submitting="isDeploymentRecordsLoading"
        :error-message="deploymentRecordErrorMessage"
        @close="onCloseUpdateDeploymentRecordModal"
        @submit="onSubmitUpdateDeploymentRecord"
      />

      <ViewDeploymentModal
        v-if="isViewDeploymentModalOpen && selectedDeployment"
        :deployment="selectedDeployment"
        @close="onCloseViewDeploymentModal"
      />

      <ViewDeploymentRecordModal
        v-if="isViewDeploymentRecordModalOpen && selectedDeploymentRecord"
        :deployment-record="selectedDeploymentRecord"
        @close="onCloseViewDeploymentRecordModal"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import KpiCard from '~/components/general/KpiCard.vue'
import DeploymentsFilter from '~/components/deployments/DeploymentsFilter.vue'
import DeploymentRecordsFilter from '~/components/deployments/DeploymentRecordsFilter.vue'
import DeploymentsTable from '~/components/deployments/DeploymentsTable.vue'
import DeploymentRecordsTable from '~/components/deployments/DeploymentRecordsTable.vue'
import CreateDeploymentRecordModal from '~/components/deployments/CreateDeploymentRecordModal.vue'
import UpdateDeploymentRecordModal from '~/components/deployments/UpdateDeploymentRecordModal.vue'
import ViewDeploymentRecordModal from '~/components/deployments/ViewDeploymentRecordModal.vue'
import CreateDeploymentModal from '~/components/deployments/CreateDeploymentModal.vue'
import UpdateDeploymentDetailModal from '~/components/deployments/UpdateDeploymentDetailModal.vue'
import UpdateDeploymentLocationModal from '~/components/deployments/UpdateDeploymentLocationModal.vue'
import ViewDeploymentModal from '~/components/deployments/ViewDeploymentModal.vue'
import { useDeploymentRecords } from '~/composables/useDeploymentRecords'
import { useDeployments } from '~/composables/useDeployments'
import {
  DEPLOYMENTS_PAGE_KPI_GRID_CLASSES,
  DEPLOYMENTS_PAGE_SECTION_CLASSES,
  DEPLOYMENTS_PAGE_SUBTITLE,
  DEPLOYMENTS_PAGE_TAB_ITEMS,
  DEPLOYMENTS_PAGE_TAB_REQUIRED_PERMISSIONS,
  DEPLOYMENTS_PAGE_TABS_ARIA_LABEL,
  DEPLOYMENTS_PAGE_TITLE,
} from '~/constants/page.constants'
import { DEPLOYMENT_PRIVILEGES } from '~/constants/privileges.constants'
import {
  APP_MAIN_CONTENT_CLASSES,
  DEPLOYMENTS_PAGE_HEADER_CLASSES,
  TRAINING_TABLE_ACTIONS_ROW_CLASSES
} from '~/constants/shared.constants'
import { useDialog } from '~/composables/useDialog'
import { useToast } from '~/composables/useToast'
import {
  useCreateDeploymentHandler,
  useDeleteDeploymentHandler,
  useCreateDeploymentRecordHandler,
  useDeleteDeploymentRecordHandler,
  useDeploymentManagementPageHandlers,
  useUpdateDeploymentHandler,
  useUpdateDeploymentRecordHandler,
  useViewDeploymentHandler,
  useViewDeploymentRecordHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { DeploymentManagementListItem, DeploymentManagementTabId } from '~/types/domain/deployment'
import type { FieldValidationMap } from '~/utils/field-validation'

const activeTab = ref<DeploymentManagementTabId>('deployments')
const hasLoadedDeployments = ref(false)
const hasLoadedDeploymentRecords = ref(false)
const deploymentFilterValidationErrors = ref<FieldValidationMap>({})
const deploymentRecordsFilterValidationErrors = ref<FieldValidationMap>({})
const createDeploymentErrorMessage = ref('')
const updateDeploymentErrorMessage = ref('')
const deploymentRecordErrorMessage = ref('')
const isUpdateDeploymentDetailModalOpen = ref(false)
const isUpdateDeploymentLocationModalOpen = ref(false)
const selectedDeployment = ref<DeploymentManagementListItem | null>(null)
const isViewDeploymentModalOpen = ref(false)
const isCreateDeploymentRecordModalOpen = ref(false)
const isUpdateDeploymentRecordModalOpen = ref(false)
const isViewDeploymentRecordModalOpen = ref(false)
const selectedDeploymentRecord = ref<DeploymentManagementListItem | null>(null)
const authStore = useAuthStore()
const { showDialog } = useDialog()
const { addToast } = useToast()

const {
  filters: deploymentsFilters,
  tableRows: deploymentRows,
  pagination: deploymentsPagination,
  isLoading: isDeploymentsLoading,
  error: deploymentsError,
  loadDeployments,
  createDeployment,
  updateDeploymentDetails,
  updateDeploymentLocation,
  deleteDeployment,
  getDeploymentById,
} = useDeployments()

const {
  filters: deploymentRecordsFilters,
  tableRows: deploymentRecordRows,
  pagination: deploymentRecordsPagination,
  isLoading: isDeploymentRecordsLoading,
  error: deploymentRecordsError,
  loadDeploymentRecords,
  createDeploymentRecord,
  updateDeploymentRecord,
  deleteDeploymentRecord,
  getDeploymentRecordById,
} = useDeploymentRecords()

const totalDeployments = computed(() => deploymentsPagination.value.totalItems)
const totalDeploymentRecords = computed(() => deploymentRecordsPagination.value.totalItems)

const loadTotalDeployments = async (): Promise<KpiCardLoaderResult> => {
  if (!hasLoadedDeployments.value && authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.manage)) {
    await loadDeployments(1, deploymentsFilters.value, deploymentsPagination.value.pageSize)
    hasLoadedDeployments.value = true
  }

  return { value: totalDeployments.value }
}

const loadTotalDeploymentRecords = async (): Promise<KpiCardLoaderResult> => {
  if (!hasLoadedDeploymentRecords.value && authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.manage)) {
    await loadDeploymentRecords(1, {}, deploymentRecordsPagination.value.pageSize)
    hasLoadedDeploymentRecords.value = true
  }

  return { value: totalDeploymentRecords.value }
}

const {
  handleTabChange,
  handleDeploymentFilterApply,
  handleDeploymentFilterReset,
} = useDeploymentManagementPageHandlers(activeTab, deploymentsFilters)
const isCreateDeploymentModalOpen = ref(false)
const {
  onOpenCreateDeploymentModal,
  onCloseCreateDeploymentModal,
  onSubmitCreateDeployment,
} = useCreateDeploymentHandler({
  isCreateDeploymentModalOpen,
  createDeployment,
  showDialog,
  errorMessage: createDeploymentErrorMessage,
})

const {
  onOpenUpdateDeploymentModal,
  onCloseUpdateDeploymentModal,
  selectedDeploymentFormValues,
  onSubmitUpdateDeploymentDetails,
  onSubmitUpdateDeploymentLocation,
} = useUpdateDeploymentHandler({
  isUpdateDeploymentModalOpen: isUpdateDeploymentDetailModalOpen,
  selectedDeployment,
  updateDeploymentDetails,
  updateDeploymentLocation,
  showDialog,
  errorMessage: updateDeploymentErrorMessage,
  isUpdateDeploymentLocationModalOpen,
  getDeploymentById,
})

const { onDeleteDeployment } = useDeleteDeploymentHandler({
  showDialog,
  deleteDeployment,
  addToast,
})

const { onCloseViewDeploymentModal, onViewDeploymentAction } = useViewDeploymentHandler({
  selectedDeployment,
  isViewDeploymentModalOpen,
  getDeploymentById,
})


const { onCloseViewDeploymentRecordModal, onViewDeploymentRecordAction } = useViewDeploymentRecordHandler({
  selectedDeploymentRecord,
  isViewDeploymentRecordModalOpen,
  getDeploymentRecordById,
})

const {
  onCloseCreateDeploymentRecordModal,
  onSubmitCreateDeploymentRecord,
} = useCreateDeploymentRecordHandler({
  isCreateDeploymentRecordModalOpen,
  createDeploymentRecord,
  showDialog,
  errorMessage: deploymentRecordErrorMessage,
})

const {
  onCloseUpdateDeploymentRecordModal,
  selectedDeploymentRecordFormValues,
  onSubmitUpdateDeploymentRecord,
} = useUpdateDeploymentRecordHandler({
  isUpdateDeploymentRecordModalOpen,
  selectedDeploymentRecord,
  updateDeploymentRecord,
  showDialog,
  errorMessage: deploymentRecordErrorMessage,
})

const { onDeleteDeploymentRecord } = useDeleteDeploymentRecordHandler({
  showDialog,
  deleteDeploymentRecord,
})

const visibleTabItems = computed(() => {
  return DEPLOYMENTS_PAGE_TAB_ITEMS.filter((tabItem) => {
    const requiredPermissions = DEPLOYMENTS_PAGE_TAB_REQUIRED_PERMISSIONS[tabItem.id as keyof typeof DEPLOYMENTS_PAGE_TAB_REQUIRED_PERMISSIONS]
    return authStore.hasPermissionAccess(requiredPermissions)
  })
})

const showCreateButton = computed(() => {
  if (activeTab.value !== 'deployments') {
    return false
  }

  return authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.create)
})


const onApplyDeploymentRecordsFilter = async (value: Partial<{ term?: string; fields?: string }>) => {
  const result = handleDeploymentFilterApply(value)
  deploymentRecordsFilterValidationErrors.value = result.errors
  if (!result.isValid) {
    return
  }

  await loadDeploymentRecords(1, result.filters)
}

const onResetDeploymentRecordsFilter = async () => {
  deploymentRecordsFilterValidationErrors.value = {}
  await loadDeploymentRecords(1, {})
}

const onApplyDeploymentsFilter = async (value: Partial<{ term?: string; fields?: string }>) => {
  const result = handleDeploymentFilterApply(value)
  deploymentFilterValidationErrors.value = result.errors
  if (!result.isValid) {
    return
  }

  await loadDeployments(1, result.filters)
}

const onResetDeploymentsFilter = async () => {
  deploymentFilterValidationErrors.value = {}
  const resetFilters = handleDeploymentFilterReset()
  await loadDeployments(1, resetFilters)
}

const onDeploymentsPageChange = async (page: number) => {
  await loadDeployments(page, deploymentsFilters.value, deploymentsPagination.value.pageSize)
}

const onDeploymentsPageSizeChange = async (pageSize: number) => {
  await loadDeployments(1, deploymentsFilters.value, pageSize)
}

const onDeploymentRecordsPageChange = async (page: number) => {
  await loadDeploymentRecords(page)
}

const onDeploymentRecordsPageSizeChange = async (pageSize: number) => {
  await loadDeploymentRecords(1, {}, pageSize)
}

const onDeploymentRecordsTableAction = async (payload: { actionKey: string; row: Record<string, unknown> }) => {
  if (payload.actionKey === 'view-deployment-record') {
    const id = String(payload.row.id ?? '')
    if (!id) {
      return
    }

    await onViewDeploymentRecordAction(payload.row)
    return
  }

  if (payload.actionKey === 'edit-deployment-record') {
    const id = String(payload.row.id ?? '')
    if (!id) {
      return
    }

    selectedDeploymentRecord.value = await getDeploymentRecordById(id)
    isUpdateDeploymentRecordModalOpen.value = true
    return
  }

  if (payload.actionKey === 'delete-deployment-record') {
    await onDeleteDeploymentRecord(payload.row)
  }
}

const onDeploymentsTableAction = async (payload: { actionKey: string; row: Record<string, unknown> }) => {
  if (payload.actionKey === 'view-deployment') {
    isUpdateDeploymentDetailModalOpen.value = false
    isUpdateDeploymentLocationModalOpen.value = false
    await onViewDeploymentAction(payload.row as unknown as DeploymentManagementListItem)
    return
  }

  if (payload.actionKey === 'edit-deployment-details') {
    isUpdateDeploymentLocationModalOpen.value = false
    isViewDeploymentModalOpen.value = false
    await onOpenUpdateDeploymentModal(payload.row)
    return
  }

  if (payload.actionKey === 'edit-deployment-location') {
    selectedDeployment.value = await getDeploymentById(String(payload.row.id ?? ''))
    isUpdateDeploymentDetailModalOpen.value = false
    isViewDeploymentModalOpen.value = false
    isUpdateDeploymentLocationModalOpen.value = true
    return
  }

  if (payload.actionKey === 'delete-deployment') {
    await onDeleteDeployment(payload.row)
  }
}

watch(activeTab, async (tab) => {
  if (!authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.manage)) {
    return
  }

  if (tab === 'deployments') {
    if (hasLoadedDeployments.value) {
      return
    }
    await loadDeployments()
    hasLoadedDeployments.value = true
    return
  }

  if (hasLoadedDeploymentRecords.value) {
    return
  }
  await loadDeploymentRecords()
  hasLoadedDeploymentRecords.value = true
}, { immediate: true })
</script>
