<template>
  <BaseCard class="border-amber-200">
    <header class="mb-4 flex items-center gap-2">
      <BaseIcon name="clock" class="text-amber-600" />
      <h3 class="text-2xl font-semibold text-amber-600">Near Rotation (Top Priority)</h3>
    </header>

    <div v-if="data.items.length" class="space-y-2">
      <article
        v-for="item in data.items"
        :key="`${item.personnelId}-${item.endDate}`"
        class="rounded-md border border-amber-100 bg-amber-50 p-3"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="font-semibold text-slate-900">{{ item.fullName }}</p>
          <BaseChip :label="`${item.daysRemaining}d`" tone="warning" />
        </div>
        <p class="text-sm text-slate-700">{{ item.locationName }}</p>
        <p class="text-xs text-amber-700">Rotation End: {{ formatDate(item.endDate, '—') }}</p>
      </article>
    </div>

    <p v-else class="py-12 text-center italic text-slate-400">No personnel near rotation</p>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseChip from '~/components/ui/BaseChip.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { useDateDisplay } from '~/composables/useDateDisplay'
import type { DashboardNearRotation } from '~/types/domain/dashboard'

const { formatDate } = useDateDisplay()

defineProps<{ data: DashboardNearRotation }>()
</script>
