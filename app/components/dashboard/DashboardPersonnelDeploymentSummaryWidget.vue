<template>
  <BaseCard>
    <header class="mb-4 flex items-center gap-2">
      <BaseIcon name="users" class="text-blue-600" />
      <h3 class="text-2xl font-semibold text-slate-900">Personnel Deployment Summary</h3>
    </header>
    <ul class="space-y-3">
      <li v-for="item in summaryItems" :key="item.key" class="flex items-center justify-between rounded-md bg-slate-100 px-3 py-2">
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
import type { DashboardPersonnelDeploymentSummary } from '~/types/domain/dashboard'

const props = defineProps<{ data: DashboardPersonnelDeploymentSummary }>()

const summaryItems = computed(() => {
  return [
    { key: 'deployed', label: 'Deployed', value: props.data.summary.deployed, classes: 'text-emerald-600' },
    { key: 'unavailable', label: 'Unavailable', value: props.data.summary.unavailable, classes: 'text-slate-500' },
    { key: 'standby-alert', label: 'Standby-Alert', value: props.data.summary.standbyAlert, classes: 'text-amber-600' },
    { key: 'injured', label: 'Injured', value: props.data.summary.injured, classes: 'text-rose-600' },
    { key: 'dead', label: 'Dead', value: props.data.summary.dead, classes: 'text-pink-900' },
  ]
})
</script>
