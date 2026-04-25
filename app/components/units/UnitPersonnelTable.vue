<template>
  <DataTable
    :title="UNITS_PERSONNEL_TABLE_TITLE"
    :columns="UNITS_PERSONNEL_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :show-search="false"
    :empty-message="UNITS_PERSONNEL_TABLE_EMPTY_MESSAGE"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import {
  UNITS_PERSONNEL_TABLE_COLUMNS,
  UNITS_PERSONNEL_TABLE_EMPTY_MESSAGE,
  UNITS_PERSONNEL_TABLE_TITLE,
} from '~/constants/table.constants'
import type { UnitPersonnelListItem } from '~/types/domain/units'

withDefaults(defineProps<{
  rows?: readonly UnitPersonnelListItem[]
  isLoading?: boolean
}>(), {
  rows: () => [],
  isLoading: false,
})
</script>
