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
    @action="emit('action', $event)"
    @update:current-page="emit('update:currentPage', $event)"
  />
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
}>(), {
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
})

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: Record<string, unknown> }): void
  (event: 'update:currentPage', value: number): void
}>()

const authStore = useAuthStore()

const visibleActions = computed(() => {
  return BATTALIONS_TABLE_ACTIONS.filter((action) => {
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
