<template>
  <DataTable
    title="Engagement Personnel"
    :columns="ENGAGEMENT_PERSONNEL_COLUMNS"
    :rows="rows"
    row-key="personnelCode"
    :show-search="false"
    empty-message="No assigned personnel found."
  />
</template>

<script setup lang="ts">
import { ENGAGEMENT_PERSONNEL_COLUMNS } from '~/constants/table.constants'

defineProps<{
  rows: readonly Record<string, unknown>[]
}>()
</script>
