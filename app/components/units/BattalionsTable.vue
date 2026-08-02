<template>
  <DataTable
    :title="BATTALIONS_TABLE_TITLE"
    :columns="BATTALIONS_TABLE_COLUMNS"
    :rows="props.rows"
    row-key="id"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    :actions-column-label="BATTALIONS_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="props.isLoading"
    :show-search="false"
    :empty-message="BATTALIONS_TABLE_EMPTY_MESSAGE"
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
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BATTALION_PRIVILEGES } from '~/constants/privileges.constants'
import {
  BATTALIONS_TABLE_ACTIONS,
  BATTALIONS_TABLE_ACTIONS_COLUMN_LABEL,
  BATTALIONS_TABLE_COLUMNS,
  BATTALIONS_TABLE_EMPTY_MESSAGE,
  BATTALIONS_TABLE_TITLE,
} from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'

const props = withDefaults(defineProps<{
  rows: readonly Record<string, unknown>[]
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
  (event: 'action', payload: { actionKey: string; row: Record<string, unknown> }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
  (event: 'update:selectedRowKeys', value: string[]): void
  (event: 'bulk-delete'): void
}>()

const authStore = useAuthStore()

const visibleActions = computed(() => {
  return BATTALIONS_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'view-battalion') {
      return authStore.hasPermissionAccess(BATTALION_PRIVILEGES.view)
    }

    if (action.key === 'assign-battalion') {
      return authStore.hasPermissionAccess(BATTALION_PRIVILEGES.edit)
    }

    if (action.key === 'edit-battalion') {
      return authStore.hasPermissionAccess(BATTALION_PRIVILEGES.edit)
    }

    if (action.key === 'delete-battalion') {
      return authStore.hasPermissionAccess(BATTALION_PRIVILEGES.delete)
    }

    return true
  })
})
</script>
