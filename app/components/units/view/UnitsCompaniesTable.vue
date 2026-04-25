<template>
  <DataTable
    :title="UNITS_COMPANIES_TABLE_TITLE"
    :columns="UNITS_COMPANIES_TABLE_COLUMNS"
    :rows="tableRows"
    row-key="id"
    :show-search="false"
    :empty-message="UNITS_COMPANIES_TABLE_EMPTY_MESSAGE"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  UNITS_COMPANIES_TABLE_COLUMNS,
  UNITS_COMPANIES_TABLE_EMPTY_MESSAGE,
  UNITS_COMPANIES_TABLE_TITLE,
} from '~/constants/table.constants'
import type { CompanyListItem } from '~/types/domain/units'

const props = withDefaults(defineProps<{
  rows?: readonly CompanyListItem[]
  isLoading?: boolean
}>(), {
  rows: () => [],
  isLoading: false,
})

const tableRows = computed(() => {
  return props.rows.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    status: row.isActive ? 'Active' : 'Inactive',
  }))
})
</script>
