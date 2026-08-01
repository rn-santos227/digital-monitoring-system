<template>
  <DataTable
    :title="DEPLOYMENT_RECORDS_TABLE_TITLE"
    :columns="DEPLOYMENT_RECORDS_TABLE_COLUMNS"
    :rows="props.rows"
    row-key="id"
    :actions="visibleActions"
    :actions-column-label="DEPLOYMENTS_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="props.isLoading"
    :show-search="false"
    :empty-message="DEPLOYMENT_RECORDS_TABLE_EMPTY_MESSAGE"
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
        singular-label="deployment record"
        plural-label="deployment records"
        @clear="clearSelection"
        @delete="emit('bulk-delete')"
      />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  DEPLOYMENT_RECORDS_TABLE_COLUMNS,
  DEPLOYMENT_RECORDS_TABLE_EMPTY_MESSAGE,
  DEPLOYMENT_RECORDS_TABLE_TITLE,
  DEPLOYMENTS_TABLE_ACTIONS_COLUMN_LABEL,
} from '~/constants/table.constants'
import { DEPLOYMENT_PRIVILEGES } from '~/constants/privileges.constants'
import type { DataTableAction } from '~/constants/ui.constants'
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

const DEPLOYMENT_RECORDS_TABLE_ACTIONS: readonly DataTableAction[] = Object.freeze([
  { key: 'view-deployment-record', tooltip: 'View record', iconName: 'eye', variant: 'info' },
  { key: 'edit-deployment-record', tooltip: 'Update record', iconName: 'pencil-square', variant: 'warning' },
  { key: 'edit-deployment-record-location', tooltip: 'Update location', iconName: 'map-pin', variant: 'warning' },
  { key: 'delete-deployment-record', tooltip: 'Delete record', iconName: 'trash', variant: 'danger' },
])

const visibleActions = computed<readonly DataTableAction[]>(() => {
  return DEPLOYMENT_RECORDS_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'view-deployment-record') {
      return authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.view)
    }

    if (action.key === 'edit-deployment-record') {
      return authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.edit)
    }

    return authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.delete)
  })
})
</script>
