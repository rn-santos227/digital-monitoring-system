<template>
  <DataTable
    :title="labels.title"
    :columns="columns"
    :rows="rows"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    row-key="id"
    :show-search="false"
    :empty-message="labels.emptyMessage"
    :is-loading="isLoading"
    :current-page="currentPage"
    :page-size="pageSize"
    :total-items="totalItems"
    :total-pages="totalPages"
    @action="emit('action', $event)"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PERSONNEL_HISTORY_LABELS } from '~/constants/page.constants'
import { PERSONNEL_PRIVILEGES } from '~/constants/privileges.constants'
import { PERSONNEL_HISTORY_TABLE_ACTIONS, PERSONNEL_EMPLOYMENT_TABLE_COLUMNS, PERSONNEL_EDUCATION_TABLE_COLUMNS } from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'
import type { PersonnelHistoryKind, PersonnelHistoryItem } from '~/types/domain/personnel-history'

const props = defineProps<{
  kind: PersonnelHistoryKind
  rows: PersonnelHistoryItem[]
  isLoading: boolean
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}>()
const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: PersonnelHistoryItem }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()
const authStore = useAuthStore()
const labels = computed(() => PERSONNEL_HISTORY_LABELS[props.kind])
const columns = computed(() => props.kind === 'employment' ? PERSONNEL_EMPLOYMENT_TABLE_COLUMNS : PERSONNEL_EDUCATION_TABLE_COLUMNS)
const visibleActions = computed(() => PERSONNEL_HISTORY_TABLE_ACTIONS.filter((action) => {
  return authStore.hasPermissionAccess(action.key === 'view-history' ? PERSONNEL_PRIVILEGES.view : PERSONNEL_PRIVILEGES.edit)
}))
</script>
