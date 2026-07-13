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
      outerBoundsMode: 'same',
      outerBoundsContain: 'axisLabel',
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

  const lineChartOption = computed<EChartsOption>(() => ({
    color: ['#0f766e'],
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `${value} records`,
    },
    grid: {
      top: 20,
      right: 24,
      bottom: 36,
      left: 48,
      outerBoundsMode: 'same',
      outerBoundsContain: 'axisLabel',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.map((item) => item.label),
      axisLabel: {
        color: '#64748b',
      },
    },
    yAxis: {
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
    series: [
      {
        type: 'line',
        smooth: true,
        symbolSize: 8,
        areaStyle: {
          color: 'rgba(15, 118, 110, 0.12)',
        },
        lineStyle: {
          color: '#0f766e',
          width: 3,
        },
        itemStyle: {
          color: '#0f766e',
        },
        data: chartData.value.map((item) => item.value),
      },
    ],
  }))

  const donutChartOption = computed<EChartsOption>(() => ({
    color: chartData.value.map((item) => item.color ?? '#0f766e'),
    tooltip: {
      trigger: 'item',
      valueFormatter: (value) => `${value} records`,
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'middle',
      textStyle: {
        color: '#475569',
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['48%', '72%'],
        center: ['32%', '50%'],
        avoidLabelOverlap: true,
        data: chartData.value.map((item) => ({
          name: item.label,
          value: item.value,
        })),
        label: {
          formatter: '{b}: {d}%',
          color: '#475569',
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: 'bold',
          },
        },
      },
    ],
  }))

  return {
    chartData,
    totalValue,
    highestValue,
    getPercentage,
    getBarWidth,
    barChartOption,
    donutChartOption,
    lineChartOption,
  }
}
