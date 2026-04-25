<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="UNITS_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ UNITS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ UNITS_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="UNITS_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          :key="`companies-${kpiRefreshKey}`"
          title="Total Companies"
          subtitle="Tracked company units in the registry."
          icon-name="building"
          tone="violet"
          :loader="loadTotalCompanies"
        />
        <KpiCard
          :key="`battalions-${kpiRefreshKey}`"
          title="Total Battalions"
          subtitle="Tracked battalion units in the registry."
          icon-name="shield"
          tone="sky"
          :loader="loadTotalBattalions"
        />
        <KpiCard
          :key="`unassigned-personnel-${kpiRefreshKey}`"
          title="Unassigned Personnel"
          subtitle="Personnel without company assignment."
          icon-name="users"
          tone="amber"
          :loader="loadUnassignedPersonnel"
        />
      </div>

      <BaseTab
        :model-value="activeTab"
        :items="visibleTabItems"
        :aria-label="UNITS_PAGE_TABS_ARIA_LABEL"
        @update:model-value="onTabChange"
      />

      <div v-if="showCreateButton" :class="UNITS_TABLE_ACTIONS_ROW_CLASSES">
        <BaseButton @click="onCreateActionClick">
          {{ createButtonLabel }}
        </BaseButton>
      </div>

      <template v-if="activeTab === 'battalion'">
        <BattalionsFilter
          :model-value="battalionFilters"
          :validation-errors="battalionFilterValidationErrors"
          @apply="handleApplyBattalionFilters"
          @reset="handleResetBattalionFilters"
        />

        <BaseAlert
          v-if="battalionError"
          :message="battalionError"
          tone="danger"
        />

        <BattalionsTable
          :rows="battalionTableRows"
          :is-loading="isBattalionsLoading"
          :current-page="battalionPagination.page"
          :total-pages="battalionPagination.totalPages"
          :total-items="battalionPagination.totalItems"
          :page-size="battalionPagination.pageSize"
          @action="onBattalionAction"
          @update:current-page="onBattalionPageChange"
          @update:page-size="onBattalionPageSizeChange"
        />
      </template>

      <template v-else>
        <CompaniesFilter
          :model-value="companyFilters"
          :validation-errors="companyFilterValidationErrors"
          @apply="handleApplyCompanyFilters"
          @reset="handleResetCompanyFilters"
        />

        <BaseAlert
          v-if="companyError"
          :message="companyError"
          tone="danger"
        />

        <CompaniesTable
          :rows="companyTableRows"
          :is-loading="isCompaniesLoading"
          :current-page="companyPagination.page"
          :total-pages="companyPagination.totalPages"
          :total-items="companyPagination.totalItems"
          :page-size="companyPagination.pageSize"
          @action="onCompanyAction"
          @update:current-page="onCompanyPageChange"
          @update:page-size="onCompanyPageSizeChange"
        />
      </template>

      <CreateBattalionModal
        v-if="isCreateBattalionModalOpen"
        @close="onCloseCreateBattalionModal"
        @submit="handleCreateBattalion"
      />

      <UpdateBattalionModal
        v-if="isUpdateBattalionModalOpen && selectedBattalion"
        :initial-values="selectedBattalion"
        @close="onCloseUpdateBattalionModal"
        @submit="handleUpdateBattalion"
      />

      <CreateCompanyModal
        v-if="isCreateCompanyModalOpen"
        @close="onCloseCreateCompanyModal"
        @submit="handleCreateCompany"
      />

      <UpdateCompanyModal
        v-if="isUpdateCompanyModalOpen && selectedCompany"
        :initial-values="selectedCompany"
        @close="onCloseUpdateCompanyModal"
        @submit="handleUpdateCompany"
      />

      <ViewBattalionModal
        v-if="isViewBattalionModalOpen && selectedBattalionView"
        :battalion="selectedBattalionView"
        @close="onCloseViewBattalionModal"
      />

      <ViewCompanyModal
        v-if="isViewCompanyModalOpen && selectedCompanyView"
        :company="selectedCompanyView"
        @close="onCloseViewCompanyModal"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useDialog } from '~/composables/useDialog'
