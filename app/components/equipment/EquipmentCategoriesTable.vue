<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EQUIPMENT_PRIVILEGES } from '~/constants/privileges.constants'
import {
  EQUIPMENT_CATEGORIES_TABLE_ACTIONS,
  EQUIPMENT_CATEGORIES_TABLE_ACTIONS_COLUMN_LABEL,
  EQUIPMENT_CATEGORIES_TABLE_COLUMNS,
  EQUIPMENT_CATEGORIES_TABLE_EMPTY_MESSAGE,
  EQUIPMENT_CATEGORIES_TABLE_TITLE,
} from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'

withDefaults(defineProps<{
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

const visibleActions = computed(() => {
  return EQUIPMENT_CATEGORIES_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'delete-equipment-category') {
      return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.manage)
    }

    return true
  })
})
</script>