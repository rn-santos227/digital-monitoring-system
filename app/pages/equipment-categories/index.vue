<template>

</template>

<script setup lang="ts">
import type { KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import KpiCard from '~/components/general/KpiCard.vue'
import EquipmentCategoriesFilter from '~/components/equipment/EquipmentCategoriesFilter.vue'
import EquipmentCategoriesTable from '~/components/equipment/EquipmentCategoriesTable.vue'
import { useEquipmentCategories } from '~/composables/useEquipmentCategories'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
  EQUIPMENT_CATEGORIES_PAGE_SECTION_CLASSES,
  EQUIPMENT_CATEGORIES_PAGE_SUBTITLE,
  EQUIPMENT_CATEGORIES_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import { useEquipmentCategoryPageHandlers } from '~/handlers'

const { showDialog } = useDialog()
const {
  filters,
  tableRows,
  pagination,
  isLoading,
  error,
  loadEquipmentCategories,
  deleteEquipmentCategory,
} = useEquipmentCategories()

const { handleFilterApply, handleFilterReset } = useEquipmentCategoryPageHandlers(filters)

const onApply = async (value: Record<string, unknown>) => {
  const next = handleFilterApply(value)
  await loadEquipmentCategories(1, next)
}
</script>
