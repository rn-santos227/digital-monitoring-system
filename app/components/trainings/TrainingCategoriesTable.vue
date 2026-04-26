<template>
  <DataTable
    :title="TRAINING_CATEGORIES_TABLE_TITLE"
    :columns="TRAINING_CATEGORIES_TABLE_COLUMNS"
    :rows="props.rows"
    row-key="id"
    :is-loading="props.isLoading"
    :show-search="false"
    :empty-message="TRAINING_CATEGORIES_TABLE_EMPTY_MESSAGE"
    :current-page="props.currentPage"
    :total-pages="props.totalPages"
    :total-items="props.totalItems"
    :page-size="props.pageSize"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  />
</template>

<script setup lang="ts">
import {
  TRAINING_CATEGORIES_TABLE_COLUMNS,
  TRAINING_CATEGORIES_TABLE_EMPTY_MESSAGE,
  TRAINING_CATEGORIES_TABLE_TITLE,
} from '~/constants/table.constants'

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
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()
</script>
