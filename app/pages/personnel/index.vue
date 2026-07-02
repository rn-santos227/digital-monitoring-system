<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="PERSONNEL_PAGE_SECTION_CLASSES">
      <header :class="PERSONNEL_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ PERSONNEL_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ PERSONNEL_PAGE_SUBTITLE }}</p>
      </header>

      <BaseAlert
        v-if="!canViewPersonnel"
        message="You do not have permission to view personnel records."
        tone="warning"
      />

      <template v-else>
        <div :class="PERSONNEL_PAGE_KPI_GRID_CLASSES">
          <KpiCard
            title="Total Personnel"
            subtitle="Total personnel records currently tracked."
            icon-name="users"
            tone="emerald"
            :value="totalPersonnelCount"
            context="Personnel records in the current registry."
          />
          <KpiCard
            title="Deployed Personnel"
            subtitle="Personnel currently tagged with deployed service status."
            icon-name="shield"
            tone="sky"
            :value="deployedPersonnelCount"
            context="Personnel currently tagged with deployed service status."
          />
          <KpiCard
            title="Total Ranks"
            subtitle="All rank records available for assignment."
            icon-name="clipboard-document-list"
            tone="violet"
            :value="totalRanksCount"
            context="Ranks available in rank management."
          />
          <KpiCard
            title="Unused Ranks"
            subtitle="Rank records not currently used in loaded personnel rows."
            icon-name="archive"
            tone="amber"
            :value="unusedRanksCount"
            context="Rank records with no personnel assignment."
          />
        </div>

        <BaseTab
          :model-value="activeTab"
          :items="visibleTabItems"
          :aria-label="PERSONNEL_PAGE_TABS_ARIA_LABEL"
          @update:model-value="onTabChange"
        />

        <template v-if="activeTab === 'personnel-records'">
          <BaseAlert
            v-if="error"
            :message="error"
            tone="danger"
          />

          <div :class="PERSONNEL_TABLE_ACTIONS_ROW_CLASSES">
            <PrintDataListButton
              table-name="personnel"
              :table-label="PERSONNEL_PRINT_BUTTON_TABLE_LABEL"
              :filters="filters"
              :get-print-data="handlePrintPersonnel"
              :disabled="isLoading"
            />
            <template v-if="canCreatePersonnel">
              <BaseButton class="mx-2" variant="secondary" @click="isBatchUploadPersonnelModalOpen = true">
                {{ PERSONNEL_BATCH_UPLOAD_BUTTON_LABEL }}
              </BaseButton>
              <BaseButton @click="openCreatePersonnelModal">
                {{ PERSONNEL_CREATE_BUTTON_LABEL }}
              </BaseButton>
            </template>
          </div>

          <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <PersonnelFilter
              class="flex-1"
              :model-value="filters"
              :validation-errors="filterValidationErrors"
              @apply="handleApplyFilters"
              @reset="handleResetFilters"
            />
            <BaseViewToggle v-model="personnelViewMode" />
          </div>

          <PersonnelTable
            v-if="personnelViewMode === 'table'"
            :rows="tableRows"
            row-key="id"
            :is-loading="isLoading"
            :current-page="pagination.page"
            :total-pages="pagination.totalPages"
            :total-items="pagination.totalItems"
            :page-size="pagination.pageSize"
            :can-view-personnel="canViewPersonnel"
            :can-edit-personnel="canEditPersonnel"
            :can-delete-personnel="canDeletePersonnel"
            @update:current-page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            @action="handleTableAction"
          />
        </template>

        <template v-else>
          <div class="grid gap-3 md:grid-cols-[1fr_auto]">
            <BaseTextField
              :model-value="rankSearchTerm"
              type="search"
              label="Search Rank"
              placeholder="Search rank code or name"
              @update:model-value="onRankSearchTermChange"
            />
            <div class="flex items-end gap-2">
              <PrintDataListButton
                table-name="ranks"
                table-label="Ranks"
                :filters="{ search: rankSearchTerm }"
                :disabled="isRanksLoading"
                :get-print-data="handlePrintRanks"
              />
              <BaseButton v-if="canCreateRanks" @click="isCreateRankModalOpen = true">
                {{ RANK_CREATE_BUTTON_LABEL }}
              </BaseButton>
            </div>
          </div>
          <BaseAlert v-if="rankError" :message="rankError" tone="danger" />
          <RanksTable
            :rows="rankRows"
            :is-loading="isRanksLoading"
            :current-page="rankPagination.page"
            :total-pages="rankPagination.totalPages"
            :total-items="rankPagination.totalItems"
            :page-size="rankPagination.pageSize"
            :can-delete="canDeleteRanks"
            @update:current-page="onRankPageChange"
            @update:page-size="onRankPageSizeChange"
            @action="onRankTableAction"
          />
        </template>
      </template>

      <CreatePersonnelModal
        v-if="isCreatePersonnelModalOpen"
        @close="closeCreatePersonnelModal"
        @submit="handleCreatePersonnel"
      />

      <BatchUploadPersonnelModal
        v-if="isBatchUploadPersonnelModalOpen"
        :is-submitting="isBatchUploadSubmitting"
        :processed-count="batchProcessedCount"
        :total-count="batchTotalCount"
        @close="isBatchUploadPersonnelModalOpen = false"
        @submit="handleBatchUploadPersonnel"
      />

      <UpdatePersonnelModal
        v-if="isUpdatePersonnelModalOpen && selectedPersonnel"
        :initial-values="selectedPersonnel"
        @close="closeUpdatePersonnelModal"
        @submit="handleUpdatePersonnel"
      />

      <CreateRankModal
        v-if="isCreateRankModalOpen"
        @close="isCreateRankModalOpen = false"
        @submit="handleCreateRank"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import BatchUploadPersonnelModal from '~/components/personnel/BatchUploadPersonnelModal.vue'
