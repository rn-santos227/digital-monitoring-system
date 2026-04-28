<template>
  <BaseCard>
    <header class="mb-4 flex items-center gap-2">
      <BaseIcon name="cog" class="text-blue-600" />
      <h3 class="text-2xl font-semibold text-slate-900">Equipment Status Overview</h3>
    </header>
    <ul class="space-y-3">
      <li v-for="item in statusItems" :key="item.key" class="flex items-center justify-between rounded-md bg-slate-100 px-3 py-2">
        <span class="text-sm text-slate-700">{{ item.label }}</span>
        <span :class="['text-3xl font-bold', item.classes]">{{ item.value }}</span>
      </li>
    </ul>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import type { DashboardEquipmentStatusOverview } from '~/types/domain/dashboard'

const props = defineProps<{ data: DashboardEquipmentStatusOverview }>()

const statusItems = computed(() => {
  return [
    { key: 'operational', label: 'Operational', value: props.data.summary.operational, classes: 'text-emerald-600' },
    { key: 'standby-ready', label: 'Standby-Ready', value: props.data.summary.standbyReady, classes: 'text-blue-600' },
    { key: 'partially-operational', label: 'Partially Operational', value: props.data.summary.partiallyOperational, classes: 'text-amber-600' },
    { key: 'under-maintenance', label: 'Under Maintenance', value: props.data.summary.underMaintenance, classes: 'text-pink-600' },
    { key: 'defective', label: 'Defective', value: props.data.summary.defective, classes: 'text-rose-600' },
  ]
})
</script>
