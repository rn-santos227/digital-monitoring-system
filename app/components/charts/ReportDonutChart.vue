<template>
  <BaseCard :title="title" :subtitle="subtitle">
    <div v-if="chartData.length" class="space-y-4">
      <VChart class="h-80 w-full print:h-64" :option="donutChartOption" autoresize />
      <div class="grid gap-3 text-sm sm:grid-cols-2 print:hidden">
        <div v-for="item in chartData" :key="item.label" class="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
          <span class="flex items-center gap-2 text-slate-700">
            <span class="h-3 w-3 rounded-full" :style="{ backgroundColor: item.color || fallbackColor }" />
            {{ item.label }}
          </span>
          <span class="font-medium text-slate-600">{{ item.value }} · {{ getPercentage(item.value) }}%</span>
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
const { chartData, donutChartOption, getPercentage } = useCharts(toRef(props, 'data'))
</script>
