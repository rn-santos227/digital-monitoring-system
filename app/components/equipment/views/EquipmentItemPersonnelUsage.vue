<template>
  <DataTable
    :title="EQUIPMENT_ITEM_PERSONNEL_USAGE_TABLE_TITLE"
    :columns="EQUIPMENT_ITEM_PERSONNEL_USAGE_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :show-search="false"
    :empty-message="EQUIPMENT_ITEM_PERSONNEL_USAGE_TABLE_EMPTY_MESSAGE"
    :is-loading="isLoading"
    :current-page="currentPage"
    :total-pages="totalPages"
    :total-items="totalItems"
    :page-size="pageSize"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  />
</template>

<script setup lang="ts">
import {
  EQUIPMENT_ITEM_PERSONNEL_USAGE_TABLE_COLUMNS,
  EQUIPMENT_ITEM_PERSONNEL_USAGE_TABLE_EMPTY_MESSAGE,
  EQUIPMENT_ITEM_PERSONNEL_USAGE_TABLE_TITLE,
} from '~/constants/table.constants'
import type { EquipmentItemPersonnelUsageListItem } from '~/types/domain/equipment'

withDefaults(defineProps<{
  rows?: EquipmentItemPersonnelUsageListItem[]
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  pageSize?: number
}>(), {
  rows: () => [],
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10,
})

const emit = defineEmits<{
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()
</script>
