<template>
  <DataTable
    :title="USERS_ACCOUNT_TABLE_TITLE"
    :columns="USERS_ACCOUNT_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    :actions-column-label="USERS_ACCOUNT_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="isLoading"
    :show-search="false"
    :empty-message="USERS_ACCOUNT_TABLE_EMPTY_MESSAGE"
    :current-page="currentPage"
    :total-pages="totalPages"
    :total-items="totalItems"
    :page-size="pageSize"
    @action="emit('action', $event)"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  USERS_ACCOUNT_REQUIRED_PERMISSIONS,
} from '~/constants/page.constants'
import {
  USERS_ACCOUNT_TABLE_ACTIONS,
  USERS_ACCOUNT_TABLE_ACTIONS_COLUMN_LABEL,
  USERS_ACCOUNT_TABLE_COLUMNS,
  USERS_ACCOUNT_TABLE_EMPTY_MESSAGE,
  USERS_ACCOUNT_TABLE_TITLE,
} from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'

withDefaults(defineProps<{
  rows: readonly Record<string, unknown>[]
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
  (event: 'action', payload: { actionKey: string; row: Record<string, unknown> }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()

const authStore = useAuthStore()

const visibleActions = computed(() => {
  return USERS_ACCOUNT_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'edit-account-type') {
      return authStore.hasPermissionAccess(USERS_ACCOUNT_REQUIRED_PERMISSIONS.edit)
    }

    if (action.key === 'delete-account-type') {
      return authStore.hasPermissionAccess(USERS_ACCOUNT_REQUIRED_PERMISSIONS.delete)
    }

    return true
  })
})
</script>
