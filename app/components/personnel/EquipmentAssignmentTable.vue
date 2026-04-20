<template>
  <DataTable
    :title="PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_TITLE"
    :columns="PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :show-search="false"
    :empty-message="PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_EMPTY_MESSAGE"
  />
</template>

<script setup lang="ts">
import {
  PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_COLUMNS,
  PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_EMPTY_MESSAGE,
  PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_TITLE,
} from '~/constants/table.constants'

interface EquipmentAssignmentTableRow {
  id: string
  assetCode: string
  itemName: string
  issuedAt: string
  returnedAt: string
  assignmentStatus: string
}

withDefaults(defineProps<{ rows?: EquipmentAssignmentTableRow[] }>(), {
  rows: () => [],
})
</script>
