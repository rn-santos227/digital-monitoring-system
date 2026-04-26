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

      <template v-if="activeTab === 'records'">
        <BaseAlert :message="TRAINING_RECORDS_PENDING_MESSAGE" tone="info" />
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
          @update:current-page="onCategoryPageChange"
          @update:page-size="onCategoryPageSizeChange"
        />
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import KpiCard from '~/components/general/KpiCard.vue'
import TrainingsFilter from '~/components/trainings/TrainingsFilter.vue'
import TrainingCategoriesFilter from '~/components/trainings/TrainingCategoriesFilter.vue'
import TrainingsTable from '~/components/trainings/TrainingsTable.vue'
import TrainingCategoriesTable from '~/components/trainings/TrainingCategoriesTable.vue'
import { useTrainings } from '~/composables/useTrainings'
import { useTrainingCategories } from '~/composables/useTrainingCategories'
import {
  TRAINING_PAGE_KPI_GRID_CLASSES,
  TRAINING_PAGE_SECTION_CLASSES,
  TRAINING_PAGE_SUBTITLE,
  TRAINING_PAGE_TAB_ITEMS,
  TRAINING_PAGE_TAB_REQUIRED_PERMISSIONS,
  TRAINING_PAGE_TABS_ARIA_LABEL,
  TRAINING_PAGE_TITLE,
  TRAINING_RECORDS_PENDING_MESSAGE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, TRAINING_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import { useTrainingManagementPageHandlers } from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { TrainingManagementTabId } from '~/types/domain/training'
import type { FieldValidationMap } from '~/utils/field-validation'

const authStore = useAuthStore()
const activeTab = ref<TrainingManagementTabId>('trainings')
const kpiRefreshKey = ref(0)

const {
  filters: trainingFilters,
  tableRows: trainingTableRows,
  pagination: trainingPagination,
  isLoading: isTrainingLoading,
  error: trainingError,
  totalItems: totalTrainings,
  loadTrainings,
} = useTrainings()

const {
  filters: categoryFilters,
  tableRows: categoryTableRows,
  pagination: categoryPagination,
  isLoading: isCategoryLoading,
  error: categoryError,
  totalItems: totalCategories,
  loadTrainingCategories,
} = useTrainingCategories()

const {
  handleTabChange,
  handleTrainingFilterApply,
  handleTrainingFilterReset,
  handleCategoryFilterApply,
  handleCategoryFilterReset,
} = useTrainingManagementPageHandlers(
  activeTab,
  trainingFilters,
  categoryFilters,
)

const trainingFilterValidationErrors = ref<FieldValidationMap>({})
const categoryFilterValidationErrors = ref<FieldValidationMap>({})

const visibleTabItems = computed(() => {
  return TRAINING_PAGE_TAB_ITEMS.filter((tabItem) => {
    const requiredPermissions = TRAINING_PAGE_TAB_REQUIRED_PERMISSIONS[tabItem.id as keyof typeof TRAINING_PAGE_TAB_REQUIRED_PERMISSIONS]
    return authStore.hasPermissionAccess(requiredPermissions)
  })
})

const onTabChange = (nextTab: string) => {
  handleTabChange(nextTab)
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

const loadTotalRecords = async (): Promise<KpiCardLoaderResult> => {
  return {
    value: 0,
    context: 'Records tab is reserved for personnel training records.',
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
