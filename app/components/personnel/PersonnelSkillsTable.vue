<template>
  <DataTable
    :title="PERSONNEL_SKILLS_TABLE_TITLE"
    :columns="PERSONNEL_SKILLS_TABLE_COLUMNS"
    :rows="tableRows"
    :actions="visibleActions"
    :action-button-count="visibleActions.length"
    row-key="id"
    :show-search="false"
    :empty-message="PERSONNEL_SKILLS_TABLE_EMPTY_MESSAGE"
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
import { PERSONNEL_PRIVILEGES } from '~/constants/privileges.constants'
import {
  PERSONNEL_SKILLS_TABLE_TITLE,
  PERSONNEL_SKILLS_TABLE_COLUMNS,
  PERSONNEL_SKILLS_TABLE_ACTIONS,
  PERSONNEL_SKILLS_TABLE_EMPTY_MESSAGE,
} from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'
import type { PersonnelSkillItem } from '~/types/domain/personnel-skills'
import { mapPersonnelSkillTableRow } from '~/utils/personnel-skills'

const props = defineProps<{
  rows: PersonnelSkillItem[]
  isLoading: boolean
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}>()
const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: PersonnelSkillItem }): void
  (event: 'update:currentPage', value: number): void
  (event: 'update:pageSize', value: number): void
}>()
const authStore = useAuthStore()
const visibleActions = computed(() => authStore.hasPermissionAccess(PERSONNEL_PRIVILEGES.edit) ? PERSONNEL_SKILLS_TABLE_ACTIONS : [])
const tableRows = computed(() => props.rows.map(mapPersonnelSkillTableRow))
</script>
