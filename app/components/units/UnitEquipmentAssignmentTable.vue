<template>
  <DataTable
    :title="UNITS_EQUIPMENT_ASSIGNMENT_TABLE_TITLE"
    :columns="UNITS_EQUIPMENT_ASSIGNMENT_TABLE_COLUMNS"
    :rows="tableRows"
    row-key="id"
    :show-search="false"
    :empty-message="UNITS_EQUIPMENT_ASSIGNMENT_TABLE_EMPTY_MESSAGE"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  UNITS_EQUIPMENT_ASSIGNMENT_TABLE_COLUMNS,
  UNITS_EQUIPMENT_ASSIGNMENT_TABLE_EMPTY_MESSAGE,
  UNITS_EQUIPMENT_ASSIGNMENT_TABLE_TITLE,
} from '~/constants/table.constants'
import type { UnitEquipmentAssetListItem } from '~/types/domain/units'

const props = withDefaults(defineProps<{
  rows?: readonly UnitEquipmentAssetListItem[]
  isLoading?: boolean
}>(), {
  rows: () => [],
  isLoading: false,
})

const tableRows = computed(() => {
  return props.rows.map((row) => ({
    ...row,
    assignedPersonnel: row.assignedPersonnelName ?? row.assignedPersonnelCode ?? 'Unassigned',
  }))
})
</script>
