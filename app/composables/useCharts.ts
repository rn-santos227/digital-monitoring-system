import { computed, unref, type MaybeRef } from 'vue'
import type { EChartsOption } from 'echarts'
import type { ChartDataPoint } from '~/types/domain/reports'
import { sumChartValues, toPercent } from '~/utils/chart-data'


