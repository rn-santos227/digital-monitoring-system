<template>
  <DataTable
    :title="EQUIPMENT_ITEMS_TABLE_TITLE"
    :columns="EQUIPMENT_ITEMS_TABLE_COLUMNS"
    :rows="props.rows"
    row-key="id"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    :actions-column-label="EQUIPMENT_ITEMS_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="props.isLoading"
    :show-search="false"
    :empty-message="EQUIPMENT_ITEMS_TABLE_EMPTY_MESSAGE"
    :current-page="props.currentPage"
    :total-pages="props.totalPages"
    :total-items="props.totalItems"
    @action="emit('action', $event)"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  />
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

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: EquipmentItemTableRow }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()

const authStore = useAuthStore()

const visibleActions = computed(() => {
  return EQUIPMENT_ITEMS_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'view-equipment-item') {
      return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.view)
    }

    if (action.key === 'edit-equipment-item') {
      return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.edit)
    }

    return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.delete)
  }
}
</script>
