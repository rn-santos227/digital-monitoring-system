<template>
  <DataTable
    :title="PERSONNEL_TABLE_TITLE"
    :columns="PERSONNEL_TABLE_COLUMNS"
    :rows="rows"
    row-key="id"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    :actions-column-label="PERSONNEL_TABLE_ACTIONS_COLUMN_LABEL"
    :show-search="false"
    :empty-message="PERSONNEL_TABLE_EMPTY_MESSAGE"
    :is-loading="isLoading"
    :current-page="currentPage"
    :total-pages="totalPages"
    :total-items="totalItems"
    :page-size="pageSize"
    @update:current-page="emit('update:currentPage', $event)"
    @update:page-size="emit('update:pageSize', $event)"
    @action="emit('action', $event)"
  >
    <template #cell-fullName="{ row }">
      <NuxtLink :to="ROUTE_PATHS.personnelProfile(String(row.id ?? ''))" class="text-emerald-700 hover:text-emerald-900 hover:underline">
        {{ row.fullName }}
      </NuxtLink>
    </template>

    <template #cell-serviceStatus="{ row }">
      <BaseChip :tone="row.serviceStatus === 'Active' ? 'success' : 'warning'">
        {{ row.serviceStatus }}
      </BaseChip>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DataTableAction } from '~/constants/ui.constants'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import {
  PERSONNEL_TABLE_ACTIONS,
  PERSONNEL_TABLE_ACTIONS_COLUMN_LABEL,
  PERSONNEL_TABLE_COLUMNS,
  PERSONNEL_TABLE_EMPTY_MESSAGE,
  PERSONNEL_TABLE_TITLE,
} from '~/constants/table.constants'
import type { PersonnelTableRow } from '~/types/domain/personnel'


const props = withDefaults(defineProps<{
  rows: readonly PersonnelTableRow[]
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  totalItems?: number
  pageSize?: number
  canViewPersonnel?: boolean
  canEditPersonnel?: boolean
  canDeletePersonnel?: boolean
}>(), {
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10,
  canViewPersonnel: false,
  canEditPersonnel: false,
  canDeletePersonnel: false,
})

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: DataTableAction['key']; row: PersonnelTableRow }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()

const visibleActions = computed(() => {
  if (!props.canViewPersonnel) {
    return []
  }

  return PERSONNEL_TABLE_ACTIONS.filter((action) => {
    if (action.key === 'edit-personnel') {
      return props.canEditPersonnel
    }

    if (action.key === 'delete-personnel') {
      return props.canDeletePersonnel
    }

    return true
  })
})
</script>
