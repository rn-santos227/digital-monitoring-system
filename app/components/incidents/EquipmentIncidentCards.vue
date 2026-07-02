<template>
  <InfiniteCardGrid
    :can-load-more="canLoadMore"
    :is-loading="isLoading"
    :is-empty="rows.length === 0 && !isLoading"
    empty-message="No equipment incident records found."
    @load-more="emit('loadMore')"
  >
    <EntityDetailCard
      v-for="row in rows"
      :key="row.id"
      :eyebrow="row.incidentNo"
      :title="row.equipmentName || row.assetTag"
      :status="row.investigationStatusName || 'Pending Review'"
      status-tone="warning"
      :description="row.description"
      :details="[
        { label: 'Asset Tag', value: row.assetTag },
        { label: 'Incident Type', value: row.incidentTypeName },
        { label: 'Date', value: row.incidentDate },
        { label: 'Location', value: row.location },
        { label: 'Personnel', value: row.personnelName },
        { label: 'Deployment', value: row.deploymentName },
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
import { EQUIPMENT_PRIVILEGES } from '~/constants/privileges.constants'
import { EQUIPMENT_INCIDENTS_TABLE_ACTIONS } from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'
import type { EquipmentIncidentTableRow } from '~/types/domain/incident'

withDefaults(defineProps<{
  rows: readonly EquipmentIncidentTableRow[]
  isLoading?: boolean
  canLoadMore?: boolean
}>(), {
  isLoading: false,
  canLoadMore: false,
})

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: EquipmentIncidentTableRow }): void
  (event: 'loadMore'): void
}>()

const authStore = useAuthStore()
const visibleActions = computed(() => EQUIPMENT_INCIDENTS_TABLE_ACTIONS.filter((action) => {
  if (action.key === 'delete-equipment-incident') {
    return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.delete)
  }

  if (action.key.startsWith('update-equipment-incident-')) {
    return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.edit)
  }

  return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.view)
}))
</script>
