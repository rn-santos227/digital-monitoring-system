<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="EQUIPMENT_CATEGORIES_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">
          {{ EQUIPMENT_CATEGORIES_PAGE_TITLE }}
        </h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_CATEGORIES_PAGE_SUBTITLE }}</p>
      </header>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import KpiCard from '~/components/general/KpiCard.vue'
import EquipmentCategoriesFilter from '~/components/equipment/EquipmentCategoriesFilter.vue'
import EquipmentCategoriesTable from '~/components/equipment/EquipmentCategoriesTable.vue'
import { useEquipmentCategories } from '~/composables/useEquipmentCategories'
import {
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
  EQUIPMENT_CATEGORIES_PAGE_SECTION_CLASSES,
  EQUIPMENT_CATEGORIES_PAGE_SUBTITLE,
  EQUIPMENT_CATEGORIES_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import { useEquipmentCategoryPageHandlers } from '~/handlers'

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
</script>
