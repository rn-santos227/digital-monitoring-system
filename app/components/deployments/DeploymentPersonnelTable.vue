<template>
  <DataTable
    :title="DEPLOYMENT_PERSONNEL_TABLE_TITLE"
    :columns="DEPLOYMENT_PERSONNEL_TABLE_COLUMNS"
    :rows="props.rows"
    :is-loading="props.isLoading"
    :empty-message="DEPLOYMENT_PERSONNEL_TABLE_EMPTY_MESSAGE"
    :show-search="false"
    :current-page="1"
    :total-pages="1"
    :total-items="props.rows.length"
    :page-size="props.rows.length || 1"
  />
</template>

<script setup lang="ts">
import {
  DEPLOYMENT_PERSONNEL_TABLE_COLUMNS,
  DEPLOYMENT_PERSONNEL_TABLE_EMPTY_MESSAGE,
  DEPLOYMENT_PERSONNEL_TABLE_TITLE,
} from '~/constants/table.constants'

const props = withDefaults(defineProps<{
  rows: readonly Record<string, unknown>[]
  isLoading?: boolean
}>(), {
  isLoading: false,
})
</script>
