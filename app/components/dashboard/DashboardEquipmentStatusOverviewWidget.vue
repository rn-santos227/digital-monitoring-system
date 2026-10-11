<template>
  <BaseCard>
    <header class="mb-4 flex items-center gap-2">
      <BaseIcon name="cog" class="text-blue-600" />
      <h3 class="text-2xl font-semibold text-slate-900">{{ DASHBOARD_EQUIPMENT_SUMMARY_TITLE }}</h3>
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
import type { DashboardEquipmentStatusOverview, DashboardEquipmentValueId } from '~/types/domain/dashboard'
import { DASHBOARD_EQUIPMENT_VALUE_OPTIONS, DASHBOARD_EQUIPMENT_SUMMARY_TITLE } from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  data: DashboardEquipmentStatusOverview
  selectedValues?: readonly DashboardEquipmentValueId[]
}>(), { selectedValues: () => DASHBOARD_EQUIPMENT_VALUE_OPTIONS.map((item) => item.key) })

const statusItems = computed(() => {
  return DASHBOARD_EQUIPMENT_VALUE_OPTIONS.filter((item) => props.selectedValues.includes(item.key))
    .map((item) => ({ ...item, value: props.data.summary[item.key] }))
})
</script>
