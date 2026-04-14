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
          <tr v-if="isLoading">
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
                {{ getRowValue(row, column.key) }}
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
                  :variant="action.variant === 'danger' ? 'danger' : 'ghost'"
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
      v-if="!isLoading"
      :current-page="currentPage"
      :total-pages="totalPages"
      :max-visible-pages="maxVisiblePages"
      @update:current-page="emit('update:currentPage', $event)"
    />
  </section>
</template>

<script setup lang="ts" generic="TRow extends object">
import { computed } from 'vue'
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
    actionButtonCount?: number
    actionsColumnLabel?: string
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
    actionButtonCount: 0,
    actionsColumnLabel: 'Actions'
  }
)

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: TRow }): void
  (event: 'sort', key: string): void
  (event: 'update:searchQuery', value: string): void
  (event: 'update:currentPage', value: number): void
}>()

const getRowValue = (row: TRow, key: string): string | number | boolean | null | undefined =>
  (row as Record<string, string | number | boolean | null | undefined>)[key]

const hasActions = computed(() => props.actions.length > 0)

const actionColumnWidthClass = computed(() => {
  const requestedActionCount = props.actionButtonCount > 0 ? props.actionButtonCount : props.actions.length
  const normalizedActionCount = Math.min(4, Math.max(1, requestedActionCount))

  return BASE_TABLE_ACTIONS_COLUMN_WIDTH_CLASSES[normalizedActionCount as 1 | 2 | 3 | 4]
})
</script>
