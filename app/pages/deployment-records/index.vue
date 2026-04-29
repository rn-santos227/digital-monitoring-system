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
          :key="`deployments-${kpiRefreshKey}`"
          title="Total Deployments"
          subtitle="Deployment profiles available for operations."
          icon-name="map-pin"
          tone="sky"
          :loader="loadTotalDeployments"
        />
        <KpiCard
          :key="`deployment-records-${kpiRefreshKey}`"
          title="Total Deployment Records"
          subtitle="Personnel deployment history records."
          icon-name="clipboard-document-list"
          tone="amber"
          :loader="loadTotalDeploymentRecords"
        />
      </div>

      <BaseTab
        :model-value="activeTab"
        :items="visibleTabItems"
        :aria-label="DEPLOYMENTS_PAGE_TABS_ARIA_LABEL"
        @update:model-value="handleTabChange"
      />

      <template v-if="activeTab === 'deployments'">
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
          @update:current-page="onDeploymentsPageChange"
          @update:page-size="onDeploymentsPageSizeChange"
        />
      </template>

      <template v-else>
        <BaseAlert v-if="deploymentRecordsError" :message="deploymentRecordsError" tone="danger" />

        <DeploymentsTable
          :rows="deploymentRecordRows"
          :is-loading="isDeploymentRecordsLoading"
          :current-page="deploymentRecordsPagination.page"
          :total-pages="deploymentRecordsPagination.totalPages"
          :total-items="deploymentRecordsPagination.totalItems"
          :page-size="deploymentRecordsPagination.pageSize"
          @update:current-page="onDeploymentRecordsPageChange"
          @update:page-size="onDeploymentRecordsPageSizeChange"
        />
      </template>

      <CreateDeploymentModal
        v-if="isCreateDeploymentModalOpen"
        :is-submitting="isDeploymentsLoading"
        :error-message="createDeploymentErrorMessage"
        @close="onCloseCreateDeploymentModal"
        @submit="onSubmitCreateDeployment"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import KpiCard from '~/components/general/KpiCard.vue'
import DeploymentsFilter from '~/components/deployments/DeploymentsFilter.vue'
import DeploymentsTable from '~/components/deployments/DeploymentsTable.vue'
import CreateDeploymentModal from '~/components/deployments/CreateDeploymentModal.vue'
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
import { APP_MAIN_CONTENT_CLASSES, DEPLOYMENTS_PAGE_HEADER_CLASSES, TRAINING_TABLE_ACTIONS_ROW_CLASSES } from '~/constants/shared.constants'
import { useDialog } from '~/composables/useDialog'
import { useCreateDeploymentHandler, useDeploymentManagementPageHandlers } from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { DeploymentManagementTabId } from '~/types/domain/deployment'
import type { FieldValidationMap } from '~/utils/field-validation'

const activeTab = ref<DeploymentManagementTabId>('deployments')
const kpiRefreshKey = ref(0)
const deploymentFilterValidationErrors = ref<FieldValidationMap>({})
const createDeploymentErrorMessage = ref('')
const authStore = useAuthStore()
const { showDialog } = useDialog()

const {
  filters: deploymentsFilters,
  tableRows: deploymentRows,
  pagination: deploymentsPagination,
  isLoading: isDeploymentsLoading,
  error: deploymentsError,
  loadDeployments,
  createDeployment,
} = useDeployments()

const {
  tableRows: deploymentRecordRows,
  pagination: deploymentRecordsPagination,
  isLoading: isDeploymentRecordsLoading,
  error: deploymentRecordsError,
  loadDeploymentRecords,
} = useDeploymentRecords()

const totalDeployments = computed(() => deploymentsPagination.value.totalItems)
const totalDeploymentRecords = computed(() => deploymentRecordsPagination.value.totalItems)

const loadTotalDeployments = async (): Promise<KpiCardLoaderResult> => {
  await loadDeployments(1, deploymentsFilters.value, deploymentsPagination.value.pageSize)
  return { value: totalDeployments.value }
}

const loadTotalDeploymentRecords = async (): Promise<KpiCardLoaderResult> => {
  await loadDeploymentRecords(1, {}, deploymentRecordsPagination.value.pageSize)
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
} = useCreateDeploymentHandler(isCreateDeploymentModalOpen, createDeployment, showDialog, createDeploymentErrorMessage)

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

watch(activeTab, async (tab) => {
  kpiRefreshKey.value += 1
  if (!authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.manage)) {
    return
  }

  if (tab === 'deployments') {
    await loadDeployments()
    return
  }

  await loadDeploymentRecords()
}, { immediate: true })
</script>
