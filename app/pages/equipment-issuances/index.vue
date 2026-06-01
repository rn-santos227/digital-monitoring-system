<template>

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
</script>
