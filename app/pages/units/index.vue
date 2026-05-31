<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="UNITS_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ UNITS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ UNITS_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="UNITS_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          title="Total Companies"
          subtitle="Tracked company units in the registry."
          icon-name="building"
          tone="violet"
          :value="totalCompanies"
        />
        <KpiCard
          title="Total Battalions"
          subtitle="Tracked battalion units in the registry."
          icon-name="shield"
          tone="sky"
          :value="totalBattalions"
        />
        <KpiCard
          title="Unassigned Personnel"
          subtitle="Personnel without company assignment."
          icon-name="users"
          tone="amber"
          :value="totalUnassignedPersonnel"
          context="Personnel without company assignment currently available in unit data."
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

      <AssignToBattalionModal
        v-if="isAssignToBattalionModalOpen"
        @close="onCloseAssignToBattalionModal"
        @submit="({ personnelId }) => onAssignToBattalion(personnelId)"
      />

      <AssignToCompanyModal
        v-if="isAssignToCompanyModalOpen"
        @close="onCloseAssignToCompanyModal"
        @submit="({ personnelId }) => onAssignToCompany(personnelId)"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDialog } from '~/composables/useDialog'
import KpiCard from '~/components/general/KpiCard.vue'
import CreateBattalionModal from '~/components/units/CreateBattalionModal.vue'
import UpdateBattalionModal from '~/components/units/UpdateBattalionModal.vue'
import CreateCompanyModal from '~/components/units/CreateCompanyModal.vue'
import UpdateCompanyModal from '~/components/units/UpdateCompanyModal.vue'
import ViewBattalionModal from '~/components/units/ViewBattalionModal.vue'
import ViewCompanyModal from '~/components/units/ViewCompanyModal.vue'
import AssignToBattalionModal from '~/components/units/AssignToBattalionModal.vue'
import AssignToCompanyModal from '~/components/units/AssignToCompanyModal.vue'
import BattalionsFilter from '~/components/units/BattalionsFilter.vue'
import BattalionsTable from '~/components/units/BattalionsTable.vue'
import CompaniesFilter from '~/components/units/CompaniesFilter.vue'
import CompaniesTable from '~/components/units/CompaniesTable.vue'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'
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
  useCreateUnitHandler,
  useDeleteBattalionHandler,
  useDeleteCompanyHandler,
  useDeleteUnitHandler,
  useUnitsPageHandlers,
  useUpdateBattalionHandler,
  useUpdateCompanyHandler,
  useUpdateUnitHandler,
  useViewBattalionHandler,
  useViewCompanyHandler,
  useAssignBattalionHandler,
  useAssignCompanyHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import { useUnitManagementKpisStore } from '~/stores/units'
import type {
  UnitManagementTabId,
  BattalionDetailItem,
  CompanyDetailItem,
} from '~/types/domain/units'
import type { FieldValidationMap } from '~/utils/field-validation'

const activeTab = ref<UnitManagementTabId>('battalion')
const authStore = useAuthStore()
const unitKpisStore = useUnitManagementKpisStore()
const { kpis: unitKpis } = storeToRefs(unitKpisStore)
const { addToast } = useToast()
const { showDialog } = useDialog()
const isCreateBattalionModalOpen = ref(false)
const isUpdateBattalionModalOpen = ref(false)
const isCreateCompanyModalOpen = ref(false)
const isUpdateCompanyModalOpen = ref(false)
const isViewBattalionModalOpen = ref(false)
const isViewCompanyModalOpen = ref(false)
const isAssignToBattalionModalOpen = ref(false)
const isAssignToCompanyModalOpen = ref(false)
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
  assignPersonnel: assignPersonnelToBattalion,
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
  assignPersonnel: assignPersonnelToCompany,
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

const { canHandleAssignBattalionAction, onOpenAssignBattalionAction, onCloseAssignToBattalionModal, onAssignToBattalion } = useAssignBattalionHandler({
  selectedBattalionId,
  isAssignToBattalionModalOpen,
  assignPersonnel: assignPersonnelToBattalion,
})

