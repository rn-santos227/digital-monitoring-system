import { computed, unref, type MaybeRef } from 'vue'
import type { EChartsOption } from 'echarts'
import type { ChartDataPoint } from '~/types/domain/reports'
import { sumChartValues, toPercent } from '~/utils/chart-data'

export const useCharts = (data: MaybeRef<readonly ChartDataPoint[]>) => {
  const chartData = computed(() => unref(data))
  const totalValue = computed(() => sumChartValues(chartData.value))
  const highestValue = computed(() => Math.max(...chartData.value.map((item) => item.value), 0))

  const getPercentage = (value: number): number => {
    return toPercent(value, totalValue.value)
  }

  const getBarWidth = (value: number): string => {
    if (highestValue.value <= 0) {
      return '0%'
    }

    return `${Math.max(Math.round((value / highestValue.value) * 100), 4)}%`
  }

  const barChartOption = computed<EChartsOption>(() => ({
    color: chartData.value.map((item) => item.color ?? '#0f766e'),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      valueFormatter: (value) => `${value} records`,
    },
    grid: {
      top: 8,
      right: 16,
      bottom: 24,
      left: 120,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: {
        color: '#64748b',
      },
      splitLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: chartData.value.map((item) => item.label),
      axisLabel: {
        color: '#475569',
      },
    },
    series: [
      {
        type: 'bar',
        data: chartData.value.map((item) => ({
          value: item.value,
          itemStyle: {
            color: item.color ?? '#0f766e',
            borderRadius: [0, 8, 8, 0],
          },
        })),
        label: {
          show: true,
          position: 'right',
          color: '#475569',
        },
      },
    ],
  }))
}
