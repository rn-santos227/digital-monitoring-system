<template>
  
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