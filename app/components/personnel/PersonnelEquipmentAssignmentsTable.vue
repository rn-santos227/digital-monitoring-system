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
import type { PersonnelProfileEquipmentRow } from '~/constants/ui.constants'
import {
  PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_COLUMNS,
  PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_EMPTY_MESSAGE,
  PERSONNEL_EQUIPMENT_ASSIGNMENT_TABLE_TITLE,
} from '~/constants/table.constants'

withDefaults(defineProps<{ rows?: PersonnelProfileEquipmentRow[] }>(), {
  rows: () => [],
})
</script>
