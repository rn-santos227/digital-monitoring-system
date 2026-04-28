<template>
  <BaseCard class="border-rose-200">
    <header class="mb-4 flex items-center gap-2">
      <BaseIcon name="cog" class="text-rose-600" />
      <h3 class="text-2xl font-semibold text-rose-600">Critical Equipment (Maintenance/Defective)</h3>
    </header>

    <div v-if="data.items.length" class="space-y-2">
      <article
        v-for="item in data.items"
        :key="item.equipmentAssetId"
        class="rounded-md border border-rose-100 bg-rose-50 p-3"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="font-semibold text-slate-900">{{ item.itemName }}</p>
          <BaseChip label="Critical" tone="danger" />
        </div>
        <p class="text-sm text-slate-600">{{ item.assetTag }}</p>
      </article>
    </div>

    <p v-else class="py-12 text-center italic text-slate-400">No critical equipment alerts</p>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseChip from '~/components/ui/BaseChip.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import type { DashboardCriticalEquipment } from '~/types/domain/dashboard'

defineProps<{ data: DashboardCriticalEquipment }>()
</script>
