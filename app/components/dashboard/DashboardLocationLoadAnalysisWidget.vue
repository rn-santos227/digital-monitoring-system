<template>
  <BaseCard>
    <header class="mb-4 flex items-center gap-2">
      <BaseIcon name="map" class="text-blue-600" />
      <h3 class="text-2xl font-semibold text-slate-900">Location Load Analysis</h3>
    </header>

    <div class="grid gap-3 md:grid-cols-2">
      <article
        v-for="item in data.items"
        :key="item.locationName"
        class="rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <div class="mb-3 flex items-center justify-between gap-2">
          <p class="text-xl font-semibold text-slate-800">{{ item.locationName }}</p>
          <BaseChip :label="item.loadLevel.toUpperCase()" :tone="toneByLoadLevel[item.loadLevel]" />
        </div>
        <div class="flex gap-8 text-sm">
          <div>
            <p class="text-slate-400">TOTAL</p>
            <p class="text-4xl font-bold text-slate-800">{{ item.totalPersonnel }}</p>
          </div>
          <div>
            <p class="text-slate-400">DEPLOYED</p>
            <p class="text-4xl font-bold text-blue-600">{{ item.deployedPersonnel }}</p>
          </div>
        </div>
      </article>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseChip from '~/components/ui/BaseChip.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import type { DashboardLocationLoadAnalysis, DashboardLocationLoadLevel } from '~/types/domain/dashboard'
import type { UiTone } from '~/constants/ui.constants'

defineProps<{ data: DashboardLocationLoadAnalysis }>()

const toneByLoadLevel: Record<DashboardLocationLoadLevel, UiTone> = {
  light: 'success',
  moderate: 'warning',
  heavy: 'danger',
}
</script>