import KpiCard from '~/components/general/KpiCard.vue'
import CreateBattalionModal from '~/components/units/CreateBattalionModal.vue'
import UpdateBattalionModal from '~/components/units/UpdateBattalionModal.vue'
import CreateCompanyModal from '~/components/units/CreateCompanyModal.vue'
import UpdateCompanyModal from '~/components/units/UpdateCompanyModal.vue'
import ViewBattalionModal from '~/components/units/ViewBattalionModal.vue'
import ViewCompanyModal from '~/components/units/ViewCompanyModal.vue'
import BattalionsFilter from '~/components/units/BattalionsFilter.vue'
import BattalionsTable from '~/components/units/BattalionsTable.vue'
import CompaniesFilter from '~/components/units/CompaniesFilter.vue'
import CompaniesTable from '~/components/units/CompaniesTable.vue'
import { useBattalions } from '~/composables/useBattalions'
import { useCompanies } from '~/composables/useCompanies'
import { useToast } from '~/composables/useToast'
import {
  UNITS_BATTALION_CREATE_BUTTON_LABEL,
  UNITS_COMPANY_CREATE_BUTTON_LABEL,
  UNITS_PAGE_KPI_GRID_CLASSES,
  UNITS_PAGE_SECTION_CLASSES,
  UNITS_PAGE_SUBTITLE,
  UNITS_PAGE_TAB_ITEMS,
  UNITS_PAGE_TAB_REQUIRED_PERMISSIONS,
  UNITS_PAGE_TABS_ARIA_LABEL,
  UNITS_PAGE_TITLE,
} from '~/constants/page.constants'
import { BATTALION_PRIVILEGES, COMPANY_PRIVILEGES } from '~/constants/privileges.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES, UNITS_TABLE_ACTIONS_ROW_CLASSES } from '~/constants/shared.constants'
import {
  useBattalionActionHandler,
  useBattalionFilterHandlers,
  useCompanyActionHandler,
  useCompanyFilterHandlers,
  useCreateBattalionHandler,
  useCreateCompanyHandler,
  useDeleteBattalionHandler,
  useDeleteCompanyHandler,
  useUnitsPageHandlers,
  useUpdateBattalionHandler,
  useUpdateCompanyHandler,
  useViewBattalionHandler,
  useViewCompanyHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type {
  CreateBattalionPayload,
  CreateCompanyPayload,
  UnitManagementTabId,
  BattalionDetailItem,
  CompanyDetailItem,
  UpdateBattalionPayload,
  UpdateCompanyPayload,
} from '~/types/domain/units'
import { getUnitManagementKpisEndpoint } from '~/utils/dashboard-endpoints'
import type { FieldValidationMap } from '~/utils/field-validation'

const activeTab = ref<UnitManagementTabId>('battalion')
const authStore = useAuthStore()
const { addToast } = useToast()
const { showDialog } = useDialog()
const kpiRefreshKey = ref(0)
const isCreateBattalionModalOpen = ref(false)
const isUpdateBattalionModalOpen = ref(false)
const isCreateCompanyModalOpen = ref(false)
const isUpdateCompanyModalOpen = ref(false)
const isViewBattalionModalOpen = ref(false)
const isViewCompanyModalOpen = ref(false)
const selectedBattalionId = ref('')
const selectedCompanyId = ref('')
const selectedBattalion = ref<{ code: string; name: string; isActive: boolean } | null>(null)
const selectedCompany = ref<{ battalionId: string | null; code: string; name: string; isActive: boolean } | null>(null)
const selectedBattalionView = ref<BattalionDetailItem | null>(null)
const selectedCompanyView = ref<CompanyDetailItem | null>(null)

const {
  filters: battalionFilters,
  tableRows: battalionTableRows,
  pagination: battalionPagination,
  isLoading: isBattalionsLoading,
  error: battalionError,
  loadBattalions,
  createBattalion,
  getBattalionById,
  updateBattalion,
  deleteBattalion,
} = useBattalions()

const {
  filters: companyFilters,
  tableRows: companyTableRows,
  pagination: companyPagination,
  isLoading: isCompaniesLoading,
  error: companyError,
  loadCompanies,
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = useCompanies()

const { handleTabChange } = useUnitsPageHandlers(activeTab)
const { onOpenCreateBattalionModal, onCloseCreateBattalionModal, onCreateBattalion } = useCreateBattalionHandler({
  isCreateBattalionModalOpen,
  createBattalion,
})
const { onOpenCreateCompanyModal, onCloseCreateCompanyModal, onCreateCompany } = useCreateCompanyHandler({
  isCreateCompanyModalOpen,
  createCompany,
})

const {
  canHandleUpdateBattalionAction,
  onEditBattalionAction,
  onUpdateBattalion,
  onCloseUpdateBattalionModal,
} = useUpdateBattalionHandler({
  selectedBattalionId,
  selectedBattalion,
  isUpdateBattalionModalOpen,
  getBattalionById,
  updateBattalion,
  loadBattalions,
  battalionPagination,
  battalionFilters,
})

const {
  canHandleViewBattalionAction,
  onViewBattalionAction,
  onCloseViewBattalionModal,
} = useViewBattalionHandler({
  selectedBattalionId,
  selectedBattalionView,
  isViewBattalionModalOpen,
  getBattalionById,
})

const { canHandleDeleteBattalionAction, onDeleteBattalionAction } = useDeleteBattalionHandler({
  showDialog,
  deleteBattalion,
  loadBattalions,
  battalionPagination,
  battalionFilters,
})

const { onBattalionAction } = useBattalionActionHandler({
  onViewBattalionAction,
  onEditBattalionAction,
  onDeleteBattalionAction,
  canHandleViewBattalionAction,
  canHandleUpdateBattalionAction,
  canHandleDeleteBattalionAction,
})

const {
  canHandleUpdateCompanyAction,
  onEditCompanyAction,
  onUpdateCompany,
  onCloseUpdateCompanyModal,
} = useUpdateCompanyHandler({
  selectedCompanyId,
  selectedCompany,
  isUpdateCompanyModalOpen,
  getCompanyById,
  updateCompany,
  loadCompanies,
  companyPagination,
  companyFilters,
})

const {
  canHandleViewCompanyAction,
  onViewCompanyAction,
  onCloseViewCompanyModal,
} = useViewCompanyHandler({
  selectedCompanyId,
  selectedCompanyView,
  isViewCompanyModalOpen,
  getCompanyById,
})

const { canHandleDeleteCompanyAction, onDeleteCompanyAction } = useDeleteCompanyHandler({
  showDialog,
  deleteCompany,
  loadCompanies,
  companyPagination,
  companyFilters,
})

const { onCompanyAction } = useCompanyActionHandler({
  onViewCompanyAction,
  onEditCompanyAction,
  onDeleteCompanyAction,
  canHandleViewCompanyAction,
  canHandleUpdateCompanyAction,
  canHandleDeleteCompanyAction,
})

const { handleFilterApply: handleBattalionFilterApply, handleFilterReset: handleBattalionFilterReset } = useBattalionFilterHandlers(battalionFilters)
const { handleFilterApply: handleCompanyFilterApply, handleFilterReset: handleCompanyFilterReset } = useCompanyFilterHandlers(companyFilters)

const visibleTabItems = computed(() => {
  return UNITS_PAGE_TAB_ITEMS.filter((tabItem) => {
    const requiredPermissions = UNITS_PAGE_TAB_REQUIRED_PERMISSIONS[tabItem.id as keyof typeof UNITS_PAGE_TAB_REQUIRED_PERMISSIONS]
    return authStore.hasPermissionAccess(requiredPermissions)
  })
})

const onTabChange = (nextTab: string) => {
  handleTabChange(nextTab)
}

const canCreateBattalion = computed(() => authStore.hasPermissionAccess(BATTALION_PRIVILEGES.create))
const canCreateCompany = computed(() => authStore.hasPermissionAccess(COMPANY_PRIVILEGES.create))
const createButtonLabel = computed(() => {
  return activeTab.value === 'battalion' ? UNITS_BATTALION_CREATE_BUTTON_LABEL : UNITS_COMPANY_CREATE_BUTTON_LABEL
})
const showCreateButton = computed(() => {
  if (activeTab.value === 'battalion') {
    return canCreateBattalion.value
  }

  return canCreateCompany.value
})

const battalionFilterValidationErrors = ref<FieldValidationMap>({})
const companyFilterValidationErrors = ref<FieldValidationMap>({})

const handleApplyBattalionFilters = async (value: typeof battalionFilters.value) => {
  const { filters, errors, isValid } = handleBattalionFilterApply(value)
  battalionFilterValidationErrors.value = errors

  if (!isValid) {
    return
  }

  await loadBattalions(1, filters)
}

const handleResetBattalionFilters = async () => {
  battalionFilterValidationErrors.value = {}
  const filters = handleBattalionFilterReset()
  await loadBattalions(1, filters)
}

const handleApplyCompanyFilters = async (value: typeof companyFilters.value) => {
  const { filters, errors, isValid } = handleCompanyFilterApply(value)
  companyFilterValidationErrors.value = errors

  if (!isValid) {
    return
  }

  await loadCompanies(1, filters)
}

const handleResetCompanyFilters = async () => {
  companyFilterValidationErrors.value = {}
  const filters = handleCompanyFilterReset()
  await loadCompanies(1, filters)
}

const onBattalionPageChange = (nextPage: number) => {
  void loadBattalions(nextPage, battalionFilters.value)
}

const onCompanyPageChange = (nextPage: number) => {
  void loadCompanies(nextPage, companyFilters.value)
}

const onBattalionPageSizeChange = (nextPageSize: number) => {
  void loadBattalions(1, battalionFilters.value, nextPageSize)
}

const onCompanyPageSizeChange = (nextPageSize: number) => {
  void loadCompanies(1, companyFilters.value, nextPageSize)
}

const refreshUnitKpis = () => {
  kpiRefreshKey.value += 1
}

const loadTotalCompanies = async () => {
  const kpis = await getUnitManagementKpisEndpoint()
  return { value: kpis.totalCompanies }
}

const loadTotalBattalions = async () => {
  const kpis = await getUnitManagementKpisEndpoint()
  return { value: kpis.totalBattalions }
}

const loadUnassignedPersonnel = async () => {
  const kpis = await getUnitManagementKpisEndpoint()
  return { value: kpis.totalUnassignedPersonnel }
}

const onCreateActionClick = () => {
  if (activeTab.value === 'battalion') {
    onOpenCreateBattalionModal()
    return
  }

  onOpenCreateCompanyModal()
}

const handleCreateBattalion = async (payload: CreateBattalionPayload) => {
  try {
    await onCreateBattalion(payload)
    addToast({
      title: 'Battalion created',
      message: 'Battalion record has been created successfully.',
      variant: 'success',
    })
    refreshUnitKpis()
  } catch {
    addToast({
      title: 'Battalion creation failed',
      message: 'Unable to create battalion record right now.',
      variant: 'error',
    })
  }
}

const handleUpdateBattalion = async (payload: UpdateBattalionPayload) => {
  try {
    await onUpdateBattalion(payload)
    addToast({
      title: 'Battalion updated',
      message: 'Battalion record has been updated successfully.',
      variant: 'success',
    })
    refreshUnitKpis()
  } catch {
    addToast({
      title: 'Battalion update failed',
      message: 'Unable to update battalion record right now.',
      variant: 'error',
    })
  }
}

const handleCreateCompany = async (payload: CreateCompanyPayload) => {
  try {
    await onCreateCompany(payload)
    addToast({
      title: 'Company created',
      message: 'Company record has been created successfully.',
      variant: 'success',
    })
    refreshUnitKpis()
  } catch {
    addToast({
      title: 'Company creation failed',
      message: 'Unable to create company record right now.',
      variant: 'error',
    })
  }
}

const handleUpdateCompany = async (payload: UpdateCompanyPayload) => {
  try {
    await onUpdateCompany(payload)
    addToast({
      title: 'Company updated',
      message: 'Company record has been updated successfully.',
      variant: 'success',
    })
    refreshUnitKpis()
  } catch {
    addToast({
      title: 'Company update failed',
      message: 'Unable to update company record right now.',
      variant: 'error',
    })
  }
}

watch(
  visibleTabItems,
  (items) => {
    if (items.some(item => item.id === activeTab.value)) {
      return
    }

    const firstVisibleTab = items.at(0)
    if (firstVisibleTab) {
      activeTab.value = firstVisibleTab.id as UnitManagementTabId
    }
  },
  { immediate: true }
)
</script>
