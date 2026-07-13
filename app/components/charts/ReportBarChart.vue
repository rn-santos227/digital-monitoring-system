<template>

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

const fallbackColor = '#0f766e'
const { barChartOption, chartData, getBarWidth, getPercentage } = useCharts(toRef(props, 'data'))
</script>
