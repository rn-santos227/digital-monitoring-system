<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
    <article
      v-for="card in cards"
      :key="card.key"
      :class="['rounded-xl border p-4 text-white shadow-sm', card.classes]"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-white/90">{{ card.label }}</p>
      <p class="mt-2 text-4xl font-bold">{{ card.value }}</p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardTopKpis } from '~/types/domain/dashboard'

const props = defineProps<{
  data: DashboardTopKpis
}>()

const cards = computed(() => {
  return [
    { key: 'total-registered', label: 'Total Registered', value: props.data.totalRegistered, classes: 'border-blue-700 bg-blue-600' },
    { key: 'deployed', label: 'Deployed', value: props.data.deployed, classes: 'border-emerald-700 bg-emerald-600' },
    { key: 'standby-alert', label: 'Standby-Alert', value: props.data.standbyAlert, classes: 'border-amber-700 bg-amber-500' },
    { key: 'no-comms', label: 'No Comms', value: props.data.noComms, classes: 'border-pink-700 bg-pink-500' },
    { key: 'injured-dead', label: 'Injured / Dead', value: props.data.injuredOrDead, classes: 'border-rose-800 bg-rose-700' },
  ]
})
</script>
