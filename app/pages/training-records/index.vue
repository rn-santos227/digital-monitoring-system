<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="TRAINING_PAGE_SECTION_CLASSES">
      <header :class="TRAINING_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ TRAINING_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ TRAINING_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="TRAINING_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          :key="`training-records-${kpiRefreshKey}`"
          title="Total Records"
          subtitle="Training records currently encoded."
          icon-name="clipboard-document-list"
          tone="amber"
          :loader="loadTotalRecords"
        />
        <KpiCard
          :key="`trainings-${kpiRefreshKey}`"
          title="Total Trainings"
          subtitle="Training master records available for assignment."
          icon-name="academic-cap"
          tone="sky"
          :loader="loadTotalTrainings"
        />
        <KpiCard
          :key="`training-categories-${kpiRefreshKey}`"
          title="Total Categories"
          subtitle="Training categories configured in the registry."
          icon-name="squares"
          tone="violet"
          :loader="loadTotalCategories"
        />
      </div>

      <BaseTab
        :model-value="activeTab"
        :items="visibleTabItems"
        :aria-label="TRAINING_PAGE_TABS_ARIA_LABEL"
        @update:model-value="onTabChange"
      />

      <div v-if="showCreateButton" :class="TRAINING_TABLE_ACTIONS_ROW_CLASSES">
        <BaseButton @click="onCreateActionClick">
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
          @update:current-page="onTrainingRecordsPageChange"
          @update:page-size="onTrainingRecordsPageSizeChange"
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
          @action="onTrainingTableAction"
          @update:current-page="onTrainingPageChange"
          @update:page-size="onTrainingPageSizeChange"
        />
      </template>

      <template v-else>
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
          @action="onCategoryTableAction"
          @update:current-page="onCategoryPageChange"
          @update:page-size="onCategoryPageSizeChange"
        />
      </template>
    </section>
    <CreateTrainingRecordModal
      v-if="isCreateTrainingRecordModalOpen"
      @close="onCloseCreateTrainingRecordModal"
      @submit="onCreateTrainingRecord"
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
import { computed, ref, watch } from 'vue'
import type { KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import KpiCard from '~/components/general/KpiCard.vue'
import CreateTrainingModal from '~/components/trainings/CreateTrainingModal.vue'
import CreateTrainingRecordModal from '~/components/trainings/CreateTrainingRecordModal.vue'
import CreateTrainingCategoryModal from '~/components/trainings/CreateTrainingCategoryModal.vue'
import UpdateTrainingCategoryModal from '~/components/trainings/UpdateTrainingCategoryModal.vue'
import UpdateTrainingModal from '~/components/trainings/UpdateTrainingModal.vue'
import ViewTrainingModal from '~/components/trainings/ViewTrainingModal.vue'
import TrainingsFilter from '~/components/trainings/TrainingsFilter.vue'
import TrainingCategoriesFilter from '~/components/trainings/TrainingCategoriesFilter.vue'
import TrainingRecordsFilter from '~/components/trainings/TrainingRecordsFilter.vue'
import TrainingsTable from '~/components/trainings/TrainingsTable.vue'
import TrainingRecordsTable from '~/components/trainings/TrainingRecordsTable.vue'
import TrainingCategoriesTable from '~/components/trainings/TrainingCategoriesTable.vue'
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
  useTrainingManagementPageHandlers,
  useUpdateTrainingCategoryHandler,
  useUpdateTrainingHandler,
  useViewTrainingHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { TrainingCategoryListItem, TrainingListItem, TrainingManagementTabId } from '~/types/domain/training'
import type { FieldValidationMap } from '~/utils/field-validation'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'
import { getTrainingPersonnelEndpoint } from '~/utils/training-endpoints'
import { useDialog } from '~/composables/useDialog'
import { useToast } from '~/composables/useToast'

const authStore = useAuthStore()
const { showDialog } = useDialog()
const { addToast } = useToast()
const activeTab = ref<TrainingManagementTabId>('trainings')
const kpiRefreshKey = ref(0)
const isCreateTrainingModalOpen = ref(false)
const isCreateTrainingCategoryModalOpen = ref(false)
const isCreateTrainingRecordModalOpen = ref(false)
const isUpdateTrainingModalOpen = ref(false)
const isUpdateTrainingCategoryModalOpen = ref(false)
const isViewTrainingModalOpen = ref(false)
const isTrainingPersonnelLoading = ref(false)
const selectedTraining = ref<TrainingListItem | null>(null)
const selectedTrainingCategory = ref<TrainingCategoryListItem | null>(null)
const trainingPersonnelRows = ref<Record<string, string>[]>([])

const {
  filters: trainingFilters,
  tableRows: trainingTableRows,
  pagination: trainingPagination,
  isLoading: isTrainingLoading,
  error: trainingError,
  totalItems: totalTrainings,
  loadTrainings,
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
  totalItems: totalTrainingRecords,
  loadTrainingRecords,
  createTrainingRecord,
} = useTrainingRecords()

const {
  filters: categoryFilters,
  tableRows: categoryTableRows,
  pagination: categoryPagination,
  isLoading: isCategoryLoading,
  error: categoryError,
  totalItems: totalCategories,
  loadTrainingCategories,
  createTrainingCategory,
  updateTrainingCategory,
  deleteTrainingCategory,
  getTrainingCategoryById,
} = useTrainingCategories()


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
  loadTrainings,
  trainingFilters,
  kpiRefreshKey,
})

