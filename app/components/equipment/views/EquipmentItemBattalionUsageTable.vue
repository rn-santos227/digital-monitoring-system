<template>

</template>

<script setup lang="ts">
import {
  EQUIPMENT_ITEM_BATTALIONS_USAGE_TABLE_COLUMNS,
  EQUIPMENT_ITEM_BATTALIONS_USAGE_TABLE_EMPTY_MESSAGE,
  EQUIPMENT_ITEM_BATTALIONS_USAGE_TABLE_TITLE,
} from '~/constants/table.constants'
import type { EquipmentItemBattalionUsageListItem } from '~/types/domain/equipment'

withDefaults(defineProps<{
  rows?: EquipmentItemBattalionUsageListItem[]
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

</script>
