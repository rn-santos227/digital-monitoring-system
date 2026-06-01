<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EQUIPMENT_PRIVILEGES } from '~/constants/privileges.constants'
import {
  EQUIPMENT_ISSUANCES_TABLE_ACTIONS,
  EQUIPMENT_ISSUANCES_TABLE_ACTIONS_COLUMN_LABEL,
  EQUIPMENT_ISSUANCES_TABLE_COLUMNS,
  EQUIPMENT_ISSUANCES_TABLE_EMPTY_MESSAGE,
  EQUIPMENT_ISSUANCES_TABLE_TITLE,
} from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'
import type { EquipmentIssuanceTableRow } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{
  rows: readonly EquipmentIssuanceTableRow[]
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

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: EquipmentIssuanceTableRow }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()


</script>
