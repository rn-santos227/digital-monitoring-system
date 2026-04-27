<template>
  <DataTable
    :title="TRAININGS_TABLE_TITLE"
    :columns="TRAININGS_TABLE_COLUMNS"
    :rows="props.rows"
    row-key="id"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    :actions-column-label="TRAININGS_TABLE_ACTIONS_COLUMN_LABEL"
    :is-loading="props.isLoading"
    :show-search="false"
    :empty-message="TRAININGS_TABLE_EMPTY_MESSAGE"
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
import { TRAINING_PAGE_REQUIRED_PERMISSIONS } from '~/constants/page.constants'
import {
  TRAININGS_TABLE_ACTIONS,
  TRAININGS_TABLE_ACTIONS_COLUMN_LABEL,
  TRAININGS_TABLE_COLUMNS,
  TRAININGS_TABLE_EMPTY_MESSAGE,
  TRAININGS_TABLE_TITLE,
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
  return TRAININGS_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'view-training') {
      return authStore.hasPermissionAccess(TRAINING_PAGE_REQUIRED_PERMISSIONS.view)
    }

    if (action.key === 'edit-training') {
      return authStore.hasPermissionAccess(TRAINING_PAGE_REQUIRED_PERMISSIONS.edit)
    }

    if (action.key === 'delete-training') {
      return authStore.hasPermissionAccess(TRAINING_PAGE_REQUIRED_PERMISSIONS.delete)
    }

    return true
  })
})
</script>
