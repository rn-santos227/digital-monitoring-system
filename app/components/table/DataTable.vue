<template>
  <section :class="BASE_TABLE_WINDOW_WRAPPER_CLASSES">
    <header class="space-y-4">
      <h2 :class="BASE_TABLE_HEADING_CLASSES">{{ title }}</h2>
      <div v-if="showSearch" :class="BASE_TABLE_SEARCH_WRAPPER_CLASSES">
        <BaseTextField
          :model-value="searchQuery"
          type="search"
          :placeholder="searchPlaceholder"
          @update:model-value="emit('update:searchQuery', $event)"
        />
      </div>
    </header>

    <div class="mt-3" :class="BASE_TABLE_SCROLL_CLASSES">
      <table :class="BASE_TABLE_CLASSES">
        <thead :class="BASE_TABLE_HEAD_CLASSES">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[BASE_TABLE_HEAD_CELL_CLASSES, resolveDataTableAlignClass(column.align)]"
              scope="col"
            >
              <button
                v-if="column.sortable"
                type="button"
                class="inline-flex items-center gap-1"
                @click="emit('sort', column.key)"
              >
                <span>{{ column.label }}</span>
                <BaseIcon name="arrows-up-down" size="sm" />
              </button>
              <span v-else>{{ column.label }}</span>
            </th>
            <th v-if="hasActions" :class="[BASE_TABLE_HEAD_CELL_CLASSES, actionColumnWidthClass]" scope="col">
              <span>{{ actionsColumnLabel }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="shouldRenderLoadingState">
            <td :class="BASE_TABLE_EMPTY_STATE_CLASSES" :colspan="columns.length + (hasActions ? 1 : 0)">
              <BaseInlineLoader :label="loadingLabel" />
            </td>
          </tr>
          <tr v-else-if="!rows.length">
            <td :class="BASE_TABLE_EMPTY_STATE_CLASSES" :colspan="columns.length + (hasActions ? 1 : 0)">
              {{ emptyMessage }}
            </td>
          </tr>
          <tr
            v-for="row in rows"
            v-else
            :key="resolveDataTableRowKey(row, rowKey)"
            :class="BASE_TABLE_ROW_CLASSES"
          >
            <td
              v-for="column in columns"
              :key="`${resolveDataTableRowKey(row, rowKey)}-${column.key}`"
              :class="[BASE_TABLE_BODY_CELL_CLASSES, resolveDataTableAlignClass(column.align)]"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
              >
                {{ resolveCellDisplayValue(row, column) }}
              </slot>
            </td>

            <td v-if="hasActions" :class="BASE_TABLE_ACTIONS_CELL_CLASSES">
              <div class="flex justify-end gap-1">
                <BaseButton
                  v-for="action in actions"
                  :key="`${resolveDataTableRowKey(row, rowKey)}-${action.key}`"
                  icon-only
                  size="sm"
                  :aria-label="action.tooltip"
                  :title="action.tooltip"
                  :variant="resolveActionButtonVariant(action)"
                  :icon-name="action.iconName"
                  @click="emit('action', { actionKey: action.key, row })"
                />
                <slot name="actions" :row="row" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      v-if="!shouldRenderLoadingState"
      :current-page="currentPage"
      :total-pages="totalPages"
      :max-visible-pages="maxVisiblePages"
      :total-items="totalItems"
      :page-size="pageSize"
      :page-size-options="pageSizeOptions"
      @update:current-page="emit('update:currentPage', $event)"
      @update:page-size="emit('update:pageSize', $event)"
    />
  </section>
</template>

<script setup lang="ts" generic="TRow extends object">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useDateDisplay } from '~/composables/useDateDisplay'
import {
  BASE_TABLE_ACTIONS_CELL_CLASSES,
  BASE_TABLE_ACTIONS_COLUMN_WIDTH_CLASSES,
  BASE_TABLE_BODY_CELL_CLASSES,
  BASE_TABLE_CLASSES,
  BASE_TABLE_EMPTY_STATE_CLASSES,
  BASE_TABLE_HEAD_CELL_CLASSES,
  BASE_TABLE_HEAD_CLASSES,
  BASE_TABLE_HEADING_CLASSES,
  BASE_TABLE_ROW_CLASSES,
  BASE_TABLE_SCROLL_CLASSES,
  BASE_TABLE_SELECTION_CELL_CLASSES,
  BASE_TABLE_SEARCH_WRAPPER_CLASSES,
  BASE_TABLE_WINDOW_WRAPPER_CLASSES,
  type DataTableAction,
  type DataTableColumn,
  type UiVariant,
} from '~/constants/ui.constants'
import { resolveDataTableAlignClass, resolveDataTableRowKey } from '~/utils/data-table'

