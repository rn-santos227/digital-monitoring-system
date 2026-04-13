<template>
  <section :class="BASE_TABLE_WINDOW_WRAPPER_CLASSES">
    <header class="space-y-4">
      <h2 :class="BASE_TABLE_HEADING_CLASSES">{{ title }}</h2>
      <div :class="BASE_TABLE_SEARCH_WRAPPER_CLASSES">
        <BaseTextField
          :model-value="searchQuery"
          type="search"
          :placeholder="searchPlaceholder"
          @update:model-value="emit('update:searchQuery', $event)"
        />
      </div>
    </header>
  </section>
</template>

<script setup lang="ts" generic="TRow extends Record<string, string | number | boolean | null | undefined>">
import { computed } from 'vue'
import {
  BASE_TABLE_ACTIONS_CELL_CLASSES,
  BASE_TABLE_BODY_CELL_CLASSES,
  BASE_TABLE_CLASSES,
  BASE_TABLE_EMPTY_STATE_CLASSES,
  BASE_TABLE_HEAD_CELL_CLASSES,
  BASE_TABLE_HEAD_CLASSES,
  BASE_TABLE_HEADING_CLASSES,
  BASE_TABLE_ROW_CLASSES,
  BASE_TABLE_SCROLL_CLASSES,
  BASE_TABLE_SEARCH_WRAPPER_CLASSES,
  BASE_TABLE_WINDOW_WRAPPER_CLASSES,
  type DataTableAction,
  type DataTableColumn,
} from '~/constants/ui.constants'
import { resolveDataTableAlignClass, resolveDataTableRowKey } from '~/utils/data-table'

const props = withDefaults(
  defineProps<{
    title: string
    columns: readonly DataTableColumn[]
    rows: readonly TRow[]
    rowKey?: keyof TRow
    actions?: readonly DataTableAction[]
    searchQuery?: string
    searchPlaceholder?: string
    emptyMessage?: string
    isLoading?: boolean
    loadingLabel?: string
    currentPage?: number
    totalPages?: number
    maxVisiblePages?: number
  }>(),
  {
    rowKey: 'id',
    actions: () => [],
    searchQuery: '',
    searchPlaceholder: 'Search records...',
    emptyMessage: 'No records found.',
    isLoading: false,
    loadingLabel: 'Loading records...',
    currentPage: 1,
    totalPages: 1,
    maxVisiblePages: 5
  }
)

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: TRow }): void
  (event: 'sort', key: string): void
  (event: 'update:searchQuery', value: string): void
  (event: 'update:currentPage', value: number): void
}>()

const hasActions = computed(() => props.actions.length > 0)
</script>
