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
    @update:current-page="emit('update:currentPage', $event)"
    @action="emit('action', $event)"
  />
</template>

<script setup lang="ts">
import { RANK_TABLE_ACTIONS, RANK_TABLE_COLUMNS, RANK_TABLE_EMPTY_MESSAGE } from '~/constants/table.constants'
import type { RankListItem } from '~/types/domain/rank'

withDefaults(defineProps<{
  rows: readonly RankListItem[]
  isLoading?: boolean
  canDelete?: boolean
  currentPage?: number
  totalPages?: number
}>(), {
  isLoading: false,
  canDelete: false,
  currentPage: 1,
  totalPages: 1,
})

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: RankListItem }): void
  (event: 'update:currentPage', value: number): void
}>()
</script>
