<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  DEPLOYMENT_RECORDS_TABLE_COLUMNS,
  DEPLOYMENT_RECORDS_TABLE_EMPTY_MESSAGE,
  DEPLOYMENT_RECORDS_TABLE_TITLE,
  DEPLOYMENTS_TABLE_ACTIONS_COLUMN_LABEL,
} from '~/constants/table.constants'
import { DEPLOYMENT_PRIVILEGES } from '~/constants/privileges.constants'
import { useAuthStore } from '~/stores/auth'

const props = withDefaults(defineProps<{
  rows: readonly Record<string, unknown>[]
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  pageSize?: number
}>(), {
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10,
})

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: Record<string, unknown> }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()

const authStore = useAuthStore()

</script>