const {
  onOpenCreateTrainingRecordModal,
  onCloseCreateTrainingRecordModal,
  onCreateTrainingRecord,
} = useCreateTrainingRecordHandler({
  isCreateTrainingRecordModalOpen,
  createTrainingRecord,
  loadTrainingRecords,
  trainingRecordFilters: trainingRecordsFilters,
  trainingRecordsPageSize: computed(() => trainingRecordsPagination.value.pageSize),
  kpiRefreshKey,
})

const {
  onOpenCreateTrainingCategoryModal,
  onCloseCreateTrainingCategoryModal,
  onCreateTrainingCategory,
} = useCreateTrainingCategoryHandler({
  isCreateTrainingCategoryModalOpen,
  createTrainingCategory,
  loadTrainingCategories,
  categoryFilters,
  kpiRefreshKey,
})

const trainingRecordFilterValidationErrors = ref<FieldValidationMap>({})
const trainingFilterValidationErrors = ref<FieldValidationMap>({})
const categoryFilterValidationErrors = ref<FieldValidationMap>({})

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

const createButtonLabel = computed(() => {
  if (activeTab.value === 'records') {
    return TRAINING_RECORDS_CREATE_BUTTON_LABEL
  }

  if (activeTab.value === 'categories') {
    return TRAINING_CATEGORIES_CREATE_BUTTON_LABEL
  }

  return TRAININGS_CREATE_BUTTON_LABEL
})

const onCreateActionClick = () => {
  if (activeTab.value === 'records') {
    onOpenCreateTrainingRecordModal()
    return
  }

  if (activeTab.value === 'categories') {
    onOpenCreateTrainingCategoryModal()
    return
  }

  if (activeTab.value === 'trainings') {
    onOpenCreateTrainingModal()
  }
}

const onTabChange = (nextTab: string) => {
  handleTabChange(nextTab)
}

const handleApplyTrainingRecordFilters = async (value: typeof trainingRecordsFilters.value) => {
  const { filters, errors, isValid } = handleRecordsFilterApply(value)
  trainingRecordFilterValidationErrors.value = errors

  if (!isValid) {
    return
  }

  await loadTrainingRecords(1, filters)
  kpiRefreshKey.value += 1
}

const handleResetTrainingRecordFilters = async () => {
  trainingRecordFilterValidationErrors.value = {}
  const filters = handleRecordsFilterReset()
  await loadTrainingRecords(1, filters)
  kpiRefreshKey.value += 1
}

const handleApplyTrainingFilters = async (value: typeof trainingFilters.value) => {
  const { filters, errors, isValid } = handleTrainingFilterApply(value)
  trainingFilterValidationErrors.value = errors

  if (!isValid) {
    return
  }

  await loadTrainings(1, filters)
  kpiRefreshKey.value += 1
}

const handleResetTrainingFilters = async () => {
  trainingFilterValidationErrors.value = {}
  const filters = handleTrainingFilterReset()
  await loadTrainings(1, filters)
  kpiRefreshKey.value += 1
}