import CreateRankModal from '~/components/personnel/CreateRankModal.vue'
import CreatePersonnelModal from '~/components/personnel/CreatePersonnelModal.vue'
import PersonnelFilter from '~/components/personnel/PersonnelFilter.vue'
import PersonnelCards from '~/components/personnel/PersonnelCards.vue'
import PersonnelTable from '~/components/personnel/PersonnelTable.vue'
import BaseViewToggle from '~/components/ui/BaseViewToggle.vue'
import RanksTable from '~/components/personnel/RanksTable.vue'
import UpdatePersonnelModal from '~/components/personnel/UpdatePersonnelModal.vue'
import { useRanks } from '~/composables/useRanks'
import {
  PERSONNEL_BATCH_UPLOAD_BUTTON_LABEL,
  PERSONNEL_CREATE_BUTTON_LABEL,
  PERSONNEL_PAGE_REQUIRED_PERMISSIONS,
  PERSONNEL_PAGE_SECTION_CLASSES,
  PERSONNEL_PAGE_SUBTITLE,
  PERSONNEL_PAGE_KPI_GRID_CLASSES,
  PERSONNEL_PAGE_TAB_ITEMS,
  PERSONNEL_PAGE_TAB_REQUIRED_PERMISSIONS,
  PERSONNEL_PAGE_TABS_ARIA_LABEL,
  PERSONNEL_PAGE_TITLE,
  PERSONNEL_PRINT_BUTTON_TABLE_LABEL,
  RANK_CREATE_BUTTON_LABEL,
} from '~/constants/page.constants'
import { RANK_PRIVILEGES } from '~/constants/privileges.constants'
import {
  APP_MAIN_CONTENT_CLASSES,
  PERSONNEL_PAGE_HEADER_CLASSES,
  PERSONNEL_TABLE_ACTIONS_ROW_CLASSES,
} from '~/constants/shared.constants'
import { useDialog } from '~/composables/useDialog'
import { useToast } from '~/composables/useToast'
import { usePersonnel } from '~/composables/usePersonnel'
import {
  createCompleteListPrintHandler,
  useCreatePersonnelModalHandler,
  useDeletePersonnelHandler,
  useDeleteRankHandler,
  usePersonnelBatchUploadHandler,
  usePersonnelPageHandlers,
  usePersonnelTableActionHandler,
  usePrintPersonnelHandler,
  usePrintRanksHandler,
  useRankTableActionHandler,
  useRanksPageHandlers,
  useSearchTermListHandlers,
  useUpdatePersonnelHandler,
  useValidatedListHandlers,
  useViewPersonnelProfileHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'
import type { CreateRankPayload } from '~/types/domain/rank'
import type { PersonnelDetail } from '~/types/domain/personnel'
import type { ListViewMode } from '~/constants/ui.constants'
import type { FieldValidationMap } from '~/utils/field-validation'

const { filters, tableRows, kpis, pagination, isLoading, error, loadPersonnel, createPersonnel, updatePersonnel, deletePersonnel, getPersonnelById, uploadPersonnelBatch } = usePersonnel()
const { tableRows: rankRows, pagination: rankPagination, isLoading: isRanksLoading, error: rankError, search: rankSearchTerm, loadRanks, createRank, deleteRank } = useRanks()
const { handleFilterApply, handleFilterReset } = usePersonnelPageHandlers(filters)
const { handleDownloadAndPrintPersonnel } = usePrintPersonnelHandler()
const { printRanks } = usePrintRanksHandler()
const { handleViewPersonnelProfile } = useViewPersonnelProfileHandler()
const authStore = useAuthStore()
const { showDialog } = useDialog()
const { addToast } = useToast()

const filterValidationErrors = ref<FieldValidationMap>({})
const isCreatePersonnelModalOpen = ref(false)
const isBatchUploadPersonnelModalOpen = ref(false)
const isBatchUploadSubmitting = ref(false)
const batchProcessedCount = ref(0)
const batchTotalCount = ref(0)
const isUpdatePersonnelModalOpen = ref(false)
const isCreateRankModalOpen = ref(false)
const selectedPersonnel = ref<PersonnelDetail | null>(null)
const personnelCardRows = ref<typeof tableRows.value>([])
const activeTab = ref<'personnel-records' | 'rank-management'>('personnel-records')
const personnelViewMode = ref<ListViewMode>('table')
const { openCreatePersonnelModal, closeCreatePersonnelModal } = useCreatePersonnelModalHandler(isCreatePersonnelModalOpen)
const createDeleteDialogCallbacks = (
  onRefresh: () => Promise<void>,
  successTitle: string,
  successMessage: string,
  cancelledMessage: string,
) => {
  return {
    onDeleteSuccess: async () => {
      await onRefresh()
      await showDialog({
        type: 'success',
        title: successTitle,
        message: successMessage,
        confirmLabel: 'OK',
      })
    },
    onDeleteCancelled: async () => {
      await showDialog({
        type: 'warning',
        title: 'Delete cancelled',
        message: cancelledMessage,
        confirmLabel: 'OK',
      })
    },
  }
}

const { onDeletePersonnel } = useDeletePersonnelHandler({
  showDialog,
  deletePersonnel,
  ...createDeleteDialogCallbacks(
    async () => {},
    'Personnel deleted',
    'Personnel record has been deleted successfully.',
    'Personnel deletion was cancelled.',
  ),
})
const { onDeleteRank } = useDeleteRankHandler({
  showDialog,
  deleteRank,
})
const { handleBatchUploadPersonnel } = usePersonnelBatchUploadHandler({
  isSubmitting: isBatchUploadSubmitting,
  processedCount: batchProcessedCount,
  totalCount: batchTotalCount,
  isModalOpen: isBatchUploadPersonnelModalOpen,
  uploadPersonnelBatch,
  showDialog,
})
const visibleTabItems = computed(() => {
  return PERSONNEL_PAGE_TAB_ITEMS.filter((tabItem) => {
    const requiredPermissions = PERSONNEL_PAGE_TAB_REQUIRED_PERMISSIONS[tabItem.id as keyof typeof PERSONNEL_PAGE_TAB_REQUIRED_PERMISSIONS]
    return authStore.hasPermissionAccess(requiredPermissions)
  })
})

const canViewPersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.view)
})

const canCreatePersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.create)
})

const canEditPersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.edit)
})

const canDeletePersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.delete)
})

const canViewRanks = computed(() => {
  return authStore.hasPermissionAccess(RANK_PRIVILEGES.view)
})

const canCreateRanks = computed(() => {
  return authStore.hasPermissionAccess(RANK_PRIVILEGES.create)
})

const canDeleteRanks = computed(() => {
  return authStore.hasPermissionAccess(RANK_PRIVILEGES.delete)
})

const totalPersonnelCount = computed(() => kpis.value.totalPersonnel)
const deployedPersonnelCount = computed(() => kpis.value.deployedPersonnel)
const totalRanksCount = computed(() => kpis.value.totalRanks)
const unusedRanksCount = computed(() => kpis.value.unusedRanks)

watch(canViewPersonnel, (hasAccess) => {
  if (!hasAccess) {
    return
  }

  void loadPersonnel(1).then(() => {
    personnelCardRows.value = [...tableRows.value]
  })
}, { immediate: true })

watch(tableRows, (rows) => {
  if (pagination.value.page === 1) {
    personnelCardRows.value = [...rows]
  }
})

const canLoadMorePersonnel = computed(() => pagination.value.page < pagination.value.totalPages)

const handleLoadMorePersonnel = async () => {
  if (isLoading.value || !canLoadMorePersonnel.value) {
    return
  }

  await loadPersonnel(pagination.value.page + 1, filters.value, pagination.value.pageSize)
  personnelCardRows.value = [...personnelCardRows.value, ...tableRows.value]
}

