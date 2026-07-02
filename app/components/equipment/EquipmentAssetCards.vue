<template>
  <InfiniteCardGrid
    :can-load-more="canLoadMore"
    :is-loading="isLoading"
    :is-empty="rows.length === 0 && !isLoading"
    empty-message="No equipment asset records found."
    @load-more="emit('loadMore')"
  >
    <EntityDetailCard
      v-for="row in rows"
      :key="row.id"
      :eyebrow="row.assetTag"
    />
  </InfiniteCardGrid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EntityDetailCard from '~/components/general/EntityDetailCard.vue'
import InfiniteCardGrid from '~/components/general/InfiniteCardGrid.vue'
import { EQUIPMENT_PRIVILEGES } from '~/constants/privileges.constants'
import { EQUIPMENT_ASSETS_TABLE_ACTIONS } from '~/constants/table.constants'
import { useAuthStore } from '~/stores/auth'
import type { EquipmentAssetTableRow } from '~/types/domain/equipment'

withDefaults(defineProps<{
  rows: readonly EquipmentAssetTableRow[]
  isLoading?: boolean
  canLoadMore?: boolean
}>(), {
  isLoading: false,
  canLoadMore: false,
})

const emit = defineEmits<{
  (event: 'action', payload: { actionKey: string; row: EquipmentAssetTableRow }): void
  (event: 'loadMore'): void
}>()

const authStore = useAuthStore()

const visibleActions = computed(() => EQUIPMENT_ASSETS_TABLE_ACTIONS.filter((action) => {
  if (action.key === 'view-equipment-asset') {
    return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.view)
  }

  if (action.key === 'edit-equipment-asset') {
    return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.edit)
  }

  return authStore.hasPermissionAccess(EQUIPMENT_PRIVILEGES.delete)
}))
</script>
