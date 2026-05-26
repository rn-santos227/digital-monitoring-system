<template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EQUIPMENT_PRIVILEGES } from '~/constants/privileges.constants'
import {
  EQUIPMENT_ITEMS_TABLE_ACTIONS,
  EQUIPMENT_ITEMS_TABLE_ACTIONS_COLUMN_LABEL,
  EQUIPMENT_ITEMS_TABLE_COLUMNS,
  EQUIPMENT_ITEMS_TABLE_EMPTY_MESSAGE,
  EQUIPMENT_ITEMS_TABLE_TITLE,
} from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'
import type { EquipmentItemTableRow } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{
  rows: readonly EquipmentItemTableRow[]
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  pageSize?: number
}>(), {
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10,
})
</script>
