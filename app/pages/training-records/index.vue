<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="TRAINING_PAGE_SECTION_CLASSES">
      <header :class="TRAINING_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ TRAINING_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ TRAINING_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="TRAINING_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          title="Total Records"
          subtitle="Training records currently encoded."
          icon-name="clipboard-document-list"
          tone="amber"
          :value="totalTrainingRecords"
          context="Personnel training records currently available in the training module."
        />
        <KpiCard
          title="Total Trainings"
          subtitle="Training master records available for assignment."
          icon-name="academic-cap"
          tone="sky"
          :value="totalTrainings"
          context="Trainings currently available in the training module."
        />
        <KpiCard
          title="Total Categories"
          subtitle="Training categories configured in the registry."
          icon-name="squares"
          tone="violet"
          :value="totalCategories"
          context="Training categories currently available in the training module."
        />
        <KpiCard
          title="Unused Categories"
          subtitle="Training categories with no training records assigned."
          icon-name="archive"
          tone="amber"
          :value="unusedTrainingCategories"
          context="Training categories not used by any training master record."
        />
      </div>

      <BaseTab
        :model-value="activeTab"
        :items="visibleTabItems"
        :aria-label="TRAINING_PAGE_TABS_ARIA_LABEL"
        @update:model-value="onTabChange"
      />

      <div :class="TRAINING_TABLE_ACTIONS_ROW_CLASSES">
        <PrintDataListButton
          :table-name="activeTrainingPrintConfig.tableName"
          :table-label="activeTrainingPrintConfig.tableLabel"
          :filters="activeTrainingPrintConfig.filters"
          :disabled="activeTrainingPrintConfig.isLoading"
          :get-print-data="activeTrainingPrintConfig.print"
        />
        <BaseButton v-if="showCreateButton" @click="onCreateActionClick">
          {{ createButtonLabel }}
        </BaseButton>
      </div>

      <template v-if="activeTab === 'records'">
        <TrainingRecordsFilter
          :model-value="trainingRecordsFilters"
          :validation-errors="trainingRecordFilterValidationErrors"
          @apply="handleApplyTrainingRecordFilters"
          @reset="handleResetTrainingRecordFilters"
        />

        <BaseAlert
          v-if="trainingRecordsError"
          :message="trainingRecordsError"
          tone="danger"
        />

        <TrainingRecordsTable
          :rows="trainingRecordsTableRows"
          :is-loading="isTrainingRecordsLoading"
          :current-page="trainingRecordsPagination.page"
          :total-pages="trainingRecordsPagination.totalPages"
          :total-items="trainingRecordsPagination.totalItems"
          :page-size="trainingRecordsPagination.pageSize"
          v-model:selected-row-keys="selectedTrainingRecordIds"
          @action="onTrainingRecordTableAction"
          @update:current-page="onTrainingRecordsPageChange"
          @update:page-size="onTrainingRecordsPageSizeChange"
          @bulk-delete="deleteSelectedTrainingRecords"
        />
      </template>

      <template v-else-if="activeTab === 'trainings'">
        <TrainingsFilter
          :model-value="trainingFilters"
          :validation-errors="trainingFilterValidationErrors"
          @apply="handleApplyTrainingFilters"
          @reset="handleResetTrainingFilters"
        />

        <BaseAlert
          v-if="trainingError"
          :message="trainingError"
          tone="danger"
        />

        <TrainingsTable
          :rows="trainingTableRows"
          :is-loading="isTrainingLoading"
          :current-page="trainingPagination.page"
          :total-pages="trainingPagination.totalPages"
          :total-items="trainingPagination.totalItems"
          :page-size="trainingPagination.pageSize"
          v-model:selected-row-keys="selectedTrainingRecordIds"
          @action="onTrainingTableAction"
          @update:current-page="onTrainingPageChange"
          @update:page-size="onTrainingPageSizeChange"
          @bulk-delete="deleteSelectedTrainingRecords"
        />
      </template>

      <template v-else-if="activeTab === 'categories'">
        <TrainingCategoriesFilter
          :model-value="categoryFilters"
          :validation-errors="categoryFilterValidationErrors"
          @apply="handleApplyCategoryFilters"
          @reset="handleResetCategoryFilters"
        />

        <BaseAlert
          v-if="categoryError"
          :message="categoryError"
          tone="danger"
        />

        <TrainingCategoriesTable
          :rows="categoryTableRows"
          :is-loading="isCategoryLoading"
          :current-page="categoryPagination.page"
          :total-pages="categoryPagination.totalPages"
          :total-items="categoryPagination.totalItems"
          :page-size="categoryPagination.pageSize"
          v-model:selected-row-keys="selectedTrainingCategoryIds"
          @action="onCategoryTableAction"
          @update:current-page="onCategoryPageChange"
          @update:page-size="onCategoryPageSizeChange"
          @bulk-delete="deleteSelectedTrainingCategories"
        />
      </template>

      <template v-else>
        <OperationsCalendar
          eyebrow="Training calendar"
          description="Review scheduled training activities by day, week, or month."
          :events="trainingCalendarEvents"
          :is-loading="isTrainingCalendarLoading"
          :error-message="trainingCalendarError"
          @visible-range-change="onTrainingCalendarRangeChange"
        />
      </template>
    </section>
    <CreateTrainingRecordModal
      v-if="isCreateTrainingRecordModalOpen"
      @close="onCloseCreateTrainingRecordModal"
      @submit="onCreateTrainingRecord"
    />
    <UpdateTrainingRecordModal
      v-if="isUpdateTrainingRecordModalOpen && selectedTrainingRecord"
      :initial-values="selectedTrainingRecordFormValues"
      @close="closeUpdateTrainingRecordModal"
      @submit="onUpdateTrainingRecordWithFeedback"
    />
    <ViewTrainingRecordModal
      v-if="isViewTrainingRecordModalOpen && selectedTrainingRecord"
      :training-record="selectedTrainingRecord"
      @close="closeViewTrainingRecordModal"
    />
    <CreateTrainingModal
      v-if="isCreateTrainingModalOpen"
      @close="onCloseCreateTrainingModal"
      @submit="onCreateTrainingWithFeedback"
    />
    <UpdateTrainingModal
      v-if="isUpdateTrainingModalOpen && selectedTraining"
      :initial-values="selectedTrainingFormValues"
      @close="closeUpdateTrainingModal"
      @submit="onUpdateTrainingWithFeedback"
    />
    <ViewTrainingModal
      v-if="isViewTrainingModalOpen && selectedTraining"
      :training="selectedTraining"
      :personnel-rows="trainingPersonnelRows"
      :is-personnel-loading="isTrainingPersonnelLoading"
      @close="closeViewTrainingModal"
    />
    <CreateTrainingCategoryModal
      v-if="isCreateTrainingCategoryModalOpen"
      @close="onCloseCreateTrainingCategoryModal"
      @submit="onCreateTrainingCategoryWithFeedback"
    />
    <UpdateTrainingCategoryModal
      v-if="isUpdateTrainingCategoryModalOpen && selectedTrainingCategory"
      :initial-values="selectedTrainingCategoryFormValues"
      @close="closeUpdateTrainingCategoryModal"
      @submit="onUpdateTrainingCategoryWithFeedback"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import OperationsCalendar from '~/components/calendar/OperationsCalendar.vue'
