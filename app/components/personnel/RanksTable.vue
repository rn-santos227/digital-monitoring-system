<template>
  <DataTable
    title="Rank Records"
    :columns="RANK_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :actions="canDelete ? RANK_TABLE_ACTIONS : []"
    :show-search="false"
    :empty-message="RANK_TABLE_EMPTY_MESSAGE"
    :is-loading="isLoading"
    :current-page="currentPage"
    :total-pages="totalPages"
    :total-items="totalItems"
    :page-size="pageSize"
    :selectable="canUpdate || canDelete"
    :selected-row-keys="selectedRowKeys"
    @update:selected-row-keys="emit('update:selectedRowKeys', $event)"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
    @action="emit('action', $event)"
  >
    <template #bulk-actions="{ selectedRowKeys: selectedKeys, clearSelection }">
      <BulkTableAction
        :selected-count="selectedKeys.length"
        singular-label="rank"
        plural-label="ranks"
        :show-update="canUpdate"
        :show-delete="canDelete"
        @clear="clearSelection"
        @update="emit('bulk-update')"
        @delete="emit('bulk-delete')"
      />
    </template>
  </DataTable>
</template>


<script setup lang="ts">
import { RANK_TABLE_ACTIONS, RANK_TABLE_COLUMNS, RANK_TABLE_EMPTY_MESSAGE } from '~/constants/table.constants'
import type { RankListItem } from '~/types/domain/rank'

withDefaults(defineProps<{
  rows: readonly RankListItem[]
  isLoading?: boolean
  canDelete?: boolean
  canUpdate?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  pageSize?: number
  selectedRowKeys?: readonly string[]
}>(), {
  isLoading: false,
  canDelete: false,
  canUpdate: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10,
  selectedRowKeys: () => [],
})

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: RankListItem }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
  (event: 'update:selectedRowKeys', value: string[]): void
  (event: 'bulk-delete'): void
  (event: 'bulk-update'): void
}>()
</script>
