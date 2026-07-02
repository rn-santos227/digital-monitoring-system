<template>

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
</script>
