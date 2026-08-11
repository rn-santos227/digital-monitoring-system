<template>
  <DataTable
    :title="USERS_PROFILE_TABLE_TITLE"
    :columns="USERS_PROFILE_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    :actions-column-label="USERS_PROFILE_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="isLoading"
    :show-search="false"
    :empty-message="USERS_PROFILE_TABLE_EMPTY_MESSAGE"
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
      <BulkTableAction
        :selected-count="selectedKeys.length"
        singular-label="user profile"
        plural-label="user profiles"
        @clear="clearSelection"
        @delete="emit('bulk-delete')"
      />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  USERS_PROFILE_REQUIRED_PERMISSIONS,
} from '~/constants/page.constants'
import {
  USERS_PROFILE_TABLE_ACTIONS,
  USERS_PROFILE_TABLE_ACTIONS_COLUMN_LABEL,
  USERS_PROFILE_TABLE_COLUMNS,
  USERS_PROFILE_TABLE_EMPTY_MESSAGE,
  USERS_PROFILE_TABLE_TITLE,
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
  return USERS_PROFILE_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'edit-user-profile' || action.key === 'change-user-password' || action.key === 'toggle-user-activation') {
      return authStore.hasPermissionAccess(USERS_PROFILE_REQUIRED_PERMISSIONS.edit)
    }

    if (action.key === 'delete-user-profile') {
      return authStore.hasPermissionAccess(USERS_PROFILE_REQUIRED_PERMISSIONS.delete)
    }

    return true
  })
})
</script>
