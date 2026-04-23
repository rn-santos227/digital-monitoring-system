app/pages/units/index.vue<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="UNITS_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ UNITS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ UNITS_PAGE_SUBTITLE }}</p>
      </header>

      <BaseTab
        :model-value="activeTab"
        :items="visibleTabItems"
        :aria-label="UNITS_PAGE_TABS_ARIA_LABEL"
        @update:model-value="onTabChange"
      />

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
          @update:current-page="onBattalionPageChange"
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
          @update:current-page="onCompanyPageChange"
        />
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BattalionsFilter from '~/components/units/BattalionsFilter.vue'
import BattalionsTable from '~/components/units/BattalionsTable.vue'
import CompaniesFilter from '~/components/units/CompaniesFilter.vue'
import CompaniesTable from '~/components/units/CompaniesTable.vue'
import { useBattalions } from '~/composables/useBattalions'
import { useCompanies } from '~/composables/useCompanies'
import {
  UNITS_PAGE_SECTION_CLASSES,
  UNITS_PAGE_SUBTITLE,
  UNITS_PAGE_TAB_ITEMS,
  UNITS_PAGE_TAB_REQUIRED_PERMISSIONS,
  UNITS_PAGE_TABS_ARIA_LABEL,
  UNITS_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import { useBattalionFilterHandlers, useCompanyFilterHandlers, useUnitsPageHandlers } from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { UnitManagementTabId } from '~/types/domain/units'
import type { FieldValidationMap } from '~/utils/field-validation'

const activeTab = ref<UnitManagementTabId>('battalion')
const authStore = useAuthStore()

const {
  filters: battalionFilters,
  tableRows: battalionTableRows,
  pagination: battalionPagination,
  isLoading: isBattalionsLoading,
  error: battalionError,
  loadBattalions,
} = useBattalions()

const {
  filters: companyFilters,
  tableRows: companyTableRows,
  pagination: companyPagination,
  isLoading: isCompaniesLoading,
  error: companyError,
  loadCompanies,
} = useCompanies()

const { handleTabChange } = useUnitsPageHandlers(activeTab)

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
