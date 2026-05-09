<template>

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