watch(canViewRanks, (hasAccess) => {
  if (!hasAccess) {
    return
  }

  void loadRanks(1)
}, { immediate: true })

const { handleRankTabChange } = useRanksPageHandlers(activeTab)

const onTabChange = handleRankTabChange

const {
  handleApplyFilters,
  handleResetFilters,
  handlePageChange,
  handlePageSizeChange,
} = useValidatedListHandlers({
  filters,
  validationErrors: filterValidationErrors,
  applyFilters: handleFilterApply,
  resetFilters: handleFilterReset,
  loadPage: loadPersonnel,
  onInvalid: () => showDialog({
    type: 'error',
    title: 'Invalid filter input',
    message: 'Please correct the highlighted fields before applying filters.',
    confirmLabel: 'OK',
  }),
})

const handlePrintPersonnel = () => handleDownloadAndPrintPersonnel(filters.value)
const handlePrintRanks = createCompleteListPrintHandler({
  rows: rankRows,
  pagination: rankPagination,
  loadPage: (page, pageSize) => loadRanks(page, rankSearchTerm.value, pageSize),
  printItems: printRanks,
})

const handleCreatePersonnel = createModalFeedbackHandler(createPersonnel, showDialog, {
  successTitle: 'Personnel created',
  successMessage: 'Personnel record has been created successfully.',
  errorTitle: 'Personnel creation failed',
  errorMessage: 'Unable to create personnel record right now.',
}, closeCreatePersonnelModal)

const { closeUpdatePersonnelModal, onEditPersonnelAction, onUpdatePersonnel } = useUpdatePersonnelHandler({
  selectedPersonnel,
  isUpdatePersonnelModalOpen,
  getPersonnelById,
  updatePersonnel,
  showDialog,
  addToast,
})

const handleUpdatePersonnel = onUpdatePersonnel
const { handleTableAction } = usePersonnelTableActionHandler({
  handleViewPersonnelProfile,
  onEditPersonnelAction,
  onDeletePersonnel,
})

const {
  handleSearchTermChange: onRankSearchTermChange,
  handlePageChange: onRankPageChange,
  handlePageSizeChange: onRankPageSizeChange,
} = useSearchTermListHandlers({
  searchTerm: rankSearchTerm,
  loadPage: loadRanks,
})

const handleCreateRank = createModalFeedbackHandler(async (payload: CreateRankPayload) => {
  await createRank(payload)
}, showDialog, {
  successTitle: 'Rank created',
  successMessage: 'Rank record has been created successfully.',
  errorTitle: 'Rank creation failed',
  errorMessage: 'Unable to create rank record right now.',
}, () => {
  isCreateRankModalOpen.value = false
})

const { onRankTableAction } = useRankTableActionHandler(onDeleteRank)
</script>
