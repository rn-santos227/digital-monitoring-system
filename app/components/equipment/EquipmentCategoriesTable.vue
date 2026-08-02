<template>
  <DataTable
    :title="EQUIPMENT_CATEGORIES_TABLE_TITLE"
    :columns="EQUIPMENT_CATEGORIES_TABLE_COLUMNS"
    :rows="props.rows"
    row-key="id"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    :actions-column-label="EQUIPMENT_CATEGORIES_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="props.isLoading"
    :show-search="false"
    :empty-message="EQUIPMENT_CATEGORIES_TABLE_EMPTY_MESSAGE"
    :current-page="props.currentPage"
    :total-pages="props.totalPages"
    :total-items="props.totalItems"
    :page-size="props.pageSize"
    :selectable="visibleActions.some((action) => action.key.startsWith('delete'))"
    :selected-row-keys="selectedRowKeys"
    @update:selected-row-keys="emit('update:selectedRowKeys', $event)"
    @action="emit('action', $event)"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  >
    <template #bulk-actions="{ selectedRowKeys: selectedKeys, clearSelection }">
      <BulkDeleteAction
        :selected-count="selectedKeys.length"
        singular-label="equipment category"
        plural-label="equipment categories"
        @clear="clearSelection"
        @delete="emit('bulk-delete')"
      />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EQUIPMENT_PRIVILEGES } from '~/constants/privileges.constants'
import {
  EQUIPMENT_CATEGORIES_TABLE_ACTIONS,
  EQUIPMENT_CATEGORIES_TABLE_ACTIONS_COLUMN_LABEL,
  EQUIPMENT_CATEGORIES_TABLE_COLUMNS,
  EQUIPMENT_CATEGORIES_TABLE_EMPTY_MESSAGE,
  EQUIPMENT_CATEGORIES_TABLE_TITLE,
} from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'
import type { EquipmentCategoryTableRow } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{
  rows: readonly EquipmentCategoryTableRow[]
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  pageSize?: number
  selectedRowKeys?: readonly string[]
}>(), {
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10,
  selectedRowKeys: () => [],
})

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: EquipmentCategoryTableRow }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
  (event: 'update:selectedRowKeys', value: string[]): void
  (event: 'bulk-delete'): void
}>()

const authStore = useAuthStore()

const visibleActions = computed(() => {
  return EQUIPMENT_CATEGORIES_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'view-equipment-category') {
      return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.view)
    }

    if (action.key === 'edit-equipment-category') {
      return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.edit)
    }

    return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.delete)
  })
})
</script>
