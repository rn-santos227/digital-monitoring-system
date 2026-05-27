<template>
  <DataTable
    :title="EQUIPMENT_ASSETS_TABLE_TITLE"
    :columns="EQUIPMENT_ASSETS_TABLE_COLUMNS"
    :rows="props.rows"
    row-key="id"
    :is-loading="props.isLoading"
    :show-search="false"
    :empty-message="EQUIPMENT_ASSETS_TABLE_EMPTY_MESSAGE"
    :current-page="props.currentPage"
    :total-pages="props.totalPages"
    :total-items="props.totalItems"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  />
</template>

<script setup lang="ts">
import {
  EQUIPMENT_ASSETS_TABLE_COLUMNS,
  EQUIPMENT_ASSETS_TABLE_EMPTY_MESSAGE,
  EQUIPMENT_ASSETS_TABLE_TITLE,
} from '~/constants/table.constants'
import type { EquipmentAssetTableRow } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{
  rows: readonly EquipmentAssetTableRow[]
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
}>(), { isLoading: false, currentPage: 1, totalPages: 1, totalItems: 0 })

const emit = defineEmits<{
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()
</script>