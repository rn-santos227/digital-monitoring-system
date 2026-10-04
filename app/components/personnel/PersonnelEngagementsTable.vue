<template>
  <DataTable
    :title="PERSONNEL_ENGAGEMENT_TABLE_TITLE"
    :columns="PERSONNEL_ENGAGEMENT_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :show-search="false"
    :empty-message="PERSONNEL_ENGAGEMENT_TABLE_EMPTY_MESSAGE"
  />
</template>

<script setup lang="ts">
import type { PersonnelProfileEngagementRow } from '~/constants/ui.constants'
import {
  PERSONNEL_ENGAGEMENT_TABLE_COLUMNS,
  PERSONNEL_ENGAGEMENT_TABLE_EMPTY_MESSAGE,
  PERSONNEL_ENGAGEMENT_TABLE_TITLE,
} from '~/constants/table.constants'

withDefaults(defineProps<{ rows?: PersonnelProfileEngagementRow[] }>(), {
  rows: () => [],
})
</script>