const handleApplyCategoryFilters = async (value: typeof categoryFilters.value) => {
  const { filters, errors, isValid } = handleCategoryFilterApply(value)
  categoryFilterValidationErrors.value = errors

  if (!isValid) {
    return
  }

  await loadTrainingCategories(1, filters)
  kpiRefreshKey.value += 1
}

const handleResetCategoryFilters = async () => {
  categoryFilterValidationErrors.value = {}
  const filters = handleCategoryFilterReset()
  await loadTrainingCategories(1, filters)
  kpiRefreshKey.value += 1
}

const onTrainingRecordsPageChange = (nextPage: number) => {
  void loadTrainingRecords(nextPage, trainingRecordsFilters.value, trainingRecordsPagination.value.pageSize)
}

const onTrainingRecordsPageSizeChange = (nextPageSize: number) => {
  void loadTrainingRecords(1, trainingRecordsFilters.value, nextPageSize)
}

const onTrainingPageChange = (nextPage: number) => {
  void loadTrainings(nextPage, trainingFilters.value)
}

const onTrainingPageSizeChange = (nextPageSize: number) => {
  void loadTrainings(1, trainingFilters.value, nextPageSize)
}

const onCategoryPageChange = (nextPage: number) => {
  void loadTrainingCategories(nextPage, categoryFilters.value)
}

const onCategoryPageSizeChange = (nextPageSize: number) => {
  void loadTrainingCategories(1, categoryFilters.value, nextPageSize)
}

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
  loadTrainings,
  trainingFilters,
  kpiRefreshKey,
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
  loadTrainingCategories,
  categoryFilters,
  kpiRefreshKey,
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

const { onDeleteTraining } = useDeleteTrainingHandler({
  deleteTraining,
  loadTrainings,
  trainingFilters,
  kpiRefreshKey,
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
  loadTrainingCategories,
  categoryFilters,
  kpiRefreshKey,
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

const onTrainingTableAction = async (payload: { actionKey: string; row: Record<string, unknown> }) => {
  const rowId = String(payload.row.id ?? '')
  if (!rowId) {
    return
  }

  if (payload.actionKey === 'view-training') {
    await onViewTraining(rowId)
    return
  }

  if (payload.actionKey === 'edit-training') {
    await onOpenUpdateTrainingModal(rowId)
    return
  }

  if (payload.actionKey !== 'delete-training') {
    return
  }

  await onDeleteTraining(rowId)
}

const onCategoryTableAction = async (payload: { actionKey: string; row: Record<string, unknown> }) => {
  const rowId = String(payload.row.id ?? '')
  if (!rowId) {
    return
  }

  if (payload.actionKey === 'edit-training-category') {
    await onOpenUpdateTrainingCategoryModal(rowId)
    return
  }

  if (payload.actionKey !== 'delete-training-category') {
    return
  }

  await onDeleteTrainingCategory(rowId)
}

const onCreateTrainingWithFeedback = createModalFeedbackHandler(onCreateTraining, showDialog, {
  successTitle: 'Training created',
  successMessage: 'Training record has been created successfully.',
  errorTitle: 'Create failed',
  errorMessage: 'Unable to create training record right now.',
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

const loadTotalRecords = async (): Promise<KpiCardLoaderResult> => {
  if (canManageTrainingRecords.value) {
    await loadTrainingRecords(1, trainingRecordsFilters.value, 10)
  }

  return {
    value: totalTrainingRecords.value,
    context: 'Personnel training records currently available in the training module.',
  }
}

const loadTotalTrainings = async (): Promise<KpiCardLoaderResult> => {
  await loadTrainings(1, trainingFilters.value, 10)

  return {
    value: totalTrainings.value,
    context: 'Trainings currently available in the training module.',
  }
}

const loadTotalCategories = async (): Promise<KpiCardLoaderResult> => {
  await loadTrainingCategories(1, categoryFilters.value, 10)

  return {
    value: totalCategories.value,
    context: 'Training categories currently available in the training module.',
  }
}

watch(
  activeTab,
  (tabId) => {
    if (tabId !== 'records') {
      return
    }

    if (!canManageTrainingRecords.value) {
      return
    }

    void loadTrainingRecords(1, trainingRecordsFilters.value, trainingRecordsPagination.value.pageSize)
  },
  { immediate: true }
)

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