import BulkUpdateTrainingsModal from '~/components/trainings/BulkUpdateTrainingsModal.vue'
import BulkUpdateTrainingRecordsModal from '~/components/trainings/BulkUpdateTrainingRecordsModal.vue'
import CreateTrainingModal from '~/components/trainings/CreateTrainingModal.vue'
import CreateTrainingRecordModal from '~/components/trainings/CreateTrainingRecordModal.vue'
import CreateTrainingCategoryModal from '~/components/trainings/CreateTrainingCategoryModal.vue'
import UpdateTrainingCategoryModal from '~/components/trainings/UpdateTrainingCategoryModal.vue'
import UpdateTrainingModal from '~/components/trainings/UpdateTrainingModal.vue'
import UpdateTrainingRecordModal from '~/components/trainings/UpdateTrainingRecordModal.vue'
import ViewTrainingModal from '~/components/trainings/ViewTrainingModal.vue'
import TrainingsFilter from '~/components/trainings/TrainingsFilter.vue'
import TrainingCategoriesFilter from '~/components/trainings/TrainingCategoriesFilter.vue'
import TrainingRecordsFilter from '~/components/trainings/TrainingRecordsFilter.vue'
import TrainingsTable from '~/components/trainings/TrainingsTable.vue'
import TrainingRecordsTable from '~/components/trainings/TrainingRecordsTable.vue'
import TrainingCategoriesTable from '~/components/trainings/TrainingCategoriesTable.vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import { useTrainings } from '~/composables/useTrainings'
import { useTrainingRecords } from '~/composables/useTrainingRecords'
import { useTrainingCategories } from '~/composables/useTrainingCategories'
import {
  TRAINING_CATEGORIES_CREATE_BUTTON_LABEL,
  TRAINING_RECORDS_CREATE_BUTTON_LABEL,
  TRAINING_PAGE_KPI_GRID_CLASSES,
  TRAINING_PAGE_SECTION_CLASSES,
  TRAINING_PAGE_SUBTITLE,
  TRAINING_PAGE_TAB_ITEMS,
  TRAINING_PAGE_TAB_REQUIRED_PERMISSIONS,
  TRAINING_PAGE_TABS_ARIA_LABEL,
  TRAINING_PAGE_TITLE,
  TRAININGS_CREATE_BUTTON_LABEL,
} from '~/constants/page.constants'
import { TRAINING_PRIVILEGES } from '~/constants/privileges.constants'
import { APP_MAIN_CONTENT_CLASSES, TRAINING_PAGE_HEADER_CLASSES, TRAINING_TABLE_ACTIONS_ROW_CLASSES } from '~/constants/shared.constants'
import {
  useCreateTrainingCategoryHandler,
  useCreateTrainingHandler,
  useCreateTrainingRecordHandler,
  useDeleteTrainingCategoryHandler,
  useDeleteTrainingHandler,
  useDeleteTrainingRecordHandler,
  useBulkDeleteTrainingRecordsHandler,
  useBulkDeleteTrainingsHandler,
  useBulkDeleteTrainingCategoriesHandler,
  useBulkUpdateTrainingsHandler,
  useValidatedListHandlers,
  useTrainingManagementPageHandlers,
  useTrainingPageActionHandlers,
  useUpdateTrainingCategoryHandler,
  useUpdateTrainingHandler,
  useUpdateTrainingRecordHandler,
  useViewTrainingHandler,
  usePrintTrainingsHandler,
  createCompleteListPrintHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { TrainingCategoryListItem, TrainingListItem, TrainingManagementTabId, TrainingRecordListItem } from '~/types/domain/training'
import type { CalendarEventsQuery } from '~/types/domain/calendar'
import type { FieldValidationMap } from '~/utils/field-validation'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'
import { getTrainingPersonnelEndpoint } from '~/utils/training-endpoints'
import { useDialog } from '~/composables/useDialog'
import { useToast } from '~/composables/useToast'

const authStore = useAuthStore()
const { showDialog } = useDialog()
const { addToast } = useToast()
const activeTab = ref<TrainingManagementTabId>('trainings')
const isCreateTrainingModalOpen = ref(false)
const isCreateTrainingCategoryModalOpen = ref(false)
const isCreateTrainingRecordModalOpen = ref(false)
const isUpdateTrainingModalOpen = ref(false)
const isUpdateTrainingRecordModalOpen = ref(false)
const isUpdateTrainingCategoryModalOpen = ref(false)
const isViewTrainingModalOpen = ref(false)
const isViewTrainingRecordModalOpen = ref(false)
const isTrainingPersonnelLoading = ref(false)
const selectedTraining = ref<TrainingListItem | null>(null)
const selectedTrainingCategory = ref<TrainingCategoryListItem | null>(null)
const selectedTrainingRecord = ref<TrainingRecordListItem | null>(null)
const trainingPersonnelRows = ref<Record<string, string>[]>([])
const hasLoadedTrainingRecords = ref(false)
const hasLoadedTrainings = ref(false)
const hasLoadedCategories = ref(false)
const selectedTrainingRecordIds = ref<string[]>([])
const selectedTrainingIds = ref<string[]>([])
const selectedTrainingCategoryIds = ref<string[]>([])
const isBulkUpdateTrainingsModalOpen = ref(false)
const isBulkUpdateTrainingRecordsModalOpen = ref(false)
const bulkUpdateTrainingsError = ref('')
const bulkUpdateTrainingRecordsError = ref('')

const { deleteSelectedTrainingRecords } = useBulkDeleteTrainingRecordsHandler({
  selectedIds: selectedTrainingRecordIds,
  reload: async () => {
    await loadTrainingRecords()
  },
  showDialog,
})

const { deleteSelectedTrainings } = useBulkDeleteTrainingsHandler({
  selectedIds: selectedTrainingIds,
  reload: async () => {
    await loadTrainings()
  },
  showDialog,
})

const { deleteSelectedTrainingCategories } = useBulkDeleteTrainingCategoriesHandler({
  selectedIds: selectedTrainingCategoryIds,
  reload: async () => {
    await loadTrainingCategories()
  },
  showDialog,
})

const {
  filters: trainingFilters,
  tableRows: trainingTableRows,
  kpis,
  pagination: trainingPagination,
  isLoading: isTrainingLoading,
  error: trainingError,
  loadTrainings,
  loadTrainingCalendarEvents,
  calendarEvents: trainingCalendarEvents,
  calendarIsLoading: isTrainingCalendarLoading,
  calendarError: trainingCalendarError,
  createTraining,
  updateTraining,
  deleteTraining,
  getTrainingById,
} = useTrainings()

const {
  filters: trainingRecordsFilters,
  tableRows: trainingRecordsTableRows,
  pagination: trainingRecordsPagination,
  isLoading: isTrainingRecordsLoading,
  error: trainingRecordsError,
  loadTrainingRecords,
  createTrainingRecord,
  updateTrainingRecord,
  deleteTrainingRecord,
  records,
} = useTrainingRecords()

const {
  filters: categoryFilters,
  tableRows: categoryTableRows,
  pagination: categoryPagination,
  isLoading: isCategoryLoading,
  error: categoryError,
  loadTrainingCategories,
  createTrainingCategory,
  updateTrainingCategory,
  deleteTrainingCategory,
  getTrainingCategoryById,
} = useTrainingCategories()

const { printTrainingCategories, printTrainingRecords, printTrainings } = usePrintTrainingsHandler()
const handlePrintTrainingRecords = createCompleteListPrintHandler({
  rows: trainingRecordsTableRows,
  pagination: trainingRecordsPagination,
  loadPage: (page, pageSize) => loadTrainingRecords(page, trainingRecordsFilters.value, pageSize),
  printItems: printTrainingRecords,
})
const handlePrintTrainings = createCompleteListPrintHandler({
  rows: trainingTableRows,
  pagination: trainingPagination,
  loadPage: (page, pageSize) => loadTrainings(page, trainingFilters.value, pageSize),
  printItems: printTrainings,
})
const handlePrintTrainingCategories = createCompleteListPrintHandler({
  rows: categoryTableRows,
  pagination: categoryPagination,
  loadPage: (page, pageSize) => loadTrainingCategories(page, categoryFilters.value, pageSize),
  printItems: printTrainingCategories,
})
const activeTrainingPrintConfig = computed(() => {
  if (activeTab.value === 'records') {
    return {
      tableName: 'training_records',
      tableLabel: 'Training Records',
      filters: trainingRecordsFilters.value,
      isLoading: isTrainingRecordsLoading.value,
      print: handlePrintTrainingRecords,
    }
  }

  if (activeTab.value === 'categories') {
    return {
      tableName: 'training_categories',
      tableLabel: 'Training Categories',
      filters: categoryFilters.value,
      isLoading: isCategoryLoading.value,
      print: handlePrintTrainingCategories,
    }
  }

  return {
    tableName: 'trainings',
    tableLabel: 'Trainings',
    filters: trainingFilters.value,
    isLoading: isTrainingLoading.value,
    print: handlePrintTrainings,
  }
})

const {
  handleTabChange,
  handleRecordsFilterApply,
  handleRecordsFilterReset,
  handleTrainingFilterApply,
  handleTrainingFilterReset,
  handleCategoryFilterApply,
  handleCategoryFilterReset,
} = useTrainingManagementPageHandlers(
  activeTab,
  trainingRecordsFilters,
  trainingFilters,
  categoryFilters,
)

const {
  onOpenCreateTrainingModal,
  onCloseCreateTrainingModal,
  onCreateTraining,
} = useCreateTrainingHandler({
  isCreateTrainingModalOpen,
  createTraining,
})

const {
  onOpenCreateTrainingRecordModal,
  onCloseCreateTrainingRecordModal,
  onCreateTrainingRecord,
} = useCreateTrainingRecordHandler({
  isCreateTrainingRecordModalOpen,
  createTrainingRecord,
})

const {
  onOpenCreateTrainingCategoryModal,
  onCloseCreateTrainingCategoryModal,
  onCreateTrainingCategory,
} = useCreateTrainingCategoryHandler({
  isCreateTrainingCategoryModalOpen,
  createTrainingCategory,
})

const trainingRecordFilterValidationErrors = ref<FieldValidationMap>({})
const trainingFilterValidationErrors = ref<FieldValidationMap>({})
const categoryFilterValidationErrors = ref<FieldValidationMap>({})

const {
  handleApplyFilters: handleApplyTrainingRecordFilters,
  handleResetFilters: handleResetTrainingRecordFilters,
  handlePageChange: onTrainingRecordsPageChange,
  handlePageSizeChange: onTrainingRecordsPageSizeChange,
} = useValidatedListHandlers({
  filters: trainingRecordsFilters,
  validationErrors: trainingRecordFilterValidationErrors,
  applyFilters: handleRecordsFilterApply,
  resetFilters: handleRecordsFilterReset,
  loadPage: loadTrainingRecords,
  getPageSize: () => trainingRecordsPagination.value.pageSize,
})

const {
  handleApplyFilters: handleApplyTrainingFilters,
  handleResetFilters: handleResetTrainingFilters,
  handlePageChange: onTrainingPageChange,
  handlePageSizeChange: onTrainingPageSizeChange,
} = useValidatedListHandlers({
  filters: trainingFilters,
  validationErrors: trainingFilterValidationErrors,
  applyFilters: handleTrainingFilterApply,
  resetFilters: handleTrainingFilterReset,
  loadPage: loadTrainings,
})

const {
  handleApplyFilters: handleApplyCategoryFilters,
  handleResetFilters: handleResetCategoryFilters,
  handlePageChange: onCategoryPageChange,
  handlePageSizeChange: onCategoryPageSizeChange,
} = useValidatedListHandlers({
  filters: categoryFilters,
  validationErrors: categoryFilterValidationErrors,
  applyFilters: handleCategoryFilterApply,
  resetFilters: handleCategoryFilterReset,
  loadPage: loadTrainingCategories,
})

const visibleTabItems = computed(() => {
  return TRAINING_PAGE_TAB_ITEMS.filter((tabItem) => {
    const requiredPermissions = TRAINING_PAGE_TAB_REQUIRED_PERMISSIONS[tabItem.id as keyof typeof TRAINING_PAGE_TAB_REQUIRED_PERMISSIONS]
    return authStore.hasPermissionAccess(requiredPermissions)
  })
})

const canManageTrainingRecords = computed(() => {
  return authStore.hasPermissionAccess(TRAINING_PRIVILEGES.manage)
})

const showCreateButton = computed(() => {
  if (activeTab.value === 'records') {
    return canManageTrainingRecords.value
  }

  if (!authStore.hasPermissionAccess(TRAINING_PRIVILEGES.create)) {
    return false
  }

  return activeTab.value === 'trainings' || activeTab.value === 'categories'
})

const totalTrainingRecords = computed(() => kpis.value.totalRecords)
const totalTrainings = computed(() => kpis.value.totalTrainings)
const totalCategories = computed(() => kpis.value.totalCategories)
const unusedTrainingCategories = computed(() => kpis.value.unusedCategories)

const createButtonLabel = computed(() => {
  if (activeTab.value === 'records') {
    return TRAINING_RECORDS_CREATE_BUTTON_LABEL
  }

  if (activeTab.value === 'categories') {
    return TRAINING_CATEGORIES_CREATE_BUTTON_LABEL
  }

  return TRAININGS_CREATE_BUTTON_LABEL
})

const onTabChange = handleTabChange

const onTrainingCalendarRangeChange = async (query: CalendarEventsQuery) => {
  await loadTrainingCalendarEvents(query).catch(() => {})
}

const {
  closeUpdateTrainingRecordModal,
  onOpenUpdateTrainingRecordModal,
  onUpdateTrainingRecord,
  selectedTrainingRecordFormValues,
} = useUpdateTrainingRecordHandler({
  isUpdateTrainingRecordModalOpen,
  selectedTrainingRecord,
  updateTrainingRecord,
})

const {
  closeUpdateTrainingModal,
  onOpenUpdateTrainingModal,
  onUpdateTraining,
  selectedTrainingFormValues,
} = useUpdateTrainingHandler({
  isUpdateTrainingModalOpen,
  selectedTraining,
  getTrainingById,
  updateTraining,
})

const {
  closeUpdateTrainingCategoryModal,
  onOpenUpdateTrainingCategoryModal,
  onUpdateTrainingCategory,
  selectedTrainingCategoryFormValues,
} = useUpdateTrainingCategoryHandler({
  isUpdateTrainingCategoryModalOpen,
  selectedTrainingCategory,
  getTrainingCategoryById,
  updateTrainingCategory,
})

const {
  closeViewTrainingModal,
  onViewTraining,
} = useViewTrainingHandler({
  isViewTrainingModalOpen,
  isTrainingPersonnelLoading,
  selectedTraining,
  trainingPersonnelRows,
  getTrainingById,
  getTrainingPersonnel: getTrainingPersonnelEndpoint,
})

const { onDeleteTrainingRecord } = useDeleteTrainingRecordHandler({
  deleteTrainingRecord,
  showDialog,
  onDeleteSuccess: () => showDialog({ type: 'success', title: 'Training record deleted', message: 'Training record has been deleted successfully.', confirmLabel: 'OK' }),
  onDeleteCancelled: () => addToast({ variant: 'warning', title: 'Delete cancelled', message: 'Training record deletion was cancelled.' }),
})

const { onDeleteTraining } = useDeleteTrainingHandler({
  deleteTraining,
  showDialog,
  onDeleteSuccess: () => showDialog({
    type: 'success',
    title: 'Training deleted',
    message: 'Training record has been deleted successfully.',
    confirmLabel: 'OK',
  }),
  onDeleteCancelled: () => addToast({
    title: 'Delete cancelled',
    message: 'Training deletion was cancelled.',
    variant: 'warning',
  }),
})

const { onDeleteTrainingCategory } = useDeleteTrainingCategoryHandler({
  deleteTrainingCategory,
  showDialog,
  onDeleteSuccess: () => showDialog({
    type: 'success',
    title: 'Training category deleted',
    message: 'Training category has been deleted successfully.',
    confirmLabel: 'OK',
  }),
  onDeleteCancelled: () => addToast({
    variant: 'warning',
    title: 'Delete cancelled',
    message: 'Training category deletion was cancelled.',
  }),
})

const {
  onCreateActionClick,
  onTrainingRecordTableAction,
  onTrainingTableAction,
  onCategoryTableAction,
  closeViewTrainingRecordModal,
} = useTrainingPageActionHandlers({
  activeTab,
  records,
  selectedTrainingRecord,
  isViewTrainingRecordModalOpen,
  onOpenCreateTrainingRecordModal,
  onOpenCreateTrainingCategoryModal,
  onOpenCreateTrainingModal,
  onOpenUpdateTrainingRecordModal,
  onDeleteTrainingRecord,
  onViewTraining,
  onOpenUpdateTrainingModal,
  onDeleteTraining,
  onOpenUpdateTrainingCategoryModal,
  onDeleteTrainingCategory,
})

const onCreateTrainingWithFeedback = createModalFeedbackHandler(onCreateTraining, showDialog, {
  successTitle: 'Training created',
  successMessage: 'Training record has been created successfully.',
  errorTitle: 'Create failed',
  errorMessage: 'Unable to create training record right now.',
})

const onUpdateTrainingRecordWithFeedback = createModalFeedbackHandler(onUpdateTrainingRecord, showDialog, {
  successTitle: 'Training record updated',
  successMessage: 'Training record has been updated successfully.',
  errorTitle: 'Update failed',
  errorMessage: 'Unable to update training record right now.',
})

const onUpdateTrainingWithFeedback = createModalFeedbackHandler(onUpdateTraining, showDialog, {
  successTitle: 'Training updated',
  successMessage: 'Training record has been updated successfully.',
  errorTitle: 'Update failed',
  errorMessage: 'Unable to update training record right now.',
})

const onCreateTrainingCategoryWithFeedback = createModalFeedbackHandler(onCreateTrainingCategory, showDialog, {
  successTitle: 'Training category created',
  successMessage: 'Training category has been created successfully.',
  errorTitle: 'Create failed',
  errorMessage: 'Unable to create training category right now.',
})

const onUpdateTrainingCategoryWithFeedback = createModalFeedbackHandler(onUpdateTrainingCategory, showDialog, {
  successTitle: 'Training category updated',
  successMessage: 'Training category has been updated successfully.',
  errorTitle: 'Update failed',
  errorMessage: 'Unable to update training category right now.',
})

onMounted(async () => {
  const loadTasks: Promise<unknown>[] = []
    
  if (canManageTrainingRecords.value && !hasLoadedTrainingRecords.value) {
    loadTasks.push(loadTrainingRecords(1, trainingRecordsFilters.value, trainingRecordsPagination.value.pageSize).then(() => {
      hasLoadedTrainingRecords.value = true
    }))
  }

  if (!hasLoadedTrainings.value) {
    loadTasks.push(loadTrainings(1, trainingFilters.value, trainingPagination.value.pageSize).then(() => {
      hasLoadedTrainings.value = true
    }))
  }

  if (!hasLoadedCategories.value) {
    loadTasks.push(loadTrainingCategories(1, categoryFilters.value, categoryPagination.value.pageSize).then(() => {
      hasLoadedCategories.value = true
    }))
  }

  await Promise.all(loadTasks)
})

watch(
  visibleTabItems,
  (items) => {
    if (items.some(item => item.id === activeTab.value)) {
      return
    }

    const firstVisibleTab = items.at(0)
    if (firstVisibleTab) {
      activeTab.value = firstVisibleTab.id as TrainingManagementTabId
    }
  },
  { immediate: true }
)
</script>
