<template>
  <DataTable
    :title="COMPANIES_TABLE_TITLE"
    :columns="COMPANIES_TABLE_COLUMNS"
    :rows="props.rows"
    row-key="id"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    :actions-column-label="COMPANIES_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="props.isLoading"
    :show-search="false"
    :empty-message="COMPANIES_TABLE_EMPTY_MESSAGE"
    :current-page="props.currentPage"
    :total-pages="props.totalPages"
    :total-items="props.totalItems"
    :page-size="props.pageSize"
    @action="emit('action', $event)"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { COMPANY_PRIVILEGES } from '~/constants/privileges.constants'
import {
  COMPANIES_TABLE_ACTIONS,
  COMPANIES_TABLE_ACTIONS_COLUMN_LABEL,
  COMPANIES_TABLE_COLUMNS,
  COMPANIES_TABLE_EMPTY_MESSAGE,
  COMPANIES_TABLE_TITLE,
} from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'

const props = withDefaults(defineProps<{
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
  return COMPANIES_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'view-company') {
      return authStore.hasPermissionAccess(COMPANY_PRIVILEGES.view)
    }

    if (action.key === 'assign-company') {
      return authStore.hasPermissionAccess(COMPANY_PRIVILEGES.edit)
    }

    if (action.key === 'edit-company') {
      return authStore.hasPermissionAccess(COMPANY_PRIVILEGES.edit)
    }

    if (action.key === 'delete-company') {
      return authStore.hasPermissionAccess(COMPANY_PRIVILEGES.delete)
    }

    return true
  })
})
</script>
