<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="DEPLOYMENTS_PAGE_SECTION_CLASSES">
      <header :class="DEPLOYMENTS_PAGE_HEADER_CLASSES">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900">{{ DEPLOYMENTS_PAGE_TITLE }}</h1>
          <p class="text-sm text-slate-600">{{ DEPLOYMENTS_PAGE_SUBTITLE }}</p>
        </div>
      </header>

      <BaseTab
        :model-value="activeTab"
        :items="DEPLOYMENTS_PAGE_TAB_ITEMS"
        :aria-label="DEPLOYMENTS_PAGE_TABS_ARIA_LABEL"
        @update:model-value="handleTabChange"
      />

      <template v-if="activeTab === 'deployments'">
        <BaseButton v-if="activeTab === 'deployments'" @click="onOpenCreateDeploymentModal">Create Deployment</BaseButton>
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
import { ref, watch } from 'vue'
import DeploymentsFilter from '~/components/deployments/DeploymentsFilter.vue'
import DeploymentsTable from '~/components/deployments/DeploymentsTable.vue'
import CreateDeploymentModal from '~/components/deployments/CreateDeploymentModal.vue'
import { useDeploymentRecords } from '~/composables/useDeploymentRecords'
import { useDeployments } from '~/composables/useDeployments'
import {
  DEPLOYMENTS_PAGE_SECTION_CLASSES,
  DEPLOYMENTS_PAGE_SUBTITLE,
  DEPLOYMENTS_PAGE_TAB_ITEMS,
  DEPLOYMENTS_PAGE_TABS_ARIA_LABEL,
  DEPLOYMENTS_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, DEPLOYMENTS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import { useCreateDeploymentHandler, useDeploymentManagementPageHandlers } from '~/handlers'
import type { DeploymentManagementTabId } from '~/types/domain/deployment'
import type { FieldValidationMap } from '~/utils/field-validation'

const activeTab = ref<DeploymentManagementTabId>('deployments')
const deploymentFilterValidationErrors = ref<FieldValidationMap>({})
const createDeploymentErrorMessage = ref('')
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
  if (tab === 'deployments') {
    await loadDeployments()
    return
  }

  await loadDeploymentRecords()
}, { immediate: true })
</script>
