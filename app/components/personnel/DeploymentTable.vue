<template>
  <DataTable
    :title="PERSONNEL_DEPLOYMENT_TABLE_TITLE"
    :columns="PERSONNEL_DEPLOYMENT_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :show-search="false"
    :empty-message="PERSONNEL_DEPLOYMENT_TABLE_EMPTY_MESSAGE"
  />
</template>

<script setup lang="ts">
import {
  PERSONNEL_DEPLOYMENT_TABLE_COLUMNS,
  PERSONNEL_DEPLOYMENT_TABLE_EMPTY_MESSAGE,
  PERSONNEL_DEPLOYMENT_TABLE_TITLE,
} from '~/constants/table.constants'

interface DeploymentTableRow {
  id: string
  location: string
  operationName: string
  startedAt: string
  endedAt: string
  status: string
}

withDefaults(defineProps<{ rows?: DeploymentTableRow[] }>(), {
  rows: () => [],
})
</script>
