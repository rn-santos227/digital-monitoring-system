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
        />
        <KpiCard
          title="Total Deployment Records"
          subtitle="Personnel deployment history records."
          icon-name="clipboard-document-list"
          tone="amber"
          :value="totalDeploymentRecords"
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

        <div class="flex justify-end gap-2">
          <PrintDataListButton
            table-name="deployment_records"
            table-label="Deployment Records"
            :filters="deploymentRecordsFilters"
            :disabled="isDeploymentRecordsLoading"
            :get-print-data="handlePrintDeploymentRecords"
          />
          <BaseButton
            v-if="authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.create)"
            @click="isCreateDeploymentRecordModalOpen = true"
          >
            Create Deployment Record
          </BaseButton>
        </div>

        <DeploymentRecordsTable
          :rows="deploymentRecordRows"
          :is-loading="isDeploymentRecordsLoading"
          :current-page="deploymentRecordsPagination.page"
          :total-pages="deploymentRecordsPagination.totalPages"
          :total-items="deploymentRecordsPagination.totalItems"
          :page-size="deploymentRecordsPagination.pageSize"
          v-model:selected-row-keys="selectedDeploymentRecordIds"
          @update:current-page="onDeploymentRecordsPageChange"
          @update:page-size="onDeploymentRecordsPageSizeChange"
          @action="onDeploymentRecordsTableAction"
          @bulk-delete="deleteSelectedDeploymentRecords"
        />
      </template>

      <template v-else>
        <DeploymentsFilter
          :model-value="deploymentsFilters"
          :validation-errors="deploymentFilterValidationErrors"
          @apply="onApplyDeploymentsFilter"
          @reset="onResetDeploymentsFilter"
        />

        <div class="flex justify-end gap-2">
          <PrintDataListButton
            table-name="deployments"
            table-label="Deployments"
            :filters="deploymentsFilters"
            :disabled="isDeploymentsLoading"
            :get-print-data="handlePrintDeployments"
          />
          <BaseButton v-if="showCreateButton" @click="onOpenCreateDeploymentModal">
            Create Deployment
          </BaseButton>
        </div>

        <BaseAlert v-if="deploymentsError" :message="deploymentsError" tone="danger" />

        <DeploymentsTable
          :rows="deploymentRows"
          :is-loading="isDeploymentsLoading"
          :current-page="deploymentsPagination.page"
          :total-pages="deploymentsPagination.totalPages"
          :total-items="deploymentsPagination.totalItems"
          :page-size="deploymentsPagination.pageSize"
          :show-actions="activeTab === 'deployments'"
          v-model:selected-row-keys="selectedDeploymentIds"
          @action="onDeploymentsTableAction"
          @update:current-page="onDeploymentsPageChange"
          @update:page-size="onDeploymentsPageSizeChange"
          @bulk-delete="deleteSelectedDeployments"
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

      <UpdateDeploymentRecordLocationModal
        v-if="isUpdateDeploymentRecordLocationModalOpen && selectedDeploymentRecord"
        :initial-values="selectedDeploymentRecordFormValues"
        :is-submitting="isDeploymentRecordsLoading"
        :error-message="deploymentRecordErrorMessage"
        @close="onCloseUpdateDeploymentRecordLocationModal"
        @submit="onSubmitUpdateDeploymentRecordLocation"
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
import KpiCard from '~/components/general/KpiCard.vue'
import DeploymentsFilter from '~/components/deployments/DeploymentsFilter.vue'
import DeploymentRecordsFilter from '~/components/deployments/DeploymentRecordsFilter.vue'
import DeploymentsTable from '~/components/deployments/DeploymentsTable.vue'
import DeploymentRecordsTable from '~/components/deployments/DeploymentRecordsTable.vue'
import CreateDeploymentRecordModal from '~/components/deployments/CreateDeploymentRecordModal.vue'
import UpdateDeploymentRecordModal from '~/components/deployments/UpdateDeploymentRecordModal.vue'
import UpdateDeploymentRecordLocationModal from '~/components/deployments/UpdateDeploymentRecordLocationModal.vue'
import ViewDeploymentRecordModal from '~/components/deployments/ViewDeploymentRecordModal.vue'
import CreateDeploymentModal from '~/components/deployments/CreateDeploymentModal.vue'
import UpdateDeploymentDetailModal from '~/components/deployments/UpdateDeploymentDetailModal.vue'
import UpdateDeploymentLocationModal from '~/components/deployments/UpdateDeploymentLocationModal.vue'
import ViewDeploymentModal from '~/components/deployments/ViewDeploymentModal.vue'
import BulkUpdateDeploymentsModal from '~/components/deployments/BulkUpdateDeploymentsModal.vue'
import BulkUpdateDeploymentRecordsModal from '~/components/deployments/BulkUpdateDeploymentRecordsModal.vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
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
} from '~/constants/shared.constants'
import { useDialog } from '~/composables/useDialog'
import { useToast } from '~/composables/useToast'
import {
  useCreateDeploymentHandler,
  useDeleteDeploymentHandler,
  useBulkDeleteDeploymentRecordsHandler,
  useBulkDeleteDeploymentsHandler,
  useBulkUpdateDeploymentsHandler,
  useCreateDeploymentRecordHandler,
  useDeleteDeploymentRecordHandler,
  useDeploymentManagementPageHandlers,
  useDeploymentTableActionHandlers,
  useUpdateDeploymentHandler,
  useUpdateDeploymentRecordHandler,
  useValidatedListHandlers,
  useViewDeploymentHandler,
  useViewDeploymentRecordHandler,
  usePrintDeploymentsHandler,
  createCompleteListPrintHandler,
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
const isUpdateDeploymentRecordLocationModalOpen = ref(false)
const isViewDeploymentRecordModalOpen = ref(false)
const selectedDeploymentRecord = ref<DeploymentManagementListItem | null>(null)
const authStore = useAuthStore()

const { showDialog } = useDialog()
const { addToast } = useToast()
const { printDeploymentRecords, printDeployments } = usePrintDeploymentsHandler()

const selectedDeploymentRecordIds = ref<string[]>([])
const selectedDeploymentIds = ref<string[]>([])
const isBulkUpdateDeploymentsModalOpen = ref(false)
const isBulkUpdateDeploymentRecordsModalOpen = ref(false)
const bulkUpdateDeploymentsErrorMessage = ref('')
const bulkUpdateDeploymentRecordsErrorMessage = ref('')

const { deleteSelectedDeploymentRecords } = useBulkDeleteDeploymentRecordsHandler({
  selectedIds: selectedDeploymentRecordIds,
  reload: async () => {
    await loadDeploymentRecords()
  },
  showDialog,
})

const { deleteSelectedDeployments } = useBulkDeleteDeploymentsHandler({
  selectedIds: selectedDeploymentIds,
  reload: async () => {
    await loadDeployments()
  },
  showDialog,
})

const {
  filters: deploymentsFilters,
  tableRows: deploymentRows,
  kpis,
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
  updateDeploymentRecordLocation,
  deleteDeploymentRecord,
  getDeploymentRecordById,
} = useDeploymentRecords()

const {
  openBulkUpdateModal: openBulkUpdateDeploymentsModal,
  closeBulkUpdateModal: closeBulkUpdateDeploymentsModal,
  updateSelectedDeployments,
} = useBulkUpdateDeploymentsHandler({
  domain: 'deployments',
  selectedIds: selectedDeploymentIds,
  isModalOpen: isBulkUpdateDeploymentsModalOpen,
  errorMessage: bulkUpdateDeploymentsErrorMessage,
  reload: async () => { await loadDeployments() },
  showDialog,
})


const handlePrintDeployments = createCompleteListPrintHandler({
  rows: deploymentRows,
  pagination: deploymentsPagination,
  loadPage: (page, pageSize) => loadDeployments(page, deploymentsFilters.value, pageSize),
  printItems: printDeployments,
})

const handlePrintDeploymentRecords = createCompleteListPrintHandler({
  rows: deploymentRecordRows,
  pagination: deploymentRecordsPagination,
  loadPage: (page, pageSize) => loadDeploymentRecords(page, deploymentRecordsFilters.value, pageSize),
  printItems: printDeploymentRecords,
})

const totalDeployments = computed(() => kpis.value.totalDeployments)
const totalDeploymentRecords = computed(() => kpis.value.totalDeploymentRecords)

const {
  handleTabChange,
  handleDeploymentFilterApply,
  handleDeploymentFilterReset,
  handleDeploymentRecordFilterApply,
  handleDeploymentRecordFilterReset,
} = useDeploymentManagementPageHandlers(
  activeTab,
  deploymentsFilters,
  deploymentRecordsFilters,
)
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
  onCloseUpdateDeploymentRecordLocationModal,
  selectedDeploymentRecordFormValues,
  onSubmitUpdateDeploymentRecord,
  onSubmitUpdateDeploymentRecordLocation,
} = useUpdateDeploymentRecordHandler({
  isUpdateDeploymentRecordModalOpen,
  isUpdateDeploymentRecordLocationModalOpen,
  selectedDeploymentRecord,
  updateDeploymentRecord,
  updateDeploymentRecordLocation,
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

const {
  handleApplyFilters: onApplyDeploymentsFilter,
  handleResetFilters: onResetDeploymentsFilter,
  handlePageChange: onDeploymentsPageChange,
  handlePageSizeChange: onDeploymentsPageSizeChange,
} = useValidatedListHandlers({
  filters: deploymentsFilters,
  validationErrors: deploymentFilterValidationErrors,
  applyFilters: handleDeploymentFilterApply,
  resetFilters: handleDeploymentFilterReset,
  loadPage: loadDeployments,
  getPageSize: () => deploymentsPagination.value.pageSize,
})

const {
  handleApplyFilters: onApplyDeploymentRecordsFilter,
  handleResetFilters: onResetDeploymentRecordsFilter,
  handlePageChange: onDeploymentRecordsPageChange,
  handlePageSizeChange: onDeploymentRecordsPageSizeChange,
} = useValidatedListHandlers({
  filters: deploymentRecordsFilters,
  validationErrors: deploymentRecordsFilterValidationErrors,
  applyFilters: handleDeploymentRecordFilterApply,
  resetFilters: handleDeploymentRecordFilterReset,
  loadPage: loadDeploymentRecords,
  getPageSize: () => deploymentRecordsPagination.value.pageSize,
})

const {
  onDeploymentRecordsTableAction,
  onDeploymentsTableAction,
} = useDeploymentTableActionHandlers({
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
})

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