const { canHandleDeleteBattalionAction, onDeleteBattalionAction } = useDeleteBattalionHandler({
  showDialog,
  deleteBattalion,
  onDeleteSuccess: async () => { await showDialog({
    type: 'success',
    title: 'Battalion deleted',
    message: 'Battalion record has been deleted successfully.',
    confirmLabel: 'OK',
  }) },
  onDeleteCancelled: () => { addToast({
    variant: 'warning',
    title: 'Delete cancelled',
    message: 'Battalion deletion was cancelled.',
  })},
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

const { canHandleAssignCompanyAction, onOpenAssignCompanyAction, onCloseAssignToCompanyModal, onAssignToCompany } = useAssignCompanyHandler({
  selectedCompanyId,
  isAssignToCompanyModalOpen,
  assignPersonnel: assignPersonnelToCompany,
})

const { canHandleDeleteCompanyAction, onDeleteCompanyAction } = useDeleteCompanyHandler({
  showDialog,
  deleteCompany,
  onDeleteSuccess: async () => { await showDialog({
    type: 'success',
    title: 'Company deleted',
    message: 'Company record has been deleted successfully.',
    confirmLabel: 'OK',
  })},
  onDeleteCancelled: async () => { addToast({
    variant: 'warning',
    title: 'Delete cancelled',
    message: 'Company deletion was cancelled.',
  })},
})

const { onCreateActionClick, handleCreateUnitBattalion, handleCreateUnitCompany } = useCreateUnitHandler({
  activeTab,
  onOpenCreateBattalionModal,
  onOpenCreateCompanyModal,
  onCreateBattalion,
  onCreateCompany,
})

const { handleUpdateUnitBattalion, handleUpdateUnitCompany } = useUpdateUnitHandler({
  onUpdateBattalion,
  onUpdateCompany,
})

const unitDeleteHandlers = useDeleteUnitHandler({
  onDeleteBattalionAction,
  onDeleteCompanyAction,
})
const { onBattalionAction } = useBattalionActionHandler({
  onViewBattalionAction,
  onEditBattalionAction,
  onDeleteBattalionAction: unitDeleteHandlers.handleDeleteUnitBattalion,
  canHandleViewBattalionAction,
  canHandleUpdateBattalionAction,
  canHandleDeleteBattalionAction,
  canHandleAssignBattalionAction,
  onAssignBattalionAction: onOpenAssignBattalionAction,
})
const { onCompanyAction } = useCompanyActionHandler({
  onViewCompanyAction,
  onEditCompanyAction,
  onDeleteCompanyAction: unitDeleteHandlers.handleDeleteUnitCompany,
  canHandleViewCompanyAction,
  canHandleUpdateCompanyAction,
  canHandleDeleteCompanyAction,
  canHandleAssignCompanyAction,
  onAssignCompanyAction: onOpenAssignCompanyAction,
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

const totalCompanies = computed(() => unitKpis.value.totalCompanies)
const totalBattalions = computed(() => unitKpis.value.totalBattalions)
const totalUnassignedPersonnel = computed(() => unitKpis.value.totalUnassignedPersonnel)

const handleCreateBattalion = createModalFeedbackHandler(handleCreateUnitBattalion, showDialog, {
  successTitle: 'Battalion created',
  successMessage: 'Battalion record has been created successfully.',
  errorTitle: 'Battalion creation failed',
  errorMessage: 'Unable to create battalion record right now.',
})

const handleUpdateBattalion = createModalFeedbackHandler(handleUpdateUnitBattalion, showDialog, {
  successTitle: 'Battalion updated',
  successMessage: 'Battalion record has been updated successfully.',
  errorTitle: 'Battalion update failed',
  errorMessage: 'Unable to update battalion record right now.',
})

const handleCreateCompany = createModalFeedbackHandler(handleCreateUnitCompany, showDialog, {
  successTitle: 'Company created',
  successMessage: 'Company record has been created successfully.',
  errorTitle: 'Company creation failed',
  errorMessage: 'Unable to create company record right now.',
})

const handleUpdateCompany = createModalFeedbackHandler(handleUpdateUnitCompany, showDialog, {
  successTitle: 'Company updated',
  successMessage: 'Company record has been updated successfully.',
  errorTitle: 'Company update failed',
  errorMessage: 'Unable to update company record right now.',
})

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

watch(
  visibleTabItems,
  (items) => {
    if (items.length === 0) {
      return
    }

    void unitKpisStore.fetchUnitManagementKpisOnce().catch(() => {})
  },
  { immediate: true }
)
</script>
