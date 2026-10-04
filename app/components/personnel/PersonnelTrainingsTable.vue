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
import type { PersonnelProfileTrainingRow } from '~/constants/ui.constants'
import {
  PERSONNEL_TRAINING_TABLE_COLUMNS,
  PERSONNEL_TRAINING_TABLE_EMPTY_MESSAGE,
  PERSONNEL_TRAINING_TABLE_TITLE,
} from '~/constants/table.constants'

withDefaults(defineProps<{ rows?: PersonnelProfileTrainingRow[] }>(), {
  rows: () => [],
})
</script>
