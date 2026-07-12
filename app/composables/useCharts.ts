import { computed, unref, type MaybeRef } from 'vue'
import type { EChartsOption } from 'echarts'
import type { ChartDataPoint } from '~/types/domain/reports'
import { sumChartValues, toPercent } from '~/utils/chart-data'

export const useCharts = (data: MaybeRef<readonly ChartDataPoint[]>) => {
  const chartData = computed(() => unref(data))
  const totalValue = computed(() => sumChartValues(chartData.value))
  const highestValue = computed(() => Math.max(...chartData.value.map((item) => item.value), 0))

}
