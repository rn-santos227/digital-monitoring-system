<template>
  <DataTable
    :title="PERSONNEL_TRAINING_TABLE_TITLE"
    :columns="PERSONNEL_TRAINING_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :show-search="false"
    :empty-message="PERSONNEL_TRAINING_TABLE_EMPTY_MESSAGE"
  />
</template>

<script setup lang="ts">
import {
  PERSONNEL_TRAINING_TABLE_COLUMNS,
  PERSONNEL_TRAINING_TABLE_EMPTY_MESSAGE,
  PERSONNEL_TRAINING_TABLE_TITLE,
} from '~/constants/table.constants'

interface TrainingTableRow {
  id: string
  courseName: string
  provider: string
  completedAt: string
  remarks: string
}

withDefaults(defineProps<{ rows?: TrainingTableRow[] }>(), {
  rows: () => [],
})
</script>
