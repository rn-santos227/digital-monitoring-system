<template>
  <DataTable
    :title="AUDIT_TABLE_TITLE"
    :columns="AUDIT_TABLE_COLUMNS"
    :rows="rows"
    :actions="AUDIT_TABLE_ACTIONS"
    row-key="id"
    :search-query="searchQuery"
    :search-placeholder="AUDIT_TABLE_SEARCH_PLACEHOLDER"
    :show-search="false"
    :empty-message="emptyMessage"
    :is-loading="isLoading"
    :current-page="currentPage"
    :total-pages="totalPages"
    @sort="emit('sort', $event)"
    @update:search-query="emit('update:searchQuery', $event)"
    @action="emit('action', $event)"
    @update:current-page="emit('update:currentPage', $event)"
  />
</template>

<script setup lang="ts">
import {
  AUDIT_TABLE_ACTIONS,
  AUDIT_TABLE_COLUMNS,
  AUDIT_TABLE_EMPTY_MESSAGE,
  AUDIT_TABLE_SEARCH_PLACEHOLDER,
  AUDIT_TABLE_TITLE,
} from '~/constants/table.constants'

withDefaults(defineProps<{
  rows: readonly Record<string, unknown>[]
  searchQuery?: string
  emptyMessage?: string
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
}>(), {
  searchQuery: '',
  emptyMessage: AUDIT_TABLE_EMPTY_MESSAGE,
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
})

const emit = defineEmits<{
  (event: 'sort', key: string): void
  (event: 'update:searchQuery', value: string): void
  (event: 'action', payload: { actionKey: string; row: Record<string, unknown> }): void
  (event: 'update:currentPage', value: number): void
}>()
</script>
