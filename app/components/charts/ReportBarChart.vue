<template>
  <BaseCard :title="title" :subtitle="subtitle">
    <div v-if="chartData.length" ref="chartContainer" class="space-y-4">
      <VChart v-if="isChartReady" class="h-80 w-full print:h-64" :option="barChartOption" autoresize />
      <div class="space-y-3 print:hidden">
        <div v-for="item in chartData" :key="item.label" class="space-y-2">
          <div class="flex items-center justify-between gap-3 text-sm">
            <span class="font-medium text-slate-700">{{ item.label }}</span>
            <span class="text-slate-500">{{ item.value }} · {{ getPercentage(item.value) }}%</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              class="h-full rounded-full transition-all"
              :style="{ width: getBarWidth(item.value), backgroundColor: item.color || fallbackColor }"
            />
          </div>
        </div>
      </div>
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

const fallbackColor = '#0f766e'
const { barChartOption, chartData, getBarWidth, getPercentage } = useCharts(toRef(props, 'data'))

const chartContainer = ref<HTMLElement | null>(null)
const { isMountedAfterFrame: isChartReady } = useMountedAfterFrame(chartContainer)
</script>
