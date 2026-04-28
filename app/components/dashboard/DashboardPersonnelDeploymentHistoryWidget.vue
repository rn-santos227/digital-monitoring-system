<template>
  <BaseCard>
    <header class="mb-4 flex items-center gap-2">
      <BaseIcon name="arrow-path" class="text-blue-600" />
      <h3 class="text-2xl font-semibold text-slate-900">Personnel Deployment History</h3>
    </header>

    <div class="space-y-2">
      <article
        v-for="item in data.items"
        :key="`${item.personnelId}-${item.loggedAt}`"
        class="border-l-4 border-blue-500 bg-slate-100 p-3"
      >
        <div class="flex items-center justify-between gap-2">
          <div>
            <p class="font-semibold text-slate-900">{{ item.fullName }}</p>
            <p class="text-sm text-slate-600">{{ item.locationName }}</p>
          </div>
          <BaseChip :label="item.statusName.toUpperCase()" tone="success" />
        </div>
      </article>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseChip from '~/components/ui/BaseChip.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import type { DashboardPersonnelDeploymentHistory } from '~/types/domain/dashboard'

defineProps<{ data: DashboardPersonnelDeploymentHistory }>()
</script>
