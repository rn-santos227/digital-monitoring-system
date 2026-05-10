<template>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseGeoMap from '~/components/ui/BaseGeoMap.vue'
import type { BaseTabItem } from '~/constants/ui.constants'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'

const VIEW_RECORD_TAB_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'details', label: 'Details' },
  { id: 'map', label: 'Geomap' },
])

defineProps<{
  deploymentRecord: DeploymentManagementListItem
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const activeTab = ref<'details' | 'map'>('details')

const onTabChange = (value: string) => {
  activeTab.value = value === 'map' ? 'map' : 'details'
}
</script>
