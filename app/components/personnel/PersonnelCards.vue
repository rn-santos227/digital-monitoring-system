<template>
  <InfiniteCardGrid
    :can-load-more="canLoadMore"
    :is-loading="isLoading"
    :is-empty="rows.length === 0 && !isLoading"
    empty-message="No personnel records found."
    @load-more="emit('loadMore')"
  >
    <EntityDetailCard
      v-for="row in rows"
      :key="row.id"
      :eyebrow="row.personnelCode"
      :title="row.fullName"
      :status="row.serviceStatus"
      :status-tone="row.serviceStatus === 'Active' ? 'success' : 'warning'"
      :description="row.email"
      :details="[
        { label: 'Rank', value: row.rankName },
        { label: 'Serial No.', value: row.serviceNumber },
        { label: 'Assignment', value: row.assignment },
        { label: 'Record ID', value: row.id },
      ]"
      :actions="visibleActions"
      @action="emit('action', { actionKey: $event, row })"
    />
  </InfiniteCardGrid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EntityDetailCard from '~/components/general/EntityDetailCard.vue'
import InfiniteCardGrid from '~/components/general/InfiniteCardGrid.vue'
import { PERSONNEL_TABLE_ACTIONS } from '~/constants/table.constants'
import type { DataTableAction } from '~/constants/ui.constants'
import type { PersonnelTableRow } from '~/types/domain/personnel'

const props = withDefaults(defineProps<{
  rows: readonly PersonnelTableRow[]
  isLoading?: boolean
  canLoadMore?: boolean
  canViewPersonnel?: boolean
  canEditPersonnel?: boolean
  canDeletePersonnel?: boolean
}>(), {
  isLoading: false,
  canLoadMore: false,
  canViewPersonnel: false,
  canEditPersonnel: false,
  canDeletePersonnel: false,
})

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: DataTableAction['key']; row: PersonnelTableRow }): void
  (event: 'loadMore'): void
}>()

const visibleActions = computed(() => {
  if (!props.canViewPersonnel) {
    return []
  }

  return PERSONNEL_TABLE_ACTIONS.filter((action) => {

  })
})
</script>
