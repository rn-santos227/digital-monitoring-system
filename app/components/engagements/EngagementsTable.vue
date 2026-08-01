<template>
  <DataTable
    :title="ENGAGEMENTS_TABLE_TITLE"
    :columns="ENGAGEMENTS_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :actions="visibleActions"
    :actions-column-label="ENGAGEMENTS_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="isLoading"
    :show-search="false"
    :empty-message="ENGAGEMENTS_TABLE_EMPTY_MESSAGE"
    :current-page="currentPage"
    :total-pages="totalPages"
    :total-items="totalItems"
    :page-size="pageSize"
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
        singular-label="engagement"
        plural-label="engagements"
        @clear="clearSelection"
        @delete="emit('bulk-delete')"
      />
    </template>
  </DataTable>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { ENGAGEMENT_PRIVILEGES } from '~/constants/privileges.constants'
import {
  ENGAGEMENTS_TABLE_ACTIONS_COLUMN_LABEL,
  ENGAGEMENTS_TABLE_COLUMNS,
  ENGAGEMENTS_TABLE_EMPTY_MESSAGE,
  ENGAGEMENTS_TABLE_TITLE,
} from '~/constants/table.constants'
import type { DataTableAction } from '~/constants/ui.constants'
import { useAuthStore } from '~/stores/auth'

withDefaults(defineProps<{
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

const engagementActions: readonly DataTableAction[] = Object.freeze([
  { key: 'view-engagement', tooltip: 'View record', iconName: 'eye', variant: 'info' },
  { key: 'edit-engagement', tooltip: 'Update record', iconName: 'pencil-square', variant: 'warning' },
  { key: 'delete-engagement', tooltip: 'Delete record', iconName: 'trash', variant: 'danger' },
])

const visibleActions = computed<readonly DataTableAction[]>(() => {
  return engagementActions.filter((action) => {
    if (action.key === 'view-engagement') {
      return authStore.hasPermissionAccess(ENGAGEMENT_PRIVILEGES.view)
    }

    if (action.key === 'edit-engagement') {
      return authStore.hasPermissionAccess(ENGAGEMENT_PRIVILEGES.edit)
    }

    return authStore.hasPermissionAccess(ENGAGEMENT_PRIVILEGES.delete)
  })
})
</script>
