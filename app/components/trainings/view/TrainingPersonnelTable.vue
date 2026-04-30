<template>
  <DataTable
    :title="TRAINING_PERSONNEL_TABLE_TITLE"
    :columns="TRAINING_PERSONNEL_TABLE_COLUMNS"
    :rows="props.rows"
    :is-loading="props.isLoading"
    :empty-message="TRAINING_PERSONNEL_TABLE_EMPTY_MESSAGE"
    :show-search="false"
    :current-page="1"
    :total-pages="1"
    :total-items="props.rows.length"
    :page-size="props.rows.length || 1"
  >
    <template #cell-personnelName="{ row }">
      <NuxtLink
        v-if="resolvePersonnelId(row)"
        :to="ROUTE_PATHS.personnelProfile(resolvePersonnelId(row))"
        class="text-emerald-700 hover:text-emerald-900 hover:underline"
      >
        {{ String(row.personnelName ?? '—') }}
      </NuxtLink>
      <span v-else>{{ String(row.personnelName ?? '—') }}</span>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ROUTE_PATHS } from '~/constants/routes.constants'
import {
  TRAINING_PERSONNEL_TABLE_COLUMNS,
  TRAINING_PERSONNEL_TABLE_EMPTY_MESSAGE,
  TRAINING_PERSONNEL_TABLE_TITLE,
} from '~/constants/table.constants'

const props = withDefaults(defineProps<{
  rows: readonly Record<string, unknown>[]
  isLoading?: boolean
}>(), {
  isLoading: false,
})

const resolvePersonnelId = (row: Record<string, unknown>): string => {
  return String(row.personnelId ?? '')
}
</script>
