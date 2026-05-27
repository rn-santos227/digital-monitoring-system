<template>
 <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="EQUIPMENT_ITEMS_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ EQUIPMENT_ITEMS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_ITEMS_PAGE_SUBTITLE }}</p>
      </header>

      <BaseAlert v-if="error" :message="error" tone="danger" />

      <EquipmentItemFilter :model-value="filters" @apply="onApply" @reset="onReset" />

      <EquipmentItemsTable
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
import EquipmentItemsFilter from '~/components/equipment/EquipmentItemsFilter.vue'
import EquipmentItemsTable from '~/components/equipment/EquipmentItemsTable.vue'
import { useEquipmentItems } from '~/composables/useEquipmentItems'
import {
  EQUIPMENT_ITEMS_PAGE_SECTION_CLASSES,
  EQUIPMENT_ITEMS_PAGE_SUBTITLE,
  EQUIPMENT_ITEMS_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import { useEquipmentPageHandlers, useEquipmentSearchHandlers } from '~/handlers'
import type { EquipmentItemSearchQuery } from '~/types/domain/equipment'

const { filters, tableRows, pagination, isLoading, error, loadEquipmentItems } = useEquipmentItems()
const { handleFilterReset } = useEquipmentPageHandlers(filters)
const { handleFilterApply } = useEquipmentSearchHandlers(filters)

const onApply = async (value: Partial<EquipmentItemSearchQuery>) => {
  const result = handleFilterApply(value)

  if (!result.isValid) {
    return
  }

  await loadEquipmentItems(1, result.filters)
}

const onReset = async () => {
  const next = handleFilterReset()
  await loadEquipmentItems(1, next)
}

const onPageChange = async (page: number) => {
  await loadEquipmentItems(page)
}

const onPageSizeChange = async (pageSize: number) => {
  await loadEquipmentItems(1, filters.value, pageSize)
}
</script>
