<template>
  <DataTable
    :title="BATTALIONS_TABLE_TITLE"
    :columns="BATTALIONS_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :is-loading="isLoading"
    :show-search="false"
    :empty-message="BATTALIONS_TABLE_EMPTY_MESSAGE"
    :current-page="currentPage"
    :total-pages="totalPages"
    @update:current-page="emit('update:currentPage', $event)"
  />
</template>

<script setup lang="ts">
import {
  BATTALIONS_TABLE_COLUMNS,
  BATTALIONS_TABLE_EMPTY_MESSAGE,
  BATTALIONS_TABLE_TITLE,
} from '~/constants/table.constants'

withDefaults(defineProps<{
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
  (event: 'update:currentPage', value: number): void
}>()
</script>
