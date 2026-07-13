<template>
  <BaseCard :title="title" :subtitle="subtitle">
    <div v-if="chartData.length" class="space-y-4"></div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import type { ChartDataPoint } from '~/types/domain/reports'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    data: readonly ChartDataPoint[]
  }>(),
  {
    subtitle: '',
  }
)

const { chartData, lineChartOption } = useCharts(toRef(props, 'data'))
</script>
