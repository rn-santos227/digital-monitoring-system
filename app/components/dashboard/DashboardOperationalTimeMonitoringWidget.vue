<template>
  <BaseCard>
    <header class="mb-4 flex items-center gap-2">
      <BaseIcon name="clock" class="text-slate-600" />
      <h3 class="text-2xl font-semibold text-slate-900">Operational Time Monitoring</h3>
    </header>

    <div class="grid gap-3 md:grid-cols-3">
      <article class="rounded-md bg-slate-100 p-4">
        <p class="text-xs uppercase text-slate-500">Active Deployments</p>
        <p class="text-3xl font-bold text-slate-900">{{ data.metric.activeDeploymentCount }}</p>
      </article>
      <article class="rounded-md bg-slate-100 p-4">
        <p class="text-xs uppercase text-slate-500">Average Active Days</p>
        <p class="text-3xl font-bold text-slate-900">{{ data.metric.averageActiveDays }}</p>
      </article>
      <article class="rounded-md bg-slate-100 p-4">
        <p class="text-xs uppercase text-slate-500">Longest Active Days</p>
        <p class="text-3xl font-bold text-slate-900">{{ data.metric.longestActiveDays }}</p>
      </article>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import type { DashboardOperationalTimeMonitoring } from '~/types/domain/dashboard'

defineProps<{ data: DashboardOperationalTimeMonitoring }>()
</script>
