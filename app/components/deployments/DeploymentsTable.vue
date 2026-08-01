<template>
  <DataTable
    :title="DEPLOYMENTS_TABLE_TITLE"
    :columns="DEPLOYMENTS_TABLE_COLUMNS"
    :rows="props.rows"
    row-key="id"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    :actions-column-label="DEPLOYMENTS_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="props.isLoading"
    :show-search="false"
    :empty-message="DEPLOYMENTS_TABLE_EMPTY_MESSAGE"
    :current-page="props.currentPage"
    :total-pages="props.totalPages"
    :total-items="props.totalItems"
    :page-size="props.pageSize"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
    @action="emit('action', $event)"
  />
</template>

<script setup lang="ts">
import {
  DEPLOYMENTS_TABLE_ACTIONS,
  DEPLOYMENTS_TABLE_ACTIONS_COLUMN_LABEL,
  DEPLOYMENTS_TABLE_COLUMNS,
  DEPLOYMENTS_TABLE_EMPTY_MESSAGE,
  DEPLOYMENTS_TABLE_TITLE,
} from '~/constants/table.constants'
import { computed } from 'vue'
import { DEPLOYMENT_PRIVILEGES } from '~/constants/privileges.constants'
import { useAuthStore } from '~/stores/auth'

const props = withDefaults(defineProps<{
  rows: readonly Record<string, unknown>[]
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  pageSize?: number
  selectedRowKeys?: readonly string[]
  showActions?: boolean
}>(), {
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10,
  selectedRowKeys: () => [],
  showActions: false,
})

const emit = defineEmits<{
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
  (event: 'action', payload: { actionKey: string; row: Record<string, unknown> }): void
  (event: 'update:selectedRowKeys', value: string[]): void
  (event: 'bulk-delete'): void
}>()

const authStore = useAuthStore()
const visibleActions = computed(() => {
  if (!props.showActions) {
    return []
  }

  return DEPLOYMENTS_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'view-deployment') {
      return authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.view)
    }

    if (action.key === 'edit-deployment-details' || action.key === 'edit-deployment-location') {
      return authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.edit)
    }

    if (action.key === 'delete-deployment') {
      return authStore.hasPermissionAccess(DEPLOYMENT_PRIVILEGES.delete)
    }

    return true
  })
})
</script>
