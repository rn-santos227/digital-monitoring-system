<template>
  <BaseCard class="border-rose-200">
    <header class="mb-4 flex items-center gap-2">
      <BaseIcon name="exclamation" class="text-rose-600" />
      <h3 class="text-2xl font-semibold text-rose-600">Critical Personnel</h3>
    </header>

    <div v-if="data.items.length" class="space-y-2">
      <article
        v-for="item in data.items"
        :key="`${item.personnelId}-${item.issueCode}`"
        class="border-l-4 border-rose-500 bg-rose-50 p-3"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="font-semibold text-slate-900">{{ item.fullName }}</p>
            <p class="text-sm text-rose-700">{{ item.locationName }}</p>
          </div>
          <BaseChip :label="item.issueCode" tone="danger" />
        </div>
      </article>
    </div>

    <p v-else class="py-8 text-center italic text-slate-400">No critical personnel alerts</p>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseChip from '~/components/ui/BaseChip.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import type { DashboardCriticalPersonnel } from '~/types/domain/dashboard'

defineProps<{ data: DashboardCriticalPersonnel }>()
</script>
