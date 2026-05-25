<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="EQUIPMENT_CATEGORIES_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">
          {{ EQUIPMENT_CATEGORIES_PAGE_TITLE }}
        </h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_CATEGORIES_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          title="Total Equipment Categories"
          subtitle="Tracked category records in registry."
          icon-name="squares"
          tone="emerald"
          :loader="loadCategoryKpi"
        />

        <KpiCard
          title="Unused Categories"
          subtitle="Categories with no equipment items assigned."
          icon-name="archive"
          tone="amber"
          :loader="loadUnusedCategoryKpi"
        />
      </div>

      <BaseAlert
        v-if="error"
        :message="error"
        tone="danger"
      />

      <EquipmentCategoriesFilter
        :model-value="filters"
        @apply="onApply"
        @reset="onReset"
      />

      <EquipmentCategoriesTable
        :rows="tableRows"
        :is-loading="isLoading"
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total-items="pagination.totalItems"
        :page-size="pagination.pageSize"
        @update:current-page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import KpiCard from '~/components/general/KpiCard.vue'
import CreateEquipmentCategoryModal from '~/components/equipment/CreateEquipmentCategoryModal.vue'
import EquipmentCategoriesFilter from '~/components/equipment/EquipmentCategoriesFilter.vue'
import EquipmentCategoriesTable from '~/components/equipment/EquipmentCategoriesTable.vue'
import UpdateEquipmentCategoryModal from '~/components/equipment/UpdateEquipmentCategoryModal.vue'
import ViewEquipmentCategoryModal from '~/components/equipment/ViewEquipmentCategoryModal.vue'
import { useEquipmentCategories } from '~/composables/useEquipmentCategories'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
  EQUIPMENT_CATEGORIES_PAGE_SECTION_CLASSES,
  EQUIPMENT_CATEGORIES_PAGE_SUBTITLE,
  EQUIPMENT_CATEGORIES_PAGE_TITLE,
  EQUIPMENT_CATEGORIES_PAGE_REQUIRED_PERMISSIONS,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import {
  useCreateEquipmentCategoryHandler,
  useDeleteEquipmentCategoryHandler,
  useEquipmentCategoryPageHandlers,
  useUpdateEquipmentCategoryHandler,
  useViewEquipmentCategoryHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type {
  EquipmentCategoryDetailItem,
  EquipmentCategorySearchQuery,
  EquipmentCategoryTableRow,
} from '~/types/domain/equipment'

const {
  filters,
  tableRows,
  pagination,
  isLoading,
  error,
  loadEquipmentCategories,
} = useEquipmentCategories()

const { handleFilterApply, handleFilterReset } = useEquipmentCategoryPageHandlers(filters)

const onApply = async (value: Record<string, unknown>) => {
  const next = handleFilterApply(value)
  await loadEquipmentCategories(1, next)
}

const onReset = async () => {
  const next = handleFilterReset()
  await loadEquipmentCategories(1, next)
}

const onPageChange = async (page: number) => {
  await loadEquipmentCategories(page)
}

const onPageSizeChange = async (pageSize: number) => {
  await loadEquipmentCategories(1, filters.value, pageSize)
}

const loadCategoryKpi = async (): Promise<KpiCardLoaderResult> => {
  await loadEquipmentCategories(1, filters.value, pagination.value.pageSize)

  return {
    value: pagination.value.totalItems.toLocaleString(),
  }
}

const loadUnusedCategoryKpi = async (): Promise<KpiCardLoaderResult> => {
  await loadEquipmentCategories(1, filters.value, pagination.value.pageSize)

  const unusedCategoryCount = tableRows.value.filter((row) => (row.itemCount ?? 0) === 0).length

  return {
    value: unusedCategoryCount.toLocaleString(),
  }
}
</script>
