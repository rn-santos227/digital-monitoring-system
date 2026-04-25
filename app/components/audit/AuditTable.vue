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
    :total-items="totalItems"
    :page-size="pageSize"
    @sort="emit('sort', $event)"
    @update:search-query="emit('update:searchQuery', $event)"
    @action="emit('action', $event)"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  />
</template>

<script setup lang="ts">
import type { DataTableAction } from '~/constants/ui.constants'
import {
  AUDIT_TABLE_ACTIONS,
  AUDIT_TABLE_COLUMNS,
  AUDIT_TABLE_EMPTY_MESSAGE,
  AUDIT_TABLE_SEARCH_PLACEHOLDER,
  AUDIT_TABLE_TITLE,
} from '~/constants/table.constants'
import type { AuditLogTableRow } from '~/types/domain/audit'

withDefaults(defineProps<{
  rows: readonly AuditLogTableRow[]
  searchQuery?: string
  emptyMessage?: string
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  pageSize?: number
}>(), {
  searchQuery: '',
  emptyMessage: AUDIT_TABLE_EMPTY_MESSAGE,
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10,
})

const emit = defineEmits<{
  (event: 'sort', key: string): void
  (event: 'update:searchQuery', value: string): void
  (event: 'action', payload: { actionKey: DataTableAction['key']; row: AuditLogTableRow }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()
</script>
