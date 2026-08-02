<template>
  <DataTable
    :title="TRAINING_CATEGORIES_TABLE_TITLE"
    :columns="TRAINING_CATEGORIES_TABLE_COLUMNS"
    :rows="props.rows"
    row-key="id"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    :actions-column-label="TRAINING_CATEGORIES_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="props.isLoading"
    :show-search="false"
    :empty-message="TRAINING_CATEGORIES_TABLE_EMPTY_MESSAGE"
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
import { TRAINING_PAGE_REQUIRED_PERMISSIONS } from '~/constants/page.constants'
import {
  TRAINING_CATEGORIES_TABLE_ACTIONS,
  TRAINING_CATEGORIES_TABLE_ACTIONS_COLUMN_LABEL,
  TRAINING_CATEGORIES_TABLE_COLUMNS,
  TRAINING_CATEGORIES_TABLE_EMPTY_MESSAGE,
  TRAINING_CATEGORIES_TABLE_TITLE,
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

const authStore = useAuthStore()

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: Record<string, unknown> }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()

const visibleActions = computed(() => {
  return TRAINING_CATEGORIES_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'edit-training-category') {
      return authStore.hasPermissionAccess(TRAINING_PAGE_REQUIRED_PERMISSIONS.edit)
    }

    if (action.key === 'delete-training-category') {
      return authStore.hasPermissionAccess(TRAINING_PAGE_REQUIRED_PERMISSIONS.delete)
    }

    return true
  })
})
</script>
