<template>
  <DataTable
    title="Available Equipment Items"
    :columns="EQUIPMENT_ITEMS_TABLE_COLUMNS"
    :rows="tableRows"
    row-key="id"
    :show-search="false"
    empty-message="No equipment items are currently listed in this category."
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EQUIPMENT_ITEMS_TABLE_COLUMNS } from '~/constants/table.constants'
import type { EquipmentItemListItem, EquipmentItemTableRow } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{
  rows?: readonly EquipmentItemListItem[]
  isLoading?: boolean
}>(), {
  rows: () => [],
  isLoading: false,
})

const tableRows = computed<EquipmentItemTableRow[]>(() => {
  return props.rows.map((row) => ({
    ...row,
    status: row.isActive ? 'Active' : 'Inactive',
  }))
})
</script>
