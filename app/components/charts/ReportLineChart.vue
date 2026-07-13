<template>
  <BaseCard :title="title" :subtitle="subtitle">
    <div v-if="chartData.length" class="space-y-4">
      <div ref="chartContainer" class="h-80 w-full print:h-64">
        <VChart v-if="isChartReady" class="h-full w-full" :option="lineChartOption" autoresize />
      </div>
      <ol class="grid gap-2 text-sm sm:grid-cols-2 print:hidden">
        <li v-for="item in chartData" :key="item.label" class="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <span class="font-medium text-slate-700">{{ item.label }}</span>
          <span class="text-slate-500">{{ item.value }} records</span>
        </li>
      </ol>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
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
const chartContainer = ref<HTMLElement | null>(null)
const { isMountedAfterFrame: isChartReady } = useMountedAfterFrame(chartContainer)
</script>
