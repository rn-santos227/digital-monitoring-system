<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import EquipmentAssetsFilter from '~/components/equipment/EquipmentAssetsFilter.vue'
import EquipmentAssetsTable from '~/components/equipment/EquipmentAssetsTable.vue'
import { useEquipmentAssets } from '~/composables/useEquipmentAssets'
import {
  EQUIPMENT_ASSETS_PAGE_SECTION_CLASSES,
  EQUIPMENT_ASSETS_PAGE_SUBTITLE,
  EQUIPMENT_ASSETS_PAGE_TITLE,
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import { useEquipmentSearchHandlers } from '~/handlers'
import type { EquipmentAssetSearchQuery } from '~/types/domain/equipment'

const { filters, tableRows, pagination, isLoading, error, loadEquipmentAssets } = useEquipmentAssets()
const { handleFilterApply, handleFilterReset } = useEquipmentSearchHandlers(filters)
const totalEquipmentAssetsKpi = computed(() => pagination.value.totalItems)

const issuedEquipmentAssetsKpi = computed(() => {
  return tableRows.value.filter((item) => item.assetStatusName.toLowerCase().includes('issued')).length
})

const notIssuedEquipmentAssetsKpi = computed(() => {
  return Math.max(0, totalEquipmentAssetsKpi.value - issuedEquipmentAssetsKpi.value)
})

const onApply = async (value: Partial<EquipmentAssetSearchQuery>) => {
  const result = handleFilterApply(value)
  if (!result.isValid) {
    return
  }
  await loadEquipmentAssets(1, result.filters)
}

const onReset = async () => {
  const next = handleFilterReset()
  await loadEquipmentAssets(1, next)
}

const onPageChange = async (page: number) => {
  await loadEquipmentAssets(page)
}

const onPageSizeChange = async (pageSize: number) => {
  await loadEquipmentAssets(1, filters.value, pageSize)
}
</script>