const props = withDefaults(
  defineProps<{
    title: string
    columns: readonly DataTableColumn[]
    rows: readonly TRow[]
    rowKey?: keyof TRow | string
    actions?: readonly DataTableAction[]
    searchQuery?: string
    searchPlaceholder?: string
    emptyMessage?: string
    isLoading?: boolean
    loadingLabel?: string
    currentPage?: number
    totalPages?: number
    maxVisiblePages?: number
    totalItems?: number
    pageSize?: number
    pageSizeOptions?: readonly number[]
    actionButtonCount?: number
    actionsColumnLabel?: string
    showSearch?: boolean
    selectable?: boolean
    selectedRowKeys?: readonly string[]
    isRowSelectable?: (row: TRow) => boolean
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
    maxVisiblePages: 5,
    totalItems: 0,
    pageSize: 10,
    pageSizeOptions: () => [10, 25, 50, 100],
    actionButtonCount: 0,
    actionsColumnLabel: 'Actions',
    showSearch: true,
    selectable: false,
    selectedRowKeys: () => [],
    isRowSelectable: () => true,
  }
)

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: TRow }): void
  (event: 'sort', key: string): void
  (event: 'update:searchQuery', value: string): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
  (event: 'update:selectedRowKeys', value: string[]): void
}>()

const { formatDate } = useDateDisplay()

const getRowValue = (row: TRow, key: string): string | number | boolean | null | undefined =>
  (row as Record<string, string | number | boolean | null | undefined>)[key]

const DATE_COLUMN_KEY_PATTERN = /(date|Date|At)$/

const isLikelyIsoDateValue = (value: string): boolean => {
  if (!value.trim()) {
    return false
  }

  const parsed = new Date(value)
  return !Number.isNaN(parsed.getTime())
}

const resolveCellDisplayValue = (row: TRow, column: DataTableColumn): string | number | boolean | null | undefined => {
  const rawValue = getRowValue(row, column.key)
  if (typeof rawValue !== 'string') {
    return rawValue
  }

  const isDateColumn = column.dataType === 'date' || (column.dataType !== 'text' && DATE_COLUMN_KEY_PATTERN.test(column.key))
  if (!isDateColumn || !isLikelyIsoDateValue(rawValue)) {
    return rawValue
  }

  return formatDate(rawValue)
}

const hasActions = computed(() => props.actions.length > 0)
const tableColumnCount = computed(() => props.columns.length + (hasActions.value ? 1 : 0) + (props.selectable ? 1 : 0))

const rowEntries = computed(() => props.rows.map((row) => ({
  key: resolveDataTableRowKey(row, props.rowKey),
  row,
})))
const selectableRowKeys = computed(() => rowEntries.value
  .filter(({ row }) => props.isRowSelectable(row))
  .map(({ key }) => key))
const selectedRowKeySet = computed(() => new Set(props.selectedRowKeys))
const selectedRows = computed(() => rowEntries.value
  .filter(({ key }) => selectedRowKeySet.value.has(key))
  .map(({ row }) => row))
const areAllVisibleRowsSelected = computed(() => selectableRowKeys.value.length > 0
  && selectableRowKeys.value.every((key) => selectedRowKeySet.value.has(key)))
const areSomeVisibleRowsSelected = computed(() => !areAllVisibleRowsSelected.value
  && selectableRowKeys.value.some((key) => selectedRowKeySet.value.has(key)))

const isRowSelectionEnabled = (row: TRow): boolean => props.isRowSelectable(row)
const isRowSelected = (row: TRow): boolean => selectedRowKeySet.value.has(resolveDataTableRowKey(row, props.rowKey))
const updateSelection = (keys: Iterable<string>) => emit('update:selectedRowKeys', [...keys])

const toggleRow = (row: TRow, selected: boolean) => {
  const nextKeys = new Set(props.selectedRowKeys)
  const key = resolveDataTableRowKey(row, props.rowKey)
  selected ? nextKeys.add(key) : nextKeys.delete(key)
  updateSelection(nextKeys)
}
const toggleAllVisibleRows = (selected: boolean) => {
  const nextKeys = new Set(props.selectedRowKeys)
  selectableRowKeys.value.forEach((key) => selected ? nextKeys.add(key) : nextKeys.delete(key))
  updateSelection(nextKeys)
}
const clearSelection = () => updateSelection([])

const resolveActionButtonVariant = (action: DataTableAction): UiVariant => {
  if (!action.variant) {
    return 'ghost'
  }

  return action.variant
}

const LOADING_STATE_RENDER_DELAY_MS = 180
const shouldRenderLoadingState = ref(false)
let loadingStateTimer: ReturnType<typeof setTimeout> | null = null

const clearLoadingStateTimer = () => {
  if (!loadingStateTimer) {
    return
  }

  clearTimeout(loadingStateTimer)
  loadingStateTimer = null
}

watch(
  () => props.isLoading,
  (isLoading) => {
    clearLoadingStateTimer()

    if (!isLoading) {
      shouldRenderLoadingState.value = false
      return
    }

    loadingStateTimer = setTimeout(() => {
      shouldRenderLoadingState.value = true
    }, LOADING_STATE_RENDER_DELAY_MS)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  clearLoadingStateTimer()
})

const actionColumnWidthClass = computed(() => {
  const requestedActionCount = props.actionButtonCount > 0 ? props.actionButtonCount : props.actions.length
  const normalizedActionCount = Math.min(4, Math.max(1, requestedActionCount))

  return BASE_TABLE_ACTIONS_COLUMN_WIDTH_CLASSES[normalizedActionCount as 1 | 2 | 3 | 4]
})
</script>
