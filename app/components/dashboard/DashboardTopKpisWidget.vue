<template>
  <div :class="DASHBOARD_KPI_GRID_CLASSES">
    <article
      v-for="card in cards"
      :key="card.key"
      :class="[DASHBOARD_KPI_CARD_CLASSES, card.classes]"
    >
      <p :class="DASHBOARD_KPI_LABEL_CLASSES">{{ card.label }}</p>
      <p :class="DASHBOARD_KPI_VALUE_CLASSES">{{ card.value }}</p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardTopKpis, DashboardKpiId } from '~/types/domain/dashboard'
import { DASHBOARD_KPI_OPTIONS } from '~/constants/page.constants'
import { DASHBOARD_KPI_GRID_CLASSES, DASHBOARD_KPI_CARD_CLASSES, DASHBOARD_KPI_LABEL_CLASSES, DASHBOARD_KPI_VALUE_CLASSES } from '~/constants/shared.constants'

const props = withDefaults(defineProps<{
  data: DashboardTopKpis
  selectedValues?: readonly DashboardKpiId[]
}>(), { selectedValues: () => DASHBOARD_KPI_OPTIONS.map((item) => item.key) })

const cards = computed(() => {
  return DASHBOARD_KPI_OPTIONS.filter((item) => props.selectedValues.includes(item.key))
    .map((item) => ({ ...item, value: props.data[item.key] }))
})
</script>
