<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
   <section :class="EQUIPMENT_ISSUANCES_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ EQUIPMENT_ISSUANCES_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_ISSUANCES_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          title="Total Equipment Issuances"
          subtitle="Tracked equipment issuance records."
          icon-name="arrow-path"
          tone="emerald"
          :value="totalEquipmentIssuancesKpi"
        />
      </div>

      <BaseAlert v-if="error" :message="error" tone="danger" />

      <EquipmentIssuancesFilter :model-value="filters" @apply="onApply" @reset="onReset" />

      <EquipmentIssuancesTable
        :rows="tableRows"
        :is-loading="isLoading"
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total-items="pagination.totalItems"
        :page-size="pagination.pageSize"
        @action="onTableAction"
        @update:current-page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
   </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import EquipmentIssuancesFilter from '~/components/equipment/EquipmentIssuancesFilter.vue'
import EquipmentIssuancesTable from '~/components/equipment/EquipmentIssuancesTable.vue'
import { useEquipmentIssuances } from '~/composables/useEquipmentIssuances'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
  EQUIPMENT_ISSUANCES_PAGE_SECTION_CLASSES,
  EQUIPMENT_ISSUANCES_PAGE_SUBTITLE,
  EQUIPMENT_ISSUANCES_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import {
  useDeleteEquipmentIssuanceHandler,
  useEquipmentPageHandlers,
  useEquipmentSearchHandlers,
  useViewEquipmentIssuanceHandler,
} from '~/handlers'
import type { EquipmentIssuanceSearchQuery, EquipmentIssuanceTableRow } from '~/types/domain/equipment'

const {
  filters,
  tableRows,
  pagination,
  isLoading,
  error,
  loadEquipmentIssuances,
  deleteEquipmentIssuance,
} = useEquipmentIssuances()


const { showDialog } = useDialog()
const { handleFilterReset } = useEquipmentPageHandlers(filters)
const { handleFilterApply } = useEquipmentSearchHandlers(filters)

const totalEquipmentIssuancesKpi = computed(() => pagination.value.totalItems)

const { onDeleteEquipmentIssuance } = useDeleteEquipmentIssuanceHandler({
  deleteEquipmentIssuance,
  showDialog,
})

const { onViewEquipmentIssuance } = useViewEquipmentIssuanceHandler({
  showDialog,
})

const onApply = async (value: Partial<EquipmentIssuanceSearchQuery>) => {
  const result = handleFilterApply(value)

  if (!result.isValid) {
    return
  }

  await loadEquipmentIssuances(1, result.filters)
}

const onReset = async () => {
  const resetFilters = handleFilterReset()
  await loadEquipmentIssuances(1, resetFilters)
}

const onPageChange = async (page: number) => {
  await loadEquipmentIssuances(page, filters.value)
}

const onPageSizeChange = async (pageSize: number) => {
  await loadEquipmentIssuances(1, filters.value, pageSize)
}

const onTableAction = async ({ actionKey, row }: { actionKey: string; row: EquipmentIssuanceTableRow }) => {
  if (actionKey === 'view-equipment-issuance') {
    await onViewEquipmentIssuance(row)
    return
  }

  if (actionKey === 'delete-equipment-issuance') {
    await onDeleteEquipmentIssuance(row.id)
  }
}
</script>
